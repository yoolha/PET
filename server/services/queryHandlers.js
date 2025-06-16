const { resolveCNAME } = require('./dnsService');

const queryHandlers = {
    'DNS-CNAME': async (content) => await resolveCNAME(content)
    // 다른 핸들러 추가(ICMP, TCP 등)
};

module.exports = queryHandlers;