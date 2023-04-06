const { ServerError } = require("../error");
const { verifyToken } = require("../utils");

exports.authentication = async (req, res, data) => {
  try {
    const tokenData = verifyToken(req.headers.token)
    req.tokenData = tokenData
  } catch (e) {
    throw new ServerError(403, e.message)
  }
  return { next: true }
};

exports.authorization = async (req, res, data) => {
  console.log('checking authorization');
  return { next: true };
};