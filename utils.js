const { scrypt, randomBytes, createHmac } = require('crypto');

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

const passowrdHashLength = 90
const hashIter = 1024

exports.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    randomBytes(30, (err, buf) => {
      if (err) throw reject(err);
      const salt = buf.toString('base64')
      scrypt(password, salt, passowrdHashLength, { N: hashIter }, (err, derivedKey) => {
        if (err) throw reject(err);
        resolve(`${salt}.${derivedKey.toString('base64')}`)
      });
    });
  })
}

exports.verifyPassword = (password, hashPassword) => {
  return new Promise((resolve, reject) => {
    const [salt, hash] = hashPassword.split('.')
    scrypt(password, salt, passowrdHashLength, { N: hashIter }, (err, derivedKey) => {
      if (err) throw reject(err);
      resolve(derivedKey.toString('base64') === hash)
    });
  })
}

exports.generateToken = (data) => {
  const strData = JSON.stringify(data)
  let buff = Buffer.from(strData);
  let encoadedData = buff.toString('base64');
  console.log(encoadedData)
  const sign = createHmac('sha256', 'osiduvgbksdfcvkhjsfgyisdfvhakfuvhjdfbSDASGvcdTWCDG').update(strData).digest("base64");
  return `${encoadedData}.${sign}`
}