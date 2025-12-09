const salesService = require('../services/salesService');

async function getSales(req, res) {
  try {
    const data = await salesService.querySales(req.query);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getSales };
