exports.cors = (req, res, data) => {
  res.setHeader('Content-Type', 'application/json',);
  res.setHeader('Access-Control-Allow-Origin', '*',);
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,PTACH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-PINGOTHER,Content-Type,X-Token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  return { next: true }
};
