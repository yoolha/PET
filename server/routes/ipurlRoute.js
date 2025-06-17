const express = require('express');
const router = express.Router();
const { resolveA, resolvePTR } = require('../services/ipurlService');

router.post('/a', async (req, res) => {
  const { domain } = req.body;
  try {
    const result = await resolveA(domain);
    const ips = result.join(', ');
    res.json({
      type: 'A',
      result,
      message: `입력한 도메인 ${domain} 에 해당하는 IP 주소는 다음과 같습니다: ${ips}`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/ptr', async (req, res) => {
  const { ip } = req.body;
  try {
    const result = await resolvePTR(ip);

    if (!result || result.length === 0) {
      return res.json({
        type: 'PTR',
        result: [],
        info: '입력한 IP 주소에 대한 도메인 정보(PTR 레코드)는 등록되어 있지 않거나, 공개되지 않았습니다. 예시: 8.8.8.8 → dns.google, 1.1.1.1 → one.one.one.one'
      });
    }

    res.json({ type: 'PTR', result });
  } catch (err) {
    res.status(500).json({
      error: err.message,
      info: 'URL은 기업에서 등록된 경우에만 조회 가능합니다. 예시: 8.8.8.8, 1.1.1.1'
    });
  }
});


module.exports = router;
