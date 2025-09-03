/**
 * games.js - NeoBank OS
 * Sistema de jogos educativos com recompensas em OSD
 * O usuário ganha OSD jogando e gera um código para depositar na conta
 */

let gameBalance = 0;

// Banco de perguntas
const quizzes = {
  capitals: [
    { q: "Qual é a capital da França?", o: ["Londres", "Berlim", "Paris", "Madri"], c: 2 },
    { q: "Qual é a capital do Japão?", o: ["Pequim", "Seul", "Tóquio", "Bangkok"], c: 2 },
    { q: "Qual é a capital do Brasil?", o: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador"], c: 1 }
  ],
  math: [
    { q: "Quanto é 15 + 27?", o: ["40", "42", "44", "46"], c: 1 },
    { q: "Quanto é 8 × 7?", o: ["54", "56", "58", "60"], c: 1 },
    { q: "Quanto é 100 − 33?", o: ["67", "68", "69", "70"], c: 0 }
  ],
  riddles: [
    { q: "Tem chaves mas não abre portas?", o: ["Piano", "Carro", "Casa", "Celular"], c: 0 },
    { q: "Quanto mais você tira, maior fica?", o: ["Buraco", "Pedra", "Árvore", "Saco"], c: 0 },
    { q: "Qual mês tem 28 dias?", o: ["Fevereiro", "Todos", "Dezembro", "Nenhum"], c: 1 }
  ]
};

/**
 * Abre a tela de jogos
 */
function showGamesScreen() {
  const user = getCurrentUser();
  if (!user) return;

  // Carrega o saldo do jogo do Firebase
  db.ref('users/' + user.username + '/gameBalance').once('value')
    .then(snapshot => {
      gameBalance = snapshot.val() || 0;
      renderGamesScreen(user);
    })
    .catch(err => {
      console.error('Erro ao carregar saldo do jogo:', err);
      alert('Erro ao carregar dados.');
    });
}

/**
 * Renderiza a interface de jogos
 */
function renderGamesScreen(user) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Arena de Jogos 🎮</h2>
      </div>

      <!-- Saldo do Jogo -->
      <div class="card text-center">
        <p class="text-muted">Saldo nos Jogos</p>
        <p class="balance-display">${gameBalance.toFixed(2)} <span class="osd">OSD</span></p>
        ${gameBalance > 0 ? `
          <button onclick="generateRedemptionCode('${user.username}')" class="btn btn-primary mt-2">
            Gerar Código de Resgate
          </button>
        ` : '<p class="text-sm text-muted mt-2">Jogue para ganhar OSD</p>'}
      </div>

      <!-- Jogos Disponíveis -->
      <div class="card">
        <h3>Escolha um Jogo</h3>
        <div class="space-y-2 mt-3">
          <button onclick="startGame('${user.username}', 'capitals')" class="btn btn-secondary w-full py-3">🌍 Capitais do Mundo</button>
          <button onclick="startGame('${user.username}', 'math')" class="btn btn-secondary w-full py-3">🧮 Cálculo Rápido</button>
          <button onclick="startGame('${user.username}', 'riddles')" class="btn btn-secondary w-full py-3">🧠 Adivinhas Nerds</button>
        </div>
      </div>

      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;

  setTimeout(() => lucide.createIcons(), 100);
}

/**
 * Inicia um jogo
 */
function startGame(username, type) {
  const questions = quizzes[type];
  let score = 0;
  let current = 0;

  function showQuestion() {
    const q = questions[current];
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="card">
          <h3>Pergunta ${current + 1}/${questions.length}</h3>
          <p class="my-4">${q.q}</p>
          ${q.o.map((opt, i) => `
            <button onclick="checkAnswer(${i}, ${q.c}, ${score + (i === q.c ? 10 : 0)}, ${current + 1 < questions.length})" class="btn btn-secondary w-full my-1">${opt}</button>
          `).join('')}
        </div>
        <button onclick="showGamesScreen()" class="btn btn-ghost mt-4">Sair</button>
      </div>
    `;
    setTimeout(() => lucide.createIcons(), 100);
  }

  // Função global para resposta
  window.checkAnswer = (userAnswer, correctAnswer, newScore, hasNext) => {
    if (userAnswer === correctAnswer) {
      showToast('✅ Correto! +10 OSD');
    } else {
      showToast('❌ Errado!');
    }

    score = newScore;

    if (hasNext) {
      current++;
      setTimeout(showQuestion, 600);
    } else {
      const earned = score;
      gameBalance += earned;
      // Salva no Firebase
      db.ref('users/' + username + '/gameBalance').set(gameBalance)
        .then(() => {
          showToast(`🎯 Você ganhou ${earned} OSD!`);
          setTimeout(() => showGamesScreen(), 1000);
        });
    }
  };

  showQuestion();
}

/**
 * Gera um código de resgate para o saldo do jogo
 */
function generateRedemptionCode(username) {
  if (typeof db === 'undefined') {
    alert('Erro: Firebase não inicializado.');
    return;
  }

  db.ref('users/' + username + '/gameBalance').once('value')
    .then(snapshot => {
      const amount = snapshot.val() || 0;

      if (amount <= 0) {
        alert('Jogue primeiro para ganhar OSD!');
        return;
      }

      // Gera código único
      const code = `OSD-${username.toUpperCase()}-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;

      // Salva no Firebase
      db.ref('redemption_codes/' + code).set({
        username: username,
        amount: amount,
        used: false,
        createdAt: new Date().toISOString()
      })
      .then(() => {
        // Zera o saldo do jogo
        return db.ref('users/' + username + '/gameBalance').set(0);
      })
      .then(() => {
        alert(`✅ Código gerado!\n\nCódigo: ${code}\nValor: ${amount} OSD\n\nUse no depósito!`);
        showToast(`${amount} OSD pronto para resgate!`);
        gameBalance = 0;
        showGamesScreen();
      })
      .catch(err => {
        console.error('Erro ao gerar código:', err);
        alert('Erro: ' + err.message);
      });
    });
}
