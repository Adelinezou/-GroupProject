const boardSize = 11;  // Define the size of the board as 11x11.
const gameBoard = document.getElementById('game-board');  // Get the game board element from the DOM.
const resetButton = document.getElementById('reset-button');  // Get the reset button element from the DOM.

let catPosition = { x: 5, y: 5 };  // Initialize the cat's position in the middle of the board.
let blockedCells = [];  // Initialize an empty array to store the positions of blocked cells.

function randInt(max) {
    return Math.floor(Math.random() * max);  // Generate a random integer from 0 to max-1.
}

function setRandBoard() {
    blockedCells = [];  // Clear any previously blocked cells.
    const totalCells = boardSize * boardSize;  // Calculate the total number of cells on the board.
    const positions = Array.from({ length: totalCells }, (_, i) => ({
        x: Math.floor(i / boardSize),  // Calculate the row index.
        y: i % boardSize  // Calculate the column index.
    }));

    // Shuffle the positions array using Fisher-Yates algorithm.
    for (let i = positions.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Take the first 6 shuffled positions and mark them as blocked.
    for (let i = 0; i < 15; i++) {
        blockedCells.push(positions[i]);
    }
}

function createBoard() {
    gameBoard.innerHTML = '';  // Clear the game board.
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const hex = document.createElement('div');  // Create a new div element for each cell.
            hex.classList.add('hex');  // Add the 'hex' class to the cell.
            hex.dataset.row = row;  // Set the row data attribute.
            hex.dataset.col = col;  // Set the column data attribute.
            if (row % 2 == 0) {
                hex.style.marginLeft = "25px";
            }

            gameBoard.appendChild(hex);  // Add the cell to the game board.
        }
    }
}


function resetGame() {
    setRandBoard();  // Set 6 random tiles as blocked.
    catPosition = { x: 5, y: 5 };  // Reset the cat's position to the middle of the board.
    createBoard();  // Recreate the game board.
    updateBoard();  // Update the board with the current state.
}

function updateBoard() {
    document.querySelectorAll('.hex').forEach(hex => {
        const row = parseInt(hex.dataset.row);
        const col = parseInt(hex.dataset.col);
        hex.classList.remove('cat', 'blocked');  // Remove any previous 'cat' or 'blocked' classes.
        if (catPosition.x === row && catPosition.y === col) {
            hex.classList.add('cat');  // Add the 'cat' class if this cell is the cat's position.
            const catImg = document.createElement('img');
            catImg.src = 'BeeA1.png';
            hex.appendChild(catImg);
        } else if (blockedCells.some(cell => cell.x === row && cell.y === col)) {
            hex.classList.add('blocked');  // Add the 'blocked' class if this cell is blocked.
        }
    });
}

function handleHexClick(event) {
    const hex = event.target.closest('.hex');  // Get the clicked cell.
    if (!hex) return;  // If no cell was clicked, return.
    const row = parseInt(hex.dataset.row);
    const col = parseInt(hex.dataset.col);
    if (catPosition.x === row && catPosition.y === col) return;  // If the cat is in the clicked cell, return.
    blockedCells.push({ x: row, y: col });  // Add the clicked cell to the blocked cells.
    updateBoard();  // Update the board.
    if (!findAvailableRoad(catPosition)) {  // Check if the cat is trapped.
        alert('You trapped the cat!');  // Alert the user if the cat is trapped.
        resetGame();  // Reset the game.
    } else {
        moveCat();  // Move the cat.
    }
}

function findAvailableRoad(start) {
    const directions = [
        { dx: -1, dy: 0 }, { dx: -1, dy: -1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 0 }, { dx: 1, dy: 1 }, { dx: 0, dy: 1 }
    ];

    const queue = [start];  // Initialize the BFS queue with the starting position.
    const visited = new Set([`${start.x},${start.y}`]);  // Mark the starting position as visited.

    while (queue.length > 0) {
        const { x, y } = queue.shift();  // Get the current position from the queue.

        if (x === 0 || x === boardSize - 1 || y === 0 || y === boardSize - 1) {
            return true;  // Return true if the current position is on the edge of the board.
        }

        for (const { dx, dy } of directions) {
            const newX = x + dx;
            const newY = y + dy;
            const newKey = `${newX},${newY}`;

            if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && !blockedCells.some(cell => cell.x === newX && cell.y === newY) && !visited.has(newKey)) {
                queue.push({ x: newX, y: newY });  // Add the new position to the queue.
                visited.add(newKey);  // Mark the new position as visited.
            }
        }
    }

    return false;  // Return false if no path to the edge is found.
}

function moveCat() {
    const directions = [
        { dx: -1, dy: 0 }, { dx: -1, dy: -1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 0 }, { dx: 1, dy: 1 }, { dx: 0, dy: 1 }
    ];

    const queue = [[catPosition]];  // Initialize the BFS queue with the path starting at the cat's position.
    const visited = new Set([`${catPosition.x},${catPosition.y}`]);  // Mark the starting position as visited.

    while (queue.length > 0) {
        const path = queue.shift();  // Get the current path from the queue.
        const { x, y } = path[path.length - 1];  // Get the current position from the end of the path.

        if (x === 0 || x === boardSize - 1 || y === 0 || y === boardSize - 1) {
            catPosition = path[1] || path[0];  // Move the cat to the first step of the path.
            if (catPosition.x === 0 || catPosition.x === boardSize - 1 || catPosition.y === 0 || catPosition.y === boardSize - 1) {
                alert('The cat escaped!');  // Alert the user if the cat escaped.
                resetGame();  // Reset the game.
            }
            updateBoard();  // Update the board.
            return;
        }

        for (const { dx, dy } of directions) {
            const newX = x + dx;
            const newY = y + dy;
            const newKey = `${newX},${newY}`;

            if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && !blockedCells.some(cell => cell.x === newX && cell.y === newY) && !visited.has(newKey)) {
                queue.push([...path, { x: newX, y: newY }]);  // Add the new path to the queue.
                visited.add(newKey);  // Mark the new position as visited.
            }
        }
    }

    alert('You trapped the cat!');  // Alert the user if the cat is trapped.
    resetGame();  // Reset the game.
}

resetButton.addEventListener('click', resetGame);  // Add an event listener to the reset button.
gameBoard.addEventListener('click', handleHexClick);  // Add an event listener to the game board.

resetGame();  // Start the game.
