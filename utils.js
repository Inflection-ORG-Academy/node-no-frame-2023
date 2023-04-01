const { createHash } = require('crypto');
const hash = createHash('sha256');

exports.generateNextId = (data) => {
  if (!Array.isArray(data) || !data.length) {
    return 1;
  }
  let max = 0;
  for (let i = 0; i < data.length; i++) {
    if (max < data[i].id) {
      max = data[i].id;
    }
  }
  return max + 1;
};

exports.hashPassword = (password) => {
  hash.update(password);
  return hash.digest('hex')
}