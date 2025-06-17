const dgram = require('dgram');

function startUdpServer() {
  const server = dgram.createSocket('udp4');

  server.on('message', (msg, rinfo) => {
    try {
      const { type, message } = JSON.parse(msg.toString());
      let result = message;
      if (type === 'upper') result = message.toUpperCase();
      else if (type === 'lower') result = message.toLowerCase();
      const response = Buffer.from(`${result}`);
      server.send(response, rinfo.port, rinfo.address);
    } catch (err) {
      const errorResponse = Buffer.from('잘못된 요청 형식 (JSON 오류)');
      server.send(errorResponse, rinfo.port, rinfo.address);
    }
  });

  server.bind(9001, () => {
    console.log('UDP 서버 실행 중 (포트 9001)');
  });
}

module.exports = startUdpServer;
