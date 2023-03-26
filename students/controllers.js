const { readFile, writeFile, generateId } = require('../file');

exports.getStudents = async (req, res, data) => {
  const fileData = await readFile();
  const students = fileData.students;
  res.end(JSON.stringify(students));
};
exports.addStudent = async (req, res, data) => {
  const fileData = await readFile();
  // TODO: generate id for students before adding to students array
  const id = generateId(fileData.students);
  fileData.students.push({ id, ...req.body });
  await writeFile(fileData);
  res.end(JSON.stringify(req.body));
};
