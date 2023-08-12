const express = require("express")
const { connectToDb, getDb } = require("./db")
const { ObjectId } = require("mongodb")

//init app and middleware

const app = express()
app.use(express.json())

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
app.get("/posts", (req, res) => {
  const posts = []
  //pagination
  const currentPage = req.query.p || 0
  const postsPerPage = 10
  db.collection("posts")
    .find()
    .skip(currentPage * postsPerPage)
    .limit(postsPerPage)
    .forEach(color => {
      posts.push(color)
    })
    .then(() => {
      res.status(200).json({ code: 0, posts })
    })
    .catch(err => {
      res.status(500).json({ code: 1, error: "Could not fetch documents" })
    })
})

app.get("/posts/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("posts")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then(post => {
        res.status(200).json({ code: 0, post })
      })
      .catch(err => {
        res.status(500).json({ code: 1, error: "Could not fetch document" })
      })
  } else {
    res.status(500).json({ code: 1, error: "Invalid id" })
  }
})

app.post("/addnewpost", (req, res) => {
  db.collection("posts")
    .insertOne(req.body)
    .then(() => {
      res.status(201).json({ code: 0, Message: "Post was added successfully" })
    })
    .catch(err => {
      res.status(500).json({ code: 1, Error: "Post was not added" })
    })
})

app.delete("/posts/:id", (req, res) => {
  const id = req.params.id
  if (ObjectId.isValid(id)) {
    db.collection("posts")
      .deleteOne({ _id: new ObjectId(id) })
      .then(result => {
        res.status(200).json({
          code: 0,
          Message: `Document with ID ${id} was deleted successfully`,
        })
      })
      .catch(err => {
        res
          .status(500)
          .json({ code: 1, error: "Could not delete the document" })
      })
  } else {
    res.status(500).json({ code: 1, error: "Not a valid document ID" })
  }
})

app.patch("/posts/:id", (req, res) => {
  const updates = req.body
  if (ObjectId.isValid(req.params.id)) {
    db.collection("posts")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then(() => {
        res
          .status(200)
          .json({ code: 0, Message: `Document was updated sucessfully` })
      })
      .catch(err => {
        res.status(500).json({ code: 1, error: "Could not update document" })
      })
  } else {
    res.status(500).json({ code: 1, error: "Not a valid document ID" })
  }
})

app.use((req, res) => {
  res
    .status(404)
    .json({ code: 1, Message: "Could not find requested resourse" })
})
