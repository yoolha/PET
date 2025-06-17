const express = require('express');
const router = express.Router();
const { tcpUpper, tcpOriginal, tcpLower } = require('../services/tcpService');

router.post('/upper', async (req, res) => {
  const { message } = req.body;
  try {
    const result = await tcpUpper(message);
    res.json({ type: 'TCP-UPPER', result });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

router.post('/original', async (req, res) => {
  const { message } = req.body;
  try {
    const result = await tcpOriginal(message);
    res.json({ type: 'TCP-ORIGINAL', result });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

router.post('/lower', async (req, res) => {
  const { message } = req.body;
  try {
    const result = await tcpLower(message);
    res.json({ type: 'TCP-LOWER', result });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

module.exports = router;
