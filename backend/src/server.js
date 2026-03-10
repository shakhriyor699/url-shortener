require("dotenv").config()

const express = require("express")
const cors = require("cors")
const urlRoutes = require("./routes/url.routes")

const app = express()
const port = Number(process.env.PORT || 5060)
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173"

app.use(
  cors({
    origin: allowedOrigin
  })
)

app.use(express.json())

app.use("/api/url", urlRoutes)

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`CORS origin: ${allowedOrigin}`)
})

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Choose another PORT and update frontend proxy.`)
    process.exit(1)
  }

  console.error("Server failed to start:", error)
  process.exit(1)
})
