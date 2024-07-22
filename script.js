
const boardSize = 11; //set a constant value boardSize to 11
const gameBoard = document.getElementById('game-board'); //get references to the HTML elements
const resetButton = document.getElementById('reset-button');//same with above

let catPosition = { x: 5, y: 5 };//set cat position to the middle
let blockedCells = [];//set array blockedCells
//a function that generate a random number using a input "max" 
function randInt(max) {
    return Math.floor(Math.random() * max);
}
//set 6 random tiles in the begainning 
function setRandBoard() {
    blockedCells = [];
    const totalCells = boardSize * boardSize;
    const positions = Array.from({ length: totalCells }, (_, i) => ({
        x: Math.floor(i / boardSize),
        y: i % boardSize
    }));

    for (let i = positions.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    for (let i = 0; i < 6; i++) {
        blockedCells.push(positions[i]);
    }
}
//create the game board
function createBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const hex = document.createElement('div');
            hex.classList.add('hex');
            hex.dataset.row = row;
            hex.dataset.col = col;
            if (row % 2 !== 0 && col === boardSize) {
                hex.style.visibility = 'hidden';
            }
            gameBoard.appendChild(hex);
        }
    }
}
//function to reset the game
function resetGame() {
    setRandBoard(); // Set 6 random tiles as blocked
    catPosition = { x: 5, y: 5 };
    createBoard();
    updateBoard();
}
//update the game board when action was taken
function updateBoard() {
    document.querySelectorAll('.hex').forEach(hex => {
        const row = parseInt(hex.dataset.row);
        const col = parseInt(hex.dataset.col);
        hex.classList.remove('cat', 'blocked');
        if (catPosition.x === row && catPosition.y === col) {
            hex.classList.add('cat');
        } else if (blockedCells.some(cell => cell.x === row && cell.y === col)) {
            hex.classList.add('blocked');
        }
    });
}
//function to ass click event 
function handleHexClick(event) {
    const hex = event.target.closest('.hex');
    if (!hex) return;
    const row = parseInt(hex.dataset.row);
    const col = parseInt(hex.dataset.col);
    if (catPosition.x === row && catPosition.y === col) return;
    blockedCells.push({ x: row, y: col });
    updateBoard();
    moveCat();
}

function moveCat() {
    // A simple random move for the cat (you can improve this with actual pathfinding)
    const directions = [
        { dx: -1, dy: 0 },
        { dx: -1, dy: -1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 0 },
        { dx: 1, dy: 1 },
        { dx: 0, dy: 1 }
    ];
    //add constant avaliableMoves 
    const availableMoves = directions
        .map(d => ({ x: catPosition.x + d.dx, y: catPosition.y + d.dy }))
        .filter(pos => pos.x >= 0 && pos.x < boardSize && pos.y >= 0 && pos.y < boardSize)
        .filter(pos => !blockedCells.some(cell => cell.x === pos.x && cell.y === pos.y));
    //if the availableMoves of the cat is 0, display using alert "you trap the cat"&reset the game
    if (availableMoves.length === 0) {
        alert('You trapped the cat!');
        resetGame();
    } 
    //if cat can move move it to random position that it can move 
    else {
        const nextMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        catPosition = nextMove;
        if (catPosition.x === 0 || catPosition.x === boardSize - 1 || catPosition.y === 0 || catPosition.y === boardSize - 1) {
            alert('The cat escaped!');
            resetGame();
        }
    }
    updateBoard();
}
//if click on reset button, call resetGame function
resetButton.addEventListener('click', resetGame);
//if click on the tiles read handleHexClick function
gameBoard.addEventListener('click', handleHexClick);
//reset the game
resetGame();