/**
 * dashboard.js - NeoBank OS
 * Tela principal com todas as funções integradas e notificações
 */

let currentUser = null;

function loadDashboard(username) {
  currentUser = username;
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    showLoginScreen();
    return;
  }

  app.innerHTML = '<div class="container"><div class="skeleton skeleton--card"></div></div>';

  const userRef = db.ref('users/' + username);
  userRef.on('value', (snapshot) => {
    const user = snapshot.val();
    if (!user) {
      console.error('Usuário não encontrado no Firebase:', username);
      showToast('❌ Usuário não encontrado. Faça login novamente.');
      userRef.off();
      showLoginScreen();
      return;
    }

    user.level = Math.floor((user.xp || 0) / 100) + 1;
    renderDashboard(user, username);
    console.log('Dashboard carregado para:', username);
  }, (error) => {
    console.error('Erro ao carregar dados do usuário:', error);
    showToast('❌ Erro ao carregar dados: ' + error.message);
    app.innerHTML = '<div class="container"><div class="card text-center"><p class="text-muted">Erro ao carregar. Tente novamente.</p></div></div>';
  });
}

function renderDashboard(user, username) {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    return;
  }

  const transactions = Object.values(user.transactions || {}).slice(-5).reverse();
  const transactionItems = transactions.length ? transactions.map(t => {
    const icons = {
      deposit: 'plus-circle badge--success',
      withdraw: 'minus-circle badge--danger',
      pix_in: 'qr-code badge--success',
      pix_out: 'qr-code badge--warning',
      investment_gain: 'trending-up badge--success'
    }[t.type] || 'circle';

    const label = {
      deposit: `+${t.amount} OSD`,
      withdraw: `-${t.amount} OSD`,
      pix_in: `+${t.amount} (Pix) ← ${t.target}`,
      pix_out: `-${t.amount} (Pix) → ${t.target}`,
      investment_gain: `💰 +${t.amount.toFixed(2)} OSD de investimento`
    }[t.type] || 'Transação';

    return `
      <li class="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700">
        <i data-lucide="${icons.split(' ')[0]}" class="w-5 h-5 ${icons}"></i>
        <div class="flex-1">
          <p class="text-sm font-medium">${label}</p>
          <p class="text-xs text-muted">${t.date}</p>
        </div>
      </li>
    `;
  }).join('') : '<li class="text-muted text-center py-2">Nenhuma transação</li>';

  app.innerHTML = `
    <header class="header">
      <div class="flex items-center gap-3">
        <img src="${user.avatar}" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-blue-300 shadow-sm" />
        <div>
          <h2 class="text-lg">Olá, ${user.username}!</h2>
          <p class="text-sm text-muted">Nível ${user.level}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button id="btnHelp" title="Ajuda" class="btn btn--ghost"><i data-lucide="help-circle" class="w-5 h-5"></i></button>
        <button id="btnLogout" title="Sair" class="btn btn--ghost"><i data-lucide="log-out" class="w-5 h-5"></i></button>
      </div>
    </header>

    <main class="container">
      <div class="card text-center">
        <p class="text-muted">Saldo disponível</p>
        <p class="balance-display">${user.balance.toFixed(2)} <span class="osd">OSD</span></p>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-6">
        <button onclick="showTransactionModal('withdraw')" class="btn btn--secondary py-4">
          <i data-lucide="minus-circle" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Sacar</span>
        </button>
        <button onclick="showPixScreen()" class="btn btn--secondary py-4">
          <i data-lucide="qr-code" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Pix</span>
        </button>
        <button onclick="showCardScreen('${username}')" class="btn btn--secondary py-4">
          <i data-lucide="credit-card" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Cartão</span>
        </button>
        <button onclick="showInvestmentsScreen()" class="btn btn--secondary py-4">
          <i data-lucide="trending-up" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Investir</span>
        </button>
        <button onclick="showAchievementsScreen('${username}')" class="btn btn--secondary py-4">
          <i data-lucide="award" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Conquistas</span>
        </button>
        <button onclick="showGamesScreen('${username}')" class="btn btn--secondary py-4">
          <i data-lucide="gamepad" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Jogos</span>
        </button>
      </div>

      <div class="card">
        <h3 class="font-semibold mb-3">Ganhe OSD Jogando 🎮</h3>
        <p class="text-sm text-muted mb-3">Jogue, ganhe OSD e resgate com código</p>
        <button onclick="showGamesScreen('${username}')" class="btn btn--primary w-full mb-2">Jogar e Ganhar OSD</button>
        <button onclick="showRedemptionModal('${username}')" class="btn btn--secondary w-full">Resgatar Código</button>
      </div>

      <div class="card">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold">Últimas Transações</h3>
          <button onclick="showFullTransactions('${username}')" class="text-primary text-sm">Ver tudo</button>
        </div>
        <ul id="transactionList" class="space-y-2">
          ${transactionItems}
        </ul>
      </div>
    </main>
  `;

  setTimeout(() => lucide.createIcons(), 100);

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.onclick = () => {
      db.ref('users/' + currentUser).off();
      localStorage.removeItem('currentUser');
      showToast('✅ Até logo!');
      setTimeout(showLoginScreen, 500);
    };
  }

  const btnHelp = document.getElementById('btnHelp');
  if (btnHelp) {
    btnHelp.onclick = () => {
      showToast('ℹ️ NeoBank OS: App bancário fictício para fins educativos.');
      alert('NeoBank OS\n\nApp bancário fictício com jogos e investimentos.\n\nApenas para fins educativos.');
    };
  }
}

function showTransactionModal(type) {
  const isWithdraw = type === 'withdraw';
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    return;
  }

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">${isWithdraw ? 'Sacar' : 'Depositar'} OSD</h3>
        <div class="input-group">
          <label for="amount" class="field__label">Valor (OSD)</label>
          <input type="number" id="amount" placeholder="0.00" step="0.01" class="input w-full" />
        </div>
        <p id="transaction-error" class="field__error hidden"></p>
        <button onclick="processTransaction('${type}', '${currentUser}', document.getElementById('amount').value, (success) => { if (success) setTimeout(() => loadDashboard('${currentUser}'), 1000); })" class="btn btn--primary w-full mt-3">${isWithdraw ? 'Sacar' : 'Depositar'}</button>
        <button onclick="loadDashboard('${currentUser}')" class="btn btn--ghost w-full mt-2">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function showPixScreen() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    return;
  }

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Pix</h3>
        <div class="input-group">
          <label for="pix-target" class="field__label">Destinatário</label>
          <input type="text" id="pix-target" placeholder="Nome de usuário" class="input w-full" />
        </div>
        <div class="input-group">
          <label for="pix-amount" class="field__label">Valor (OSD)</label>
          <input type="number" id="pix-amount" placeholder="0.00" step="0.01" class="input w-full" />
        </div>
        <p id="pix-error" class="field__error hidden"></p>
        <button onclick="processPix('${currentUser}', document.getElementById('pix-target').value, document.getElementById('pix-amount').value, (success) => { if (success) setTimeout(() => loadDashboard('${currentUser}'), 1000); })" class="btn btn--primary w-full mt-3">Enviar Pix</button>
        <button onclick="loadDashboard('${currentUser}')" class="btn btn--ghost w-full mt-2">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function showRedemptionModal(username) {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    return;
  }

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Resgatar Código de Jogo</h3>
        <p class="text-sm text-muted mb-4">Digite o código gerado nos jogos para adicionar OSD à sua conta.</p>
        <div class="input-group">
          <label for="redeemCode" class="field__label">Código de Resgate</label>
          <input type="text" id="redeemCode" placeholder="OSD-ALICE-123456789" class="input w-full" />
        </div>
        <p id="redeem-error" class="field__error hidden"></p>
        <button onclick="redeemCode('${username}')" class="btn btn--primary w-full mt-3">Resgatar</button>
        <button onclick="loadDashboard('${username}')" class="btn btn--ghost w-full mt-2">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function redeemCode(username) {
  const codeInput = document.getElementById('redeemCode');
  const error = document.getElementById('redeem-error');
  if (!codeInput || !error) {
    console.error('Elementos de resgate não encontrados.');
    showToast('❌ Erro interno: formulário de resgate inválido.');
    return;
  }

  const code = codeInput.value.trim();
  if (!code) {
    error.textContent = 'Digite um código.';
    error.classList.remove('hidden');
    showToast('❌ Digite um código.');
    return;
  }

  error.classList.add('hidden');

  db.ref('redemption_codes/' + code).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (!data) {
        error.textContent = 'Código inválido.';
        error.classList.remove('hidden');
        showToast('❌ Código inválido.');
        return;
      }
      if (data.used) {
        error.textContent = 'Código já usado.';
        error.classList.remove('hidden');
        showToast('❌ Código já usado.');
        return;
      }
      if (data.username !== username) {
        error.textContent = 'Este código não pertence a você.';
        error.classList.remove('hidden');
        showToast('❌ Este código não pertence a você.');
        return;
      }

      updateUserBalance(username, data.amount);
      addTransaction(username, 'deposit', data.amount, 'Código de Jogo');
      db.ref('redemption_codes/' + code).update({ used: true });
      showToast(`✅ +${data.amount.toFixed(2)} OSD resgatados!`);
      setTimeout(() => loadDashboard(username), 1000);
    })
    .catch(err => {
      console.error('Erro ao resgatar código:', err);
      showToast('❌ Erro ao resgatar código: ' + err.message);
    });
}

function showFullTransactions(username) {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    return;
  }

  db.ref('users/' + username).once('value')
    .then(snapshot => {
      const user = snapshot.val();
      const allTrans = Object.values(user.transactions || {}).reverse();
      const html = `
        <div class="container">
          <div class="header">
            <h2>Todas as Transações</h2>
          </div>
          <div class="card">
            ${allTrans.length ? allTrans.map(t => {
              const icons = {
                deposit: 'plus-circle badge--success',
                withdraw: 'minus-circle badge--danger',
                pix_in: 'qr-code badge--success',
                pix_out: 'qr-code badge--warning',
                investment_gain: 'trending-up badge--success'
              }[t.type] || 'circle';

              const label = {
                deposit: `+${t.amount} OSD (Depósito)`,
                withdraw: `-${t.amount} OSD (Saque)`,
                pix_in: `+${t.amount} OSD (Pix recebido de ${t.target})`,
                pix_out: `-${t.amount} OSD (Pix enviado para ${t.target})`,
                investment_gain: `+${t.amount.toFixed(2)} OSD (Ganho de investimento)`
              }[t.type] || 'Transação desconhecida';

              return `
                <div class="py-2 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                  <i data-lucide="${icons.split(' ')[0]}" class="w-5 h-5 ${icons}"></i>
                  <div class="flex-1">
                    <p class="text-sm font-medium">${label}</p>
                    <p class="text-xs text-muted">${t.date} - ${t.time}</p>
                  </div>
                </div>
              `;
            }).join('') : '<p class="text-muted text-center py-4">Nenhuma transação encontrada</p>'}
          </div>
          <button onclick="loadDashboard('${username}')" class="btn btn--ghost mt-4 w-full">Voltar</button>
        </div>
      `;
      app.innerHTML = html;
      setTimeout(() => lucide.createIcons(), 100);
    })
    .catch(err => {
      console.error('Erro ao carregar transações:', err);
      showToast('❌ Erro ao carregar transações: ' + err.message);
    });
}
