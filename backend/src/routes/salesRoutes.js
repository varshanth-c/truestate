// src/routes/salesRoutes.js
const express = require('express');
const router = express.Router();

// use the service and controller you already have
const { querySales } = require('../services/salesService');
const { mapCsvToCamel } = require('../services/salesService'); 

const salesController = require('../controllers/salesController');
const Sale = require('../models/Sale');

// LIST + pagination + summary -> GET /api/sales
router.get('/', async (req, res) => {
  try {
    const q = req.query || {};
    const result = await querySales(q);
    return res.json({
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      pages: result.pages,
      summary: result.summary
    });
  } catch (err) {
    console.error('sales list error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// STATS -> GET /api/sales/stats
router.get('/stats', async (req, res) => {
  try {
    const q = { ...(req.query || {}), page: 1, limit: 1 };
    const result = await querySales(q);
    return res.json(result.summary || { totalUnits: 0, totalAmount: 0, totalDiscount: 0 });
  } catch (err) {
    console.error('stats route error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// SINGLE item -> GET /api/sales/:id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Sale.findById(id).lean().exec();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(mapCsvToCamel(doc));
  } catch (err) {
    console.error('sales getById error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
