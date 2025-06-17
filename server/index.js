const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const port = 3000;

const registerSocketHandlers = require('./sockets/socketHandler');
const dnsRouter = require('./routes/dnsRoute');
const pingRouter = require('./routes/pingRoute');
const tlsRouter = require('./routes/tlsRoute');

app.use(cors());
app.use(express.json());
app.use('/dns', dnsRouter);
app.use('/ping', pingRouter);
app.use('/tls', tlsRouter);

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