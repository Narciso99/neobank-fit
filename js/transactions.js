function showTransactionModal(type) {
  console.log('Exibindo modal de transação:', type);
  const user = getCurrentUser();
  if (!user) {
    showToast('Você precisa estar logado.');
    console.error('Erro: Usuário não logado');
    showLoginScreen();
    return;
  }
  const modalHTML = {
    deposit: `
      <h3 class="text-xl font-bold mb-4">Depositar</h3>
      <div class="input-group">
        <label>Valor (FIT$)</label>
        <input type="number" id="amount" placeholder="100" class="w-full p-3 rounded-xl border" />
      </div>
      <button onclick="confirmTransaction('deposit')" class="btn btn-primary w-full">Confirmar</button>
    `,
    withdraw: `
      <h3 class="text-xl font-bold mb-4">Sacar</h3>
      <div class="input-group">
        <label>Valor (FIT$)</label>
        <input type="number" id="amount" placeholder="50" class="w-full p-3 rounded-xl border" />
      </div>
      <button onclick="confirmTransaction('withdraw')" class="btn btn-primary w-full">Confirmar</button>
    `,
    transfer: `
      <h3 class="text-xl font-bold mb-4">Transferir via IBAN</h3>
      <div class="input-group">
        <label>IBAN (OSPT...)</label>
        <input type="text" id="targetIban" placeholder="OSPT1234567890123456" class="w-full p-3 rounded-xl border" />
      </div>
      <div class="input-group">
        <label>Valor (FIT$)</label>
        <input type="number" id="amount" placeholder="100" class="w-full p-3 rounded-xl border" />
      </div>
      <button onclick="confirmTransaction('transfer')" class="btn btn-primary w-full">Enviar</button>
    `
  }[type];
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado');
    return;
  }
  app.innerHTML = `
    <div class="container fade-in">
      <div class="card slide-up">
        ${modalHTML}
        <button onclick="loadDashboard('${user.uid}')" class="btn btn-secondary w-full mt-3">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function confirmTransaction(type) {
  console.log('Confirmando transação:', type);
  const user = getCurrentUser();
  if (!user) {
    showToast('Você precisa estar logado.');
    console.error('Erro: Usuário não logado');
    return;
  }
  const amountInput = document.getElementById('amount');
  if (!amountInput) {
    showToast('Campo de valor não encontrado.');
    console.error('Erro: Campo de valor não encontrado');
    return;
  }
  const amount = parseFloat(amountInput.value);
  if (!amount || amount <= 0) {
    showToast('Informe um valor válido.');
    console.error('Erro: Valor inválido', amount);
    return;
  }
  const userRef = firebase.database().ref('users/' + user.uid);
  switch (type) {
    case 'deposit':
      userRef.transaction(userData => {
        if (userData) {
          userData.balance += amount;
          userData.xp = (userData.xp || 0) + amount * 0.1;
          userData.level = Math.floor(userData.xp / 100) + 1;
        }
        return userData;
      }).then(() => {
        addTransaction(user.uid, 'deposit', amount);
        addAchievement(user.uid, 'Depósito Feito', `+${amount} FIT$ depositados.`);
        showToast(`+${amount} FIT$ depositado!`);
        setTimeout(() => loadDashboard(user.uid), 600);
      }).catch(err => {
        showToast('Erro ao depositar: ' + err.message);
        console.error('Erro ao depositar:', err.message);
      });
      break;
    case 'withdraw':
      userRef.once('value')
        .then(snapshot => {
          const userData = snapshot.val();
          if (!userData || userData.balance < amount) {
            showToast('Saldo insuficiente.');
            console.error('Erro: Saldo insuficiente', userData.balance, amount);
            return;
          }
          userRef.transaction(userData => {
            if (userData) {
              userData.balance -= amount;
              userData.xp = (userData.xp || 0) + amount * 0.1;
              userData.level = Math.floor(userData.xp / 100) + 1;
            }
            return userData;
          }).then(() => {
            addTransaction(user.uid, 'withdraw', amount);
            addAchievement(user.uid, 'Primeiro Saque', 'Você fez seu primeiro saque!');
            showToast(`-${amount} FIT$ sacado!`);
            setTimeout(() => loadDashboard(user.uid), 600);
          });
        })
        .catch(err => {
          showToast('Erro ao sacar: ' + err.message);
          console.error('Erro ao sacar:', err.message);
        });
      break;
    case 'transfer':
      const targetInput = document.getElementById('targetIban');
      if (!targetInput) {
        showToast('Campo IBAN não encontrado.');
        console.error('Erro: Campo IBAN não encontrado');
        return;
      }
      const targetIban = targetInput.value.trim();
      if (!targetIban.startsWith('OSPT') || targetIban.length !== 22) {
        showToast('IBAN inválido.');
        console.error('Erro: IBAN inválido', targetIban);
        return;
      }
      firebase.database().ref('users').orderByChild('iban').equalTo(targetIban).once('value')
        .then(snapshot => {
          if (!snapshot.exists()) {
            showToast('IBAN não encontrado.');
            console.error('Erro: IBAN não encontrado', targetIban);
            return;
          }
          const targetUid = Object.keys(snapshot.val())[0];
          const targetUsername = snapshot.val()[targetUid].username;
          if (targetUid === user.uid) {
            showToast('Você não pode transferir para si mesmo.');
            console.error('Erro: Tentativa de transferência para si mesmo');
            return;
          }
          userRef.once('value')
            .then(userSnap => {
              const userData = userSnap.val();
              if (!userData || userData.balance < amount) {
                showToast('Saldo insuficiente.');
                console.error('Erro: Saldo insuficiente', userData.balance, amount);
                return;
              }
              const now = new Date();
              const transactionId = 'transfer_' + now.getTime();
              const updates = {};
              updates['users/' + user.uid + '/balance'] = userData.balance - amount;
              updates['users/' + user.uid + '/xp'] = (userData.xp || 0) + amount * 0.1;
              updates['users/' + targetUid + '/balance'] = firebase.database.ServerValue.increment(amount);
              updates['users/' + targetUid + '/xp'] = firebase.database.ServerValue.increment(amount * 0.1);
              updates['users/' + user.uid + '/transactions/' + transactionId] = {
                id: transactionId,
                type: 'transfer_out',
                amount,
                target: targetUsername,
                date: now.toISOString().split('T')[0],
                time: now.toTimeString().split(' ')[0]
              };
              updates['users/' + targetUid + '/transactions/' + transactionId] = {
                id: transactionId,
                type: 'transfer_in',
                amount,
                target: user.username,
                date: now.toISOString().split('T')[0],
                time: now.toTimeString().split(' ')[0]
              };
              firebase.database().ref().update(updates)
                .then(() => {
                  addAchievement(user.uid, 'Transferência Enviada', `${amount} FIT$ enviados para ${targetUsername}.`);
                  showToast(`${amount} FIT$ enviado para ${targetUsername}!`);
                  setTimeout(() => loadDashboard(user.uid), 600);
                });
            });
        })
        .catch(err => {
          showToast('Erro ao transferir: ' + err.message);
          console.error('Erro ao transferir:', err.message);
        });
      break;
  }
}

function updateUserBalance(uid, amount) {
  console.log('Atualizando saldo para UID:', uid, 'Valor:', amount);
  const ref = firebase.database().ref('users/' + uid);
  ref.transaction(user => {
    if (user) {
      user.balance += amount;
      user.xp = (user.xp || 0) + Math.abs(amount) * 0.1;
      user.level = Math.floor(user.xp / 100) + 1;
    }
    return user;
  }).catch(err => {
    showToast('Erro ao atualizar saldo: ' + err.message);
    console.error('Erro ao atualizar saldo:', err.message);
  });
}

function addTransaction(uid, type, amount, target = null) {
  console.log('Adicionando transação:', type, 'Valor:', amount, 'UID:', uid);
  const transaction = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0],
    type,
    amount,
    target
  };
  firebase.database().ref('users/' + uid + '/transactions').push(transaction)
    .catch(err => {
      showToast('Erro ao salvar transação: ' + err.message);
      console.error('Erro ao salvar transação:', err.message);
    });
}

function getCurrentUser() {
  const uid = localStorage.getItem('currentUser');
  if (!uid) return null;
  let userData = null;
  firebase.database().ref('users/' + uid).once('value')
    .then(snapshot => {
      userData = snapshot.val();
    })
    .catch(error => {
      showToast('Erro ao buscar usuário: ' + error.message);
      console.error('Erro ao buscar usuário:', error.message);
    });
  return userData ? { uid, ...userData } : null;
}
