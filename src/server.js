import express from 'express';
import cors from 'cors';
import { botApi } from './tg_bot/botApi.js';


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://artyomcha.github.io", // Replace with your frontend's URL
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/create-invoice', async (req, res) => {
  try {
    const { skinName, starsPrice } = req.body;
    const invoiceLink = await botApi.createInvoiceLink(
      'Buy Skin',          // Title
      `Purchase ${skinName}`, 
      '{}',                // Payload
      '',                  // For Stars, empty
      'XTR',               // Currency = XTR
      [{ amount: starsPrice, label: 'Stars Payment' }],
    );
    res.json({ invoiceLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

app.post('/withdraw-stars', async (req, res) => {
  try {
    const { starsAmount, password } = req.body; // User specifies amount and their 2FA password
    
    // Call a function to get the withdrawal URL
    const withdrawalUrl = await botApi.getStarsRevenueWithdrawalUrl(starsAmount, password);
    
    res.json({ withdrawalUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to withdraw Stars revenue' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

