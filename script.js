const gridElement = document.getElementById('grid');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');

const gridSize = 11;
let catPosition = { x: 5, y: 5 };
let blockedCells = new Set();

function createGrid() {
    gridElement.innerHTML = '';
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            gridElement.appendChild(cell);
        }
    }
    updateGrid();
}

function updateGrid() {
    document.querySelectorAll('.cell').forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        cell.classList.remove('blocked', 'cat');
        if (row === catPosition.x && col === catPosition.y) {
            cell.classList.add('cat');
        } else if (blockedCells.has(`${row},${col}`)) {
            cell.classList.add('blocked');
        }
    });
}

function getNeighbors(position) {
    const { x, y } = position;
    const neighbors = [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 },
        { x: x - 1, y: y - 1 },
        { x: x + 1, y: y + 1 }
    ];
    return neighbors.filter(neighbor =>
        neighbor.x >= 0 && neighbor.x < gridSize &&
        neighbor.y >= 0 && neighbor.y < gridSize &&
        !blockedCells.has(`${neighbor.x},${neighbor.y}`)
    );
}

function moveCat() {
    const neighbors = getNeighbors(catPosition);
    if (neighbors.length === 0) {
        message.innerText = 'You win! The cat is trapped.';
        return;
    }
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    catPosition = randomNeighbor;
    if (catPosition.x === 0 || catPosition.x === gridSize - 1 || catPosition.y === 0 || catPosition.y === gridSize - 1) {
        message.innerText = 'You lose! The cat escaped.';
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if (blockedCells.has(`${row},${col}`) || (row === catPosition.x && col === catPosition.y)) {
        return;
    }
    blockedCells.add(`${row},${col}`);
    moveCat();
    updateGrid();
}

function restartGame() {
    catPosition = { x: 5, y: 5 };
    blockedCells.clear();
    message.innerText = '';
    createGrid();
}

gridElement.addEventListener('click', handleCellClick);
restartButton.addEventListener('click', restartGame);

createGrid();
