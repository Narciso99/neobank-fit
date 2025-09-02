/**
 * investments.js - Sistema de investimentos simulados com recompensas
 * Rendimento aleatório, seguro e com efeitos visuais
 */

// Mostra a tela de investimentos
function showInvestmentsScreen() {
  const user = getCurrentUser();
  if (!user) return;

  db.ref('users/' + user.username).once('value')
    .then(snapshot => {
      const userData = snapshot.val();
      const balance = userData.balance;
      const gameBalance = userData.gameBalance || 0;

      const app = document.getElementById('app');
      if (!app) return;

      app.innerHTML = `
        <div class="container">
          <div class="header">
            <h2>Investimentos 📈</h2>
          </div>

          <!-- Saldo do Jogo -->
          <div class="card text-center">
            <p class="text-muted">Saldo nos Jogos</p>
            <p class="balance-display">${gameBalance.toFixed(2)} <span class="osd">OSD</span></p>
            ${gameBalance > 0 ? `
              <button onclick="generateRedemptionCode('${user.username}')" class="btn btn-primary mt-2">
                Gerar Código de Resgate
              </button>
            ` : '<p class="text-sm text-muted mt-2">Jogue para ganhar OSD</p>'}
          </div>

          <!-- Fundos de Investimento -->
          <div class="card">
            <h3>Fundo OSD Tech (Tecnologia)</h3>
            <p>Rendimento: <strong>+${(Math.random() * 12 + 3).toFixed(2)}%</strong> ao mês</p>
            <div class="flex gap-2 mt-2">
              <input type="number" id="investAmount1" placeholder="100" class="flex-1 p-2 rounded-lg border" />
              <button onclick="investIn('tech')" class="btn btn-primary py-2 px-4">Investir</button>
            </div>
          </div>

          <div class="card">
            <h3>EcoBonds (Sustentabilidade)</h3>
            <p>Rendimento: <strong>+${(Math.random() * 8 + 1.5).toFixed(2)}%</strong> ao mês</p>
            <div class="flex gap-2 mt-2">
              <input type="number" id="investAmount2" placeholder="50" class="flex-1 p-2 rounded-lg border" />
              <button onclick="investIn('ecobonds')" class="btn btn-primary py-2 px-4">Investir</button>
            </div>
          </div>

          <!-- Histórico de Investimentos -->
          <div class="card">
            <h3>Retornos de Investimento</h3>
            <ul id="investmentList" class="space-y-2 mt-3">
              <!-- Preenchido dinamicamente -->
            </ul>
          </div>

          <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4 w-full">Voltar</button>
        </div>
      `;

      renderInvestmentHistory(userData.transactions);
      setTimeout(() => lucide.createIcons(), 100);
    });
}

// Renderiza o histórico de investimentos
function renderInvestmentHistory(transactions) {
  const list = document.getElementById('investmentList');
  if (!list) return;

  const gains = Object.values(transactions || {})
    .filter(t => t.type === 'investment_gain')
    .slice(-5)
    .reverse();

  list.innerHTML = gains.length ? gains.map(t => `
    <li class="py-2 border-b">
      <p class="font-medium text-green-600 dark:text-green-400">+${t.amount.toFixed(2)} OSD</p>
      <p class="text-xs text-muted">${t.date}</p>
    </li>
  `).join('') : '<li class="text-muted text-center py-2">Nenhum retorno</li>';
}

// Investe em um fundo
function investIn(fund) {
  const user = getCurrentUser();
  const amountInput = document.getElementById('investAmount' + (fund === 'tech' ? '1' : '2'));
  const amount = parseFloat(amountInput.value);

  if (!amount || amount <= 0) {
    alert('Valor inválido.');
    return;
  }

  db.ref('users/' + user.username).once('value')
    .then(snapshot => {
      const userData = snapshot.val();
      if (userData.balance < amount) {
        alert('Saldo insuficiente.');
        return;
      }

      // Atualiza saldo
      updateUserBalance(user.username, -amount);

      // Simula retorno em 3 segundos
      const retorno = amount * (0.03 + Math.random() * 0.12);
      setTimeout(() => {
        updateUserBalance(user.username, retorno);
        addTransaction(user.username, 'investment_gain', retorno, `Fundo ${fund.toUpperCase()}`);
        showToast(`💰 +${retorno.toFixed(2)} OSD de retorno!`);
      }, 3000);

      showToast(`Investido ${amount} OSD no Fundo ${fund === 'tech' ? 'OSD Tech' : 'EcoBonds'}`);
    });
}
