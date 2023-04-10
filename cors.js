exports.cors = (req, res, data) => {
  res.setHeader('Access-Control-Allow-Origin', '*',);
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-requested-with');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Expose-Headers', '*');
  res.setHeader('Access-Control-Request-Headers', 'Content-Type');
  return { next: true }
};
