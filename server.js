const http = require('http');
const { bodyPraser } = require('./bodyParser');
const { urlMatcher } = require('./urlMatcher');
const { run } = require('./runner');
const { authentication, userAuthorization, employeeAuthorization } = require('./middleware/auth');
const { userSignup, userLogin, userProfile, userUpdateProfile } = require('./user/controllers');
const {
  employeeLogin,
  employeeSignup,
  myProfile,
  updateMyProfile,
  employeeProfile,
  updateEmployeeProfile
} = require('./emploies/controllers');
const { cors } = require('./cors');
const { ServerError } = require('./error');

const globalMiddleware = [
  bodyPraser,
  cors,

  // user
  urlMatcher('/users/signup', 'POST', userSignup),
  urlMatcher('/users/login', 'POST', userLogin),
  urlMatcher('/users/profile', 'GET', authentication, userAuthorization, userProfile),
  urlMatcher('/users/profile', 'PATCH', authentication, userAuthorization, userUpdateProfile),

  // employee
  urlMatcher('/emploies/signup', 'POST', authentication, employeeAuthorization("m1", "admin"), employeeSignup),
  urlMatcher('/emploies/login', 'POST', employeeLogin),
  urlMatcher('/emploies/profile', 'GET', authentication, myProfile),
  urlMatcher('/emploies/profile', 'PATCH', authentication, updateMyProfile),
  urlMatcher('/emploies/profile', 'GET', authentication, employeeAuthorization("admin"), employeeProfile),
  urlMatcher('/emploies/profile', 'PATCH', authentication, employeeAuthorization("admin"), updateEmployeeProfile),
  (req, res) => { throw new ServerError(400, "route not found") }
];

const server = http.createServer(async (req, res) => {
  try {
    await run(globalMiddleware, req, res);
  } catch (e) {
    res.statusCode = e.serverCode ? e.serverCode : 500
    res.end(JSON.stringify({ error: e.message }));
    console.log("res error sent")
  }
});

server.listen('8080');
