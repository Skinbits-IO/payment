import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import crypto from 'crypto';
import bigInt from 'big-integer';
import { sha256 } from '@openpgp/crypto';

dotenv.config();

// 1. Load your bot token from environment or config
const bot = new Telegraf(process.env.BOT_TOKEN);

/**
 * Create an invoice link for Telegram Stars payment (XTR).
 *
 * @param {string} title         The title of the invoice.
 * @param {string} description   A short description of the product or purchase.
 * @param {string} payload       A JSON string or other data you want to attach to the invoice (bot-side).
 * @param {string} providerToken For standard payments, you'd pass your BotFather-issued token.
 *                               For Telegram Stars, this can be an empty string.
 * @param {string} currency      Usually "XTR" for Telegram Stars, but can be "USD"/"RUB"/etc. for others.
 * @param {Array<{ amount: number, label: string }>} prices 
 *   An array of `{ amount, label }` describing the price. 
 *   For XTR, `amount` is an integer representing that many stars.
 *
 * @returns {Promise<string>} A direct link that opens the Telegram Payment UI (Stars Payment Drawer).
 */
async function createInvoiceLink(
  title,
  description,
  payload,
  providerToken, 
  currency,
  prices
) {
  try {
    const link = await bot.telegram.createInvoiceLink({
      title,
      description,
      payload,
      provider_token: providerToken,
      currency,
      prices
    });

    return link; // e.g. "https://t.me/YourBotName?start=XXXX"
  } catch (error) {
    console.error('Error creating invoice link:', error);
    throw error;
  }
}
/**
 * Fetches 2FA password parameters from Telegram.
 */
async function getPasswordParams() {
  try {
    const passwordDetails = await bot.telegram.callApi('account.getPassword');
    return passwordDetails;
  } catch (error) {
    console.error('Error fetching password details:', error);
    throw error;
  }
}


/**
 * Generates SRP authentication using password and parameters.
 */
/**
 * Create an SRP password check payload for Telegram's payments API.
 * @param {string} password - The user's 2FA password.
 * @returns {Promise<object>} - SRP parameters for Telegram's API.
 */
const createPasswordCheckPayload = async (password, passwordParams) => {
  const { srp_id, srp_B, current_salt } = passwordParams;

  const g = bigInt(2);
  const N = bigInt(
    'AC6BDB41324A9A9BF166DE5E1389582FAF72B665198FFB3E2C6D9A8C12AD3D9A86917F1FE55E7182967C2E4D' +
    'FCE10D86AA6D5FDEDD532F3A942D5EEC0A3C9CEFAF9643DB81E2AFCBDC7D465F20AB4FA91852C1696F769A9A2C',
    16
  );

  const salt = Buffer.from(current_salt, 'base64');
  const passwordBytes = Buffer.from(password, 'utf-8');
  const passwordHash = await sha256(Buffer.concat([salt, passwordBytes]));

  const x = bigInt(passwordHash.toString('hex'), 16);
  const a = bigInt(crypto.randomBytes(256).toString('hex'), 16);
  const A = g.modPow(a, N);

  const B = bigInt(srp_B, 16);
  const u = bigInt((await sha256(Buffer.concat([A.toArray(256).value, B.toArray(256).value]))).toString('hex'), 16);

  const S = B.subtract(g.modPow(x, N)).modPow(a.add(u.multiply(x)), N);
  const M1 = await sha256(Buffer.concat([A.toArray(256).value, B.toArray(256).value, S.toArray(256).value]));

  return {
    _: 'inputCheckPasswordSRP',
    srp_id,
    A: A.toString(16),
    M1: M1.toString('hex'),
  };
};


/**
 * Get the Stars revenue withdrawal URL.
 *
 * @param {string} channelId - The ID of the bot or channel.
 * @param {number} starsAmount - The amount of Stars to withdraw.
 * @param {string} password - The 2FA password.
 * @returns {Promise<string>} - The withdrawal URL.
 */
async function getStarsRevenueWithdrawalUrl(starsAmount, password) {
  try {
    const passwordParams = await getPasswordParams();
    const passwordPayload = await createPasswordCheckPayload(password, passwordParams);

    const response = await bot.telegram.callApi('payments.getStarsRevenueWithdrawalUrl', {
      peer: {
        _: 'inputPeerUser',
        user_id: process.env.BOT_ID,
      },
      stars: starsAmount,
      password: passwordPayload,
    });

    return response.url;
  } catch (error) {
    console.error('Error in getStarsRevenueWithdrawalUrl:', error);
    throw error;
  }
}

// Export all methods or objects related to your bot
export const botApi = {
  bot,                  // The Telegraf bot instance (if needed elsewhere)
  createInvoiceLink,    // Function to create invoice links
  getStarsRevenueWithdrawalUrl,  // Function to generate withdrawal URLs
};

