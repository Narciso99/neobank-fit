/**
 * dashboard.js - NeoBank OS
 * Tela principal completa com Jogos, Investimentos, Resgate por Código e OSD
 */

let currentUser = null;

/**
 * Carrega o dashboard com escuta em tempo real do Firebase
 */
function loadDashboard(username) {
  currentUser = username;

  const userRef = db.ref('users/' + username);
  userRef.on('value', (snapshot) => {
    const user = snapshot.val();

    if (!user) {
      showToast('Usuário não encontrado.');
      showLoginScreen();
      return;
    }

    // Atualiza nível com base no XP
    user.level = Math.floor((user.xp || 0) / 100) + 1;

    // Renderiza a interface
    renderDashboard(user, username);
  }, (error) => {
    console.error('Erro ao carregar dados do usuário:', error);
    showToast('Erro ao carregar dados.');
  });
}

/**
 * Renderiza a interface completa do dashboard
 */
function renderDashboard(user, username) {
  const app = document.getElementById('app');
  if (!app) return;

  // Transações recentes
  const transactions = Object.values(user.transactions || {}).slice(-5).reverse();
  const transactionItems = transactions.length ? transactions.map(t => {
    const icons = {
      deposit: 'plus-circle text-green-500',
      withdraw: 'minus-circle text-red-500',
      pix_in: 'qr-code text-blue-500',
      pix_out: 'qr-code text-orange-500',
      investment_gain: 'trending-up text-purple-500'
    }[t.type] || 'circle';

    const label = {
      deposit: `+${t.amount} OSD`,
      withdraw: `-${t.amount} OSD`,
      pix_in: `+${t.amount} (Pix) ← ${t.target}`,
      pix_out: `-${t.amount} (Pix) → ${t.target}`,
      investment_gain: `💰 +${t.amount.toFixed(2)} OSD de investimento`
    }[t.type] || t.type;

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

  // HTML do Dashboard
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
        <button id="btnHelp" title="Ajuda"><i data-lucide="help-circle" class="w-5 h-5 text-primary"></i></button>
        <button id="btnLogout" title="Sair"><i data-lucide="log-out" class="w-5 h-5"></i></button>
      </div>
    </header>

    <main class="container">

      <!-- Saldo Principal -->
      <div class="card text-center">
        <p class="text-muted">Saldo disponível</p>
        <p class="balance-display">${user.balance.toFixed(2)} <span class="osd">OSD</span></p>
      </div>

      <!-- Ações Rápidas -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <button onclick="showTransactionModal('withdraw')" class="btn btn-secondary py-4">
          <i data-lucide="minus-circle" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Sacar</span>
        </button>
        <button onclick="showPixScreen()" class="btn btn-secondary py-4">
          <i data-lucide="qr-code" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Pix</span>
        </button>
        <button onclick="showCardScreen()" class="btn btn-secondary py-4">
          <i data-lucide="credit-card" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Cartão</span>
        </button>
        <button onclick="showInvestmentsScreen()" class="btn btn-secondary py-4">
          <i data-lucide="trending-up" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Investir</span>
        </button>
      </div>

      <!-- Jogos e Resgate -->
      <div class="card">
        <h3 class="font-semibold mb-3">Ganhe OSD Jogando 🎮</h3>
        <p class="text-sm text-muted mb-3">Jogue, ganhe OSD e resgate com código</p>
        <button onclick="showGamesScreen()" class="btn btn-primary w-full mb-2">Jogar e Ganhar OSD</button>
        <button onclick="showRedemptionModal('${username}')" class="btn btn-secondary w-full">Resgatar Código</button>
      </div>

      <!-- Histórico -->
      <div class="card">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold">Últimas Transações</h3>
          <button onclick="showFullTransactions('${username}')" class="text-primary text-sm">Ver tudo</button>
        </div>
        <ul id="transactionList" class="space-y-2">
          ${transactionItems}
        </ul>
      </div>

      <!-- Botão flutuante de tema -->
      <button id="theme-toggle" class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
        <i data-lucide="sun" class="w-6 h-6"></i>
      </button>

    </main>
  `;

  // Inicializa ícones
  setTimeout(() => lucide.createIcons(), 200);

  // Eventos
  document.getElementById('btnLogout').onclick = () => {
    db.ref('users/' + currentUser).off();
    localStorage.removeItem('currentUser');
    showToast('Até logo!');
    setTimeout(showLoginScreen, 500);
  };

  document.getElementById('btnHelp').onclick = () => {
    alert('NeoBank OS\n\nApp de simulação bancária com jogos e investimentos.\n\nApenas para fins educativos.');
  };

  // Botão flutuante de tema
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    icon.setAttribute('data-lucide', document.documentElement.classList.contains('dark') ? 'moon' : 'sun');
    lucide.createIcons();
  };

  lucide.createIcons();

  // Renderiza transações
  renderTransactions(user.transactions || []);
}

/**
 * Renderiza a lista de transações
 */
function renderTransactions(transactions) {
  const list = document.getElementById('transactionList');
  if (!list) return;

  const recent = Object.values(transactions || {}).slice(-5).reverse();
  list.innerHTML = recent.length ? recent.map(t => {
    const icons = {
      deposit: 'plus-circle text-green-500',
      withdraw: 'minus-circle text-red-500',
      pix_in: 'qr-code text-blue-500',
      pix_out: 'qr-code text-orange-500',
      investment_gain: 'trending-up text-purple-500'
    }[t.type] || 'circle';

    const label = {
      deposit: `+${t.amount} OSD`,
      withdraw: `-${t.amount} OSD`,
      pix_in: `+${t.amount} (Pix) ← ${t.target}`,
      pix_out: `-${t.amount} (Pix) → ${t.target}`,
      investment_gain: `💰 +${t.amount.toFixed(2)} OSD`
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

  setTimeout(() => lucide.createIcons(), 100);
}

/**
 * Mostra modal para resgatar código
 */
function showRedemptionModal(username) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Resgatar Código de Jogo</h3>
        <p class="text-sm text-muted mb-4">Digite o código gerado nos jogos para adicionar OSD à sua conta.</p>
        <div class="input-group">
          <label>Código de Resgate</label>
          <input type="text" id="redeemCode" placeholder="OSD-ALICE-123456789" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="redeemCode('${username}')" class="btn btn-primary w-full mt-3">Resgatar</button>
        <button onclick="loadDashboard('${username}')" class="btn btn-ghost w-full mt-2">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

/**
 * Resgata um código de jogo
 */
function redeemCode(username) {
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
        alert('Código inválido.');
        return;
      }
      if (data.used) {
        alert('Código já usado.');
        return;
      }
      if (data.username !== username) {
        alert('Este código não pertence a você.');
        return;
      }

      // Atualiza saldo
      updateUserBalance(username, data.amount);
      addTransaction(username, 'deposit', data.amount, 'Código de Jogo');

      // Marca como usado
      db.ref('redemption_codes/' + code).update({ used: true });

      showToast(`+${data.amount} OSD resgatados!`);
      setTimeout(() => loadDashboard(username), 1000);
    })
    .catch(err => {
      alert('Erro: ' + err.message);
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
 * Adiciona transação
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
 * Mostra todas as transações
 */
function showFullTransactions(username) {
  db.ref('users/' + username).once('value').then(snapshot => {
    const user = snapshot.val();
    const allTrans = Object.values(user.transactions || {}).reverse();
    const html = `
      <div class="container">
        <div class="header">
          <h2>Todas as Transações</h2>
        </div>
        <div class="card">
          ${allTrans.length ? allTrans.map(t => `
            <div class="py-2 border-b">
              <p><strong>${t.type}:</strong> ${t.amount} OSD</p>
              <p class="text-sm text-muted">${t.date} - ${t.time}</p>
            </div>
          `).join('') : '<p class="text-muted">Nenhuma transação</p>'}
        </div>
        <button onclick="loadDashboard('${username}')" class="btn btn-ghost mt-4">Voltar</button>
      </div>
    `;
    document.getElementById('app').innerHTML = html;
    setTimeout(() => lucide.createIcons(), 100);
  });
}
