import express from 'express';
import cors from 'cors';
import { botApi } from './tg_bot/botApi.js';


const app = express();
app.use(express.json());
app.use(cors()); 

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});