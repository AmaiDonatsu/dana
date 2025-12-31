```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neuro-Sync: Memoria de Trabajo Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        
        body {
            font-family: 'JetBrains+Mono', monospace;
            background-color: #050507;
            color: #e2e8f0;
            overflow-x: hidden;
        }

        .hex-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            max-width: 340px;
            margin: 0 auto;
        }

        .node {
            aspect-ratio: 1;
            background: #16161e;
            border: 2px solid #2d2d39;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 2.2rem;
            position: relative;
            user-select: none;
        }

        .node:active {
            transform: scale(0.92);
        }

        .node.active {
            background: #3b82f6;
            border-color: #60a5fa;
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.7);
            transform: translateY(-2px);
            z-index: 10;
        }

        .node.error {
            background: #ef4444;
            border-color: #f87171;
            box-shadow: 0 0 25px rgba(239, 68, 68, 0.7);
        }

        .node.success {
            background: #10b981;
            border-color: #34d399;
            box-shadow: 0 0 25px rgba(16, 185, 129, 0.7);
        }

        .glass-panel {
            background: rgba(20, 20, 28, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        @keyframes shuffle-anim {
            0% { transform: scale(1); filter: blur(0); }
            50% { transform: scale(0.8); filter: blur(4px); opacity: 0.5; }
            100% { transform: scale(1); filter: blur(0); }
        }

        .shuffling {
            animation: shuffle-anim 0.5s ease-in-out;
        }

        @keyframes pulse-text {
            0%, 100% { opacity: 1; text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
            50% { opacity: 0.6; }
        }

        .status-active {
            animation: pulse-text 1.5s infinite;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4">

    <div class="max-w-md w-full glass-panel rounded-[2.5rem] p-8 shadow-2xl border-b-4 border-blue-900/30">
        <div class="text-center mb-6">
            <h1 class="text-2xl font-black text-blue-500 tracking-tighter mb-1">NEURO-SYNC <span class="text-xs bg-blue-900/50 px-2 py-0.5 rounded text-blue-300 ml-1">v2.0 PRO</span></h1>
            <p class="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-bold">Protocolo de Alta Interferencia Cognitiva</p>
        </div>

        <div id="game-info" class="flex justify-between mb-6 bg-black/40 p-4 rounded-2xl border border-white/5">
            <div class="flex flex-col">
                <span class="text-slate-500 uppercase text-[9px] font-bold mb-1">Nivel Actual</span>
                <span id="level-display" class="font-bold text-2xl text-white tabular-nums">01</span>
            </div>
            <div class="flex flex-col items-end">
                <span class="text-slate-500 uppercase text-[9px] font-bold mb-1">Puntuación</span>
                <span id="score-display" class="font-bold text-2xl text-blue-400 tabular-nums">0000</span>
            </div>
        </div>

        <div id="message-box" class="h-14 flex items-center justify-center mb-6 rounded-2xl bg-blue-950/20 border border-blue-500/10 text-center px-4">
            <span id="status-text" class="text-xs text-blue-300 font-bold uppercase tracking-wider">Sistema Inicializado</span>
        </div>

        <div class="hex-grid mb-8" id="grid">
            <!-- Nodos dinámicos -->
        </div>

        <div class="flex flex-col gap-3">
            <button id="start-btn" class="w-full py-4 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 active:scale-[0.98]">
                INICIAR ENTRENAMIENTO
            </button>
            
            <div class="flex gap-2">
                <button id="mode-normal" class="flex-1 py-3 bg-slate-800/50 text-[10px] rounded-xl border border-blue-500/50 text-blue-300 font-bold transition-all">NORMAL</button>
                <button id="mode-inverse" class="flex-1 py-3 bg-slate-900/50 text-[10px] rounded-xl border border-transparent text-slate-500 font-bold transition-all hover:text-slate-300">INVERSO (HARD)</button>
            </div>
        </div>

        <div class="mt-8 pt-6 border-t border-white/5 space-y-2">
            <div class="flex justify-between items-center text-[10px]">
                <span class="text-slate-500 font-bold">MODO SHUFFLE:</span>
                <span id="shuffle-status" class="text-slate-600">INACTIVO (NIVEL < 5)</span>
            </div>
            <div class="flex justify-between items-center text-[10px]">
                <span class="text-slate-500 font-bold">LATENCIA:</span>
                <span id="speed-display" class="text-blue-400 font-mono">600ms</span>
            </div>
        </div>
    </div>

    <script>
        const grid = document.getElementById('grid');
        const startBtn = document.getElementById('start-btn');
        const statusText = document.getElementById('status-text');
        const levelDisplay = document.getElementById('level-display');
        const scoreDisplay = document.getElementById('score-display');
        const speedDisplay = document.getElementById('speed-display');
        const shuffleStatus = document.getElementById('shuffle-status');
        const modeNormal = document.getElementById('mode-normal');
        const modeInverse = document.getElementById('mode-inverse');

        const icons = ['⚛️', '🧬', '🔭', '🪐', '💻', '⚡', '🤖', '🔋', '🚀'];
        // nodeMapping guarda qué icono (índice 0-8) está en qué slot (índice 0-8)
        let nodeMapping = [0, 1, 2, 3, 4, 5, 6, 7, 8]; 
        let sequence = []; // Guardamos los ÍNDICES DE LOS ICONOS, no de los slots
        let playerSequence = [];
        let level = 1;
        let score = 0;
        let isPlaying = false;
        let isShowingSequence = false;
        let isInverseMode = false;

        function initGrid() {
            grid.innerHTML = '';
            nodeMapping.forEach((iconIndex, slotIndex) => {
                const node = document.createElement('div');
                node.className = 'node';
                node.dataset.slotIndex = slotIndex;
                node.innerHTML = `<span>${icons[iconIndex]}</span>`;
                node.addEventListener('click', () => handleNodeClick(slotIndex));
                grid.appendChild(node);
            });
        }

        async function playSequence() {
            isShowingSequence = true;
            isPlaying = false;
            playerSequence = [];
            
            // Velocidad adaptativa: se reduce la pausa a medida que sube el nivel
            const currentSpeed = Math.max(250, 600 - (level * 25));
            speedDisplay.innerText = `${currentSpeed}ms`;

            statusText.innerText = "Sincronizando Secuencia...";
            statusText.classList.add('status-active');

            for (let iconIdx of sequence) {
                await wait(currentSpeed);
                const slotIdx = nodeMapping.indexOf(iconIdx);
                highlightNode(slotIdx);
                await wait(currentSpeed);
            }

            // ¿Aplicar Shuffle? (A partir de nivel 5)
            if (level >= 5) {
                statusText.innerText = "¡INTERFERENCIA DETECTADA!";
                shuffleStatus.innerText = "ACTIVO 🔥";
                shuffleStatus.classList.replace('text-slate-600', 'text-orange-500');
                grid.classList.add('shuffling');
                await wait(500);
                shuffleGrid();
                grid.classList.remove('shuffling');
            } else {
                shuffleStatus.innerText = "INACTIVO (NIVEL < 5)";
            }

            statusText.classList.remove('status-active');
            statusText.innerText = isInverseMode ? "ORDEN INVERSO" : "TU TURNO";
            isShowingSequence = false;
            isPlaying = true;
        }

        function shuffleGrid() {
            // Barajamos el mapeo de iconos a slots
            nodeMapping.sort(() => Math.random() - 0.5);
            initGrid();
        }

        function highlightNode(slotIdx, type = 'active') {
            const nodes = document.querySelectorAll('.node');
            const node = nodes[slotIdx];
            if (node) {
                node.classList.add(type);
                setTimeout(() => node.classList.remove(type), 400);
            }
        }

        function handleNodeClick(slotIdx) {
            if (!isPlaying || isShowingSequence) return;

            const iconIdxClicked = nodeMapping[slotIdx];
            playerSequence.push(iconIdxClicked);
            highlightNode(slotIdx);

            const currentStep = playerSequence.length - 1;
            const targetSequence = isInverseMode ? [...sequence].reverse() : sequence;

            if (playerSequence[currentStep] !== targetSequence[currentStep]) {
                gameOver();
                return;
            }

            if (playerSequence.length === sequence.length) {
                nextLevel();
            }
        }

        function nextLevel() {
            isPlaying = false;
            score += level * 150;
            level++;
            updateStats();
            statusText.innerText = "NIVEL SUPERADO";
            
            const nodes = document.querySelectorAll('.node');
            nodes.forEach(n => n.classList.add('success'));
            
            setTimeout(() => {
                nodes.forEach(n => n.classList.remove('success'));
                startNextRound();
            }, 800);
        }

        function startNextRound() {
            const nextIconIdx = Math.floor(Math.random() * 9);
            sequence.push(nextIconIdx);
            playSequence();
        }

        function gameOver() {
            isPlaying = false;
            statusText.innerText = "FALLO EN LA MATRIZ";
            const nodes = document.querySelectorAll('.node');
            nodes.forEach(n => n.classList.add('error'));
            
            setTimeout(() => {
                nodes.forEach(n => n.classList.remove('error'));
                resetGame();
            }, 1200);
        }

        function resetGame() {
            level = 1;
            score = 0;
            sequence = [];
            playerSequence = [];
            nodeMapping = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            updateStats();
            initGrid();
            statusText.innerText = "SISTEMA LISTO";
            startBtn.disabled = false;
            startBtn.classList.remove('opacity-50');
            shuffleStatus.innerText = "INACTIVO (NIVEL < 5)";
            shuffleStatus.classList.replace('text-orange-500', 'text-slate-600');
        }

        function updateStats() {
            levelDisplay.innerText = level.toString().padStart(2, '0');
            scoreDisplay.innerText = score.toString().padStart(4, '0');
        }

        function wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        startBtn.addEventListener('click', () => {
            startBtn.disabled = true;
            startBtn.classList.add('opacity-50');
            sequence = [Math.floor(Math.random() * 9)];
            playSequence();
        });

        modeNormal.addEventListener('click', () => {
            isInverseMode = false;
            modeNormal.classList.add('border-blue-500/50', 'text-blue-300');
            modeInverse.classList.remove('border-blue-500/50', 'text-blue-300');
            resetGame();
        });

        modeInverse.addEventListener('click', () => {
            isInverseMode = true;
            modeInverse.classList.add('border-blue-500/50', 'text-blue-300');
            modeNormal.classList.remove('border-blue-500/50', 'text-blue-300');
            resetGame();
        });

        initGrid();
    </script>
</body>
</html>```