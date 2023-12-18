function init() {
  const localBoards = document.querySelectorAll(".local");
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

  function getCellsFromBoard(board) {
    // return board.querySelectorAll(".cell");
    return Object.values(board.children);
  }

  function addClickEventListener(board) {
    board.classList.add("available");
    const cells = getCellsFromBoard(board);
    cells.forEach((cell) => {
      if (cell.classList.length === 1)
        cell.addEventListener("click", handleCellClick, { once: true });
    });
  }

  function removeClickEventListener(board) {
    board.classList.remove("available");
    const cells = getCellsFromBoard(board);
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
    // ? afetr local win check for globla win or draw
    // ! after local draw check only for global draw
    // * for win or drwa same conditions will apply for global win/draw
    //  & change the name of function to check for win or drwa then apply same function for global win/draw
    if (checkLocalBoardWinner(board)) {
      handleLocalWinOrDraw(
        board,
        `Player ${currentPlayer} wins!`,
        `winner-${currentPlayer}`
      );
    } else if (checkLocalDraw(board)) {
      handleLocalWinOrDraw(board, `drwa`, `drwa`);
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    checkForNextGrid(nextMoveOnBoard);
  }

  function checkLocalBoardWinner(localBoard) {
    const cells = localBoard.querySelectorAll(".cell");
    return winningConditions.some((condition) => {
      return condition.every((index) =>
        cells[index].classList.contains(currentPlayer)
      );
    });
  }

  function checkLocalDraw(board) {
    const cells = Array.from(board.querySelectorAll(".cell"));
    return cells.every((cell) => cell.classList.length === 2);
  }
  function handleLocalWinOrDraw(board, messageToUpdate, classToUpdate) {
    board.classList.add(classToUpdate);
    message = messageToUpdate;
    removeClickEventListener(board);
  }

  function checkForNextGrid(idx) {
    const isFinishedBoard = (board) =>
      board.classList.contains("drwa") ||
      board.classList.contains("winner-X") ||
      board.classList.contains("winner-O");
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
