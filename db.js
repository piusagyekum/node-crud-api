const { MongoClient, ServerApiVersion } = require("mongodb")

let dbConnection

module.exports = {
  connectToDb: cb => {
    MongoClient.connect("mongodb://127.0.0.1:27017/test")
      .then(client => {
        dbConnection = client.db()
        console.log("then method success")
        return cb()
      })
      .catch(err => {
        console.error(err)
        console.error("an error occured")
        return cb(err)
      })
  },
  getDb: () => dbConnection,
}
