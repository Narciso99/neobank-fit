// transactions.js
function showRedemptionModal() {
  const user = getCurrentUser();
  if (!user) return;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Resgatar Código de Jogo</h3>
        <p class="text-sm text-muted mb-4">Digite o código gerado nos jogos.</p>
        <div class="input-group">
          <label>Código</label>
          <input type="text" id="redeemCode" placeholder="OSD-ALICE-123456789" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="redeemCode()" class="btn btn-primary w-full mt-3">Resgatar</button>
        <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost w-full mt-2">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function redeemCode() {
  const user = getCurrentUser();
  const code = document.getElementById('redeemCode').value.trim();

  if (!code) {
    alert('Digite um código.');
    return;
  }

  db.ref('redemption_codes/' + code).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (!data || data.used || data.username !== user.username) {
        alert('Código inválido ou já usado.');
        return;
      }

      // Atualiza saldo
      updateUserBalance(user.username, data.amount);
      addTransaction(user.username, 'deposit', data.amount, 'Código de Jogo');

      // Marca como usado
      db.ref('redemption_codes/' + code).update({ used: true });

      showToast(`+${data.amount} OSD resgatados!`);
      setTimeout(() => loadDashboard(user.username), 1000);
    })
    .catch(err => {
      console.error('Erro ao resgatar código:', err);
      alert('Erro ao verificar código.');
    });
}

// Mostra todas as transações
function showFullTransactions(username) {
  db.ref('users/' + username).once('value').then(snapshot => {
    const user = snapshot.val();
    const allTrans = Object.values(user.transactions || {}).reverse();
    const html = `
      <div class="container">
        <div class="header">
          <h2>Extrato Completo</h2>
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
