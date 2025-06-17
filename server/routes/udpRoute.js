const express = require('express');
const router = express.Router();
const { udpUpper, udpOriginal, udpLower } = require('../services/udpService');

router.post('/upper', async (req, res) => {
  const { message } = req.body;
  try {
    const result = await udpUpper(message);
    res.json({ type: 'UDP-UPPER', result });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

router.post('/original', async (req, res) => {
  const { message } = req.body;
  try {
    const result = await udpOriginal(message);
    res.json({ type: 'UDP-ORIGINAL', result });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

router.post('/lower', async (req, res) => {
  const { message } = req.body;
  try {
    const result = await udpLower(message);
    res.json({ type: 'UDP-LOWER', result });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
