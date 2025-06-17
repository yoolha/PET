const express = require('express');
const router = express.Router();
const ping = require('ping');

router.post('/', async (req, res) => {
  const { target } = req.body;
  if (!target) {
    return res.status(400).json({ error: 'target is required' });
  }

  try {
    const result = await ping.promise.probe(target, {
      timeout: 3,
      extra: ['-c', '4'], // macOS/Linux용
    });

    res.json({
      type: 'PING',
      target,
      result: {
        alive: result.alive,
        time: result.time,
      }
    });
  } catch (error) {
    res.status(500).json({
      type: 'PING',
      target,
      error: error.message,
    });
  }
});

module.exports = router;
