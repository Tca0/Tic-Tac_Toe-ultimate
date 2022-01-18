function init() {
    let playerTurn = document.querySelector(".player_turn")
    let gameSituation = document.querySelector(".game_situation")
    let resetBtn = document.querySelector(".reset")
    const showResultsDiv = document.querySelector(".hiddenResults")
    const results = document.querySelector(".results")
    const localGrids = document.querySelectorAll(".local")
    const localCells = document.querySelectorAll(".local_grid_cell")
    const globalGride = document.querySelector(".global")
    const dialogBox = document.querySelector("#dialogInfo")
    const errorMessages = document.querySelector(".infoMessages")
    const gameTimer = document.querySelector("#timer")
    // const startGameTime = document.querySelector(".startGame")
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
    let resultsMessage = ""
    let infoMessage = ""
    let nextMoveOnGrid = [] // to store the supposed next move
    let numberOfMoves = 0
    let X_Moves = 0
    let O_Moves = 0
    let timerInterval
    // start the game by calling the startGame function
    startGame()
    // start game function
    function startGame() {
        X_Turn = true
        X_Moves = 0
        O_Moves = 0
        localCells.forEach(cell => {
            cell.textContent = ""
            cell.addEventListener('click', handelClickOnCell)
        })
        emptyCellsNumber = 81
        gameSituation.textContent = "Start Playing"
        playerTurn.textContent = "Player X's Turn"
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
            cell.classList.remove('X')
            cell.classList.remove('O')
        })
        numberOfMoves = 0
        infoMessage = ""
        resultsMessage = "Game restarted"
        nextMoveOnGrid = [] 
        gameTimer.innerHTML = "00:00"
        displayResultsAndMessages()
        localGrids.forEach(grid => {
            grid.dataset.winner = ""
            grid.dataset.available = "true"
        })
        globalGride.addEventListener('click', startTime, {once:true})
        startGame()
        clearInterval(timerInterval)
    }

    //time function 
    const startTime = () => {
        let second = 0
        let minute = 0
        clearInterval(timerInterval)
        timerInterval = setInterval(function () {
            second++
            gameTimer.innerHTML = (minute<10? "0"+minute : minute) +":"+ (second<10? "0"+second : second)
            if(second == 60) {
                minute++
                second = 0
            }
            console.log(minute, second)
        },1000)
    }
    // with first click on the grid the time will run
    globalGride.addEventListener('click', startTime, {once:true})

    function handelClickOnCell(event) 
    {
        const clickedCell = event.target
        numberOfMoves++ // with every click increase the numberOfMoves by one
        let currentTurn
        if(X_Turn) {
            currentTurn = 'X'
            X_Moves++
        } else {
            currentTurn = 'O'
            O_Moves++
        }
        const clickedOnGridNumber = clickedCell.parentNode.dataset.localBoard
        const nextMove = event.target.dataset.index
        let nextMoveAvailability = document.querySelector(`.local[data-local-board="${nextMove}"]`).dataset.available
        
        //store the supposed next move in an array to check if it's a legal click or not  
        //check if the current click is on available grid and right click due to the rules
        //if it's then call a moveOnAvailableGrid function
        // else show a massage it's not available move here go to another available grid due to the rules
        //if it's an empty global grid move on else check if it's match the rules
        if(isValidCell(clickedCell)) {
            if(isItAnewGame() || isItRightLocalBoard(clickedOnGridNumber)) {
                placeMark(clickedCell)
                if(isLocalBoardWins(clickedOnGridNumber, currentTurn)) {
                    clickedCell.parentNode.dataset.available = "false"
                    nextMoveAvailability = "false"
                    clickedCell.parentNode.dataset.winner = clickedCell.textContent
                    resultsMessage = `winner is ${clickedCell.parentNode.dataset.winner} on grid number ${clickedOnGridNumber}`
                } else if(isLocalDraw(clickedOnGridNumber)) {
                    clickedCell.parentNode.dataset.available = "false"
                    clickedCell.parentNode.dataset.winner = "none"
                    resultsMessage = `It's a draw in board number ${clickedOnGridNumber}`
                    nextMoveAvailability = "false"
                }
                if(isGlobalWins(currentTurn)) {
                    resultsMessage = `Game ended.<br>The winner is ${currentTurn}.<br>Total moves ${numberOfMoves}.<br>X's total moves ${X_Moves}.<br>O's total moves ${O_Moves}.<br>Total time ${minute}:${second}`
                    endGame()
                } else if(isGlobalDraw()) {
                    resultsMessage = `No winner.<br>It's totally tied.<br>Total off moves ${numberOfMoves}.<br>X's total moves ${X_Moves}.<br>O's total moves ${O_Moves}.<br>Total time ${minute}:${second}`
                    endGame()
                }
                else {
                    swapTurn()
                    if(nextMoveAvailability === "false") {
                        nextMoveOnGrid.push("anyAvailableBoard")
                        infoMessage = "Next player can play on any unfinished board"
                    } else {
                        nextMoveOnGrid.push(nextMove)
                    }
                }
            } else {
            infoMessage = `Clicked on wrong local board.<br>your move should be on grid number ${parseInt(nextMoveOnGrid[nextMoveOnGrid.length-1])+1}`
            }
        }
        else {
            infoMessage = `current cell was occupied by another player`
        }
        displayResultsAndMessages()
    }
    // function to check if it's a new game started 
    const isItAnewGame = () => emptyCellsNumber === 81
    
    // function to check if it's an empty cell 
    const isValidCell = (cell) => !(cell.classList.contains('X') || cell.classList.contains('O'))

    // function to check if it's a right local board was clicked
    const isItRightLocalBoard = (boardNumber) => 
    (boardNumber === nextMoveOnGrid[nextMoveOnGrid.length-1] || nextMoveOnGrid[nextMoveOnGrid.length-1] === "anyAvailableBoard")

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
        return winingConditions.every(condition => {
            return condition.every(index => {
                return (grid[index].dataset.available === "false")
            })
        })
    }

    // Placing mark in the cell
    const placeMark = (cell) => {
        gameSituation.textContent = "Game In Progress"
            if(X_Turn) {
                cell.classList.add('X')
                cell.textContent = 'X'
            } else {
                cell.classList.add('O')
                cell.textContent ='O'
            }
            emptyCellsNumber--
    } 

    // switch turn between players
    const swapTurn = () => {
        X_Turn = !X_Turn
        playerTurn.textContent = (X_Turn)? "Player X's Turn" : "Player O's Turn"
    }

    //display messages function
    const displayResultsAndMessages = () => {
        if(resultsMessage) {
            results.innerHTML = resultsMessage
            openMessagesWindow()
        } else if(infoMessage) {
            errorMessages.innerHTML = infoMessage
            showDialog()
        }
        resultsMessage = ""
        infoMessage = ""
    }

    const openMessagesWindow = () => showResultsDiv.classList.add("popup")
    // function to close the message window when user clicks on any empty space on the screen
    window.onclick = function(e) {
        if (e.target == showResultsDiv) {
            showResultsDiv.classList.remove("popup")
        }
    }

    const showDialog = () => dialogBox.showModal()
    const closeDialog = () => {
        dialogBox.close()
    } 
    dialogBox.addEventListener('click', closeDialog)


    //end game function
    const endGame = () => {
        localCells.forEach(cell => {
        cell.removeEventListener('click', handelClickOnCell)
    })
    globalGride.removeEventListener('click', startTime)
    clearInterval(timerInterval)
    }

}
window.addEventListener('DOMContentLoaded', init)