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


bot.on('pre_checkout_query', async (ctx) => {
  try {
    const query = ctx.update.pre_checkout_query;
    console.log('Received pre_checkout_query:', query);

    const { id, invoice_payload } = query;

    // Validate the payload
    if (invoice_payload !== '{}') {
      console.error('Invalid payload:', invoice_payload);
      await ctx.answerPreCheckoutQuery(false, 'Invalid payment payload.');
      return;
    }

    // Approve the payment
    await ctx.answerPreCheckoutQuery(true);
    console.log(`Payment approved for pre_checkout_query ID: ${id}`);
  } catch (error) {
    console.error('Error handling pre_checkout_query:', error);
    await ctx.answerPreCheckoutQuery(false, 'Failed to process payment.');
  }
});

// Handle successful payments
bot.on('successful_payment', (ctx) => {
  console.log('Successful payment received:', ctx.message.successful_payment);
  ctx.reply('Thank you for your payment!');
});

(async () => {
  try {
    console.log('Starting bot...');
    await bot.launch();
    console.log('Bot is running!');
  } catch (error) {
    console.error('Failed to launch the bot:', error);
    process.exit(1);
  }
})();

// Export botApi
export const botApi = {
  bot,
  createInvoiceLink
};