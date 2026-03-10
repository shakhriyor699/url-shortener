const urlService = require("../services/url.service")

exports.shortenUrl = async (req, res) => {
  try {
    const { url } = req.body

    const data = await urlService.createShortUrl(url)

    const shortUrl = `${req.protocol}://${req.get('host')}/api/url/${data.shortId}`

    res.json({ shortUrl, meta: data.meta })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

exports.redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params

    const url = await urlService.getOriginalUrl(shortId)

    res.redirect(url)
  } catch (error) {
    res.status(404).json({ error: "URL not found" })
  }
}