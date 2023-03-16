const fsp = require('fs/promises');
const dbFileName = "./db.json"

// create an empty file
exports.readFile = async () => {
  let contents = "{}"
  try {
    contents = await fsp.readFile(dbFileName, { encoding: 'utf8' })
  }
  catch (err) {
    // -2 error is file does not exists
    if (err.errno === -2) {
      await fsp.writeFile(dbFileName, contents, { encoding: 'utf8' })
    } else {
      throw err
    }
  }
  obj = JSON.parse(contents)
  return obj
}