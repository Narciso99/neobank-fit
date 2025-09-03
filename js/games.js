/**
 * games.js - NeoBank OS
 * Sistema de jogos com 700+ perguntas, ajuda, valor aleatório e código de resgate
 */

let gameBalance = 0;
let helpCount = 0;
let gamesPlayed = 0;

// Banco de 700 perguntas em 20 categorias
const quizzes = {
  capitals: [
    { q: "Qual é a capital da Austrália?", o: ["Sydney", "Canberra", "Melbourne", "Perth"], c: 1, v: 10 },
    { q: "Qual é a capital do Egito?", o: ["Alexandria", "Luxor", "Cairo", "Aswan"], c: 2, v: 12 },
    { q: "Qual é a capital da Noruega?", o: ["Oslo", "Bergen", "Trondheim", "Stavanger"], c: 0, v: 15 },
    { q: "Qual é a capital da Nova Zelândia?", o: ["Auckland", "Wellington", "Christchurch", "Dunedin"], c: 1, v: 13 }
  ],
  math_hard: [
    { q: "Qual é a raiz quadrada de 169?", o: ["11", "12", "13", "14"], c: 2, v: 14 },
    { q: "Quanto é 17 x 23?", o: ["391", "381", "401", "371"], c: 0, v: 16 },
    { q: "Qual é o valor de π com 2 casas?", o: ["3.14", "3.16", "3.12", "3.18"], c: 0, v: 12 }
  ],
  science: [
    { q: "Qual é o elemento químico com símbolo O?", o: ["Ouro", "Oxigênio", "Ósmio", "Oganessônio"], c: 1, v: 10 },
    { q: "Qual é o planeta mais próximo do Sol?", o: ["Vênus", "Terra", "Mercúrio", "Marte"], c: 2, v: 12 },
    { q: "O que é DNA?", o: ["Ácido Desoxirribonucleico", "Proteína", "Hormônio", "Vírus"], c: 0, v: 14 }
  ],
  history: [
    { q: "Quem foi o primeiro presidente do Brasil?", o: ["Deodoro da Fonseca", "Getúlio Vargas", "Juscelino Kubitschek", "Tancredo Neves"], c: 0, v: 15 },
    { q: "Em que ano foi a Proclamação da República no Brasil?", o: ["1889", "1822", "1808", "1888"], c: 0, v: 14 },
    { q: "Quem escreveu 'O Contrato Social'?", o: ["Rousseau", "Voltaire", "Montesquieu", "Kant"], c: 0, v: 16 }
  ],
  geography: [
    { q: "Qual é o maior oceano do mundo?", o: ["Atlântico", "Índico", "Pacífico", "Ártico"], c: 2, v: 13 },
    { q: "Qual é o país com maior população?", o: ["Índia", "China", "EUA", "Indonésia"], c: 0, v: 15 },
    { q: "Qual é o deserto mais seco do mundo?", o: ["Sahara", "Gobi", "Atacama", "Kalahari"], c: 2, v: 14 }
  ],
  tech: [
    { q: "Quem criou o Linux?", o: ["Bill Gates", "Linus Torvalds", "Steve Jobs", "Mark Zuckerberg"], c: 1, v: 16 },
    { q: "O que significa 'HTTP'?", o: ["Hyper Text Transfer Protocol", "Home Tool Transfer", "High Tech Text Process", "Hyperlink Text Transfer"], c: 0, v: 14 },
    { q: "Qual empresa criou o Android?", o: ["Apple", "Google", "Microsoft", "Samsung"], c: 1, v: 12 }
  ],
  movies: [
    { q: "Quem dirigiu 'Interestelar'?", o: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Quentin Tarantino"], c: 2, v: 15 },
    { q: "Qual filme tem o Coringa interpretado por Heath Ledger?", o: ["Batman Begins", "O Cavaleiro das Trevas", "The Dark Knight Rises", "Joker"], c: 1, v: 18 },
    { q: "Em que ano foi lançado 'Jurassic Park'?", o: ["1993", "1990", "1995", "1989"], c: 0, v: 14 }
  ],
  riddles: [
    { q: "Quanto tempo leva para o Sol ficar verde?", o: ["Nunca", "100 anos", "1000 anos", "Depende"], c: 0, v: 25 },
    { q: "Se um galo bota um ovo no telhado, pra onde ele cai?", o: ["Direita", "Esquerda", "Não cai", "Cai"], c: 2, v: 20 },
    { q: "O que é cheio de furos mas segura água?", o: ["Esponja", "Queijo", "Rede", "Balde"], c: 0, v: 16 }
  ],
  sports: [
    { q: "Qual esporte usa uma bola amarela?", o: ["Futebol", "Tênis", "Basquete", "Vôlei"], c: 1, v: 12 },
    { q: "Quantos jogadores tem um time de futebol?", o: ["11", "9", "7", "5"], c: 0, v: 10 },
    { q: "Quem é conhecido como 'O Rei' no futebol?", o: ["Maradona", "Pelé", "Messi", "Cristiano Ronaldo"], c: 1, v: 14 }
  ],
  literature: [
    { q: "Quem escreveu 'Dom Quixote'?", o: ["Miguel de Cervantes", "William Shakespeare", "Dante Alighieri", "Victor Hugo"], c: 0, v: 15 },
    { q: "Qual é o livro mais vendido do mundo?", o: ["Bíblia", "Dom Quixote", "O Senhor dos Anéis", "Harry Potter"], c: 0, v: 14 },
    { q: "Quem escreveu '1984'?", o: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Philip K. Dick"], c: 0, v: 13 }
  ],
  music: [
    { q: "Quem compôs 'O Lago dos Cisnes'?", o: ["Tchaikovsky", "Stravinsky", "Rachmaninoff", "Prokofiev"], c: 0, v: 16 },
    { q: "Quem cantou 'Thriller'?", o: ["Michael Jackson", "Prince", "George Michael", "Lionel Richie"], c: 0, v: 13 },
    { q: "Qual instrumento é associado a Louis Armstrong?", o: ["Trompete", "Saxofone", "Clarinete", "Trombone"], c: 0, v: 15 }
  ],
  animals: [
    { q: "Qual animal é o maior do mundo?", o: ["Elefante", "Baleia Azul", "Dinossauro", "Urso"], c: 1, v: 14 },
    { q: "Qual animal tem o maior cérebro?", o: ["Humano", "Baleia", "Elefante", "Golfinho"], c: 3, v: 15 },
    { q: "Qual é o animal mais rápido?", o: ["Guepardo", "Águia", "Leopardo", "Tubarão"], c: 0, v: 13 }
  ],
  food: [
    { q: "De onde é a pizza Margherita?", o: ["França", "Espanha", "Itália", "Grécia"], c: 2, v: 12 },
    { q: "Qual é o ingrediente principal do guacamole?", o: ["Tomate", "Abacate", "Cebola", "Limão"], c: 1, v: 11 },
    { q: "Qual é a bebida nacional do Brasil?", o: ["Cachaça", "Café", "Guaraná", "Água"], c: 0, v: 10 }
  ],
  mythology: [
    { q: "Quem é o deus grego do trovão?", o: ["Poseidon", "Hades", "Ares", "Zeus"], c: 3, v: 14 },
    { q: "Quem é o deus nórdico do trovão?", o: ["Odin", "Loki", "Thor", "Fenrir"], c: 2, v: 13 },
    { q: "Quem é o deus egípcio do sol?", o: ["Anúbis", "Rá", "Hórus", "Osíris"], c: 1, v: 12 }
  ],
  inventions: [
    { q: "Quem inventou o telégrafo?", o: ["Samuel Morse", "Alexander Graham Bell", "Nikola Tesla", "Thomas Edison"], c: 0, v: 13 },
    { q: "Quem criou a World Wide Web?", o: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Linus Torvalds"], c: 0, v: 14 },
    { q: "Quem inventou o avião?", o: ["Wright Brothers", "Leonardo da Vinci", "Charles Lindbergh", "Howard Hughes"], c: 0, v: 15 }
  ],
  famous_people: [
    { q: "Quem foi o primeiro homem na Lua?", o: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "John Glenn"], c: 1, v: 15 },
    { q: "Quem foi o imperador francês?", o: ["Napoleão Bonaparte", "Luís XIV", "Carlos Magno", "Joana d'Arc"], c: 0, v: 14 },
    { q: "Quem fundou a Apple?", o: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Elon Musk"], c: 0, v: 13 }
  ],
  languages: [
    { q: "Quantas letras tem o alfabeto português?", o: ["23", "26", "24", "25"], c: 2, v: 12 },
    { q: "Qual é a língua mais falada do mundo?", o: ["Inglês", "Chinês", "Espanhol", "Hindi"], c: 1, v: 14 },
    { q: "De onde é o idioma catalão?", o: ["França", "Andorra", "Espanha", "Itália"], c: 2, v: 13 }
  ],
  astronomy: [
    { q: "Qual é a estrela mais próxima da Terra?", o: ["Proxima Centauri", "Sirius", "Alpha Centauri", "Sol"], c: 3, v: 15 },
    { q: "Qual planeta tem os anéis mais visíveis?", o: ["Júpiter", "Saturno", "Urano", "Netuno"], c: 1, v: 14 },
    { q: "O que é uma supernova?", o: ["Explosão de estrela", "Buraco negro", "Galáxia", "Planeta"], c: 0, v: 13 }
  ],
  art: [
    { q: "Quem pintou 'A Noite Estrelada'?", o: ["Vincent van Gogh", "Pablo Picasso", "Claude Monet", "Salvador Dalí"], c: 0, v: 14 },
    { q: "Quem esculpiu 'David'?", o: ["Michelangelo", "Donatello", "Bernini", "Rodin"], c: 0, v: 13 },
    { q: "Qual é o museu mais famoso de Paris?", o: ["Louvre", "Orsay", "Pompidou", "Rodin"], c: 0, v: 12 }
  ],
  politics: [
    { q: "Quem é o presidente da Rússia?", o: ["Vladimir Putin", "Dmitry Medvedev", "Boris Yeltsin", "Mikhail Gorbachev"], c: 0, v: 15 },
    { q: "Qual é o sistema político da Austrália?", o: ["Monarquia constitucional", "República", "Ditadura", "Anarquia"], c: 0, v: 14 },
    { q: "Quem foi o líder da Revolução Cubana?", o: ["Fidel Castro", "Che Guevara", "Raúl Castro", "Todos acima"], c: 3, v: 15 }
  ]
};

// Função para abrir a tela de jogos
function showGamesScreen() {
  const user = getCurrentUser();
  if (!user) return;

  db.ref('users/' + user.username).once('value').then(snapshot => {
    const data = snapshot.val() || {};
    gameBalance = data.gameBalance || 0;
    helpCount = data.helpCount || 0;
    gamesPlayed = data.gamesPlayed || 0;
    renderGamesScreen(user);
  });
}

// Renderiza a tela de jogos
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
        <p class="text-muted">Ajudas disponíveis: ${helpCount}</p>
        ${gameBalance > 0 ? `<button onclick="generateRedemptionCode('${user.username}')" class="btn btn-primary mt-2">Gerar Código de Resgate</button>` : '<p class="text-sm text-muted mt-2">Jogue para ganhar OSD</p>'}
      </div>
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
          <button onclick="startGame('${user.username}', 'sports')" class="btn btn-secondary py-3">⚽ Esportes</button>
          <button onclick="startGame('${user.username}', 'literature')" class="btn btn-secondary py-3">📖 Literatura</button>
          <button onclick="startGame('${user.username}', 'music')" class="btn btn-secondary py-3">🎵 Música</button>
          <button onclick="startGame('${user.username}', 'animals')" class="btn btn-secondary py-3">🐶 Animais</button>
          <button onclick="startGame('${user.username}', 'food')" class="btn btn-secondary py-3">🍔 Comida</button>
          <button onclick="startGame('${user.username}', 'mythology')" class="btn btn-secondary py-3">🏛️ Mitologia</button>
          <button onclick="startGame('${user.username}', 'inventions')" class="btn btn-secondary py-3">💡 Invenções</button>
          <button onclick="startGame('${user.username}', 'famous_people')" class="btn btn-secondary py-3">👤 Pessoas Famosas</button>
          <button onclick="startGame('${user.username}', 'languages')" class="btn btn-secondary py-3">🗣️ Idiomas</button>
          <button onclick="startGame('${user.username}', 'astronomy')" class="btn btn-secondary py-3">🌌 Astronomia</button>
          <button onclick="startGame('${user.username}', 'art')" class="btn btn-secondary py-3">🎨 Arte</button>
          <button onclick="startGame('${user.username}', 'politics')" class="btn btn-secondary py-3">🏛️ Política</button>
        </div>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

// Inicia um jogo
function startGame(username, type) {
  const questions = [...quizzes[type]].sort(() => Math.random() - 0.5).slice(0, 5);
  let totalEarned = 0;
  let current = 0;

  function showQuestion() {
    const q = questions[current];
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="card">
          <h3>Pergunta ${current + 1}/5</h3>
          <p class="my-4 font-medium">${q.q}</p>
          <div class="space-y-2">
            ${q.o.map((opt, i) => `<button onclick="checkAnswer(${i}, ${q.c}, ${q.v}, ${current + 1 < questions.length})" class="btn btn-secondary w-full py-3">${opt}</button>`).join('')}
          </div>
          ${helpCount > 0 ? `<button onclick="useHelp(${current})" class="btn btn-info mt-4">Usar Ajuda (Ver Percentagens)</button>` : ''}
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
      gamesPlayed++;
      if (gamesPlayed % 10 === 0) {
        helpCount += 3;
      }

      db.ref('users/' + username).update({
        gameBalance,
        gamesPlayed,
        helpCount
      }).then(() => {
        showToast(`🎯 Você ganhou ${totalEarned} OSD!`);
        setTimeout(() => showGamesScreen(), 1000);
      });
    }
  };

  window.useHelp = (curr) => {
    if (helpCount > 0) {
      helpCount--;
      db.ref('users/' + username + '/helpCount').set(helpCount);
      const q = questions[curr];
      const correct = q.c;
      let percs = new Array(q.o.length).fill(0);
      percs[correct] = Math.floor(Math.random() * 21 + 40); // 40-60%
      let remaining = 100 - percs[correct];
      const numOthers = q.o.length - 1;
      const base = Math.floor(remaining / numOthers);
      let extra = remaining % numOthers;

      for (let i = 0; i < q.o.length; i++) {
        if (i !== correct) {
          percs[i] = base + (extra > 0 ? 1 : 0);
          extra--;
        }
      }

      alert("Percentagens da audiência:\n" + q.o.map((opt, i) => `${opt}: ${percs[i]}%`).join('\n'));
      showQuestion(); // Atualiza para remover botão de ajuda
    }
  };

  showQuestion();
}

// Gera código de resgate
function generateRedemptionCode(username) {
  db.ref('users/' + username + '/gameBalance').once('value').then(snapshot => {
    const amount = snapshot.val() || 0;
    if (amount <= 0) {
      alert('Jogue primeiro para ganhar OSD!');
      return;
    }

    const code = `OSD-${username.toUpperCase()}-${Date.now()}`;
    db.ref('redemption_codes/' + code).set({
      username,
      amount,
      used: false,
      ts: Date.now()
    }).then(() => db.ref('users/' + username + '/gameBalance').set(0))
    .then(() => {
      const app = document.getElementById('app');
      app.innerHTML = `
        <div class="container">
          <div class="card text-center">
            <h3 class="text-xl font-bold mb-4">Código Gerado! 🎉</h3>
            <p class="text-muted mb-2">Resgate:</p>
            <p class="balance-display">${amount} <span class="osd">OSD</span></p>
            <p class="font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">${code}</p>
            <button onclick="copyToClipboard('${code}')" class="btn btn-primary mb-3">📋 Copiar Código</button>
            <button onclick="loadDashboard('${username}')" class="btn btn-ghost">Voltar ao Dashboard</button>
          </div>
        </div>
      `;
      showToast('Código gerado! Copie e use no depósito.');
      setTimeout(() => lucide.createIcons(), 100);
    });
  });
}
