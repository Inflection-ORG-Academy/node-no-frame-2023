const http = require("http")

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("server is running")
  } else if (req.url === "/hello") {
    res.end("hello")
  } else {
    res.end("invalid route")
  }
})

server.listen("8080")