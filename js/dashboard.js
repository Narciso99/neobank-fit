/**
 * dashboard.js - NeoBank OS
 * Gerencia a tela principal do dashboard com suporte a notificações
 */

function loadDashboard(username) {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro ao carregar dashboard.');
    return;
  }

  db.ref('users/' + username).once('value')
    .then(snapshot => {
      const userData = snapshot.val() || {};
      const balance = userData.balance || 0;
      const xp = userData.xp || 0;
      const level = userData.level || 1;
      const avatar = userData.avatar || 'https://api.dicebear.com/9.x/thumbs/svg?seed=' + username;
      const transactions = userData.transactions || {};

      app.innerHTML = `
        <div class="container">
          <div class="header">
            <h2>NeoBank OS</h2>
          </div>
          <div class="card text-center mb-4">
            <img src="${avatar}" alt="Avatar" class="w-16 h-16 rounded-full mx-auto mb-2" />
            <p class="text-lg font-semibold">${username}</p>
            <p class="text-muted">Nível ${level} | ${xp} XP</p>
            <p class="balance-display" id="balance-display">${balance.toFixed(2)} <span class="osd">OSD</span></p>
          </div>
          <div class="card">
            <h3>Transferir</h3>
            <div class="input-group">
              <label for="transfer-to">Destinatário</label>
              <input type="text" id="transfer-to" placeholder="Nome de usuário" class="w-full" />
            </div>
            <div class="input-group">
              <label for="transfer-amount">Valor (OSD)</label>
              <input type="number" id="transfer-amount" placeholder="0.00" step="0.01" class="w-full" />
            </div>
            <p id="transfer-error" class="text-sm text-red-500 mt-1 hidden"></p>
            <button onclick="transfer('${username}')" class="btn btn-primary w-full mt-4">Transferir</button>
          </div>
          <div class="card">
            <h3>Histórico de Transações</h3>
            <div id="transaction-list"></div>
          </div>
          <button onclick="receiveReward('${username}')" class="btn btn-secondary w-full mt-4">Receber Recompensa</button>
          <button onclick="showInvestmentsScreen()" class="btn btn-ghost w-full mt-2">Investimentos</button>
          <button onclick="logout()" class="btn btn-ghost w-full mt-2">Sair</button>
        </div>
      `;

      // Render transaction list
      renderTransactions(transactions);
      setTimeout(() => lucide.createIcons(), 100);
    })
    .catch(err => {
      showToast('❌ Erro ao carregar dashboard: ' + err.message);
      console.error('Erro ao carregar dashboard:', err);
    });
}

function renderTransactions(transactions) {
  const transactionList = document.getElementById('transaction-list');
  if (!transactionList) return;

  const transactionArray = Object.entries(transactions).map(([key, t]) => ({
    key,
    ...t,
  }));

  if (transactionArray.length === 0) {
    transactionList.innerHTML = '<p class="text-muted text-center">Nenhum registro de transação.</p>';
    return;
  }

  transactionList.innerHTML = transactionArray
    .map(t => `
      <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
        <div>
          <p class="font-medium">${t.type === 'transfer' ? 'Transferência' : t.type === 'investment_gain' ? 'Retorno de Investimento' : 'Recompensa'}</p>
          <p class="text-sm text-muted">${t.description}</p>
          <p class="text-sm text-muted">${new Date(t.timestamp).toLocaleString()}</p>
        </div>
        <p class="${t.amount >= 0 ? 'text-green-600' : 'text-red-600'} font-semibold">
          ${t.amount >= 0 ? '+' : ''}${t.amount.toFixed(2)} OSD
        </p>
      </div>
    `)
    .join('');
}

function transfer(username) {
  const toInput = document.getElementById('transfer-to');
  const amountInput = document.getElementById('transfer-amount');
  const error = document.getElementById('transfer-error');
  const to = toInput ? toInput.value.trim() : '';
  const amount = amountInput ? parseFloat(amountInput.value) : 0;

  if (!to || !amount || amount <= 0) {
    error.textContent = 'Preencha o destinatário e um valor válido.';
    error.classList.remove('hidden');
    showToast('❌ Preencha o destinatário e um valor válido.');
    return;
  }

  error.classList.add('hidden');

  // Check if recipient exists
  db.ref('users/' + to).once('value')
    .then(snapshot => {
      if (!snapshot.exists()) {
        error.textContent = 'Destinatário não encontrado.';
        error.classList.remove('hidden');
        showToast('❌ Destinatário não encontrado.');
        return;
      }

      // Check sender's balance
      db.ref('users/' + username + '/balance').once('value')
        .then(snapshot => {
          const balance = snapshot.val() || 0;
          if (balance < amount) {
            error.textContent = 'Saldo insuficiente.';
            error.classList.remove('hidden');
            showToast('❌ Saldo insuficiente.');
            return;
          }

          // Perform transfer
          db.ref('users/' + username + '/balance').transaction(balance => balance - amount)
            .then(() => {
              db.ref('users/' + to + '/balance').transaction(balance => (balance || 0) + amount)
                .then(() => {
                  // Record transaction for sender
                  addTransaction(username, 'transfer', -amount, `Transferência para ${to}`);
                  // Record transaction for recipient
                  addTransaction(to, 'transfer', amount, `Transferência de ${username}`);
                  showToast(`✅ Transferência de ${amount.toFixed(2)} OSD para ${to} realizada!`);
                  // Update balance display
                  const balanceDisplay = document.getElementById('balance-display');
                  if (balanceDisplay) {
                    db.ref('users/' + username + '/balance').once('value').then(snap => {
                      balanceDisplay.innerHTML = `${snap.val().toFixed(2)} <span class="osd">OSD</span>`;
                    });
                  }
                })
                .catch(err => {
                  showToast('❌ Erro ao processar transferência: ' + err.message);
                  console.error('Erro ao processar transferência:', err);
                });
            })
            .catch(err => {
              showToast('❌ Erro ao processar transferência: ' + err.message);
              console.error('Erro ao processar transferência:', err);
            });
        })
        .catch(err => {
          showToast('❌ Erro ao verificar saldo: ' + err.message);
          console.error('Erro ao verificar saldo:', err);
        });
    })
    .catch(err => {
      showToast('❌ Erro ao verificar destinatário: ' + err.message);
      console.error('Erro ao verificar destinatário:', err);
    });
}

function addTransaction(username, type, amount, description) {
  db.ref('users/' + username + '/transactions').push({
    type,
    amount,
    description,
    timestamp: Date.now(),
  }).then(() => {
    // Refresh transaction list
    db.ref('users/' + username + '/transactions').once('value')
      .then(snapshot => {
        renderTransactions(snapshot.val() || {});
      })
      .catch(err => {
        console.error('Erro ao atualizar transações:', err);
      });
  }).catch(err => {
    showToast('❌ Erro ao registrar transação: ' + err.message);
    console.error('Erro ao registrar transação:', err);
  });
}

function receiveReward(username) {
  const reward = 10 + Math.floor(Math.random() * 90); // Random reward between 10 and 100 OSD
  db.ref('users/' + username + '/balance').transaction(balance => (balance || 0) + reward)
    .then(() => {
      db.ref('users/' + username + '/xp').transaction(xp => (xp || 0) + 10)
        .then(() => {
          addTransaction(username, 'reward', reward, 'Recompensa Diária');
          showToast(`✅ Recompensa de ${reward.toFixed(2)} OSD recebida! +10 XP`);
          // Update balance and XP display
          const balanceDisplay = document.getElementById('balance-display');
          if (balanceDisplay) {
            db.ref('users/' + username + '/balance').once('value').then(snap => {
              balanceDisplay.innerHTML = `${snap.val().toFixed(2)} <span class="osd">OSD</span>`;
            });
          }
        })
        .catch(err => {
          showToast('❌ Erro ao adicionar XP: ' + err.message);
          console.error('Erro ao adicionar XP:', err);
        });
    })
    .catch(err => {
      showToast('❌ Erro ao receber recompensa: ' + err.message);
      console.error('Erro ao receber recompensa:', err);
    });
}

function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('theme');
  showToast('✅ Sessão encerrada.');
  showLoginScreen();
}
