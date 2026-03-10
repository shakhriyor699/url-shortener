const router = require("express").Router()
const { shortenUrl } = require("../controllers/url.controller")
const { redirectUrl } = require("../controllers/url.controller")

router.post("/shorten", shortenUrl)
router.get("/:shortId", redirectUrl)

module.exports = router