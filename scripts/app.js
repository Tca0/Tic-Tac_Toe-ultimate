function init() {
  const localBoards = document.querySelectorAll(".local");
  const globalBoard = document.querySelector(".global");
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
    const cells = getChildrenNodes(board);
    cells.forEach((cell) => {
      cell.removeEventListener("click", handleCellClick);
    });
  }

  function handleCellClick(event) {
    if (gameOver) return;
    const cell = event.target;
    const board = cell.parentNode;
    nextMoveOnBoard = parseInt(cell.getAttribute("data-index"));
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    // ! Check for local win or drwa
    // Prepear for the next move
    // ? Check for total win or drwa

    const localWin = checkWin(board);
    const localDraw = checkDraw(board);
    if (localWin) {
      handleLocalWinOrDraw(
        board,
        `Player ${currentPlayer} wins!`,
        currentPlayer
      );
    } else if (localDraw) {
      handleLocalWinOrDraw(board, `drwa`, `drwa`);
    }
    checkForNextGrid(nextMoveOnBoard);

    if (localWin || localDraw) {
      const globalWin = checkWin(globalBoard);
      const globalDrwa = checkDraw(globalBoard);
      gameOver = globalWin || globalDrwa ? true : false;
      if (globalWin) {
        console.log(`game over, the player ${currentPlayer} wins`);
      }
      if (globalDrwa) {
        console.log("Game over, no winner");
      }
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
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
      console.log(`checking on global board`);
      console.log(cells);
      return !cells.some((cell) => {
        console.log(cell);
        console.log(cell.classList.contains("available"));
        return cell.classList.contains("available");
      });
    } else {
      return cells.every((cell) => cell.classList.length === 2);
    }
  }

  function handleLocalWinOrDraw(board, messageToUpdate, classToUpdate) {
    board.classList.add(classToUpdate);
    message = messageToUpdate;
    removeClickEventListener(board);
  }

  function checkForNextGrid(idx) {
    const isFinishedBoard = (board) =>
      board.classList.contains("drwa") ||
      board.classList.contains("X") ||
      board.classList.contains("O");
    if (!isFinishedBoard(localBoards[idx])) {
      for (let i = 0; i < 9; i++) {
        if (i != idx) {
          removeClickEventListener(localBoards[i]);
        } else {
          addClickEventListener(localBoards[i]);
        }
      }
    } else {
      localBoards.forEach((board) => {
        if (!isFinishedBoard(board)) {
          addClickEventListener(board);
        }
      });
    }
  }

  localBoards.forEach((board) => {
    if (!nextMoveOnBoard) {
      addClickEventListener(board);
    }
  });
}
window.addEventListener("DOMContentLoaded", init);
