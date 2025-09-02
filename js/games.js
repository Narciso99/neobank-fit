let gameBalance = 0;

const quizzes = {
  capitals: [
    { q: "Capital da França?", o: ["Londres", "Berlim", "Paris", "Madri"], c: 2 },
    { q: "Capital do Japão?", o: ["Pequim", "Seul", "Tóquio", "Bangkok"], c: 2 },
    { q: "Capital do Brasil?", o: ["São Paulo", "Brasília", "Rio", "Salvador"], c: 1 }
  ],
  math: [
    { q: "15 + 27?", o: ["40", "42", "44", "46"], c: 1 },
    { q: "8 × 7?", o: ["54", "56", "58", "60"], c: 1 },
    { q: "100 − 33?", o: ["67", "68", "69", "70"], c: 0 }
  ],
  riddles: [
    { q: "Tem chaves mas não abre portas?", o: ["Piano", "Carro", "Casa", "Celular"], c: 0 },
    { q: "Quanto mais tira, maior fica?", o: ["Buraco", "Pedra", "Árvore", "Saco"], c: 0 },
    { q: "Qual mês tem 28 dias?", o: ["Fevereiro", "Todos", "Dezembro", "Nenhum"], c: 1 }
  ]
};

function showGamesScreen() {
  const user = getCurrentUser();
  if (!user) return;

  db.ref('users/' + user.username + '/gameBalance').once('value')
    .then(snap => {
      gameBalance = snap.val() || 0;
      renderGamesScreen(user);
    });
}

function renderGamesScreen(user) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Arena de Jogos 🎮</h2>
      </div>
      <div class="card text-center">
        <p class="text-muted">Saldo nos Jogos</p>
        <p class="balance-display">${gameBalance.toFixed(2)} <span class="osd">OSD</span></p>
        ${gameBalance > 0 ? `
          <button onclick="generateRedemptionCode('${user.username}')" class="btn btn-primary mt-2">
            Gerar Código de Resgate
          </button>
        ` : ''}
      </div>
      <div class="card">
        <h3>Escolha um Jogo</h3>
        <div class="space-y-2 mt-3">
          <button onclick="startGame('capitals')" class="btn btn-secondary w-full">🌍 Capitais</button>
          <button onclick="startGame('math')" class="btn btn-secondary w-full">🧮 Matemática</button>
          <button onclick="startGame('riddles')" class="btn btn-secondary w-full">🧠 Adivinhas</button>
        </div>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function startGame(type) {
  const qs = quizzes[type];
  let score = 0;
  let i = 0;

  function showQ() {
    const q = qs[i];
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="card">
          <h3>Pergunta ${i+1}/${qs.length}</h3>
          <p class="my-4">${q.q}</p>
          ${q.o.map((opt, idx) => `
            <button onclick="checkAnswer(${idx}, ${q.c}, ${score + (idx === q.c ? 10 : 0)}, ${i < qs.length - 1})" class="btn btn-secondary w-full my-1">${opt}</button>
          `).join('')}
        </div>
        <button onclick="showGamesScreen()" class="btn btn-ghost mt-4">Sair</button>
      </div>
    `;
    setTimeout(() => lucide.createIcons(), 100);
  }

  window.checkAnswer = (ua, ca, ns, nh) => {
    if (ua === ca) showToast('✅ +10 OSD!');
    else showToast('❌ Errou!');

    score = ns;

    if (nh) {
      i++;
      setTimeout(showQ, 600);
    } else {
      gameBalance += score;
      db.ref('users/' + getCurrentUser().username + '/gameBalance').set(gameBalance);
      showToast(`🎯 Ganhou ${score} OSD!`);
      setTimeout(showGamesScreen, 1000);
    }
  };

  showQ();
}

function generateRedemptionCode(username) {
  if (gameBalance <= 0) {
    alert('Jogue primeiro!');
    return;
  }

  const code = `R-${username.toUpperCase()}-${Date.now()}`;
  const amt = gameBalance;

  db.ref('redemption_codes/' + code).set({
    username, amt, used: false, ts: Date.now()
  }).then(() => {
    alert(`Código: ${code}\nUse no depósito!`);
    db.ref('users/' + username + '/gameBalance').set(0);
    gameBalance = 0;
    showGamesScreen();
  });
}
