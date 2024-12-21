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

// Export all methods or objects related to your bot
export const botApi = {
  bot,             // The Telegraf bot instance (if needed elsewhere)
  createInvoiceLink
};

