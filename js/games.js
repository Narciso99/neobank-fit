let currentQuestion = 0;
let gameBalance = 0;
let helpsUsed = 0;
const questions = [
  { question: "Quem pintou a Mona Lisa?", answers: ["Leonardo da Vinci", "Michelangelo", "Rafael", "Donatello"], correct: 0, category: "Arte" },
  { question: "Qual é a capital do Brasil?", answers: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], correct: 2, category: "Geografia" },
  // Adicione mais 698 perguntas
];

function showGame() {
  document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
  document.getElementById('game-screen').style.display = 'block';
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('question').textContent = q.question;
  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';
  q.answers.forEach((answer, i) => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.onclick = () => checkAnswer(i);
    answersDiv.appendChild(btn);
  });
  document.getElementById('help-btn').textContent = `Ver Percentagens (${helpsUsed}/3)`;
}

function checkAnswer(index) {
  const q = questions[currentQuestion];
  const value = Math.floor(Math.random() * 46) + 5;
  if (index === q.correct) {
    gameBalance += value;
    showToast('🎉 Resposta correta! +' + value + ' OSD');
  } else {
    showToast('😢 Resposta errada!');
  }
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showToast(`Fim do jogo! Total ganho: ${gameBalance} OSD`);
    document.getElementById('generate-code-btn').style.display = 'block';
    firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({ gameBalance });
  } else {
    loadQuestion();
  }
}

function useHelp() {
  if (helpsUsed >= 3) {
    showToast('Limite de ajudas atingido!');
    return;
  }
  helpsUsed++;
  const percentages = [40, 30, 20, 10];
  questions[currentQuestion].answers.forEach((_, i) => {
    document.getElementById('answers').children[i].textContent += ` (${percentages[i]}%)`;
  });
  document.getElementById('help-btn').textContent = `Ver Percentagens (${helpsUsed}/3)`;
  firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({ helpsUsed });
}

function generateCode() {
  const uid = firebase.auth().currentUser.uid;
  firebase.database().ref(`users/${uid}`).once('value').then(snapshot => {
    const username = snapshot.val().username;
    const code = `OSD-${username}-${Date.now()}`;
    firebase.database().ref('redemption_codes').child(code).set({
      value: gameBalance,
      userId: uid,
      used: false
    }).then(() => {
      navigator.clipboard.writeText(code);
      showToast('Código copiado!');
      firebase.database().ref(`users/${uid}`).update({ gameBalance: 0 });
      gameBalance = 0;
      currentQuestion = 0;
      backToDashboard();
    });
  });
}

function showRedeem() {
  document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
  document.getElementById('redeem-screen').style.display = 'block';
}

function redeemCode() {
  const code = document.getElementById('redeem-code').value;
  const uid = firebase.auth().currentUser.uid;
  firebase.database().ref('redemption_codes').child(code).once('value', snapshot => {
    if (!snapshot.exists() || snapshot.val().used || snapshot.val().userId !== uid) {
      showToast('Código inválido ou já usado!');
      return;
    }
    const value = snapshot.val().value;
    firebase.database().ref(`users/${uid}`).once('value').then(userSnapshot => {
      const balance = userSnapshot.val().balance;
      firebase.database().ref(`users/${uid}`).update({ balance: balance + value });
      firebase.database().ref('redemption_codes').child(code).update({ used: true });
      firebase.database().ref(`transactions/${uid}`).push({
        type: 'deposit',
        amount: value,
        date: Date.now()
      });
      showToast(`Código resgatado! +${value} OSD`);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Código resgatado! +${value} OSD`);
      }
      backToDashboard();
    });
  });
}
