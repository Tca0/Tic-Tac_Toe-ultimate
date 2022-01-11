function init() {
    let playerTurn = document.querySelector(".player_turn")
    let gameSituation = document.querySelector(".game_situation")
    let resetBtn = document.querySelector(".reset")
    const globalGride = document.querySelector(".global")
    const localGrides = document.querySelectorAll(".local")
    // let x = []
    // localGrides.forEach(grid => {
    //     console.log(grid.dataset)
    //     console.log(grid.dataset.localBoard,typeof(grid.dataset.localBoard))
    // })
    const localCells = document.querySelectorAll(".local_grid")
    // console.log(localCells)
    let X_Turn 

    startGame()

    resetBtn.addEventListener('click',startGame)

    function startGame() {
        X_Turn = true
        localCells.forEach(cell => {
            cell.textContent = ""
        })
        localCells.forEach(cell => {
            // by placing once:true in the event listener can't be clicked on any booked cell
            cell.addEventListener('click', processOfGame, {once:true})
        })
        gameSituation.textContent = "Game started"
        playerTurn.textContent = "Player X turn"
    }

    function processOfGame(e) {
        const cell = e.target
        // console.log(cell)
        // console.log(cell.dataset.index,typeof(cell.dataset.index))
        placeMark(cell)
        switchTurn(cell.dataset.index)
    }
    // Placing mark in the cell
    function placeMark(cell) {
        gameSituation.textContent = "Game In Progress"
        console.log(X_Turn)
        if(cell.textContent === "") {
            cell.textContent = (X_Turn)? "X" : " O"
            X_Turn = !X_Turn
        }
    }
    function switchTurn(index) {
        
        console.log(X_Turn)
        playerTurn.textContent = (X_Turn)? "Player X Turn" : "Player O Turn"
        console.log(index)
        //get index form process function
        //remove all event listeners
        //search for the local grid which is equal to the passed index
        // activate it with event listener
        // update playturn message with the right one
        //reverse the value of X_turn   

        localCells.forEach(cell => {
            cell.removeEventListener('click', processOfGame)
        })
        localGrides.forEach(grid => {
            if(grid.dataset.localBoard === index) {
                console.log(`target is grid number ${parseInt(index)+1}`)
                // grid.style.backgroundColor = "red"
                grid.addEventListener('click', processOfGame, {once:true})
            }
        })
    }

    
}
window.addEventListener('DOMContentLoaded', init)