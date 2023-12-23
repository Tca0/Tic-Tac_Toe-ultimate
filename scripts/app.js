function init() {
  const localBoards = document.querySelectorAll(".local");
  const globalBoard = document.querySelector(".global");
  let messageToDisplay = document.querySelector(".message")
  let currentPlayer = "X";
  let gameOver = false;
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let nextMoveOnBoard = null;

  function handleCellClick(event) {
    messageToDisplay.textContent = " "
    if (gameOver) return;
    const cell = event.target;
    const board = cell.parentNode;
    nextMoveOnBoard = parseInt(cell.getAttribute("data-index"));
    replaceMark(cell)
    // cell.textContent = currentPlayer;
    // cell.classList.add(currentPlayer);
    // ! Check for local win or drwa
    // Prepear for the next move
    // ? Check for total win or drwa
    const localWin = checkWin(board);
    const localDraw = checkDraw(board);
    if (localWin) {
      handleLocalWinOrDraw(
        board,
        `Player ${currentPlayer} wins the board ${parseInt(board.id)+1}!`,
        currentPlayer
      );
    } else if (localDraw) {
      handleLocalWinOrDraw(board, `Tie on the board ${parseInt(board.id)+1}`, `drwa`);
    }
    checkForNextGrid(nextMoveOnBoard);

    if (localWin || localDraw) {
      // ! handel game over terms
      //  ? write a function to carry a message and finish the game
      const globalWin = checkWin(globalBoard);
      const globalDrwa = checkDraw(globalBoard);
      gameOver = globalWin || globalDrwa ? true : false;
      if (globalWin) {
        handleGameOver(`${currentPlayer} won`)
      }
      if (globalDrwa) {
        handleGameOver("No winner, it's a tie")
      }
    }
    setTimeout(() => swapTurn(), 500)
    // swapTurn()
  }
  function replaceMark(cell) {
    cell.classList.add(currentPlayer)
    // cell.textContent = currentPlayer
    setTimeout(() => cell.textContent = currentPlayer, 500)
  }
function swapTurn() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.querySelectorAll(".available").forEach((gird) => gird.classList.add(`${currentPlayer}-turn`))
}
  function checkWin(board) {
    const cells = getChildrenNodes(board);
    return winningConditions.some((condition) => {
      return condition.every((index) =>
        cells[index].classList.contains(currentPlayer)
      );
    });
  }

  function checkDraw(board) {
    const cells = getChildrenNodes(board);
    if (board.classList.contains("global")) {
      return !cells.some((cell) => cell.classList.contains("available"));
    } else {
      return cells.every((cell) => cell.classList.length === 2);
    }
  }

  function handleLocalWinOrDraw(board, messageToUpdate, classToUpdate) {
    board.classList.add(classToUpdate);
    message = messageToUpdate;
    removeClickEventListener(board);
    messageToDisplay.textContent = messageToUpdate
  }

  function handleGameOver(message) {
    localBoards.forEach(board => removeClickEventListener(board))
    messageToDisplay.textContent = `Game over... ${message}`
    }

  function checkForNextGrid(idx) {
    const isFinishedBoard = (board) =>
      board.classList.contains("drwa") ||
      board.classList.contains("X") ||
      board.classList.contains("O");
      localBoards.forEach(board => removeClickEventListener(board))
      if(!isFinishedBoard(localBoards[idx])) {
        addClickEventListener(localBoards[idx])
      } else {
        localBoards.forEach((board) => {
          if (!isFinishedBoard(board)) {
            addClickEventListener(board);
          }
        });
      }
  }

  function getChildrenNodes(board) {
    return Object.values(board.children);
  }

  function addClickEventListener(board) {
    board.classList.add("available");
    const cells = getChildrenNodes(board);
    cells.forEach((cell) => {
      if (cell.classList.length === 1)
        cell.addEventListener("click", handleCellClick, { once: true });
    });
  }

  function removeClickEventListener(board) {
    board.classList.remove("available");
    board.classList.remove(`${currentPlayer}-turn`)
    const cells = getChildrenNodes(board);
    cells.forEach((cell) => {
      cell.removeEventListener("click", handleCellClick);
    });
  }

  localBoards.forEach((board) => {
    if (!nextMoveOnBoard) {
      board.classList.add(`${currentPlayer}-turn`)
      addClickEventListener(board);
    }
  });
}
window.addEventListener("DOMContentLoaded", init);
