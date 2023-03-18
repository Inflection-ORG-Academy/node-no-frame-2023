const http = require('http')
const { readFile, writeFile } = require('./file')

const bodyPraser = (req) => {
  let body = ''
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("body parser timeout"))
    }, 2000)
    req.on('data', function (data) {
      body += data
    })
    req.on('end', function (data) {
      resolve(JSON.parse(body))
    })
  })
}

const server = http.createServer(async (req, res) => {
  const json = { 'Content-Type': 'application/json' }
  try {
    if (req.url === '/' && req.method === 'GET') {
      res.end('server is running')
    } else if (req.url === '/students' && req.method === 'GET') {
      const obj = await readFile()
      res.writeHead(200, json)
      res.end(JSON.stringify(obj.students))
    } else if (req.url === '/students' && req.method === 'POST') {
      const body = await bodyPraser(req)
      const data = await readFile()
      data.students.push(body)
      await writeFile(data)
      res.end("success")
    } else {
      res.end('invalid route')
    }
  } catch (e) {
    res.writeHead(500, json)
    res.end(
      JSON.stringify({
        message: e.message,
      })
    )
  }
})

server.listen('8080')
