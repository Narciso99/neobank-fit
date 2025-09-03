// transactions.js
function showTransactionModal(type) {
  const user = getCurrentUser();
  if (!user) return;

  const modalHTML = {
    deposit: `
      <h3>Depositar OSD</h3>
      <p class="text-sm text-muted mb-2">Depósitos diretos não são permitidos. Jogue e resgate com código.</p>
      <button onclick="showGamesScreen()" class="btn btn-primary w-full">Jogar e Ganhar OSD</button>
    `,
    withdraw: `
      <h3>Sacar OSD</h3>
      <div class="input-group">
        <label>Valor (OSD)</label>
        <input type="number" id="amount" placeholder="50" class="w-full p-3 rounded-xl border" />
      </div>
      <button onclick="confirmTransaction('withdraw')" class="btn btn-primary w-full">Sacar</button>
    `,
    transfer: `
      <h3>Transferir OSD</h3>
      <div class="input-group">
        <label>Destinatário</label>
        <input type="text" id="targetUser" placeholder="alice" class="w-full p-3 rounded-xl border" />
      </div>
      <div class="input-group">
        <label>Valor (OSD)</label>
        <input type="number" id="amount" placeholder="100" class="w-full p-3 rounded-xl border" />
      </div>
      <button onclick="confirmTransaction('transfer')" class="btn btn-primary w-full">Enviar</button>
    `
  }[type];

  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="container">
      <div class="card">${modalHTML}</div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-3">Voltar</button>
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
    case 'withdraw':
      db.ref('users/' + user.username).once('value').then(snap => {
        const userData = snap.val();
        if (userData.balance < amount) {
          alert('Saldo insuficiente.');
          return;
        }
        updateUserBalance(user.username, -amount);
        addTransaction(user.username, 'withdraw', amount);
        showToast(`-${amount} OSD sacado!`);
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
          const userData = userSnap.val();
          if (userData.balance < amount) {
            alert('Saldo insuficiente.');
            return;
          }

          updateUserBalance(user.username, -amount);
          updateUserBalance(target, amount);
          addTransaction(user.username, 'transfer_out', amount, target);
          addTransaction(target, 'transfer_in', amount, user.username);
          showToast(`${amount} OSD enviado para ${target}!`);
        });
      });
      break;
  }

  setTimeout(() => loadDashboard(user.username), 500);
}

function updateUserBalance(username, amount) {
  const ref = db.ref('users/' + username);
  ref.transaction(user => {
    if (user) {
      user.balance += amount;
      user.xp += amount * 0.1;
      user.level = Math.floor(user.xp / 100) + 1;
    }
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

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}
