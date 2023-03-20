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

const server = http.createServer(async (req, res) => {
  const json = { 'Content-Type': 'application/json' };
  try {
    if (urlMatcher(req, '/', 'GET').isMatched) {
      res.end('server is running');
    } else if (urlMatcher(req, '/students', 'GET').isMatched) {
      const obj = await readFile();
      res.writeHead(200, json);
      res.end(JSON.stringify(obj.students));
    } else if (urlMatcher(req, '/students', 'POST').isMatched) {
      const body = await bodyPraser(req);
      const data = await readFile();
      data.students.push(body);
      await writeFile(data);
      res.end('success');
    } else if (urlMatcher(req, '/students/:id', 'PATCH').isMatched) {
      console.log(urlMatcher(req, '/students/:id', 'PATCH'));
      res.end('dynamic route');
    } else {
      res.end('invalid route');
    }
  } catch (e) {
    res.writeHead(500, json);
    res.end(
      JSON.stringify({
        message: e.message,
      })
    );
  }
});

server.listen('8080');
