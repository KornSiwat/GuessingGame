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
    const gameId = res.data.gameId

    loadGame(gameId)
  } catch (error) {
    alert("Error! Please Try Again")
  }
}

async function loadGame(gameId) {
  try {
    const res = await axios.get("/game")
    const gameBody = res.data
    const currentBody = getCurrentDocumentBody()

    currentBody.innerHTML = gameBody
  } catch (error) {
    alert("Error! Please Try Again")
  }
}

function getPlayerName() {
  return document.getElementById("playerName").value
}

function getCurrentDocumentBody() {
  return document.getElementsByTagName("Body")[0]
}
