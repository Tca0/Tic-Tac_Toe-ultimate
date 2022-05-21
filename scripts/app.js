function init() {
  let playerTurn = document.querySelector(".player_turn");
  let gameSituation = document.querySelector(".game_situation");
  let resetBtn = document.querySelector(".reset");
  const showResultsDiv = document.querySelector(".hiddenResults");
  const results = document.querySelector(".results");
  const localGrids = document.querySelectorAll(".local");
  const localCells = document.querySelectorAll(".local_grid_cell");
  const globalGride = document.querySelector(".global");
  const dialogBox = document.querySelector("#dialogInfo");
  const errorMessages = document.querySelector(".infoMessages");
  const gameTimer = document.querySelector("#timer");
  const muteBtnStarter = document.querySelector("#mute");
  const muteOrUnmute = document.querySelector("#muteButton");
  const winingConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let X_Turn; // to decide which player turn is and place mark due it.
  let emptyCellsNumber = 0; // It's 81 when game started for the first move
  let resultsMessage = "";
  let infoMessage = "";
  let nextMoveOnGrid = []; // to store the supposed next move
  let numberOfMoves = 0;
  let X_Moves = 0;
  let O_Moves = 0;
  let timerInterval;

  //creating a sounds
  let soundTracksArray = []; // to mute all sounds when press mute button
  const localWinSound = new Audio("../sounds/local-win-sound.wav");
  soundTracksArray.push(localWinSound);
  const startGameSound = new Audio("../sounds/game-start-sound.wav");
  soundTracksArray.push(startGameSound);
  const clockTicking = new Audio("../sounds/clock-game-time-sound.wav");
  soundTracksArray.push(clockTicking);
  const globalWinSound = new Audio("../sounds/global-winng-sound.wav");
  soundTracksArray.push(globalWinSound);
  const wrongMoveSound = new Audio("../sounds/wrong-move-sound.wav");
  soundTracksArray.push(wrongMoveSound);
  const placeMarkSound = new Audio("../sounds/place-mark-sound.wav");
  soundTracksArray.push(placeMarkSound);
  const localDrawSound = new Audio("../sounds/local-draw-sound.wav");
  soundTracksArray.push(localDrawSound);
  const globalDrawSound = new Audio("../sounds/global-draw-sound.wav");
  soundTracksArray.push(globalDrawSound);

  // after game loaded and before game start a popup window will show up and players
  // will enter their names and each one will click on a dice
  // the numbers showed on dices will be compared and the player with bigger number will start first
  document.querySelector(".hidden_Inputs").classList.toggle("popup_start");
  const firstDice = document.querySelector(".dice_X");
  const secondDice = document.querySelector(".dice_O");
  let firstDiceFaces = Array.from(firstDice.children);
  let secondDiceFaces = Array.from(secondDice.children);
  let firstPlayerNum;
  let secondPlayerNum;
  let firstPlayerName;
  let secondPlayerName;
  let muted = false;

  //generating a random dice face between 1-6
  const showDiceFaceNumber = (number, faceView) => {
    switch (number) {
      case 1:
        faceView.innerHTML = `<span>&#9856;</span>`;
        break;
      case 2:
        faceView.innerHTML = `<span>&#9857;</span>`;
        break;
      case 3:
        faceView.innerHTML = `<span>&#9858;</span>`;
        break;
      case 4:
        faceView.innerHTML = `<span>&#9859;</span>`;
        break;
      case 5:
        faceView.innerHTML = `<span>&#9860;</span>`;
        break;
      case 6:
        faceView.innerHTML = `<span>&#9861;</span>`;
        break;
      default:
    }
  };
  const rollDice1 = () => {
    firstPlayerNum = parseInt(Math.random() * 6) + 1;
    let xRand = getRandomRotate();
    let yRand = getRandomRotate();
    firstDice.style.webkitTransform =
      "rotateX(" + xRand + "deg) rotateY(" + yRand + "deg)";
    firstDice.style.transform =
      "rotateX(" + xRand + "deg) rotateY(" + yRand + "deg)";
    firstDiceFaces.forEach((face) => {
      showDiceFaceNumber(firstPlayerNum, face);
    });
    return firstPlayerNum;
  };
  const rollDice2 = () => {
    secondPlayerNum = parseInt(Math.random() * 6) + 1;
    let xRand = getRandomRotate();
    let yRand = getRandomRotate();
    secondDice.style.webkitTransform =
      "rotateX(" + xRand + "deg) rotateY(" + yRand + "deg)";
    secondDice.style.transform =
      "rotateX(" + xRand + "deg) rotateY(" + yRand + "deg)";
    secondDiceFaces.forEach((face) => {
      showDiceFaceNumber(secondPlayerNum, face);
    });
    return secondPlayerNum;
  };
  const getRandomRotate = () => {
    // times of 90 deg is to set up the dice's face vertically
    return (Math.floor(Math.random() * 6) + 1) * 90;
  };
  firstDice.addEventListener("click", rollDice1);
  secondDice.addEventListener("click", rollDice2);

  // function to close first start div and get users information
  // and change starter show to red-yellow-green
  const startBtn = document.querySelector(".startGameBtn");
  const getPlayersInfoAndStart = () => {
    firstPlayerName = document.querySelector("#firstPlayerName").value;
    secondPlayerName = document.querySelector("#secondPlayerName").value;
    const light = ["redLight", "yellowLight", "greenLight"];
    let i = 0;
    document.querySelector("#rulesExplaining").classList.add("hideText");
    document.querySelector(".player_Inputs").classList.add("hideText");
    startBtn.classList.add("hideText");
    document.querySelector(".game_Rules").classList.add(`${light[i]}`);
    setInterval(() => {
      i++;
      document.querySelector(".game_Rules").classList.remove(`${light[i - 1]}`);
      document.querySelector(".game_Rules").classList.add(`${light[i]}`);
    }, 2200);

    setTimeout(() => {
      document.querySelector(".hidden_Inputs").classList.remove("popup_start");
      startGame();
    }, 5000);
    startGameSound.play();
  };

  // function to trim names from spaces and Capitalize first letter
  const correctNames = (string) =>
    string
      .trim()
      .replace(/[^a-zA-Z]/g, "")
      .charAt(0)
      .toUpperCase() +
    string
      .trim()
      .replace(/[^a-zA-Z]/g, "")
      .slice(1)
      .toLowerCase();
  startBtn.addEventListener("click", getPlayersInfoAndStart);

  //setting the mutters and un mutters before game start and inside it
  //functions to mute the sounds at the beginning before game starts and during the game
  const muteOrUnmuteSounds = () => {
    soundTracksArray.forEach((track) => {
      track.muted = !track.muted;
    });
    muted = !muted;
    showingMuteUnmuteIcon(muted);
  };
  // function to stop sounds and reset all audios
  const stopSounds = (soundTracks) => {
    soundTracks.forEach((track) => {
      track.pause();
      track.currentTime = 0;
      track.muted = false;
    });
  };
  //function to show the right sounds icon
  const showingMuteUnmuteIcon = (isMute) => {
    if (isMute === true) {
      muteOrUnmute.innerHTML = "&#128263;";
      muteBtnStarter.innerHTML = "&#128263;";
    } else {
      muteOrUnmute.innerHTML = "&#x1F508;";
      muteBtnStarter.innerHTML = "&#x1F508;";
    }
  };
  muteBtnStarter.addEventListener("click", muteOrUnmuteSounds);
  muteOrUnmute.addEventListener("click", muteOrUnmuteSounds);

  // start the game by calling the startGame function
  // start game function
  const startGame = () => {
    firstPlayerName = correctNames(firstPlayerName);
    secondPlayerName = correctNames(secondPlayerName);
    showingMuteUnmuteIcon(muted);
    //if players entered their names or not
    // if they choose to decided to roll the dices with names or without
    if (
      firstPlayerNum > secondPlayerNum ||
      (!firstPlayerNum && !secondPlayerNum)
    ) {
      X_Turn = true;
    } else {
      X_Turn = false;
    }
    displayTurn();
    X_Moves = 0;
    O_Moves = 0;
    localCells.forEach((cell) => {
      cell.textContent = "";
      cell.addEventListener("click", handelClickOnCell);
    });
    emptyCellsNumber = 81;
    gameSituation.textContent = "Start Playing";
  };
  // Restart button and its function
  function restartGame() {
    //remove all eventListeners
    // reset all global variables
    localCells.forEach((cell) => {
      cell.textContent = "";
      cell.removeEventListener("click", handelClickOnCell);
      cell.classList.remove("X");
      cell.classList.remove("O");
    });
    numberOfMoves = 0;
    infoMessage = "";
    resultsMessage = "";
    nextMoveOnGrid = [];
    gameSituation.textContent = " ";
    playerTurn.textContent = "";
    gameTimer.innerHTML = "00:00";
    displayResultsAndMessages();
    localGrids.forEach((grid) => {
      grid.dataset.winner = "";
      grid.dataset.available = "true";
    });
    globalGride.addEventListener("click", startTime, { once: true });
    clearInterval(timerInterval);
    stopSounds(soundTracksArray);
    document.querySelector(".hidden_Inputs").classList.toggle("popup_start");
    document.querySelector(".game_Rules").classList.remove("greenLight");
    document.querySelector("#rulesExplaining").classList.remove("hideText");
    document.querySelector(".player_Inputs").classList.remove("hideText");
    startBtn.classList.remove("hideText");
  }
  resetBtn.addEventListener("click", restartGame);

  //time function
  let minute = 0;
  let second = 0;
  const startTime = () => {
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      second++;
      gameTimer.innerHTML =
        (minute < 10 ? "0" + minute : minute) +
        ":" +
        (second < 10 ? "0" + second : second);
      if (second == 60) {
        minute++;
        second = 0;
      }
      clockTicking.currentTime = 0;
    }, 1000);
    clockTicking.play();
  };
  // with first click on the grid the time will run
  globalGride.addEventListener("click", startTime, { once: true });

  function handelClickOnCell(event) {
    const clickedCell = event.target;
    numberOfMoves++; // with every click increase the numberOfMoves by one
    let currentTurn;
    let currentPlayer;
    if (X_Turn) {
      currentTurn = "X";
      currentPlayer = firstPlayerName ? firstPlayerName : "X";
      X_Moves++;
    } else {
      currentTurn = "O";
      currentPlayer = secondPlayerName ? secondPlayerName : "X";
      O_Moves++;
    }
    const clickedOnGridNumber = clickedCell.parentNode.dataset.localBoard;
    const nextMove = event.target.dataset.index;
    let nextMoveAvailability = document.querySelector(
      `.local[data-local-board="${nextMove}"]`
    ).dataset.available;

    //store the supposed next move in an array to check if it's a legal click or not
    //check if the current click is on available grid and right click due to the rules
    //if it's then call a moveOnAvailableGrid function
    // else show a massage it's not available move here go to another available grid due to the rules
    //if it's an empty global grid move on else check if it's match the rules
    if (isValidCell(clickedCell)) {
      if (isItAnewGame() || isItRightLocalBoard(clickedOnGridNumber)) {
        placeMark(clickedCell);
        if (isLocalBoardWins(clickedOnGridNumber, currentTurn)) {
          setTimeout(() => localWinSound.play(), 800);
          clickedCell.parentNode.dataset.available = "false";
          nextMoveAvailability = "false";
          clickedCell.parentNode.dataset.winner = clickedCell.textContent;
          resultsMessage = `winner is ${currentPlayer} on grid number ${clickedOnGridNumber}`;
        } else if (isLocalDraw(clickedOnGridNumber)) {
          setTimeout(() => localDrawSound.play(), 800);
          clickedCell.parentNode.dataset.available = "false";
          clickedCell.parentNode.dataset.winner = "none";
          resultsMessage = `It's a draw in board number ${clickedOnGridNumber}`;
          nextMoveAvailability = "false";
        }
        if (isGlobalWins(currentTurn)) {
          setTimeout(() => globalWinSound.play(), 800);
          resultsMessage = `Game ended.<br>The winner is ${currentPlayer}.<br>Total moves ${numberOfMoves}.<br>X's total moves ${X_Moves}.<br>O's total moves ${O_Moves}.<br>Total time ${minute}:${second}`;
          endGame();
        } else if (isGlobalDraw()) {
          setTimeout(() => globalDrawSound.play(), 800);
          resultsMessage = `No winner.<br>It's totally tied.<br>Total off moves ${numberOfMoves}.<br>X's total moves ${X_Moves}.<br>O's total moves ${O_Moves}.<br>Total time ${minute}:${second}`;
          endGame();
        } else {
          swapTurn();
          if (nextMoveAvailability === "false") {
            nextMoveOnGrid.push("anyAvailableBoard");
            infoMessage = "Next player can play on any unfinished board";
          } else {
            nextMoveOnGrid.push(nextMove);
          }
        }
      } else {
        infoMessage = `Clicked on wrong local board.<br>your move should be on grid number ${
          parseInt(nextMoveOnGrid[nextMoveOnGrid.length - 1]) + 1
        }`;
      }
    } else {
      infoMessage = `current cell was occupied by another player`;
    }
    displayResultsAndMessages();
  }
  // function to check if it's a new game started
  const isItAnewGame = () => emptyCellsNumber === 81;

  // function to check if it's an empty cell
  const isValidCell = (cell) =>
    !(cell.classList.contains("X") || cell.classList.contains("O"));

  // function to check if it's a right local board was clicked
  const isItRightLocalBoard = (boardNumber) =>
    boardNumber === nextMoveOnGrid[nextMoveOnGrid.length - 1] ||
    nextMoveOnGrid[nextMoveOnGrid.length - 1] === "anyAvailableBoard";

  // Local wins function
  const isLocalBoardWins = (index, currentTurn) => {
    const x = document.querySelector(`.local[data-local-board="${index}"]`);
    const cells = Array.from(x.children);
    if (x.dataset.available === "true") {
      return winingConditions.some((condition) => {
        return condition.every((index) => {
          return cells[index].classList.contains(currentTurn);
        });
      });
    }
    return;
  };

  //local draw
  const isLocalDraw = (index) => {
    const x = document.querySelector(`.local[data-local-board="${index}"]`);
    const cells = Array.from(x.children);
    if (x.dataset.available === "true") {
      return cells.every((cell) => {
        return !isValidCell(cell);
      });
    }
    return;
  };

  // Global wins
  const isGlobalWins = (currentTurn) => {
    const grid = Array.from(globalGride.children);
    return winingConditions.some((condition) => {
      return condition.every((index) => {
        return (
          grid[index].dataset.winner === currentTurn &&
          grid[index].dataset.available === "false"
        );
      });
    });
  };

  // global draw function
  const isGlobalDraw = () => {
    const grid = Array.from(globalGride.children);
    return winingConditions.every((condition) => {
      return condition.every((index) => {
        return grid[index].dataset.available === "false";
      });
    });
  };

  // Placing mark in the cell
  const placeMark = (cell) => {
    gameSituation.textContent = "Game In Progress";
    if (X_Turn) {
      cell.classList.add("X");
      cell.textContent = "X";
    } else {
      cell.classList.add("O");
      cell.textContent = "O";
    }
    emptyCellsNumber--;
    placeMarkSound.play();
    placeMarkSound.currentTime = 0;
  };
  // Player Turn message display
  const displayTurn = () => {
    if (X_Turn) {
      if (firstPlayerName) {
        playerTurn.textContent = `${firstPlayerName}'s Turn`;
      } else {
        playerTurn.textContent = "Player X's Turn";
      }
    } else {
      if (secondPlayerName) {
        playerTurn.textContent = `${secondPlayerName}'s Turn`;
      } else {
        playerTurn.textContent = "Player O's Turn";
      }
    }
  };
  // switch turn between players
  const swapTurn = () => {
    X_Turn = !X_Turn;
    displayTurn();
  };

  //display messages function
  const displayResultsAndMessages = () => {
    if (resultsMessage) {
      results.innerHTML = resultsMessage;
      openMessagesWindow();
    } else if (infoMessage) {
      errorMessages.innerHTML = infoMessage;
      showDialog();
    }
    resultsMessage = "";
    infoMessage = "";
  };

  const openMessagesWindow = () => {
    setTimeout(() => showResultsDiv.classList.add("popup"), 300);
  };
  // function to close the message window when user clicks on any empty space on the screen
  window.onclick = function (e) {
    if (e.target == showResultsDiv) {
      showResultsDiv.classList.remove("popup");
    }
  };

  const showDialog = () => {
    dialogBox.showModal();
    wrongMoveSound.play();
  };
  const closeDialog = () => {
    dialogBox.close();
    wrongMoveSound.pause();
    wrongMoveSound.currentTime = 0;
  };
  dialogBox.addEventListener("click", closeDialog);

  //end game function
  const endGame = () => {
    localCells.forEach((cell) => {
      cell.removeEventListener("click", handelClickOnCell);
      clockTicking.pause();
    });
    globalGride.removeEventListener("click", startTime);
    clearInterval(timerInterval);
  };
}
window.addEventListener("DOMContentLoaded", init);
