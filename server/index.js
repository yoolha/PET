const express = require('express');
const app = express();
const port = 3000;

const dnsRouter = require('./routes/dnsRoute');

app.use(express.json());
app.use('/dns', dnsRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});