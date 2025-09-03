let currentQuestion = 0;
let gameBalance = 0;
let helpsUsed = 0;
const questions = [
  { question: "Quem pintou a Mona Lisa?", answers: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Donatello"], correct: 0, category: "Arte" },
  { question: "Qual é a capital do Brasil?", answers: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], correct: 2, category: "Geografia" },
  // Adicione mais perguntas conforme necessário
];

function showGameScreen() {
  console.log('Exibindo tela de jogo');
  const user = getCurrentUser();
  if (!user) {
    showToast('Você precisa estar logado.');
    console.error('Erro: Usuário não logado');
    showLoginScreen();
    return;
  }
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado');
    return;
  }
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Jogo de Perguntas</h2>
      </div>
      <div class="card">
        <p class="text-lg mb-4" id="question"></p>
        <div id="answers" class="space-y-2"></div>
        <button onclick="useHelp()" id="help-btn" class="btn btn-secondary mt-3">Ver Percentagens (${helpsUsed}/3)</button>
        <button onclick="generateCode()" id="generate-code-btn" class="btn btn-primary mt-3" style="display: none;">Gerar Código de Resgate</button>
      </div>
      <button onclick="loadDashboard('${user.uid}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  loadQuestion();
  setTimeout(() => lucide.createIcons(), 100);
}

function loadQuestion() {
  console.log('Carregando pergunta:', currentQuestion);
  const q = questions[currentQuestion];
  document.getElementById('question').textContent = q.question;
  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';
  q.answers.forEach((answer, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary w-full';
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(i);
    answersDiv.appendChild(btn);
  });
  document.getElementById('help-btn').textContent = `Ver Percentagens (${helpsUsed}/3)`;
}

function checkAnswer(index) {
  console.log('Verificando resposta:', index);
  const q = questions[currentQuestion];
  const value = Math.floor(Math.random() * 46) + 5;
  const user = getCurrentUser();
  if (index === q.correct) {
    gameBalance += value;
    showToast(`🎉 Resposta correta! +${value} FIT$`);
    console.log('Resposta correta, ganho:', value);
    addAchievement(user.uid, 'Resposta Certa', `Ganhou ${value} FIT$ no jogo!`);
  } else {
    showToast('😢 Resposta errada!');
    console.error('Resposta errada');
  }
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showToast(`Fim do jogo! Total ganho: ${gameBalance} FIT$`);
    console.log('Fim do jogo, total ganho:', gameBalance);
    document.getElementById('generate-code-btn').style.display = 'block';
    firebase.database().ref('users/' + user.uid).update({ balance: user.balance + gameBalance });
    addTransaction(user.uid, 'deposit', gameBalance, 'Jogo');
  } else {
    loadQuestion();
  }
}

function useHelp() {
  console.log('Usando ajuda, total usado:', helpsUsed);
  const user = getCurrentUser();
  if (helpsUsed >= 3) {
    showToast('Limite de ajudas atingido!');
    console.error('Erro: Limite de ajudas atingido');
    return;
  }
  helpsUsed++;
  const percentages = [40, 30, 20, 10];
  questions[currentQuestion].answers.forEach((_, i) => {
    document.getElementById('answers').children[i].textContent += ` (${percentages[i]}%)`;
  });
  document.getElementById('help-btn').textContent = `Ver Percentagens (${helpsUsed}/3)`;
  firebase.database().ref('users/' + user.uid).update({ helpsUsed });
}

function generateCode() {
  console.log('Gerando código de resgate');
  const user = getCurrentUser();
  const code = `FIT-${user.username}-${Date.now()}`;
  firebase.database().ref('redemption_codes').child(code).set({
    value: gameBalance,
    userId: user.uid,
    used: false
  }).then(() => {
    navigator.clipboard.writeText(code);
    showToast('Código copiado!');
    console.log('Código gerado e copiado:', code);
    gameBalance = 0;
    currentQuestion = 0;
    helpsUsed = 0;
    loadDashboard(user.uid);
  }).catch(err => {
    showToast('Erro ao gerar código: ' + err.message);
    console.error('Erro ao gerar código:', err.message);
  });
}
