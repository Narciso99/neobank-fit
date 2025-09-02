/**
 * dashboard.js - NeoBank OS
 * Tela principal com suporte a OSD, Jogos, Investimentos, Pix, Dark Mode
 */

let currentUser = null;

/**
 * Carrega o dashboard com escuta em tempo real do Firebase
 */
function loadDashboard(username) {
  currentUser = username;

  // Referência ao usuário no Firebase
  const userRef = db.ref('users/' + username);

  // Escuta mudanças em tempo real
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

  // Gera lista de transações recentes
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
      investment_gain: `💰 +${t.amount} OSD de investimento`
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
        <button onclick="showTransactionModal('deposit')" class="btn btn-secondary py-4">
          <i data-lucide="plus-circle" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Depositar</span>
        </button>
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
      </div>

      <!-- Jogos e Investimentos -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <button onclick="showGamesScreen()" class="btn btn-secondary py-4">
          <i data-lucide="gamepad" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Jogos</span>
        </button>
        <button onclick="showInvestmentsScreen()" class="btn btn-secondary py-4">
          <i data-lucide="trending-up" class="w-5 h-5 mx-auto mb-1"></i>
          <span class="text-sm">Investir</span>
        </button>
      </div>

      <!-- Resumo Financeiro -->
      <div class="card">
        <h3 class="font-semibold mb-3">Resumo Financeiro</h3>
        <div class="space-y-3">
          <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span class="text-muted">Depósitos</span>
            <span>${getTotalByType(user.transactions, 'deposit').toFixed(2)} OSD</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span class="text-muted">Saques</span>
            <span>${getTotalByType(user.transactions, 'withdraw').toFixed(2)} OSD</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span class="text-muted">Pix Recebido</span>
            <span class="text-green-600 dark:text-green-400">+${getTotalByType(user.transactions, 'pix_in').toFixed(2)} OSD</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-muted">Investimentos</span>
            <span class="text-purple-600 dark:text-purple-400">+${getTotalByType(user.transactions, 'investment_gain').toFixed(2)} OSD</span>
          </div>
        </div>
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
      <button id="theme-toggle" class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105">
        <i data-lucide="sun" class="w-6 h-6"></i>
      </button>

    </main>
  `;

  // Inicializa ícones
  setTimeout(() => lucide.createIcons(), 200);

  // Eventos
  document.getElementById('btnLogout').onclick = () => {
    db.ref('users/' + currentUser).off(); // Para escuta
    localStorage.removeItem('currentUser');
    showToast('Até logo!');
    setTimeout(showLoginScreen, 500);
  };

  document.getElementById('btnHelp').onclick = () => {
    alert('NeoBank OS\n\nApp bancário fictício com jogos, investimentos e recompensas em OSD.');
  };

  // Botão flutuante de tema
  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    icon.setAttribute('data-lucide', document.documentElement.classList.contains('dark') ? 'moon' : 'sun');
    lucide.createIcons();
  };

  // Inicializa o ícone inicial
  lucide.createIcons();

  // Renderiza transações
  renderTransactions(user.transactions || []);
}

/**
 * Calcula total por tipo de transação
 */
function getTotalByType(transactions, type) {
  const transArray = Object.values(transactions || {});
  return transArray
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
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
      investment_gain: `💰 +${t.amount} OSD de investimento`
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
 * Mostra todas as transações (opcional)
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
