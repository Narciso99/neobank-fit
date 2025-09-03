/**
 * transactions.js - NeoBank OS
 * Gerencia transações de depósito e saque
 */

function processTransaction(type, username, amount, callback) {
  if (!amount || amount <= 0) {
    showToast('❌ Digite um valor válido.');
    callback(false);
    return;
  }

  if (type === 'withdraw') {
    db.ref('users/' + username + '/balance').once('value')
      .then(snapshot => {
        const balance = snapshot.val() || 0;
        if (balance < amount) {
          showToast('❌ Saldo insuficiente.');
          callback(false);
          return;
        }
        updateUserBalance(username, -amount);
        addTransaction(username, 'withdraw', amount);
        showToast(`✅ Saque de ${amount.toFixed(2)} OSD realizado!`);
        callback(true);
      })
      .catch(err => {
        console.error('Erro ao verificar saldo:', err);
        showToast('❌ Erro ao processar saque: ' + err.message);
        callback(false);
      });
  } else {
    updateUserBalance(username, amount);
    addTransaction(username, 'deposit', amount);
    showToast(`✅ Depósito de ${amount.toFixed(2)} OSD realizado!`);
    callback(true);
  }
}

function updateUserBalance(username, amount) {
  const ref = db.ref('users/' + username);
  ref.transaction(user => {
    if (user) {
      user.balance = (user.balance || 0) + amount;
      user.xp = (user.xp || 0) + Math.abs(amount) * 0.1;
      user.level = Math.floor(user.xp / 100) + 1;
    }
    return user;
  }).catch(err => {
    console.error('Erro ao atualizar saldo:', err);
    showToast('❌ Erro ao atualizar saldo: ' + err.message);
  });
}

function addTransaction(username, type, amount, target = null) {
  const transaction = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0],
    type,
    amount,
    target
  };
  db.ref('users/' + username + '/transactions').push(transaction)
    .catch(err => {
      console.error('Erro ao adicionar transação:', err);
      showToast('❌ Erro ao adicionar transação: ' + err.message);
    });
}
