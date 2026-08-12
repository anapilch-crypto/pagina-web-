// Aguarda o navegador carregar completamente a página antes de iniciar o xadrez
$(document).ready(function() {
    var board = null;
    var game = new Chess();
    var $status = $('#status');

    // Função do Bot para escolher a melhor jogada
    function calcularMelhorJogada() {
        var jogadasPossiveis = game.moves({ verbose: true });
        
        if (jogadasPossiveis.length === 0) return null;

        var valoresPecas = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 1000 };
        var melhorJogada = jogadasPossiveis;
        var maiorValorCaptura = -1;

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

        if (maiorValorCaptura === -1) {
            var indiceAleatorio = Math.floor(Math.random() * jogadasPossiveis.length);
            melhorJogada = jogadasPossiveis[indiceAleatorio];
        }

        return melhorJogada;
    }

    function fazerJogadaDoBot() {
        var jogada = calcularMelhorJogada();
        
        if (jogada === null) return;

        game.move({
            from: jogada.from,
            to: jogada.to,
            promotion: 'q'
        });

        board.position(game.fen());
        atualizarStatus();
    }

    function onDragStart(source, piece, position, orientation) {
        if (game.game_over()) return false;
        // Não deixa o jogador arrastar peças pretas (do bot)
        if (piece.search(/^b/) !== -1) return false;
    }

    function onDrop(source, target) {
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) return 'snapback';

        atualizarStatus();
        window.setTimeout(fazerJogadaDoBot, 250);
    }

    function onSnapEnd() {
        board.position(game.fen());
    }

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

    // Configurações e links corretos para as imagens das peças padrão do Chessboard
    var config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'https://cloudflare.com{piece}.png'
    };

    // Cria o tabuleiro na tela
    board = Chessboard('board', config);

    // Botão reiniciar ativo
    $('#btn-reiniciar').on('click', function() {
        game.reset();
        board.start();
        $status.html('Jogo reiniciado! Sua vez.');
    });
});
