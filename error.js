class ServerError extends Error {
  constructor(code, message) {
    super(message)
    this.serverCode = code
  }
}

module.exports = { ServerError }