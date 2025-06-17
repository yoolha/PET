const { resolveCNAME, resolveMX } = require('./dnsService');
const { resolvePing } = require('./pingService');
const { resolveTls } = require('./tlsService');

const queryHandlers = {
    'DNS-CNAME': async (domain) => await resolveCNAME(domain),
    'DNS-MX': async (domain) => await resolveMX(domain),
    'PING': async (target) => await resolvePing(target),
    'TLS': async (target) => await resolveTls(target)
};

module.exports = queryHandlers;