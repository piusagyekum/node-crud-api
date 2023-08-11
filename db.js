const { MongoClient } = require("mongodb")

let dbConnection

module.exports = {
  connectToDb: cb => {
    MongoClient.connect("mongodb://127.0.0.1:27017/test")
      .then(client => {
        dbConnection = client.db()
        return cb()
      })
      .catch(err => {
        console.error(err,"could not connect to the database")
        return cb(err)
      })
  },
  getDb: () => dbConnection,
}
