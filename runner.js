exports.run = async (fnArray, req, res) => {
  if (!Array.isArray(fnArray)) {
    throw new Error('fn arr is not array');
  }
  for (let i = 0; i < fnArray.length; i++) {
    await fnArray[i](req, res);
    if (req.next === true) {
      req.next = undefined
      continue;
    }
    break;
  }
};
