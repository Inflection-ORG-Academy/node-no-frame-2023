const http = require('http');
const { readFile, writeFile } = require('./file');

const bodyPraser = (req) => {
  let body = '';
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('body parser timeout'));
    }, 2000);
    req.on('data', function (data) {
      body += data;
    });
    req.on('end', function (data) {
      resolve(JSON.parse(body));
    });
  });
};

const urlMatcher = (req, matchUrl, method) => {
  if (req.method !== method) {
    return false;
  }
  const reqUrl = req.url.split('/');
  const url = matchUrl.split('/');
  console.log(reqUrl, url);
  if (reqUrl.length !== url.length) {
    return false;
  }
  let isMatched = true;
  const params = {};
  for (let i = 0; i < url.length; i++) {
    const x = url[i];
    const y = reqUrl[i];
    if (!x.includes(':')) {
      if (x !== y) {
        isMatched = false;
        break;
      }
    } else {
      const z = x.split(':')[1];
      params[z] = y;
    }
  }
  return { isMatched, params };
};

const c1 = (req, res, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('c1');
      res.end('apple');
      resolve({ next: true, name: 'apple' });
    }, 4000);
  });
};

const c2 = (req, res, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(data);
      console.log('c2');
      resolve();
    }, 1000);
  });
};

const globalMiddleware = [c1, c2];

const run = async (fnArray, req, res) => {
  let data = undefined;
  for (let i = 0; i < fnArray.length; i++) {
    data = await fnArray[i](req, res, data);
    if (data?.next) {
      continue;
    }
    break;
  }
};

const server = http.createServer(async (req, res) => {
  try {
    await run(globalMiddleware, req, res);
  } catch (e) {
    console.log(e);
  }
});

server.listen('8080');
