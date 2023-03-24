const http = require('http');
const { bodyPraser } = require('./bodyParser');
const { urlMatcher } = require('./urlMatcher');
const { run } = require('./runner');

const globalMiddleware = [
  bodyPraser,
  urlMatcher('/students', 'GET'),
  urlMatcher('/students', 'POST'),
  // resChecker,
  // errorChecker,
];

const server = http.createServer(async (req, res) => {
  try {
    await run(globalMiddleware, req, res);
  } catch (e) {
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ error: e.message }));
  }
});

server.listen('8080');
