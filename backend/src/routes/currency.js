const express = require('express');

const router = express.Router();
// open.er-api.com is a genuinely free, no-key-required currency API (unlike
// exchangerate.host, which now requires a paid key) and covers 160+
// currencies, including PKR.
const RATES_BASE = 'https://open.er-api.com/v6/latest';

// GET /api/currency/convert?from=USD&to=PKR&amount=100
router.get('/convert', async (req, res, next) => {
  try {
    const { from = 'USD', to = 'PKR', amount = '1' } = req.query;
    const url = `${RATES_BASE}/${encodeURIComponent(from)}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(502).json({ error: 'currency provider request failed' });
    }

    const data = await response.json();
    if (data.result !== 'success') {
      return res.status(400).json({ error: `unsupported currency: "${from}"` });
    }

    const rate = data.rates?.[to];
    if (rate === undefined) {
      return res.status(400).json({ error: `unsupported currency: "${to}"` });
    }

    res.json({
      from,
      to,
      rate,
      amount: Number(amount),
      converted: Math.round(Number(amount) * rate * 100) / 100,
      date: data.time_last_update_utc,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
