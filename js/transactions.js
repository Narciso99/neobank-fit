/**
 * transactions.js - NeoBank OS
 * Sistema de transações: saque, transferência e depósito via código de resgate
 */

/**
 * Abre o modal de transação
 */
function showTransactionModal(type) {
  const user = getCurrentUser();
  if (!user) return;

  let modalHTML = '';

  switch (type) {
    case 'deposit':
      modalHTML = `
        <h3 class="text-xl font-bold mb-4">Depositar OSD</h3>
        <p class="text-sm text-muted mb-4">Depósitos diretos não são permitidos.</p>
        <p class="text-sm text-muted mb-4">Ganhe OSD jogando e resgate com código.</p>
        <button onclick="showGamesScreen()" class="btn btn-primary w-full mb-3">Jogar e Ganhar OSD</button>
        <button onclick="showRedemptionModal()" class="btn btn-secondary w-full">Resgatar Código</button>
      `;
      break;

    case 'withdraw':
      modalHTML = `
        <h3 class="text-xl font-bold mb-4">Sacar OSD</h3>
        <div class="input-group">
          <label>Valor (OSD)</label>
          <input type="number" id="amount" placeholder="50" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="confirmTransaction('withdraw')" class="btn btn-primary w-full mt-3">Sacar</button>
      `;
      break;

    case 'transfer':
      modalHTML = `
        <h3 class="text-xl font-bold mb-4">Transferir OSD</h3>
        <div class="input-group">
          <label>Destinatário</label>
          <input type="text" id="targetUser" placeholder="alice" class="w-full p-3 rounded-xl border" />
        </div>
        <div class="input-group">
          <label>Valor (OSD)</label>
          <input type="number" id="amount" placeholder="100" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="confirmTransaction('transfer')" class="btn btn-primary w-full mt-3">Enviar</button>
      `;
      break;
  }

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

/**
 * Confirma a transação
 */
function confirmTransaction(type) {
  const user = getCurrentUser();
  const amount = parseFloat(document.getElementById('amount').value);

  if (!amount || amount <= 0) {
    alert('Valor inválido.');
    return;
  }

  switch (type) {
    case 'withdraw':
      db.ref('users/' + user.username).once('value')
        .then(snapshot => {
          const userData = snapshot.val();
          if (userData.balance < amount) {
            alert('Saldo insuficiente.');
            return;
          }

          updateUserBalance(user.username, -amount);
          addTransaction(user.username, 'withdraw', amount);
          showToast(`-${amount} OSD sacado!`);
          setTimeout(() => loadDashboard(user.username), 500);
        });
      break;

    case 'transfer':
      const target = document.getElementById('targetUser').value.trim();
      if (!target) {
        alert('Informe o destinatário.');
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
              showToast(`${amount} OSD enviado para ${target}!`);
              setTimeout(() => loadDashboard(user.username), 1000);
            });
        });
      break;
  }
}

/**
 * Mostra o modal para resgatar código
 */
function showRedemptionModal() {
  const user = getCurrentUser();
  if (!user) return;

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Resgatar Código de Jogo</h3>
        <p class="text-sm text-muted mb-4">Digite o código gerado nos jogos para adicionar OSD à sua conta.</p>
        <div class="input-group">
          <label>Código de Resgate</label>
          <input type="text" id="redeemCode" placeholder="OSD-ALICE-123456789" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="redeemCode()" class="btn btn-primary w-full mt-3">Resgatar</button>
        <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost w-full mt-2">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

/**
 * Resgata um código de jogo
 */
function redeemCode() {
  const user = getCurrentUser();
  const codeInput = document.getElementById('redeemCode');
  const code = codeInput ? codeInput.value.trim() : '';

  if (!code) {
    alert('Digite um código.');
    return;
  }

  db.ref('redemption_codes/' + code).once('value')
    .then(snapshot => {
      const data = snapshot.val();

      if (!data) {
        alert('❌ Código inválido.');
        return;
      }

      if (data.used) {
        alert('❌ Este código já foi usado.');
        return;
      }

      if (data.username !== user.username) {
        alert('❌ Este código não pertence a você.');
        return;
      }

      // Atualiza saldo principal
      updateUserBalance(user.username, data.amount);
      addTransaction(user.username, 'deposit', data.amount, 'Código de Jogo');

      // Marca como usado
      db.ref('redemption_codes/' + code).update({ used: true });

      showToast(`✅ +${data.amount} OSD resgatados!`);
      setTimeout(() => loadDashboard(user.username), 1500);
    })
    .catch(err => {
      console.error('Erro ao resgatar código:', err);
      alert('Erro ao verificar código.');
    });
}

/**
 * Atualiza o saldo do usuário
 */
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

/**
 * Adiciona uma transação
 */
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

/**
 * Obtém o usuário atual
 */
function getCurrentUser() {
  const username = localStorage.getItem('currentUser');
  return username ? { username } : null;
}

/**
 * Mostra uma notificação
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}
