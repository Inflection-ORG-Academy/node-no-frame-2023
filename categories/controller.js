const { ServerError } = require("../error")
const { readFile, writeFile } = require("../file")
const { generateNextId } = require("../utils")

exports.createCategory = async (req, res, data) => {
  if (!req.body.name || req.body.name.length < 3 || req.body.name.length > 20) {
    throw new ServerError(400, "invalid category name")
  }
  const dbData = await readFile()
  const allCategories = dbData["categories"]

  // check duplicate category
  for (let i = 0; allCategories.length > i; i++) {
    if (allCategories[i].name.toLowerCase() === req.body.name.toLowerCase()) {
      throw new ServerError(400, "category already exists")
    }
  }

  let cid = undefined
  // check category id (cid) validity
  if (req.body.cid) {
    let isMatched = 0
    for (let i = 0; allCategories.length > i; i++) {
      if (allCategories[i].id === req.body.cid) {
        isMatched++
      }
    }
    if (isMatched === 1) {
      cid = req.body.cid
    } else {
      throw new ServerError(404, "category is not found")
    }
  }

  const newId = generateNextId(allCategories)

  if (cid) {
    allCategories.push({ id: newId, name: req.body.name, cid })
  } else {
    allCategories.push({ id: newId, name: req.body.name })
  }

  await writeFile(dbData)

  res.end(JSON.stringify({ categoryId: newId }))
}

exports.getCategories = async (req, res, data) => {
  const dbData = await readFile()

  if (!dbData.categories.length) {
    throw new ServerError(404, "categories not found")
  }

  res.end(JSON.stringify({ categories: dbData.categories }))
}