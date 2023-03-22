const http = require('http')
const { readFile, writeFile } = require('./file')

const bodyPraser = (req, res, data) => {
  let body = ''
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('body parser timeout'))
    }, 2000)
    req.on('data', function (data) {
      body += data
    })
    req.on('end', function (data) {
      try {
        req.body = JSON.parse(body)
      } catch (e) {
      } finally {
        resolve({ next: true })
      }
    })
  })
}

const urlMatcher = (matchUrl, method) => {
  return async (req, res, data) => {
    if (req.method !== method) {
      return { next: true, data }
    }
    const reqUrl = req.url.split('/')
    const url = matchUrl.split('/')
    if (reqUrl.length !== url.length) {
      return { next: true, data }
    }
    let isMatched = true
    const params = {}
    for (let i = 0; i < url.length; i++) {
      const x = url[i]
      const y = reqUrl[i]
      if (!x.includes(':')) {
        if (x !== y) {
          isMatched = false
          break
        }
      } else {
        const z = x.split(':')[1]
        params[z] = y
      }
    }
    if (!isMatched) {
      return { next: true, data }
    }
    req.params = params
    data = await run(controllerMiddleware[`${matchUrl},${method}`], req, res)
    return { next: true, data }
  }
}

const globalMiddleware = [
  bodyPraser,
  urlMatcher('/students', 'GET'),
  urlMatcher('/students', 'POST'),
  // resChecker,
  // errorChecker,
]

const c1 = (req, res, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('c1')
      res.end('apple')
      resolve({ next: true, name: 'apple' })
    }, 4000)
  })
}

const c2 = (req, res, data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(data)
      console.log('c2')
      resolve()
    }, 1000)
  })
}

const controllerMiddleware = {
  '/students,GET': [c1, c2],
  // '/students,POST': [authCheck, work2],
}

const run = async (fnArray, req, res) => {
  if (!Array.isArray(fnArray)) {
    return
  }
  let data = {}
  for (let i = 0; i < fnArray.length; i++) {
    data = await fnArray[i](req, res, data)
    if (data?.next) {
      continue
    }
    break
  }
  return data
}

const server = http.createServer(async (req, res) => {
  try {
    await run(globalMiddleware, req, res)
  } catch (e) {
    res.writeHead(500, {
      'Content-Type': 'application/json',
    })
    res.end(JSON.stringify({ error: e.message }))
  }
})

server.listen('8080')
