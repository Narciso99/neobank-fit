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
        <p>Rendimento: <strong>+${(Math.random()*15+1).toFixed(2)}%</strong></p>
        <button onclick="invest(100)" class="btn btn-primary mt-2">Investir 100 OSD</button>
      </div>
      <div class="card">
        <h3>EcoBonds</h3>
        <p>Rendimento: <strong>+${(Math.random()*8+0.5).toFixed(2)}%</strong></p>
        <button onclick="invest(50)" class="btn btn-primary mt-2">Investir 50 OSD</button>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function invest(amount) {
  const user = getCurrentUser();
  if (user.balance < amount) {
    alert('Saldo insuficiente.');
    return;
  }

  updateUserBalance(user.username, -amount);
  const gain = amount * (0.01 + Math.random() * 0.15);

  setTimeout(() => {
    updateUserBalance(user.username, gain);
    addTransaction(user.username, 'investment_gain', gain, 'OSD Tech');
    showToast(`💰 +${gain.toFixed(2)} OSD de retorno!`);
  }, 3000);
}
