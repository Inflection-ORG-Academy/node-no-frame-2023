const { ServerError } = require("../error")
const { readFile, writeFile } = require("../file")
const { hashPassword, verifyPassword, generateToken } = require("../utils")

exports.employeeLogin = async (req, res, data) => {
  if (!req.body.email) {
    throw new ServerError(400, 'email not supplied')
  }
  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
    throw new ServerError(400, 'invalid email')
  }
  if (!req.body.password) {
    throw new ServerError(400, 'password not supplied')
  }
  if (req.body.password.length < 6) {
    throw new ServerError(400, 'password is less than 6 character')
  }

  // find user
  const dbData = await readFile()
  const employeeData = dbData.emploies[req.body.email]
  if (!employeeData) {
    throw new ServerError(404, 'email not found, contact your admin')
  }

  // verify password
  if (!verifyPassword(req.body.password, employeeData.password)) {
    throw new ServerError(404, 'password is wrong')
  }

  // generate JWT token
  const token = generateToken({
    email: req.body.email,
    role: employeeData.role,
    iat: Date.now()
  })

  res.end(JSON.stringify({ message: "login successful", token }))
}

exports.employeeSignup = async (req, res, data) => {
  if (!req.body.email) {
    throw new ServerError(400, 'email not supplied')
  }
  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
    throw new ServerError(400, 'invalid email')
  }
  if (!req.body.password) {
    throw new ServerError(400, 'password not supplied')
  }
  if (req.body.password.length < 6) {
    throw new ServerError(400, 'password is less than 6 character')
  }
  if (!req.body.name) {
    throw new ServerError(400, 'name not supplied')
  }
  if (req.body.name.length < 2) {
    throw new ServerError(400, 'name is less than 2 character')
  }
  const dbData = await readFile()
  if (dbData.emploies[req.body.email]) {
    throw new ServerError(403, 'already registred, use another email to signup')
  }
  const hashedPassword = await hashPassword(req.body.password)
  dbData.emploies[req.body.email] = {
    name: req.body.name,
    password: hashedPassword,
    role: "m2"
  }
  await writeFile(dbData)
  res.end(JSON.stringify({ message: "signup successful" }))
}

exports.updateMyProfile = async (req, res, data) => {
  res.end("Update my Profile")
}

exports.myProfile = async (req, res, data) => {
  res.end("get my Profile")
}

exports.employeeProfile = async (req, res, data) => {
  res.end("get any employee Profile only for admin")
}

exports.updateEmployeeProfile = async (req, res, data) => {
  res.end("update any employee Profile only for admin")
}