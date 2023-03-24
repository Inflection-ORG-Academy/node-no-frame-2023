const { getStudents, addStudent } = require('./students/controllers');
const { run } = require('./runner');
const { auth } = require('./middleware/auth');

const controllerMiddleware = {
  '/students,GET': [auth, getStudents],
  '/students,POST': [auth, addStudent],
};

exports.urlMatcher = (matchUrl, method) => {
  return async (req, res, data) => {
    if (req.method !== method) {
      return { next: true, data };
    }
    const reqUrl = req.url.split('/');
    const url = matchUrl.split('/');
    if (reqUrl.length !== url.length) {
      return { next: true, data };
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
    if (!isMatched) {
      return { next: true, data };
    }
    req.params = params;
    data = await run(controllerMiddleware[`${matchUrl},${method}`], req, res);
    return { next: true, data };
  };
};
