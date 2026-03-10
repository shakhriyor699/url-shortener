require("dotenv").config()

const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")
const ogs = require("open-graph-scraper")
const { nanoid } = require("nanoid")
const validator = require("validator")

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function createShortUrl(url) {
  const isValid = validator.isURL(url, { require_protocol: true })
  if (!isValid) {
    throw new Error("Invalid URL: include http:// or https://")
  }

  let og = {}
  try {
    const { result } = await ogs({ url })
    og = result || {}
  } catch (err) {
    og = {}
  }

  const shortId = nanoid(7)

  const saved = await prisma.url.create({
    data: {
      originalUrl: url,
      shortId,
      title: og.ogTitle || "",
      description: og.ogDescription || "",
      image: (og.ogImage && og.ogImage.url) || (Array.isArray(og.ogImage) && og.ogImage[0]?.url) || ""
    }
  })

  return {
    shortId: saved.shortId,
    meta: {
      title: saved.title,
      description: saved.description,
      image: saved.image
    }
  }
}

async function getOriginalUrl(shortId) {
  const url = await prisma.url.findUnique({ where: { shortId } })
  if (!url) {
    throw new Error("Not found")
  }
  return url.originalUrl
}

module.exports = {
  createShortUrl,
  getOriginalUrl
}
