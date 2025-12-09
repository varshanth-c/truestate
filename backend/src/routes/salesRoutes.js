const express = require('express');
const router = express.Router();
const { getSales } = require('../controllers/salesController');

const { querySales } = require('../services/salesService');

router.get('/', async (req, res) => {
  try {
    const q = req.query || {};
    const result = await querySales(q);
    // return shape frontend expects
    res.json({ data: result.items, total: result.total, page: result.page, limit: result.limit, summary: result.summary });
  } catch (err) {
    console.error('sales route error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
