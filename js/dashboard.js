/**
 * dashboard.js - Tela principal com saldo e ações
 */

let currentUser = null;

function loadDashboard(username) {
  currentUser = username;

  const userRef = db.ref('users/' + username);
  userRef.on('value', snapshot => {
    const user = snapshot.val();
    if (!user) {
      showLoginScreen();
      return;
    }
    renderDashboard(user, username);
  });
}

function renderDashboard(user, username) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <header class="header">
      <div class="flex items-center gap-3">
        <img src="${user.avatar}" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-blue-300" />
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
      <div class="card text-center">
        <p class="text-muted">Saldo disponível</p>
        <p class="balance-display">${user.balance.toFixed(2)} FIT$</p>
      </div>

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

      <div class="card">
        <h3 class="font-semibold mb-3">Últimas Transações</h3>
        <ul id="transactionList" class="space-y-2"></ul>
      </div>

      <button id="floatingHelp" class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
        <i data-lucide="message-circle" class="w-6 h-6"></i>
      </button>
    </main>
  `;

  setTimeout(() => {
    lucide.createIcons();

    document.getElementById('btnLogout').onclick = () => {
      db.ref('users/' + currentUser).off();
      localStorage.removeItem('currentUser');
      showToast('Até logo!');
      showLoginScreen();
    };

    document.getElementById('btnHelp').onclick = () => {
      alert('NeoBank FIT - Simulação bancária com Firebase');
    };

    document.getElementById('floatingHelp').onclick = () => {
      showToast('Suporte em breve!');
    };

    renderTransactions(user.transactions || []);
  }, 100);
}

function renderTransactions(transactions) {
  const list = document.getElementById('transactionList');
  if (!list) return;

  const recent = Object.values(transactions || {}).slice(-5).reverse();
  list.innerHTML = recent.length ? recent.map(t => {
    const icons = {
      deposit: 'plus-circle text-green-500',
      withdraw: 'minus-circle text-red-500',
      pix_in: 'qr-code text-blue-500',
      pix_out: 'qr-code text-orange-500'
    }[t.type] || 'circle';

    const label = {
      deposit: `+${t.amount} FIT$`,
      withdraw: `-${t.amount} FIT$`,
      pix_in: `+${t.amount} (Pix) ← ${t.target}`,
      pix_out: `-${t.amount} (Pix) → ${t.target}`
    }[t.type] || 'Transação';

    return `
      <li class="flex items-center gap-3 py-2 border-b">
        <i data-lucide="${icons.split(' ')[0]}" class="w-5 h-5 ${icons}"></i>
        <div class="flex-1">
          <p class="text-sm font-medium">${label}</p>
          <p class="text-xs text-muted">${t.date}</p>
        </div>
      </li>
    `;
  }).join('') : '<li class="text-muted text-center py-2">Sem transações</li>';

  setTimeout(() => lucide.createIcons(), 100);
}
