// Inicializa o motor de regras (Chess.js) e o tabuleiro (Chessboard.js)
var board = null;
var game = new Chess();
var $status = $('#status');

// Função do Bot para escolher a melhor jogada (Minimax Simples / Captura)
function calcularMelhorJogada() {
    var jogadasPossiveis = game.moves({ verbose: true });
    
    // Se não houver jogadas, o jogo acabou
    if (jogadasPossiveis.length === 0) return null;

    // Tabela de valores das peças
    var valoresPecas = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 1000 };
    var melhorJogada = jogadasPossiveis[0];
    var maiorValorCaptura = -1;

    // O bot procura se pode comer alguma peça e escolhe a de maior valor
    for (var i = 0; i < jogadasPossiveis.length; i++) {
        var jogada = jogadasPossiveis[i];
        if (jogada.captured) {
            var valor = valoresPecas[jogada.captured];
            if (valor > maiorValorCaptura) {
                maiorValorCaptura = valor;
                melhorJogada = jogada;
            }
        }
    }

    // Se não puder comer nada, escolhe uma jogada aleatória
    if (maiorValorCaptura === -1) {
        var indiceAleatorio = Math.floor(Math.random() * jogadasPossiveis.length);
        melhorJogada = jogadasPossiveis[indiceAleatorio];
    }

    return melhorJogada;
}

// Executa a jogada do Bot (Pretas)
function fazerJogadaDoBot() {
    var jogada = calcularMelhorJogada();
    
    if (jogada === null) return;

    game.move({
        from: jogada.from,
        to: jogada.to,
        promotion: 'q' // Sempre promove para Rainha para simplificar
    });

    board.position(game.fen());
    atualizarStatus();
}

// Controla o arrastar de peças no tabuleiro
function onDragStart(source, piece, position, orientation) {
    // Não permite mexer peças se o jogo acabou ou se for a vez das Pretas (Bot)
    if (game.game_over()) return false;
    if (piece.search(/^b/) !== -1) return false;
}

// Valida o movimento feito pelo jogador humano
function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    // Se o movimento for inválido, volta a peça para o lugar original
    if (move === null) return 'snapback';

    atualizarStatus();
    
    // Aguarda 250ms e faz o bot jogar
    window.setTimeout(fazerJogadaDoBot, 250);
}

// Atualiza o tabuleiro após animações
function onSnapEnd() {
    board.position(game.fen());
}

// Atualiza o texto de status (Vez de quem, Xeque, Fim de jogo)
function atualizarStatus() {
    var statusText = '';
    var vezDoJogador = game.turn() === 'w' ? 'Brancas (Você)' : 'Pretas (Bot)';

    if (game.in_checkmate()) {
        statusText = 'Fim de jogo! ' + vezDoJogador + ' sofreu Xeque-Mate.';
    } else if (game.in_draw()) {
        statusText = 'Fim de jogo! Empate.';
    } else {
        statusText = 'Sua vez! Mexa uma peça branca.';
        if (game.in_check()) {
            statusText += ' (Você está em Xeque!)';
        }
    }

    $status.html(statusText);
}

// Configurações do Tabuleiro
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};

board = Chessboard('board', config);

// Botão de reiniciar o jogo
$('#btn-reiniciar').on('click', function() {
    game.reset();
    board.start();
    $status.html('Jogo reiniciado! Sua vez.');
});
