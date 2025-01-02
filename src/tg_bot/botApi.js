import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

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
    return passwordDetails; // Contains srp_id, salt, and srp_B
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
async function createPasswordCheckPayload(password) {
  // Replace this with your implementation for generating SRP parameters.
  // Example dummy implementation for development.
  return {
    srp_id: crypto.randomBytes(16).toString('hex'),
    A: crypto.randomBytes(256).toString('hex'), // Replace with actual logic
    M1: crypto.randomBytes(256).toString('hex'),
  };
}

/**
 * Get the Stars revenue withdrawal URL.
 *
 * @param {string} channelId - The ID of the bot or channel.
 * @param {number} starsAmount - The amount of Stars to withdraw.
 * @param {string} password - The 2FA password.
 * @returns {Promise<string>} - The withdrawal URL.
 */
async function getStarsRevenueWithdrawalUrl(channelId, starsAmount, password) {
  try {
    // Generate SRP password payload
    const passwordPayload = await createPasswordCheckPayload(password);

    // Call Telegram's payments.getStarsRevenueWithdrawalUrl API
    const response = await bot.telegram.callApi('payments.getStarsRevenueWithdrawalUrl', {
      peer: { type: 'channel', id: channelId },
      stars: starsAmount,
      password: passwordPayload,
    });

    return response.url; // The URL to the withdrawal page
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

