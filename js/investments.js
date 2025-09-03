function showInvestmentsScreen() {
  console.log('Exibindo tela de investimentos');
  const user = getCurrentUser();
  if (!user) {
    showToast('Você precisa estar logado.');
    console.error('Erro: Usuário não logado');
    showLoginScreen();
    return;
  }
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado');
    return;
  }
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Investimentos</h2>
      </div>
      <div class="card">
        <h3 class="font-semibold">Escolha uma Opção</h3>
        <select id="investment-option" class="w-full p-3 rounded-xl border mb-4">
          <option value="tech">Fundos de Tecnologia (Risco: Médio, Retorno: 8%)</option>
          <option value="crypto">Criptomoedas (Risco: Alto, Retorno: 15%)</option>
          <option value="gold">Ouro (Risco: Baixo, Retorno: 3%)</option>
        </select>
        <div class="input-group">
          <label>Valor (FIT$)</label>
          <input type="number" id="investment-amount" placeholder="100" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="invest()" class="btn btn-primary w-full">Investir</button>
      </div>
      <button onclick="loadDashboard('${user.uid}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function invest() {
  console.log('Iniciando investimento');
  const user = getCurrentUser();
  if (!user) {
    showToast('Você precisa estar logado.');
    console.error('Erro: Usuário não logado');
    return;
  }
  const amount = parseFloat(document.getElementById('investment-amount').value);
  const option = document.getElementById('investment-option').value;
  if (!amount || amount <= 0) {
    showToast('Informe um valor válido.');
    console.error('Erro: Valor inválido', amount);
    return;
  }
  firebase.database().ref('users/' + user.uid).once('value')
    .then(snapshot => {
      const userData = snapshot.val();
      if (!userData || userData.balance < amount) {
        showToast('Saldo insuficiente.');
        console.error('Erro: Saldo insuficiente', userData.balance, amount);
        return;
      }
      const returns = { tech: 0.08, crypto: 0.15, gold: 0.03 };
      const returnAmount = amount * returns[option];
      setTimeout(() => {
        const updates = {};
        updates['users/' + user.uid + '/balance'] = userData.balance - amount + returnAmount;
        updates['users/' + user.uid + '/xp'] = (userData.xp || 0) + amount * 0.1;
        updates['users/' + user.uid + '/transactions/investment_' + Date.now()] = {
          id: 'investment_' + Date.now(),
          type: 'investment',
          amount: returnAmount,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0]
        };
        firebase.database().ref().update(updates)
          .then(() => {
            addAchievement(user.uid, 'Investimento Realizado', `Ganhou ${returnAmount.toFixed(2)} FIT$ em ${option}.`);
            showToast(`Investimento concluído! Ganho: ${returnAmount.toFixed(2)} FIT$`);
            console.log('Investimento concluído:', option, amount, 'Ganho:', returnAmount);
            setTimeout(() => loadDashboard(user.uid), 1500);
          });
      }, 3000);
    })
    .catch(err => {
      showToast('Erro ao investir: ' + err.message);
      console.error('Erro ao investir:', err.message);
    });
}
