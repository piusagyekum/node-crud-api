const express = require("express")
const { connectToDb, getDb } = require("./db")

//init app and middleware

const app = express()

let db

connectToDb(err => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening for requests on port 3000")
    })
    db = getDb()
  }
})

//routes
app.get("/colors", (req, res) => {
  const colors = []
  db.collection("colors")
    .find()
    .forEach(color => {
      colors.push(color)
    })
    .then(() => {
      res
        .status(200)
        .json(colors)
    })
    .catch(err => {
      console.error(error)
    })
})
