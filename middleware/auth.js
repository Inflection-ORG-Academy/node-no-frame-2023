const { verifyToken } = require("../utils");

exports.authentication = async (req, res, data) => {
  try {
    const tokenData = verifyToken(req.headers.token)
    req.tokenData = tokenData
  } catch (e) {
    res.writeHead(403, {
      'Content-Type': 'application/json',
    });
    return res.end(JSON.stringify({ error: e.message }))
  }
  return { next: true }
};

exports.authorization = async (req, res, data) => {
  console.log('checking authorization');
  return { next: true };
};