exports.userSignup = async (req, res, data) => {
  if (!req.body.email || !req.body.password || !req.body.name) {
    res.error = {
      code: 400,
      message: 'invalid input'
    }
    return { next: true }
  }

  res.end("user signup")
}

exports.userLogin = async (req, res, data) => {
  res.end("user login")
}

exports.userProfile = async (req, res, data) => {
  res.end("user profile")
}

exports.userUpdateProfile = async (req, res, data) => {
  res.end("user update profile")
}