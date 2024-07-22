const boardSize = 11;
const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');

let catPosition = { x: 5, y: 5 };
let blockedCells = [];

function randInt(max) {
    return Math.floor(Math.random() * max);
}

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

function resetGame() {
    setRandBoard(); // Set 6 random tiles as blocked
    catPosition = { x: 5, y: 5 };
    createBoard();
    updateBoard();
}

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

    const availableMoves = directions
        .map(d => ({ x: catPosition.x + d.dx, y: catPosition.y + d.dy }))
        .filter(pos => pos.x >= 0 && pos.x < boardSize && pos.y >= 0 && pos.y < boardSize)
        .filter(pos => !blockedCells.some(cell => cell.x === pos.x && cell.y === pos.y));

    if (availableMoves.length === 0) {
        alert('You trapped the cat!');
        resetGame();
    } else {
        const nextMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        catPosition = nextMove;
        if (catPosition.x === 0 || catPosition.x === boardSize - 1 || catPosition.y === 0 || catPosition.y === boardSize - 1) {
            alert('The cat escaped!');
            resetGame();
        }
    }
    updateBoard();
}

resetButton.addEventListener('click', resetGame);
gameBoard.addEventListener('click', handleHexClick);

resetGame();