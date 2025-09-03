function addAchievement(uid, title, description) {
  console.log('Adicionando conquista:', title, 'para UID:', uid);
  const ref = firebase.database().ref('users/' + uid + '/achievements');
  ref.push({
    title,
    description,
    date: new Date().toISOString()
  }).catch(err => {
    showToast('Erro ao salvar conquista: ' + err.message);
    console.error('Erro ao salvar conquista:', err.message);
  });
}

function checkAchievements(user) {
  console.log('Verificando conquistas para:', user.username);
  const transactions = Object.values(user.transactions || {});
  const totalDeposits = transactions.filter(t => t.type === 'deposit').length;
  const totalBalance = user.balance;
  const totalPix = transactions.filter(t => t.type === 'pix_out').length;
  const totalInvestments = transactions.filter(t => t.type === 'investment').length;

  if (totalDeposits >= 10 && !hasAchievement(user, 'Mestre dos Depósitos')) {
    addAchievement(user.uid, 'Mestre dos Depósitos', 'Fez 10 depósitos!');
  }
  if (totalBalance >= 500 && !hasAchievement(user, 'Guardião do Saldo')) {
    addAchievement(user.uid, 'Guardião do Saldo', 'Guardou 500 FIT$ ou mais!');
  }
  if (totalPix >= 5 && !hasAchievement(user, 'Mestre do Pix')) {
    addAchievement(user.uid, 'Mestre do Pix', 'Realizou 5 transferências Pix!');
  }
  if (totalInvestments >= 3 && !hasAchievement(user, 'Investidor Iniciante')) {
    addAchievement(user.uid, 'Investidor Iniciante', 'Realizou 3 investimentos!');
  }
}

function hasAchievement(user, title) {
  return Object.values(user.achievements || {}).some(a => a.title === title);
}
