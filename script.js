const ROWS = 3, COLS = 3, PLAYER_X = 'X', PLAYER_O = 'O', WIN_LENGTH = 3;
let BOARD_EL, MESSAGE_EL, RESET_BUTTON, PLAYER_X_INDICATOR, PLAYER_O_INDICATOR;
let board, currentPlayer, gameOver;

function initApp() {
    BOARD_EL = document.getElementById('board');
    MESSAGE_EL = document.getElementById('message-box');
    RESET_BUTTON = document.getElementById('reset-button');
    PLAYER_X_INDICATOR = document.getElementById('player-x-indicator');
    PLAYER_O_INDICATOR = document.getElementById('player-o-indicator');
    RESET_BUTTON.addEventListener('click', initGame);
    initGame();
}

function initGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = PLAYER_X;
    gameOver = false;
    BOARD_EL.innerHTML = '';
    drawBoard();
    updateMessage(`${currentPlayer}'s turn!`);
    updatePlayerIndicator();
}

function drawBoard() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            const hole = document.createElement('div');
            hole.classList.add('hole');
            cell.appendChild(hole);
            cell.addEventListener('click', () => handleMove(r, c, cell));
            BOARD_EL.appendChild(cell);
        }
    }
}

function updateMessage(text) {
    MESSAGE_EL.textContent = text;
    if (text.includes('X Wins')) MESSAGE_EL.style.color = 'var(--color-primary-red)';
    else if (text.includes('O Wins')) MESSAGE_EL.style.color = 'var(--color-primary-yellow)';
    else MESSAGE_EL.style.color = 'var(--color-text-light)';
}

function updatePlayerIndicator() {
    PLAYER_X_INDICATOR.classList.remove('active-player');
    PLAYER_O_INDICATOR.classList.remove('active-player');
    if (currentPlayer === PLAYER_X) PLAYER_X_INDICATOR.classList.add('active-player');
    else PLAYER_O_INDICATOR.classList.add('active-player');
}

function handleMove(row, col, cell) {
    if (gameOver || board[row][col] !== null) return;
    board[row][col] = currentPlayer;
    const piece = currentPlayer, pieceClass = piece === PLAYER_X ? 'x' : 'o';
    const holeEl = cell.querySelector('.hole');
    holeEl.textContent = piece;
    holeEl.classList.add(pieceClass);
    cell.classList.add(pieceClass.slice(0, 1));
    if (checkWin(row, col)) endGame(currentPlayer);
    else if (checkDraw()) endGame(null);
    else {
        currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
        updateMessage(`${currentPlayer}'s turn!`);
        updatePlayerIndicator();
    }
}

function endGame(winner) {
    gameOver = true;
    PLAYER_X_INDICATOR.classList.remove('active-player');
    PLAYER_O_INDICATOR.classList.remove('active-player');
    if (winner) {
        const winningLine = findWinningLine();
        winningLine.forEach(([r, c]) => {
            document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`)
                .classList.add('winning-cell');
        });
        updateMessage(`${winner} Wins!`);
    } else updateMessage("It's a Draw!");
}

function checkDraw() {
    return board.every(row => row.every(cell => cell !== null));
}

function checkWin(r, c) {
    const player = board[r][c];
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of dirs) {
        let total = 1;
        for (let i = 1; i < WIN_LENGTH; i++) {
            const nr = r + i * dr, nc = c + i * dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === player) total++;
            else break;
        }
        for (let i = 1; i < WIN_LENGTH; i++) {
            const nr = r - i * dr, nc = c - i * dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === player) total++;
            else break;
        }
        if (total >= WIN_LENGTH) return true;
    }
    return false;
}

function findWinningLine() {
    const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const player = board[r][c];
            if (!player) continue;
            for (const [dr, dc] of dirs) {
                let line = [], isWin = true;
                for (let i = 0; i < WIN_LENGTH; i++) {
                    const nr = r + i * dr, nc = c + i * dc;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === player)
                        line.push([nr, nc]);
                    else { isWin = false; break; }
                }
                if (isWin) return line;
            }
        }
    }
    return [];
}

window.onload = initApp;
