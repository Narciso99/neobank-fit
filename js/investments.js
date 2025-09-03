function showInvestmentsScreen() {
  const user = getCurrentUser();
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Investimentos 📈</h2>
      </div>
      <div class="card">
        <h3>Fundo OSD Tech</h3>
        <p>Rendimento: <strong>+${(Math.random() * 4 + 8).toFixed(2)}%</strong> ao mês</p>
        <p class="osd">Risco: Alto | Mínimo: 100 OSD</p>
        <div class="input-group">
          <label for="invest1">Valor a investir (OSD)</label>
          <div class="flex gap-2">
            <input type="number" id="invest1" placeholder="100" min="100" step="0.01" class="flex-1" />
            <button onclick="invest(1, 100, 'Fundo OSD Tech')" class="btn btn-primary">Investir</button>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>EcoBonds Verde</h3>
        <p>Rendimento: <strong>+${(Math.random() * 2 + 3).toFixed(2)}%</strong> ao mês</p>
        <p class="osd">Risco: Baixo | Mínimo: 50 OSD</p>
        <div class="input-group">
          <label for="invest2">Valor a investir (OSD)</label>
          <div class="flex gap-2">
            <input type="number" id="invest2" placeholder="50" min="50" step="0.01" class="flex-1" />
            <button onclick="invest(2, 50, 'EcoBonds Verde')" class="btn btn-primary">Investir</button>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>Crypto Quantum</h3>
        <p>Rendimento: <strong>+${(Math.random() * 10 + 10).toFixed(2)}%</strong> ao mês</p>
        <p class="osd">Risco: Muito Alto | Mínimo: 200 OSD</p>
        <div class="input-group">
          <label for="invest3">Valor a investir (OSD)</label>
          <div class="flex gap-2">
            <input type="number" id="invest3" placeholder="200" min="200" step="0.01" class="flex-1" />
            <button onclick="invest(3, 200, 'Crypto Quantum')" class="btn btn-primary">Investir</button>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>Imóveis Futura</h3>
        <p>Rendimento: <strong>+${(Math.random() * 3 + 5).toFixed(2)}%</strong> ao mês</p>
        <p class="osd">Risco: Médio | Mínimo: 500 OSD</p>
        <div class="input-group">
          <label for="invest4">Valor a investir (OSD)</label>
          <div class="flex gap-2">
            <input type="number" id="invest4" placeholder="500" min="500" step="0.01" class="flex-1" />
            <button onclick="invest(4, 500, 'Imóveis Futura')" class="btn btn-primary">Investir</button>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>Tesouro Estelar</h3>
        <p>Rendimento: <strong>+${(Math.random() * 1.5 + 2).toFixed(2)}%</strong> ao mês</p>
        <p class="osd">Risco: Muito Baixo | Mínimo: 25 OSD</p>
        <div class="input-group">
          <label for="invest5">Valor a investir (OSD)</label>
          <div class="flex gap-2">
            <input type="number" id="invest5" placeholder="25" min="25" step="0.01" class="flex-1" />
            <button onclick="invest(5, 25, 'Tesouro Estelar')" class="btn btn-primary">Investir</button>
          </div>
        </div>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function invest(fundId, minAmount, fundName) {
  const user = getCurrentUser();
  const input = document.getElementById('invest' + fundId);
  const amount = parseFloat(input.value) || minAmount;

  // Input validation
  if (isNaN(amount) || amount < minAmount) {
    showToast(`❌ O valor mínimo para ${fundName} é ${minAmount} OSD.`);
    return;
  }

  if (user.balance < amount) {
    showToast(`❌ Saldo insuficiente para investir ${amount} OSD.`);
    return;
  }

  // Deduct investment amount
  updateUserBalance(user.username, -amount);
  showToast(`✅ Investimento de ${amount.toFixed(2)} OSD em ${fundName} realizado!`);

  // Simulate investment return after a delay
  const returnRates = {
    1: { min: 0.08, max: 0.12 }, // Fundo OSD Tech
    2: { min: 0.03, max: 0.05 }, // EcoBonds Verde
    3: { min: 0.10, max: 0.20 }, // Crypto Quantum
    4: { min: 0.05, max: 0.08 }, // Imóveis Futura
    5: { min: 0.02, max: 0.035 }, // Tesouro Estelar
  };

  const rate = returnRates[fundId].min + Math.random() * (returnRates[fundId].max - returnRates[fundId].min);
  const gain = amount * rate;

  setTimeout(() => {
    updateUserBalance(user.username, gain);
    addTransaction(user.username, 'investment_gain', gain, fundName);
    showToast(`💰 +${gain.toFixed(2)} OSD de retorno em ${fundName}!`);
  }, 3000);
}
