function addAchievement(username, title, description) {
  const ref = db.ref('users/' + username + '/achievements');
  ref.push({
    title,
    description,
    date: new Date().toISOString()
  });
}

function checkAchievements(user) {
  const transactions = Object.values(user.transactions || {});
  const totalDeposits = transactions.filter(t => t.type === 'deposit').length;
  const totalBalance = user.balance;

  if (totalDeposits >= 10 && !hasAchievement(user, 'Mestre dos Depósitos')) {
    addAchievement(user.username, 'Mestre dos Depósitos', 'Fez 10 depósitos!');
  }
  if (totalBalance >= 500 && !hasAchievement(user, 'Guardião do Saldo')) {
    addAchievement(user.username, 'Guardião do Saldo', 'Guardou 500 FIT$ ou mais!');
  }
}

function hasAchievement(user, title) {
  return (user.achievements || []).some(a => a.title === title);
}