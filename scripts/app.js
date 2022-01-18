function init() {
    let playerTurn = document.querySelector(".player_turn")
    let gameSituation = document.querySelector(".game_situation")
    let resetBtn = document.querySelector(".reset")
    const showResultsDiv = document.querySelector(".results")
    const localGrids = document.querySelectorAll(".local")
    const localCells = document.querySelectorAll(".local_grid_cell")
    const globalGride = document.querySelector(".global")
    const winingConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    let X_Turn // to decide which player turn is and place mark due it.
    let emptyCellsNumber = 0 // It's 81 when game started for the first move
    let localWinner = undefined // to store the winner for a local grid win
    let message = ""
    let nextMoveOnGrid = [] // to store the supposed next move
    let numberOfMoves = 0
    // start the game by calling the startGame function
    startGame()
    // start game function
    function startGame() {
        X_Turn = true
        localCells.forEach(cell => {
            cell.textContent = ""
            cell.addEventListener('click', handelClickOnCell)
        })
        emptyCellsNumber = 81
        gameSituation.textContent = "Game started"
        playerTurn.textContent = "Player X Turn"
    }

    // Restart button and its function
        resetBtn.addEventListener('click',restartGame)
        function restartGame () {
            //remove all eventListeners
            // reset all global variables
            // show message that game restated
            // recall function startGame
        localCells.forEach(cell => {
            cell.textContent = ""
            cell.removeEventListener('click', handelClickOnCell)
        })
        
        message = "Game restarted"
        nextMoveOnGrid = [] 
        localWinner = undefined
        displayResultsAndMessages()
        localGrids.forEach(grid => {
            grid.dataset.winner = ""
            grid.dataset.available = "true"
        })
        startGame()
    }

    function handelClickOnCell(event) {
        numberOfMoves++ // with every click increase the numberOfMoves by one
        const clickedCell = event.target
        const currentLocalGridAvailability = clickedCell.parentNode.dataset.available
        const clickedOnGridNumber = clickedCell.parentNode.dataset.localBoard
        const nextMove = event.target.dataset.index
        const currentTurn = X_Turn? 'X':'O'
        let nextMoveAvailability = document.querySelector(`.local[data-local-board="${nextMove}"]`).dataset.available
        
        //store the supposed next move in an array to check if it's a legal click or not  
        //check if the current click is on available grid and right click due to the rules
        //if it's then call a moveOnAvailableGrid function
        // else show a massage it's not available move here go to another available grid due to the rules
        //if it's an empty global grid move on else check if it's match the rules
        

        if(isItAnewGame() ||isItRightLocalBoard(currentLocalGridAvailability, clickedOnGridNumber)) {
            placeMark(clickedCell)
            if(isLocalBoardWins(clickedOnGridNumber, currentTurn)) {
                clickedCell.parentNode.dataset.available = "false"
                nextMoveAvailability = "false"
                clickedCell.parentNode.dataset.winner = clickedCell.textContent
                message = `winner is ${clickedCell.parentNode.dataset.winner} on grid number ${clickedOnGridNumber}`
            } else if(isLocalDraw(clickedOnGridNumber)) {
                clickedCell.parentNode.dataset.available = "false"
                clickedCell.parentNode.dataset.winner = "none"
                message = `It's a draw in board number ${clickedOnGridNumber}`
                nextMoveAvailability = "false"
            }
            if(isGlobalWins(currentTurn)) {
                    message = `Game ended.<br>The winner is ${currentTurn}.<br>Total off moves ${numberOfMoves}`
                    endGame()
                } else if(isGlobalDraw()) {
                    message = `No winner.<br>It's totally tied`
                    endGame()
                } else {
                    swapTurn()
                    if(nextMoveAvailability === "false") {
                        nextMoveOnGrid.push("anyAvailableBoard")
                    } else {
                        nextMoveOnGrid.push(nextMove)
                    }
                }
                
            } else {
            if(nextMoveOnGrid[nextMoveOnGrid.length-1] === "anyAvailableBoard") {
                message = `Clicked on finished grid.<br>Your move should be on another available grid`
            }else {
                message = `Clicked on wrong local board.<br>your move should be on grid number ${parseInt(nextMoveOnGrid[nextMoveOnGrid.length-1])+1}`
            }
        }
        displayResultsAndMessages()
    }
    // function to check if it's a new game started 
    const isItAnewGame = () => emptyCellsNumber === 81
    
    // function to check if it's an empty cell 
    const isValidCell = (cell) => (cell.textContent === "")

    // function to check if it's a right local board was clicked
    const isItRightLocalBoard = (boardAvailability, boardNumber) => 
    (boardAvailability === "true" && (boardNumber === nextMoveOnGrid[nextMoveOnGrid.length-1] || nextMoveOnGrid[nextMoveOnGrid.length-1] === "anyAvailableBoard"))

    // Local wins function 
    const isLocalBoardWins =(index, currentTurn) => {
        const x = document.querySelector(`.local[data-local-board="${index}"]`)
        const cells = Array.from(x.children)
        if(x.dataset.available === "true") {
            return winingConditions.some(condition => {
                return condition.every(index => {
                    return cells[index].classList.contains(currentTurn)
                })
            })
        }
        return
    }

    //local draw
    const isLocalDraw = (index) => {
        const x = document.querySelector(`.local[data-local-board="${index}"]`)
        const cells = Array.from(x.children)
        if(x.dataset.available === "true") {
            return cells.every(cell => {
                return !isValidCell(cell)
            })
        }
        return
    }

    // Global wins
    const isGlobalWins = (currentTurn) => {
        const grid = Array.from(globalGride.children)
            return winingConditions.some(condition => {
                return condition.every(index => {
                    return (grid[index].dataset.winner === currentTurn && grid[index].dataset.available === "false")
                })
            })
    }

    // global draw function
    const isGlobalDraw = () => {
        const grid = Array.from(globalGride.children)
        return grid.every(localGrid => {
            return (localGrid.dataset.available === "false")
        })
    }

    // Placing mark in the cell
    const placeMark = (cell) => {
        gameSituation.textContent = "Game In Progress"
        if(isValidCell(cell)) {
            if(X_Turn) {
                cell.classList.add('X')
                cell.textContent = 'X'
            } else {
                cell.classList.add('O')
                cell.textContent ='O'
            }
            emptyCellsNumber--
        } else {
            message = `Clicked on occupied cell, please click on another empty cell`
        }
        
    } 

    // switch turn between players
    const swapTurn = () => {
        X_Turn = !X_Turn
        playerTurn.textContent = (X_Turn)? "Player X Turn" : "Player O Turn"
    }

    //display messages function
    const displayResultsAndMessages = () => showResultsDiv.innerHTML = message

    //end game function
    const endGame = () => localCells.forEach(cell => {
        cell.removeEventListener('click', handelClickOnCell)
        })
}
window.addEventListener('DOMContentLoaded', init)