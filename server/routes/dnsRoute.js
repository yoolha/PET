const express = require('express');
const router = express.Router();
const { resolveCNAME, resolveMX } = require('../services/dnsService');

router.post('/cname', async (req, res) => {
  const { domain } = req.body;
  try {
    const result = await resolveCNAME(domain);
    res.json({ type: 'CNAME', result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post('/mx', async (req, res) => {
  const { domain } = req.body;
  try {
    const result = await resolveMX(domain);
    res.json({ type: 'MX', result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;