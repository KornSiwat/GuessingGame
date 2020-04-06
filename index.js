const GAME = {}

async function start() {
  const playerName = getPlayerName()

  if (playerName === "") {
    alert("Please Enter Your Name")
    return
  }

  try {
    const res = await axios.post("/game", {
      name: playerName,
    })
    const gameID = res.data.gameID

    GAME.ID = gameID

    loadGame()
  } catch (error) {
    alert("Error! Please Try Again")
  }
}

async function loadGame() {
  try {
    const res = await axios.get("/game")
    const gameBody = res.data

    updateHTMLBody(gameBody)
  } catch (error) {
    alert("Error! Please Try Again")
  }
}

async function loadCurrentAnswer() {
  try {
    const res = await axios.get(`/answer?ID=${GAME.ID}`)
    const currentAnswer = res.data

    const currentAnswerString = Array.from(Array(4)).reduce((acc, _, index) => {
      if (currentAnswer[index]) {
        acc += ` $(currentAnswer[index])`
      } else {
        acc += " _"
      }

      return acc
    }, "")

    updateAnswerBox(currentAnswerString)
  } catch (error) {
    console.log("cannot load current answer")
  }
}

function getPlayerName() {
  return document.getElementById("playerName").value
}

function getCurrentHTMLBody() {
  return document.getElementsByTagName("Body")[0]
}

function updateHTMLBody(newBody) {
  getCurrentHTMLBody().innerHTML = newBody
}

function getAnswerBox() {
  return document.getElementsByClassName("answerBox")[0]
}

function updateAnswerBox(newAnswer) {
  getAnswerBox.innerHTML = newAnswer
}
