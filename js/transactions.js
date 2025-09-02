/**
 * transactions.js - Transações bancárias
 */

function showTransactionModal(type) {
  const user = getCurrentUser();
  if (!user) return;

  const modalHTML = {
    deposit: `
      <h3>Depositar</h3>
      <input type="number" id="amount" placeholder="100" class="w-full p-3 border rounded-xl my-3" />
      <button onclick="confirmTransaction('deposit')" class="btn btn-primary w-full">Confirmar</button>
    `,
    withdraw: `
      <h3>Sacar</h3>
      <input type="number" id="amount" placeholder="50" class="w-full p-3 border rounded-xl my-3" />
      <button onclick="confirmTransaction('withdraw')" class="btn btn-primary w-full">Confirmar</button>
    `,
    transfer: `
      <h3>Transferir</h3>
      <input type="text" id="targetUser" placeholder="destinatário" class="w-full p-3 border rounded-xl my-2" />
      <input type="number" id="amount" placeholder="100" class="w-full p-3 border rounded-xl my-2" />
      <button onclick="confirmTransaction('transfer')" class="btn btn-primary w-full">Enviar</button>
    `
  }[type];

  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="container">
      <div class="card">${modalHTML}</div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-secondary mt-3">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function confirmTransaction(type) {
  const user = getCurrentUser();
  const amount = parseFloat(document.getElementById('amount').value);

  if (!amount || amount <= 0) {
    alert('Valor inválido.');
    return;
  }

  switch (type) {
    case 'deposit':
      updateUserBalance(user.username, amount);
      addTransaction(user.username, 'deposit', amount);
      showToast(`+${amount} FIT$ depositado!`);
      break;

    case 'withdraw':
      db.ref('users/' + user.username).once('value').then(snap => {
        if (snap.val().balance < amount) {
          alert('Saldo insuficiente.');
          return;
        }
        updateUserBalance(user.username, -amount);
        addTransaction(user.username, 'withdraw', amount);
        showToast(`-${amount} FIT$ sacado!`);
      });
      break;

    case 'transfer':
      const target = document.getElementById('targetUser').value.trim();
      if (!target) {
        alert('Informe o destinatário.');
        return;
      }

      db.ref('users/' + target).once('value').then(snap => {
        if (!snap.exists()) {
          alert('Usuário não encontrado.');
          return;
        }

        db.ref('users/' + user.username).once('value').then(userSnap => {
          if (userSnap.val().balance < amount) {
            alert('Saldo insuficiente.');
            return;
          }

          updateUserBalance(user.username, -amount);
          updateUserBalance(target, amount);
          addTransaction(user.username, 'transfer_out', amount, target);
          addTransaction(target, 'transfer_in', amount, user.username);
          showToast(`${amount} FIT$ enviado para ${target}!`);
        });
      });
      break;
  }

  setTimeout(() => loadDashboard(user.username), 500);
}

function updateUserBalance(username, amount) {
  const ref = db.ref('users/' + username);
  ref.transaction(user => {
    if (user) user.balance += amount;
    return user;
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
  db.ref('users/' + username + '/transactions').push(transaction);
}

function getCurrentUser() {
  return { username: localStorage.getItem('currentUser') };
}
