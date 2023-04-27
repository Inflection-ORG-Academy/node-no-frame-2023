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
const { createCategory, getCategories, updateCategory } = require('./categories/controller');
const { createAsset, getAssetByCategory } = require('./assets/controller')

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
  urlMatcher('/emploies/profile/admin', 'POST', authentication, employeeAuthorization("admin"), employeeProfile),
  urlMatcher('/emploies/profile/admin', 'PATCH', authentication, employeeAuthorization("admin"), updateEmployeeProfile),

  // category
  urlMatcher('/categories', 'POST', authentication, employeeAuthorization("admin"), createCategory),
  urlMatcher('/categories', 'GET', authentication, getCategories),
  urlMatcher('/categories/:id', 'PATCH', authentication, employeeAuthorization("admin", "m1"), updateCategory),

  // assets
  urlMatcher('/assets', 'POST', authentication, employeeAuthorization("admin"), createAsset),
  urlMatcher('/assets/:cid', 'GET', getAssetByCategory),

  // not found
  urlMatcher('*', '*'),
];

const server = http.createServer(async (req, res) => {
  try {
    await run(globalMiddleware, req, res);
  } catch (e) {
    res.statusCode = e.code ? e.code : 500
    res.end(JSON.stringify({ error: e.message }));
  }
});

server.listen('8080');
