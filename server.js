const http = require('http');
const { bodyPraser } = require('./bodyParser');
const { urlMatcher } = require('./urlMatcher');
const { run } = require('./runner');
const { authentication, authorization } = require('./middleware/auth');
const { userSignup, userLogin, userProfile, userUpdateProfile } = require('./user/controllers');
const { employeeLogin } = require('./emploies/controllers');
const { globalErrorHandler } = require('./error');


const globalMiddleware = [
  bodyPraser,
  urlMatcher('/users/signup', 'POST', userSignup),
  urlMatcher('/users/login', 'POST', userLogin),
  urlMatcher('/users/profile', 'GET', authentication, authorization, userProfile),
  urlMatcher('/users/profile', 'PATCH', authentication, authorization, userUpdateProfile),
  urlMatcher('/emploies/login', 'POST', employeeLogin),
  // resChecker,
  globalErrorHandler
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
