// investments.js
function showInvestmentsScreen() {
  const user = getCurrentUser();
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Investimentos 📈</h2>
      </div>
      <div class="card">
        <h3>Fundo OSD Tech</h3>
        <p>Rendimento: <strong>+${(Math.random()*12+3).toFixed(2)}%</strong> ao mês</p>
        <div class="flex gap-2 mt-2">
          <input type="number" id="invest1" placeholder="100" class="flex-1 p-2 border rounded-lg" />
          <button onclick="invest(1,100)" class="btn btn-primary py-2 px-4">Investir</button>
        </div>
      </div>
      <div class="card">
        <h3>EcoBonds</h3>
        <p>Rendimento: <strong>+${(Math.random()*8+1.5).toFixed(2)}%</strong> ao mês</p>
        <div class="flex gap-2 mt-2">
          <input type="number" id="invest2" placeholder="50" class="flex-1 p-2 border rounded-lg" />
          <button onclick="invest(2,50)" class="btn btn-primary py-2 px-4">Investir</button>
        </div>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function invest(fund, min) {
  const user = getCurrentUser();
  const input = document.getElementById('invest' + fund);
  const amount = parseFloat(input.value) || min;

  if (user.balance < amount) {
    alert('Saldo insuficiente.');
    return;
  }

  updateUserBalance(user.username, -amount);
  const gain = amount * (0.03 + Math.random() * 0.12);
  setTimeout(() => {
    updateUserBalance(user.username, gain);
    addTransaction(user.username, 'investment_gain', gain, 'Fundo ' + fund);
    showToast(`💰 +${gain.toFixed(2)} OSD de retorno!`);
  }, 3000);
}
