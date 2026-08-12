// --- SISTEMA DE ABAS ---
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`tab-${tabName}`).classList.add('active');
    document.getElementById(`btn-${tabName}`).classList.add('active');
}

// --- SISTEMA DO JOGO DE XADREZ ---
const boardElement = document.getElementById('chessBoard');
const turnIndicator = document.getElementById('turnIndicator');
const scoreWhiteElement = document.getElementById('scoreWhite');
const scoreBlackElement = document.getElementById('scoreBlack');

let currentTurn = 'white';
let selectedSquare = null;

let scoreWhite = 0;
let scoreBlack = 0;

// Tabela de valores oficiais das peças para o placar
const pieceValues = {
    '♙': 1, '♟': 1,
    '♘': 3, '♞': 3,
    '♗': 3, '♝': 3,
    '♖': 5, '♜': 5,
    '♕': 9, '♛': 9,
    '♔': 0, '♚': 0
};

// Estado inicial das peças no tabuleiro
const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

// Descobrir a cor da peça
function getPieceColor(piece) {
    if (!piece) return null;
    return ['♙','♖','♘','♗','♕','♔'].includes(piece) ? 'white' : 'black';
}

// Montar e renderizar o tabuleiro na tela
function createBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.classList.add('square');
            
            // Alternar cores rosa e branco corretamente
            if ((r + c) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }

            square.dataset.row = r;
            square.dataset.col = c;
            square.textContent = initialBoard[r][c];

            square.addEventListener('click', onSquareClick);
            boardElement.appendChild(square);
        }
    }
}

// Lógica de cliques nas casas do tabuleiro
function onSquareClick(e) {
    const square = e.currentTarget;
    const r = parseInt(square.dataset.row);
    const c = parseInt(square.dataset.col);
    const piece = initialBoard[r][c];
    const pieceColor = getPieceColor(piece);

    // 1. Selecionar uma peça do turno atual
    if (selectedSquare === null) {
        if (piece && pieceColor === currentTurn) {
            selectedSquare = square;
            square.classList.add('selected');
        }
    } 
    // 2. Mover a peça selecionada para o novo destino escolhido
    else {
        const fromRow = parseInt(selectedSquare.dataset.row);
        const fromCol = parseInt(selectedSquare.dataset.col);
        const movingPiece = initialBoard[fromRow][fromCol];

        // Cancelar seleção clicando na mesma peça
        if (fromRow === r && fromCol === c) {
            selectedSquare.classList.remove('selected');
            selectedSquare = null;
            return;
        }

        // Evitar capturar a própria peça
        if (piece && getPieceColor(piece) === currentTurn) {
            selectedSquare.classList.remove('selected');
            selectedSquare = square;
            square.classList.add('selected');
            return;
        }

        // PROCESSAR CAPTURA E ATUALIZAR PONTUAÇÃO
        if (piece !== '') {
            const value = pieceValues[piece] || 0;
            if (currentTurn === 'white') {
                scoreWhite += value;
                scoreWhiteElement.textContent = `${scoreWhite} pts`;
            } else {
                scoreBlack += value;
                scoreBlackElement.textContent = `${scoreBlack} pts`;
            }
        }

        // Efetivar movimento na matriz lógica
        initialBoard[r][c] = movingPiece;
        initialBoard[fromRow][fromCol] = '';

        // Limpar seleções e atualizar o visual do tabuleiro
        selectedSquare.classList.remove('selected');
        selectedSquare = null;
        createBoard();

        // Alternar o turno do jogador
        currentTurn = currentTurn === 'white' ? 'black' : 'white';
        turnIndicator.textContent = `Turno: ${currentTurn === 'white' ? 'Brancas' : 'Pretas'}`;
    }
}

// Inicializa o tabuleiro ao carregar a página
createBoard();

