"use strict"
const express = require("express")
const MongoClient = require("mongodb").MongoClient
const ObjectID = require("mongodb").ObjectID
const assert = require("assert")
const bodyParser = require("body-parser")
const path = require("path")

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
app.use(express.static(__dirname))
app.use(bodyParser.json())

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err)
  console.log("Connected successfully to server")

  const db = client.db(dbName)
  const gameInfoCollection = db.collection("gameInfo")

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"))
  })

  app.get("/game/", (req, res) => {
    res.sendFile(path.join(__dirname + "/game.html"))
  })

  app.get("/answer/", async (req, res) => {
    let objectID = req.query.ID

    if (!objectID) {
      res.status(400).send("No GameID Given")
    }

    objectID = new ObjectID(objectID)

    const data = await gameInfoCollection
      .findOne({ _id: { $eq: objectID }}, {answer: 1})

    if (!data) {
      res.status(404).send("GameInfo Not Found")
    }

    res.send(data.answer)
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
      _ => possibleChoice[Math.round(Math.random() * (solutionLength - 1))]
    )

    const gameInfo = {
      name: playerName,
      guessCount: 0,
      solution: solution,
      answer: [],
      won: false,
    }

    gameInfoCollection
      .insertOne(gameInfo)
      .then(result => {
        res.status(201).send({ gameID: result.ops[0]._id })
      })
      .catch(err => res.status(500).send("cannotInsertDocument"))
  })

  app.post("/answer/", (req, res) => {
    let objectID = undefined
    let answer = undefined

    if (req.body) {
      ;({ answer, gameID: objectID } = req.body)
    }

    if (!answer) {
      res.status(400).send("No Answer Given")
    }

    if (!objectID) {
      res.status(400).send("No GameID Given")
    }

    objectID = new ObjectID(objectID)

    gameInfoCollection.updateOne({ _id: objectID }, { $inc: { guessCount: 1 } })
  })
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
