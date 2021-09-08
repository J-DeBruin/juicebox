require('dotenv').config();
console.log(process.env.JWT_SECRET);

const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
  });

  // = = = = = = = = = = = = = BACKGROUND COLOR = = = = = = = = = = = = 
  server.get('/background/:color', (req, res, next) => {
    res.send(`
      <body style="background: ${ req.params.color };">
        <h1>Hello World</h1>
      </body>
    `);
  });

  // = = = = = = = = = = = = = SETTING UP ROUTE FIRST TO SECOND = = = = 
  server.get('/add/:first/to/:second', (req, res, next) => {
    res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
      Number(req.params.first) + Number(req.params.second)
     }</h1>`);
  });

const apiRouter = require('./api');
server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

const {PORT = 3000} = process.env;
server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});