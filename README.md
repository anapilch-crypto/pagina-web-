# pagina-web-<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mundo do Xadrez | Rosa & Branco</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <header>
        <h1>🌸 Mundo do Xadrez</h1>
        <nav>
            <a href="#historia">História</a>
            <a href="#regras">Regras</a>
            <a href="#tabuleiro">Jogar</a>
        </nav>
    </header>

    <div class="container">
        
        <!-- SEÇÃO HISTÓRIA -->
        <section id="historia">
            <h2>Origem e História</h2>
            <p>O xadrez é um dos jogos mais antigos e populares do mundo, com raízes que remontam à Índia do século VI. Ao longo dos séculos, viajou pela Pérsia e pelo mundo árabe até chegar à Europa, onde suas regras modernas foram consolidadas. Hoje, é reconhecido mundialmente como um esporte que testa a estratégia, a tática e a profundidade intelectual.</p>
        </section>

        <!-- SEÇÃO REGRAS E PEÇAS -->
        <section id="regras">
            <h2>Movimento das Peças</h2>
            <div class="pieces-grid">
                <div class="piece-card">
                    <h3>♙ Peão</h3>
                    <p>Avança 1 casa (ou 2 no primeiro movimento). Captura apenas na diagonal para a frente.</p>
                </div>
                <div class="piece-card">
                    <h3>♘ Cavalo</h3>
                    <p>Move-se em formato de "L" (duas casas em linha e uma para o lado). Pode pular peças.</p>
                </div>
                <div class="piece-card">
                    <h3>♗ Bispo</h3>
                    <p>Move-se estritamente em linhas diagonais por quantas casas estiverem livres.</p>
                </div>
                <div class="piece-card">
                    <h3>♖ Torre</h3>
                    <p>Move-se em linhas retas (horizontais ou verticais) por quantas casas estiverem vazias.</p>
                </div>
                <div class="piece-card">
                    <h3>♕ Dama</h3>
                    <p>A peça mais poderosa do tabuleiro. Combina os movimentos livres da Torre e do Bispo.</p>
                </div>
                <div class="piece-card">
                    <h3>♔ Rei</h3>
                    <p>A peça vital. Move-se apenas 1 casa em qualquer direção disponível por turno.</p>
                </div>
            </div>
        </section>

        <!-- SEÇÃO JOGO REAL -->
        <section id="tabuleiro">
            <h2>Tabuleiro com Regras Reais</h2>
            <p>Selecione uma peça e clique no destino. O sistema valida os movimentos legais e a alternância de turnos.</p>
            
            <div class="game-area">
                <div class="status-panel">
                    <span id="turnIndicator">Turno: Brancas</span>
                </div>
                <div class="board" id="chessBoard"></div>
                <div class="controls">
                    <button id="resetBtn">Reiniciar Partida</button>
                </div>
            </div>
        </section>

    </div>

    <footer>
        <p>&copy; 2026 Mundo do Xadrez Rosa. Desenvolvido para entusiastas da estratégia.</p>
    </footer>

    <script src="js/chess.js"></script>
</body>
</html>
