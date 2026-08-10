// Configuração e Estado Inicial do Jogo
let boardState = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

// Mapeamento visual para os símbolos Unicode das peças
const pieceSymbols = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙',
    '': ''
};

let currentTurn = 'W'; // 'W' para Brancas (Maiúsculas), 'B' para Pretas (Minúsculas)
let selectedSquare = null;
const boardElement = document.getElementById('chessBoard');
const turnIndicator = document.getElementById('turnIndicator');

function initGame() {
    createBoardUI();
    document.getElementById('resetBtn').addEventListener('click', resetGame);
}

function createBoardUI() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = r;
            square.dataset.col = c;
            
            const piece = boardState[r][c];
            square.textContent = pieceSymbols[piece];
            
            square.addEventListener('click', handleSquareClick);
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(e) {
    const square = e.currentTarget;
    const r = parseInt(square.dataset.row);
    const c = parseInt(square.dataset.col);
    const piece = boardState[r][c];

    if (selectedSquare) {
        const fromR = parseInt(selectedSquare.dataset.row);
        const fromC = parseInt(selectedSquare.dataset.col);

        if (fromR === r && fromC === c) {
            clearSelection();
            return;
        }

        if (validateMove(fromR, fromC, r, c)) {
            // Executa a jogada
            boardState[r][c] = boardState[fromR][fromC];
            boardState[fromR][fromC] = '';
            
            // Alterna turno
            currentTurn = currentTurn === 'W' ? 'B' : 'W';
            turnIndicator.textContent = `Turno: ${currentTurn === 'W' ? 'Brancas' : 'Pretas'}`;
            
            clearSelection();
            createBoardUI();
        } else {
            clearSelection();
            // Se clicou em outra peça própria, seleciona ela direto
            if (piece && isOwnPiece(piece)) {
                selectSquare(square);
            }
        }
    } else {
        if (piece && isOwnPiece(piece)) {
            selectSquare(square);
        }
    }
}

function selectSquare(square) {
    selectedSquare = square;
    square.classList.add('selected');
}

function clearSelection() {
    if (selectedSquare) selectedSquare.classList.remove('selected');
    selectedSquare = null;
}

function isOwnPiece(piece) {
    if (currentTurn === 'W' && piece === piece.toUpperCase()) return true;
    if (currentTurn === 'B' && piece === piece.toLowerCase()) return true;
    return false;
}

/* --- MOTOR DE VALIDAÇÃO DE REGRAS REAIS --- */
function validateMove(fromR, fromC, toR, toC) {
    const piece = boardState[fromR][fromC];
    const target = boardState[toR][toC];

    // Impedir capturar peça da própria cor
    if (target !== '' && ((currentTurn === 'W' && target === target.toUpperCase()) || (currentTurn === 'B' && target === target.toLowerCase()))) {
        return false;
    }

    const diffR = toR - fromR;
    const diffC = toC - fromC;
    const absR = Math.abs(diffR);
    const absC = Math.abs(diffC);

    switch (piece.toUpperCase()) {
        case 'P': // Peão
            const dir = piece === 'P' ? -1 : 1; // Brancas sobem (-1), Pretas descem (+1)
            const startRow = piece === 'P' ? 6 : 1;

            // Avanço simples
            if (diffC === 0 && diffR === dir && target === '') return true;
            // Avanço duplo inicial
            if (diffC === 0 && fromR === startRow && diffR === 2 * dir && target === '' && boardState[fromR + dir][fromC] === '') return true;
            // Captura diagonal
            if (absC === 1 && diffR === dir && target !== '') return true;
            return false;

        case 'R': // Torre (Linhas retas sem obstáculos)
            if (diffR !== 0 && diffC !== 0) return false;
            return checkPathClear(fromR, fromC, toR, toC);

        case 'B': // Bispo (Diagonais sem obstáculos)
            if (absR !== absC) return false;
            return checkPathClear(fromR, fromC, toR, toC);

        case 'Q': // Dama (Combinação de Torre e Bispo)
            if (diffR !== 0 && diffC !== 0 && absR !== absC) return false;
            return checkPathClear(fromR, fromC, toR, toC);

        case 'K': // Rei (1 casa para qualquer direção)
            return absR <= 1 && absC <= 1;

        case 'N': // Cavalo (Movimento em L, ignora obstáculos)
            return (absR === 2 && absC === 1) || (absR === 1 && absC === 2);
    }
    return false;
}

// Verifica se há peças bloqueando o caminho (para Torre, Bispo e Dama)
function checkPathClear(fromR, fromC, toR, toC) {
    const stepR = toR === fromR ? 0 : (toR > fromR ? 1 : -1);
    const stepC = toC === fromC ? 0 : (toC > fromC ? 1 : -1);
    
    let currentR = fromR + stepR;
    let currentC = fromC + stepC;

    while (currentR !== toR || currentC !== toC) {
        if (boardState[currentR][currentC] !== '') return false;
        currentR += stepR;
        currentC += stepC;
    }
    return true;
}

function resetGame() {
    boardState = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    currentTurn = 'W';
    turnIndicator.textContent = "Turno: Brancas";
    clearSelection();
    createBoardUI();
}

// Inicializa o script
initGame();
