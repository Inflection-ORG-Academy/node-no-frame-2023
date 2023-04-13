exports.cors = (req, res) => {
  res.setHeader('Content-Type', 'application/json',);

  res.setHeader('access-control-allow-origin', '*',);
  res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-PING,Content-Type,Origin,Accept,access-control-max-age,access-control-expose-headers');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,PUT');
  res.setHeader('Access-Control-Request-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', 'Date,X-Device-Id');
  res.setHeader('Access-Control-Max-Age', 600);
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    res.end(JSON.stringify({}))
    return
  }
  return req.next = true
};
