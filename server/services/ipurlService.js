const dns = require('dns');

function resolveA(domain) {
  return new Promise((resolve, reject) => {
    dns.resolve4(domain, (err, addresses) => {
      if (err) reject(new Error(`A 레코드 조회 실패: ${err.message}`));
      else resolve(addresses);
    });
  });
}

function resolvePTR(ip) {
  return new Promise((resolve, reject) => {
    dns.reverse(ip, (err, hostnames) => {
      if (err) reject(new Error(`PTR 조회 실패: ${err.message}`));
      else resolve(hostnames);
    });
  });
}

module.exports = { resolveA, resolvePTR };
