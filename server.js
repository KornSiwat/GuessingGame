"use strict"
const express = require("express")
const MongoClient = require("mongodb").MongoClient
const assert = require("assert")
const bodyParser = require("body-parser")

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
app.use(express.static("public"))
app.use(bodyParser.json())

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err)
  console.log("Connected successfully to server")

  const db = client.db(dbName)
  const gameInfoCollection = db.collection("gameInfo")

  app.get("/", (req, res) => {
    res.send("Test")
  })

  app.post("/game/", (req, res) => {
    let playerName = undefined

    if (req.body) {
      ;({ name: playerName } = req.body)
    }

    if (!playerName) {
      res.status(400).send("NoPlayerName")
    }

    const solutionLength = 4
    const possibleChoice = ["A", "B", "C", "D"]
    const solution = Array.from(Array(solutionLength)).map(
      (_) => possibleChoice[Math.round(Math.random() * (solutionLength - 1))]
    )

    const gameInfo = {
      name: playerName,
      guessCount: 0,
      solution: solution,
      won: false,
    }

    gameInfoCollection
      .insertOne(gameInfo)
      .then((result) => {
        res.status(201).send({ gameID: result.ops[0]._id })
      })
      .catch((err) => res.status(500).send("cannotInsertDocument"))
  })
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
