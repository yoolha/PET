const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const port = 3000;

const registerSocketHandlers = require('./sockets/socketHandler');
const dnsRouter = require('./routes/dnsRoute');
const tcpRouter = require('./routes/tcpRoute');
const udpRouter = require('./routes/udpRoute');
const startTcpServer = require('./socketServer/tcpSocketServer');
const startUdpServer = require('./socketServer/udpSocketServer');


const ipurlRouter = require('./routes/ipurlRoute');

app.use(cors());
app.use(express.json());
app.use('/dns', dnsRouter);
app.use('/tcp', tcpRouter);
app.use('/udp',udpRouter);



app.use('/ipurl', ipurlRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

registerSocketHandlers(io);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

startTcpServer();
startUdpServer();