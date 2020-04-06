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

async function loadCurrentStatus() {
  try {
    const res = await axios.get(`/status?ID=${GAME.ID}`)
    const currentAnswer = res.data.answer
    const currentGuessCount = res.data.guessCount
    const isWon = res.data.won

    const currentAnswerString = Array.from(Array(4)).reduce((acc, _, index) => {
      if (currentAnswer[index]) {
        acc += ` ${currentAnswer[index]}`
      } else {
        acc += " _"
      }

      return acc
    }, "")

    updateAnswerBox(currentAnswerString)
    updateGuessCount(currentGuessCount)

    if (isWon) {
      setTimeout(function () {
        alert(
          `Yay!! You Finished the game with only ${currentGuessCount} guesses`
        )
        location.reload()
      }, 10)
    }
  } catch (error) {
    console.log("cannot load current answer")
  }
}

async function answer(button) {
  const res = await axios.post("/answer", {
    ID: GAME.ID,
    answer: button.value,
  })

  loadCurrentStatus()
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
  getAnswerBox().innerText = newAnswer
}

function updateGuessCount(guessCount) {
  document.getElementsByClassName(
    "guessCount"
  )[0].innerText = `Guess Count: ${guessCount}`
}
