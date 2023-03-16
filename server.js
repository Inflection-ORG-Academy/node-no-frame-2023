const http = require("http")
const { readFile } = require("./file")

const server = http.createServer(async (req, res) => {
  const json = { "Content-Type": "application/json" }
  try {
    if (req.url === "/") {
      res.end("server is running")
    } else if (req.url === "/hello") {
      const obj = await readFile()
      res.writeHead(200, json)
      res.end(JSON.stringify(obj))
    } else {
      res.end("invalid route")
    }
  } catch (e) {
    res.writeHead(500, json)
    res.end(JSON.stringify({
      message: e.message
    }))
  }
})

server.listen("8080")