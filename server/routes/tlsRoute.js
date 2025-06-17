const express = require('express');
const router = express.Router();
const https = require('https');

function assessSecurity(tlsVersion, tlsCipher) {
  if (tlsVersion === 'TLSv1.3') {
    if (tlsCipher.includes('256')) {
      return { level: '보안성: 강함', comment: '최신 프로토콜과 강력한 암호화 방식이 사용되었습니다.' };
    } else {
      return { level: '보안성: 보통', comment: '최신 TLS 버전이지만 암호화 강도는 중간 수준입니다.' };
    }
  } else if (tlsVersion === 'TLSv1.2') {
    return { level: '보안성: 보통', comment: '안전한 버전이지만 최신 TLS 1.3에 비해 다소 취약할 수 있습니다.' };
  } else {
    return { level: '보안성: 낮음', comment: 'TLS 1.0/1.1 또는 불명확한 암호화 방식 사용으로 보안에 취약합니다.' };
  }
}

router.post('/', (req, res) => {
  let { target } = req.body;
  if (!target) {
    return res.status(400).json({ error: 'target is required' });
  }

  if (!target.startsWith('https://')) {
    target = 'https://' + target;
  }

  try {
    const start = Date.now();

    https.get(target, (response) => {
      const duration = Date.now() - start;
      const cipher = response.socket.getCipher();
      
      const securityAssessment = assessSecurity(cipher.version, cipher.name); 

      res.json({
        type: 'TLS',
        target,
        result: {
          statusCode: response.statusCode,
          durationMs: duration,
          tlsCipher: cipher.name,
          tlsVersion: cipher.version,
          redirectTo: response.headers?.location || null,
          securityAssessment
        }
      });
    }).on('error', (err) => {
      res.status(502).json({
        type: 'TLS',
        target,
        error: err.message,
      });
    });
  } catch (err) {
    res.status(500).json({
      type: 'TLS',
      target,
      error: err.message,
    });
  }
});

module.exports = router;
