// investments.js
const investmentOptions = [
  { name: "Fundos de Tecnologia", risk: "Alto", return: "12-18%" },
  { name: "Títulos do Tesouro", risk: "Baixo", return: "5-7%" },
  { name: "Ações Internacionais", risk: "Alto", return: "10-15%" }
];

function showInvestmentsScreen() {
  const user = getCurrentUser();
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Investimentos 📈</h2>
      </div>
      ${investmentOptions.map((inv, i) => `
        <div class="card">
          <h3>${inv.name}</h3>
          <p><strong>Risco:</strong> ${inv.risk}</p>
          <p><strong>Retorno:</strong> ${inv.return} ao ano</p>
          <div class="flex gap-2 mt-2">
            <input type="number" id="invest${i}" placeholder="100" class="flex-1 p-2 border rounded-lg" />
            <button onclick="investIn(${i})" class="btn btn-primary py-2 px-4">Investir</button>
          </div>
        </div>
      `).join('')}
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function investIn(index) {
  const user = getCurrentUser();
  const amount = parseFloat(document.getElementById(`invest${index}`).value) || 100;

  db.ref('users/' + user.username).once('value')
    .then(snap => {
      const userData = snap.val();
      if (userData.balance < amount) {
        alert('Saldo insuficiente.');
        return;
      }

      updateUserBalance(user.username, -amount);
      const gain = amount * (Math.random() * 0.15 + 0.05);
      setTimeout(() => {
        updateUserBalance(user.username, gain);
        addTransaction(user.username, 'investment_gain', gain, investmentOptions[index].name);
        showToast(`💰 +${gain.toFixed(2)} OSD de retorno!`);
      }, 3000);

      showToast(`Investido ${amount} OSD em ${investmentOptions[index].name}`);
    });
}
