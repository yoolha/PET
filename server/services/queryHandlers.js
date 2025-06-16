const { resolveCNAME, resolveMX } = require('./dnsService');

const queryHandlers = {
    'DNS-CNAME': async (domain) => await resolveCNAME(domain),
    'DNS-MX': async (domain) => await resolveMX(domain)
    // 다른 핸들러 추가(ICMP, TCP 등)
};

module.exports = queryHandlers;