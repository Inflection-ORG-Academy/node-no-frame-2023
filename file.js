const fsp = require('fs/promises');
const dbFileName = './db.json';

// create an empty file
exports.readFile = async () => {
  let contents = '{}';
  try {
    contents = await fsp.readFile(dbFileName, { encoding: 'utf-8' });
  } catch (err) {
    // error is file does not exists
    if (err.code === 'ENOENT') {
      await fsp.writeFile(dbFileName, contents, { encoding: 'utf8' });
    } else {
      throw err;
    }
  }
  obj = JSON.parse(contents);
  return obj;
};

// waite file
exports.writeFile = async (data) => {
  const contents = JSON.stringify(data);
  await fsp.writeFile(dbFileName, contents, { encoding: 'utf8' });
};
exports.generateId = (students) => {
  if (!Array.isArray(students) || !students.length) {
    return 1;
  }
  let max = 0;
  for (let i = 0; i < students.length; i++) {
    if (max < students[i].id) {
      max = students[i].id;
    }
  }
  return max + 1;
};
