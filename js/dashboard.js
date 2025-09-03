// dashboard.js
function renderDashboard(user, username) {
  const app = document.getElementById('app');
  if (!app) return;

  const transactions = Object.values(user.transactions || {}).slice(-5).reverse();
  const transactionItems = transactions.length ? transactions.map(t => {
    return `
      <li class="py-2 border-b">
        <span class="font-medium">${t.amount} OSD</span>
        <span class="text-xs text-muted ml-2">${t.date}</span>
      </li>
    `;
  }).join('') : '<li class="text-muted">Sem transações</li>';

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
        <button id="btnLogout" title="Sair"><i data-lucide="log-out" class="w-5 h-5"></i></button>
      </div>
    </header>

    <main class="container">
      <div class="card text-center">
        <p class="text-muted">Saldo disponível</p>
        <p class="balance-display">${user.balance.toFixed(2)} <span class="osd">OSD</span></p>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-6">
        <button onclick="showTransactionModal('withdraw')" class="btn btn-secondary py-4">Sacar</button>
        <button onclick="showPixScreen()" class="btn btn-secondary py-4">Pix</button>
        <button onclick="showCardScreen()" class="btn btn-secondary py-4">Cartão</button>
        <button onclick="showInvestmentsScreen()" class="btn btn-secondary py-4">Investir</button>
      </div>

      <div class="card">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold">Últimas Movimentações</h3>
          <button onclick="showFullTransactions('${username}')" class="text-primary text-sm">Ver tudo</button>
        </div>
        <ul id="transactionList" class="space-y-2">${transactionItems}</ul>
      </div>

      <div class="card">
        <h3>Ganhe OSD Jogando 🎮</h3>
        <button onclick="showGamesScreen()" class="btn btn-primary w-full my-2">Jogar e Ganhar OSD</button>
        <button onclick="showRedemptionModal()" class="btn btn-secondary w-full">Resgatar Código</button>
      </div>
    </main>
  `;

  document.getElementById('btnLogout').onclick = () => {
    db.ref('users/' + currentUser).off();
    localStorage.removeItem('currentUser');
    showToast('Até logo!');
    showLoginScreen();
  };

  lucide.createIcons();
}
