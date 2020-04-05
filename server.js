"use strict"
const express = require("express")
const MongoClient = require("mongodb").MongoClient
const assert = require("assert")
// Connection URL
const url = "mongodb://localhost:27017"

// Database Name
const dbName = "GuessingGame"
// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true })

// Constants
const PORT = 80
const HOST = "0.0.0.0"

// App
const app = express()

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err)
  console.log("Connected successfully to server")

  const db = client.db(dbName)
  const col = db.collection("gameInfo")

  app.get("/", (req, res) => {
    res.send("Test")
  })
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
