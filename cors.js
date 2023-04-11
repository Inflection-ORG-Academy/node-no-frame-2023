exports.cors = (req, res, data) => {
  res.setHeader('Content-Type', 'application/json',);

  res.setHeader('Access-Control-Allow-Origin', '*',);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-PING,Content-Type,Origin,Accept');
  res.setHeader('Access-Control-Expose-Headers', 'Date, X-Device-Id');
  res.setHeader('Access-Control-Max-Age', 600);
  res.setHeader('Access-Control-Allow-Credentials', true);
  return { next: true }
};
