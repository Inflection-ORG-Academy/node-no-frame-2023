const { ServerError } = require('../error')
const { readFile, writeFile } = require("../file")
const { generateNextId } = require("../utils")

exports.createAsset = async (req, res, data) => {
  if (!req.body.name) {
    throw new ServerError(400, "name not supplied")
  }
  const price = parseFloat(req.body?.price)
  if (!req.body.price || isNaN(price)) {
    throw new ServerError(400, "invalid price")
  }
  const cid = parseInt(req.body?.cid)
  if (!req.body.cid || isNaN(cid)) {
    throw new ServerError(400, "invalid category id supplied")
  }

  const dbData = await readFile()

  // check for existing categories
  const allCategories = dbData.categories

  let isMatched = false
  for (let i = 0; i < allCategories.length; i++) {
    if (allCategories[i].id === cid) {
      isMatched = true
      break
    }
  }

  if (!isMatched) {
    throw new ServerError(404, "category not found")
  }

  // check for available repeated asset
  for (let i = 0; i < dbData.assets.length; i++) {
    if (dbData.assets[i].name === req.body.name) {
      throw new ServerError(400, "asset name already exists")
    }
  }

  const newAssetId = generateNextId(dbData.assets)
  const asset = {
    id: newAssetId,
    name: req.body.name,
    price,
    cid,
    description: req.body.description
  }

  dbData.assets.push(asset)

  await writeFile(dbData)

  res.end(JSON.stringify(asset))
}

exports.getAssetByCategory = async (req, res, data) => {
  const cidStr = req.params.cid
  const cid = parseInt(cidStr)
  if (isNaN(cid)) {
    throw new ServerError(400, "cid is invalid")
  }

  const dbData = await readFile()

  const assets = []
  for (let i = 0; i < dbData.assets.length; i++) {
    if (dbData.assets[i].cid === cid) {
      assets.push(dbData.assets[i])
    }
  }

  res.end(JSON.stringify(assets))
}