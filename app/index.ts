import express from "express"

const port = 9000
const app = express()

app.get("/", (req, res) => {
  return res.send("hello world")
})

app.listen(port)
console.log(`Server started on port ${port}`)
