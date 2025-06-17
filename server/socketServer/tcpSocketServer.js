const net = require('net');

function startTcpServer() {
  const server = net.createServer((socket) => {
    socket.on('data', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        const { type, message } = parsed;
        let result = message;
        if (type === 'upper') result = message.toUpperCase();
        else if (type === 'lower') result = message.toLowerCase();
        socket.write(`${result}`);
      } catch (err) {
        socket.write('잘못된 메시지 형식입니다 (JSON)');
      }
    });

    socket.on('end', () => {
      console.log('TCP 연결 종료');
    });
  });

  server.listen(9000, () => {
    console.log('TCP 서버 실행 중 (포트 9000)');
  });
}

module.exports = startTcpServer;
