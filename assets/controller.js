const { json } = require("stream/consumers")
const { ServerError } = require("../error")
const { readFile, writeFile } = require("../file")
const { generateNextId } = require("../utils")
exports.createAsset = async (req, res, data) => {
  const price = parseInt(req.body.price)
  if (!req.body.name || req.body.name.length < 3 || req.body.name.length > 20) {
    throw new ServerError(400, "invalid asset name")
  }
  if(!price){
    throw new ServerError(400 , "price must allowed")
  }
  console.log(req.body.name)
  const dbData = await readFile()
  const allAssets = dbData.assets

  // check duplicate assert
  for (let i = 0; allAssets.length > i; i++) {
    if (allAssets[i].name.toLowerCase() === req.body.name.toLowerCase()) {
      throw new ServerError(400, "assets already exists")
    }
  }

  let cid = undefined
  // check assert id (cid) validity
  if (req.body.cid) {
    let isMatched = 0
    for (let i = 0; allAssets.length > i; i++) {
      if (allAssets[i].id === req.body.cid) {
        isMatched++
      }
    }
    if (isMatched === 1) {
      cid = req.body.cid
    } else {
      throw new ServerError(404, "assert is not found")
    }
    return 
  }

  const newId = generateNextId(allAssets)

  if (cid) {
    allAssets.push({ id: newId, name: req.body.name,price:req.body.price, cid })
  } else {
    allAssets.push({ id: newId, name: req.body.name })
  }

  await writeFile(dbData)

  res.end(JSON.stringify({ assetId: newId }))
}


exports.getAsset = async (req, res, data) => {
  const dbData = await readFile()
  const allAssets = dbData.assets
  const cid= parseInt(req.params.cid)

  let asset=[]
  for (let i = 0; allAssets.length > i; i++) {
    if (allAssets[i].cid === cid) {      
      asset.push(allAssets[i])
    }
  }
  res.end(JSON.stringify({asset}) )
}


exports.updateAsset = async (req, res, body) => {
  const intId = parseInt(req.params.id)
  if (isNaN(intId)) {
    throw new ServerError(400, "invalid assset id supplied")
  }

  if (!req.body.name) {
    throw new ServerError(400, "name not supplied")
  }
  if (!req.body.price) {
    throw new ServerError(400, "price not supplied")
  }
  

  const dbdata = await readFile()

  // check duplicate asset name
  let i = 0
  for (i = 0; dbdata.assets.length > i; i++) {
    if (dbdata.assets[i].name.toLowerCase() === req.body.name.toLowerCase()) {
      throw new ServerError(400, "asset already exists")
    }
  }


  let isUpdated = false
  for (i = 0; i < dbdata.assets.length; i++) {
    if (dbdata.assets[i].id === intId) {
      dbdata.assets[i].name = req.body.name
      dbdata.assets[i].price = req.body.price
      isUpdated = true
      break
    }
  }

  if (!isUpdated) {
    throw new ServerError(404, "asset id not found")
  }

  await writeFile(dbdata)

  res.end(JSON.stringify({ ...dbdata.assets[i] }))
}
