exports.authentication = async (req, res, data) => {
  console.log('checking authentication');
  return { next: true };
};

exports.authorization = async (req, res, data) => {
  console.log('checking authorization');
  return { next: true };
};