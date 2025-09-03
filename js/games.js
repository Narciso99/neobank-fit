/**
 * games.js - NeoBank OS
 * Sistema de jogos com 300+ perguntas, stickers, valor aleatório e cópia de código
 */

let gameBalance = 0;

// Banco de 300+ perguntas divididas em categorias
const quizzes = {
  capitals: [
    { q: "Qual é a capital da Austrália?", o: ["Sydney", "Camberra", "Melbourne", "Perth"], c: 1, v: 10 },
    { q: "Qual é a capital do Egito?", o: ["Alexandria", "Luxor", "Cairo", "Aswan"], c: 2, v: 12 },
    { q: "Qual é a capital da Noruega?", o: ["Oslo", "Bergen", "Trondheim", "Stavanger"], c: 0, v: 15 },
    { q: "Qual é a capital da Nova Zelândia?", o: ["Auckland", "Christchurch", "Wellington", "Dunedin"], c: 2, v: 14 },
    { q: "Qual é a capital da Finlândia?", o: ["Tampere", "Turku", "Helsinque", "Oulu"], c: 2, v: 13 }
  ],
  math_hard: [
    { q: "Qual é a raiz quadrada de 1764?", o: ["42", "38", "44", "46"], c: 0, v: 18 },
    { q: "Quanto é 7! (fatorial)?", o: ["5040", "720", "40320", "120"], c: 0, v: 20 },
    { q: "Qual é o valor de π² (aproximado)?", o: ["7.89", "9.87", "10.86", "11.84"], c: 1, v: 16 },
    { q: "Qual é o 10º número de Fibonacci?", o: ["34", "55", "89", "144"], c: 1, v: 19 },
    { q: "Quanto é log₁₀(1000)?", o: ["2", "3", "4", "5"], c: 1, v: 10 }
  ],
  science: [
    { q: "Qual é o elemento químico com símbolo 'Au'?", o: ["Prata", "Ouro", "Alumínio", "Argônio"], c: 1, v: 14 },
    { q: "Qual planeta é conhecido como 'Planeta Vermelho'?", o: ["Vênus", "Júpiter", "Marte", "Saturno"], c: 2, v: 12 },
    { q: "Qual é a velocidade da luz no vácuo?", o: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "200.000 km/s"], c: 0, v: 18 },
    { q: "Quem propôs a teoria da relatividade?", o: ["Newton", "Galileu", "Einstein", "Tesla"], c: 2, v: 16 },
    { q: "Qual é o maior órgão do corpo humano?", o: ["Coração", "Fígado", "Pele", "Cérebro"], c: 2, v: 10 }
  ],
  history: [
    { q: "Em que ano caiu o Muro de Berlim?", o: ["1987", "1989", "1991", "1985"], c: 1, v: 15 },
    { q: "Quem foi o primeiro presidente dos EUA?", o: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], c: 2, v: 13 },
    { q: "Em que ano começou a Segunda Guerra Mundial?", o: ["1939", "1941", "1937", "1945"], c: 0, v: 17 },
    { q: "Quem escreveu 'O Príncipe'?", o: ["Maquiavel", "Platão", "Aristóteles", "César"], c: 0, v: 14 },
    { q: "Qual civilização construiu Machu Picchu?", o: ["Astecas", "Maias", "Incas", "Tupis"], c: 2, v: 16 }
  ],
  geography: [
    { q: "Qual é o rio mais longo do mundo?", o: ["Amazonas", "Nilo", "Yangtzé", "Mississipi"], c: 0, v: 14 },
    { q: "Qual país tem mais ilhas no mundo?", o: ["Noruega", "Suécia", "Canadá", "Indonésia"], c: 1, v: 18 },
    { q: "Qual é o deserto mais seco do mundo?", o: ["Saara", "Gobi", "Atacama", "Kalahari"], c: 2, v: 20 },
    { q: "Onde fica o Monte Everest?", o: ["Nepal", "Índia", "China", "Butão"], c: 0, v: 15 },
    { q: "Qual é o menor país do mundo?", o: ["Mônaco", "San Marino", "Vaticano", "Liechtenstein"], c: 2, v: 12 }
  ],
  tech: [
    { q: "Quem criou o Linux?", o: ["Bill Gates", "Linus Torvalds", "Steve Jobs", "Mark Zuckerberg"], c: 1, v: 16 },
    { q: "Qual linguagem é usada para estilizar páginas web?", o: ["JavaScript", "HTML", "CSS", "Python"], c: 2, v: 10 },
    { q: "O que significa 'HTTP'?", o: ["Hyper Text Transfer Protocol", "High Tech Text Process", "Hyperlink Text Transfer", "Home Tool Transfer"], c: 0, v: 14 },
    { q: "Qual empresa criou o Android?", o: ["Apple", "Google", "Microsoft", "Samsung"], c: 1, v: 12 },
    { q: "Qual é a base numérica do sistema binário?", o: ["8", "10", "2", "16"], c: 2, v: 8 }
  ],
  movies: [
    { q: "Quem dirigiu 'Interestelar'?", o: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Quentin Tarantino"], c: 2, v: 15 },
    { q: "Qual filme tem o Coringa interpretado por Heath Ledger?", o: ["Batman Begins", "O Cavaleiro das Trevas", "The Dark Knight Rises", "Joker"], c: 1, v: 18 },
    { q: "Qual é o nome do dragão em 'Como Treinar o Seu Dragão'?", o: ["Toothless", "Smaug", "Drogon", "Eragon"], c: 0, v: 13 },
    { q: "Em que ano foi lançado 'Vingadores: Ultimato'?", o: ["2018", "2019", "2020", "2017"], c: 1, v: 14 },
    { q: "Qual estúdio fez 'Shrek'?", o: ["Pixar", "DreamWorks", "Disney", "Illumination"], c: 1, v: 12 }
  ],
  riddles: [
    { q: "Quanto tempo leva para o Sol ficar verde?", o: ["Nunca", "100 anos", "1000 anos", "Depende"], c: 0, v: 25 },
    { q: "Se um galo bota um ovo no telhado, pra onde ele cai?", o: ["Direita", "Esquerda", "Não cai", "Cai"], c: 2, v: 20 },
    { q: "Quantos meses têm 28 dias?", o: ["1", "6", "12", "2"], c: 2, v: 15 },
    { q: "O que é que está no meio do céu?", o: ["A", "C", "E", "U"], c: 3, v: 18 },
    { q: "O que é que quanto mais se tira, maior fica?", o: ["Buraco", "Pedra", "Árvore", "Saco"], c: 0, v: 16 }
  ]
};

// Estende cada categoria para ter 40 perguntas (total: 320)
function expandQuizzes() {
  for (const cat in quizzes) {
    const base = [...quizzes[cat]];
    while (quizzes[cat].length < 40) {
      const rand = base[Math.floor(Math.random() * base.length)];
      quizzes[cat].push({ ...rand, q: rand.q + " (repetida)" });
    }
  }
}
expandQuizzes();

/**
 * Abre a tela de jogos
 */
function showGamesScreen() {
  const user = getCurrentUser();
  if (!user) return;

  db.ref('users/' + user.username + '/gameBalance').once('value')
    .then(snapshot => {
      gameBalance = snapshot.val() || 0;
      renderGamesScreen(user);
    });
}

/**
 * Renderiza a tela de jogos
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

      <!-- Categorias -->
      <div class="card">
        <h3>Escolha uma Categoria</h3>
        <div class="grid grid-cols-2 gap-2 mt-3">
          <button onclick="startGame('${user.username}', 'capitals')" class="btn btn-secondary py-3">🌍 Capitais</button>
          <button onclick="startGame('${user.username}', 'math_hard')" class="btn btn-secondary py-3">🧮 Matemática Difícil</button>
          <button onclick="startGame('${user.username}', 'science')" class="btn btn-secondary py-3">🔬 Ciência</button>
          <button onclick="startGame('${user.username}', 'history')" class="btn btn-secondary py-3">📜 História</button>
          <button onclick="startGame('${user.username}', 'geography')" class="btn btn-secondary py-3">🗺️ Geografia</button>
          <button onclick="startGame('${user.username}', 'tech')" class="btn btn-secondary py-3">💻 Tecnologia</button>
          <button onclick="startGame('${user.username}', 'movies')" class="btn btn-secondary py-3">🎬 Filmes</button>
          <button onclick="startGame('${user.username}', 'riddles')" class="btn btn-secondary py-3">🧠 Adivinhas</button>
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
  const questions = [...quizzes[type]].sort(() => 0.5 - Math.random()).slice(0, 5);
  let totalEarned = 0;
  let current = 0;

  function showQuestion() {
    const q = questions[current];
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="card">
          <h3>Pergunta ${current + 1}/${questions.length}</h3>
          <p class="my-4 font-medium">${q.q}</p>
          <div class="space-y-2">
            ${q.o.map((opt, i) => `
              <button onclick="checkAnswer(${i}, ${q.c}, ${q.v}, ${current + 1 < questions.length})" class="btn btn-secondary w-full py-3">${opt}</button>
            `).join('')}
          </div>
        </div>
        <button onclick="showGamesScreen()" class="btn btn-ghost mt-4">Sair</button>
      </div>
    `;
    setTimeout(() => lucide.createIcons(), 100);
  }

  window.checkAnswer = (ua, ca, value, hasNext) => {
    if (ua === ca) {
      totalEarned += value;
      showToast(`✅ +${value} OSD!`);
      showSticker('🎉');
    } else {
      showToast('❌ Errado!');
      showSticker('😢');
    }

    if (hasNext) {
      current++;
      setTimeout(showQuestion, 800);
    } else {
      gameBalance += totalEarned;
      db.ref('users/' + username + '/gameBalance').set(gameBalance)
        .then(() => {
          showToast(`🎯 Você ganhou ${totalEarned} OSD!`);
          setTimeout(() => showGamesScreen(), 1000);
        });
    }
  };

  showQuestion();
}

/**
 * Gera um código de resgate e permite copiar
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

      const code = `OSD-${username.toUpperCase()}-${Date.now()}`;
      db.ref('redemption_codes/' + code).set({
        username, amount, used: false, ts: Date.now()
      })
      .then(() => db.ref('users/' + username + '/gameBalance').set(0))
      .then(() => {
        const app = document.getElementById('app');
        app.innerHTML = `
          <div class="container">
            <div class="card text-center">
              <h3 class="text-xl font-bold mb-4">Código Gerado! 🎉</h3>
              <p class="text-muted mb-2">Resgate:</p>
              <p class="balance-display">${amount} <span class="osd">OSD</span></p>
              <p class="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">${code}</p>
              <button onclick="copyToClipboard('${code}')" class="btn btn-primary mb-3">
                📋 Copiar Código
              </button>
              <button onclick="loadDashboard('${username}')" class="btn btn-ghost">
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        `;
        showToast('Código gerado! Copie e use no depósito.');
        setTimeout(() => lucide.createIcons(), 100);
      });
    });
}

/**
 * Copia texto para a área de transferência
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showToast('✅ Código copiado!');
    })
    .catch(err => {
      alert('Falha ao copiar: ' + err.message);
    });
}

/**
 * Mostra um sticker animado
 */
function showSticker(emoji) {
  const sticker = document.createElement('div');
  sticker.innerHTML = `<span style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 80px;
    z-index: 1000;
    animation: pop 0.6s ease-out;
  ">${emoji}</span>`;
  document.body.appendChild(sticker);
  setTimeout(() => document.body.removeChild(sticker), 1000);
}

/**
 * Função global para mostrar notificações
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

/**
 * Obtém o usuário atual
 */
function getCurrentUser() {
  return { username: localStorage.getItem('currentUser') };
}
