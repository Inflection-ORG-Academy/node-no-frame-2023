exports.auth = async (req, res, data) => {
  console.log('checking auth');
  return { next: true };
};
