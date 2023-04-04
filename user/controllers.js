const { readFile, writeFile } = require("../file")
const { hashPassword, verifyPassword, generateToken } = require("../utils")

exports.userSignup = async (req, res, data) => {
  if (!req.body.email) {
    res.error = {
      code: 400,
      message: 'email not supplied'
    }
    return { next: true }
  }
  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
    res.error = {
      code: 400,
      message: 'invalid email'
    }
    return { next: true }
  }
  if (!req.body.password) {
    res.error = {
      code: 400,
      message: 'password not supplied'
    }
    return { next: true }
  }
  if (req.body.password.length < 6) {
    res.error = {
      code: 400,
      message: 'password is less than 6 character'
    }
    return { next: true }
  }
  if (!req.body.name) {
    res.error = {
      code: 400,
      message: 'name not supplied'
    }
    return { next: true }
  }
  if (req.body.name.length < 2) {
    res.error = {
      code: 400,
      message: 'name is less than 2 character'
    }
    return { next: true }
  }
  const dbData = await readFile()
  if (dbData.users[req.body.email]) {
    res.error = {
      code: 403,
      message: 'already registred, use another email to signup'
    }
    return { next: true }
  }
  const hashedPassword = await hashPassword(req.body.password)
  dbData.users[req.body.email] = {
    name: req.body.name,
    password: hashedPassword
  }
  await writeFile(dbData)
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify({ message: "signup successful" }))
}

exports.userLogin = async (req, res, data) => {
  if (!req.body.email) {
    res.error = {
      code: 400,
      message: 'email not supplied'
    }
    return { next: true }
  }
  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
    res.error = {
      code: 400,
      message: 'invalid email'
    }
    return { next: true }
  }
  if (!req.body.password) {
    res.error = {
      code: 400,
      message: 'password not supplied'
    }
    return { next: true }
  }
  if (req.body.password.length < 6) {
    res.error = {
      code: 400,
      message: 'password is less than 6 character'
    }
    return { next: true }
  }

  // find user
  const dbData = await readFile()
  const userData = dbData.users[req.body.email]
  if (!userData) {
    res.error = {
      code: 404,
      message: 'email not found'
    }
    return { next: true }
  }

  // verify password
  if (!verifyPassword(req.body.password, userData.password)) {
    res.error = {
      code: 400,
      message: 'password is wrong'
    }
    return { next: true }
  }

  // generate JWT token
  const token = generateToken({
    email: req.body.email,
    iat: Date.now()
  })

  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify({ message: "login successful", token }))
}

exports.userProfile = async (req, res, data) => {
  res.end("user profile")
}

exports.userUpdateProfile = async (req, res, data) => {
  res.end("user update profile")
}