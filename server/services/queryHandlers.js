const { resolveCNAME, resolveMX } = require('./dnsService');
const {tcpOriginal,tcpUpper,tcpLower,} = require('./tcpService');
const {udpOriginal,udpUpper,udpLower,} = require('./udpService');

const queryHandlers = {
    'DNS-CNAME': async (domain) => await resolveCNAME(domain),
    'DNS-MX': async (domain) => await resolveMX(domain),
    // TCP
    'TCP-ORIGINAL': async (message) => await tcpOriginal(message),
    'TCP-UPPER': async (message) => await tcpUpper(message),
    'TCP-LOWER': async (message) => await tcpLower(message),

    // UDP
    'UDP-ORIGINAL': async (message) => await udpOriginal(message),
    'UDP-UPPER': async (message) => await udpUpper(message),
    'UDP-LOWER': async (message) => await udpLower(message),

    // 다른 핸들러 추가(ICMP, TCP 등)
};

module.exports = queryHandlers;