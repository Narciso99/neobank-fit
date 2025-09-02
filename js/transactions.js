function showTransactionModal(type) {
  const user = getCurrentUser();
  if (!user) return;

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
      <h3 class="text-xl font-bold mb-4">Transferir</h3>
      <div class="input-group">
        <label>Destinatário</label>
        <input type="text" id="targetUser" placeholder="alice" class="w-full p-3 rounded-xl border" />
      </div>
      <div class="input-group">
        <label>Valor (FIT$)</label>
        <input type="number" id="amount" placeholder="100" class="w-full p-3 rounded-xl border" />
      </div>
      <button onclick="confirmTransaction('transfer')" class="btn btn-primary w-full">Enviar</button>
    `
  }[type];

  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="container fade-in">
      <div class="card slide-up">
        ${modalHTML}
        <button onclick="loadDashboard('${user.username}')" class="btn btn-secondary w-full mt-3">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function confirmTransaction(type) {
  const user = getCurrentUser();
  const amountInput = document.getElementById('amount');
  if (!amountInput) return;
  const amount = parseFloat(amountInput.value);

  if (!amount || amount <= 0) {
    alert('Valor inválido.');
    return;
  }

  switch (type) {
    case 'deposit':
      updateUserBalance(user.username, amount);
      addTransaction(user.username, 'deposit', amount);
      addAchievement(user.username, 'Depósito Feito', `+${amount} FIT$ depositados.`);
      showToast(`+${amount} FIT$ depositado!`);
      break;

    case 'withdraw':
      db.ref('users/' + user.username).once('value')
        .then(snapshot => {
          const userData = snapshot.val();
          if (!userData || userData.balance < amount) {
            alert('Saldo insuficiente.');
            return;
          }
          updateUserBalance(user.username, -amount);
          addTransaction(user.username, 'withdraw', amount);
          addAchievement(user.username, 'Primeiro Saque', 'Você fez seu primeiro saque!');
          showToast(`-${amount} FIT$ sacado!`);
        })
        .catch(showFirebaseError);
      break;

    case 'transfer':
      const targetInput = document.getElementById('targetUser');
      if (!targetInput) return;
      const target = targetInput.value.trim();

      if (!target) {
        alert('Informe o destinatário.');
        return;
      }

      if (target === user.username) {
        alert('Você não pode transferir para si mesmo.');
        return;
      }

      db.ref('users/' + target).once('value')
        .then(snapshot => {
          if (!snapshot.exists()) {
            alert('Usuário não encontrado.');
            return;
          }

          db.ref('users/' + user.username).once('value')
            .then(userSnap => {
              const userData = userSnap.val();
              if (userData.balance < amount) {
                alert('Saldo insuficiente.');
                return;
              }

              updateUserBalance(user.username, -amount);
              updateUserBalance(target, amount);
              addTransaction(user.username, 'transfer_out', amount, target);
              addTransaction(target, 'transfer_in', amount, user.username);
              addAchievement(user.username, 'Transferência Enviada', `${amount} FIT$ enviados para ${target}.`);
              showToast(`${amount} FIT$ enviado para ${target}!`);
            });
        })
        .catch(showFirebaseError);
      break;
  }

  setTimeout(() => loadDashboard(user.username), 600);
}

function updateUserBalance(username, amount) {
  const ref = db.ref('users/' + username);
  ref.transaction(user => {
    if (user) {
      user.balance += amount;
      user.xp = (user.xp || 0) + amount * 0.1;
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
  const username = localStorage.getItem('currentUser');
  return username ? { username } : null;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

function showFirebaseError(err) {
  console.error('Erro Firebase:', err);
  alert('Erro de conexão: ' + err.message);
}