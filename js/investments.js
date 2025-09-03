// investments.js

function showInvestmentsScreen() {
  const user = getCurrentUser();
  const app = document.getElementById('app');
  if (!app) return;

  // Fetch user balance from Firebase
  db.ref('users/' + user.username + '/balance').once('value')
    .then(snapshot => {
      const balance = snapshot.val() || 0;
      renderInvestments(app, user.username, balance);
    })
    .catch(err => {
      showToast('Erro ao carregar saldo: ' + err.message);
    });
}

function renderInvestments(app, username, balance) {
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Investimentos</h2>
      </div>
      ${generateInvestmentCard(1, 'Fundo OSD Tech', 8, 12, 'Alto', 100, balance)}
      ${generateInvestmentCard(2, 'EcoBonds Verde', 3, 5, 'Baixo', 50, balance)}
      ${generateInvestmentCard(3, 'Crypto Quantum', 10, 20, 'Muito Alto', 200, balance)}
      ${generateInvestmentCard(4, 'Imóveis Futura', 5, 8, 'Médio', 500, balance)}
      ${generateInvestmentCard(5, 'Tesouro Estelar', 2, 3.5, 'Muito Baixo', 25, balance)}
      ${generateInvestmentCard(6, 'AI Ventures Fund', 9, 14, 'Alto', 150, balance)}
      ${generateInvestmentCard(7, 'Space Exploration Bonds', 7, 13, 'Médio-Alto', 300, balance)}
      ${generateInvestmentCard(8, 'Green Energy ETF', 4, 6.5, 'Baixo-Médio', 75, balance)}
      ${generateInvestmentCard(9, 'BioTech Innovations', 11, 18, 'Alto', 250, balance)}
      ${generateInvestmentCard(10, 'Global Stock Portfolio', 6, 9.5, 'Médio', 400, balance)}
      ${generateInvestmentCard(11, 'Quantum Computing Fund', 12, 22, 'Extremamente Alto', 350, balance)}
      ${generateInvestmentCard(12, 'Sustainable Agriculture Bonds', 2.5, 4.5, 'Baixo', 80, balance)}
      ${generateInvestmentCard(13, 'Metaverse Real Estate', 8.5, 15, 'Alto', 220, balance)}
      ${generateInvestmentCard(14, 'Renewable Tech Startups', 7.5, 12.5, 'Médio', 180, balance)}
      ${generateInvestmentCard(15, 'Galactic Tourism Ventures', 10.5, 19, 'Muito Alto', 450, balance)}
      <button onclick="loadDashboard('${username}')" class="btn btn-ghost mt-4">Voltar</button>
      <button onclick="showCurrentInvestments('${username}')" class="btn btn-secondary mt-2">Ver Investimentos Atuais</button>
      <button onclick="withdrawFromInvestment('${username}')" class="btn btn-ghost mt-2">Retirar de Investimento</button>
      <button onclick="compoundInterestCalculator()" class="btn btn-info mt-2">Calculadora de Juros Compostos</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function generateInvestmentCard(id, name, minYield, maxYield, risk, minAmount, balance) {
  const yieldRate = (Math.random() * (maxYield - minYield) + minYield).toFixed(2);
  return `
    <div class="card">
      <h3>${name}</h3>
      <p>Rendimento: <strong>+${yieldRate}%</strong> ao mês</p>
      <p class="osd">Risco: ${risk} | Mínimo: ${minAmount} OSD</p>
      <div class="input-group">
        <label for="invest${id}">Valor a investir (OSD)</label>
        <div class="flex gap-2">
          <input type="number" id="invest${id}" placeholder="${minAmount}" min="${minAmount}" max="${balance}" step="0.01" class="flex-1" />
          <button onclick="invest(${id}, ${minAmount}, '${name}')" class="btn btn-primary">Investir</button>
        </div>
      </div>
    </div>
  `;
}

function invest(fundId, minAmount, fundName) {
  const user = getCurrentUser();
  const input = document.getElementById('invest' + fundId);
  const amount = parseFloat(input.value) || minAmount;

  if (isNaN(amount) || amount < minAmount) {
    showToast(`❌ O valor mínimo para ${fundName} é ${minAmount} OSD.`);
    return;
  }

  db.ref('users/' + user.username + '/balance').transaction(balance => {
    if (balance >= amount) {
      return balance - amount;
    } else {
      showToast(`❌ Saldo insuficiente para investir ${amount} OSD.`);
      return balance;
    }
  }).then(result => {
    if (result.committed) {
      showToast(`✅ Investimento de ${amount.toFixed(2)} OSD em ${fundName} realizado!`);

      // Save investment record
      db.ref('users/' + user.username + '/investments').push({
        name: fundName,
        amount: amount,
        date: new Date().toISOString(),
        fundId: fundId
      });

      // Simulate return
      const returnRates = getReturnRates();
      const rate = returnRates[fundId].min + Math.random() * (returnRates[fundId].max - returnRates[fundId].min);
      const gain = amount * rate;

      setTimeout(() => {
        updateUserBalance(user.username, gain);
        addTransaction(user.username, 'investment_gain', gain, fundName);
        showToast(`💰 +${gain.toFixed(2)} OSD de retorno em ${fundName}!`);
      }, 3000);
    }
  }).catch(err => {
    showToast('❌ Erro ao processar investimento: ' + err.message);
  });
}

function getReturnRates() {
  return {
    1: { min: 0.08, max: 0.12 },
    2: { min: 0.03, max: 0.05 },
    3: { min: 0.10, max: 0.20 },
    4: { min: 0.05, max: 0.08 },
    5: { min: 0.02, max: 0.035 },
    6: { min: 0.09, max: 0.14 },
    7: { min: 0.07, max: 0.13 },
    8: { min: 0.04, max: 0.065 },
    9: { min: 0.11, max: 0.18 },
    10: { min: 0.06, max: 0.095 },
    11: { min: 0.12, max: 0.22 },
    12: { min: 0.025, max: 0.045 },
    13: { min: 0.085, max: 0.15 },
    14: { min: 0.075, max: 0.125 },
    15: { min: 0.105, max: 0.19 },
  };
}

function showCurrentInvestments(username) {
  const app = document.getElementById('app');
  if (!app) return;

  db.ref('users/' + username + '/investments').once('value')
    .then(snapshot => {
      const investments = snapshot.val() || {};
      const invList = Object.entries(investments).map(([key, inv]) => ({ key, ...inv }));

      let html = `
        <div class="container">
          <div class="header">
            <h2>Investimentos Atuais</h2>
          </div>
      `;

      if (invList.length === 0) {
        html += '<div class="card text-center"><p class="text-muted">Nenhum investimento ativo.</p></div>';
      } else {
        invList.forEach(inv => {
          html += `
            <div class="card">
              <h3>${inv.name}</h3>
              <p>Investido: ${inv.amount.toFixed(2)} OSD</p>
              <p>Data: ${inv.date.split('T')[0]}</p>
            </div>
          `;
        });
      }

      html += `
          <button onclick="showInvestmentsScreen()" class="btn btn-ghost mt-4">Voltar</button>
        </div>
      `;

      app.innerHTML = html;
      setTimeout(() => lucide.createIcons(), 100);
    })
    .catch(err => {
      showToast('Erro ao carregar investimentos: ' + err.message);
    });
}

function withdrawFromInvestment(username) {
  const app = document.getElementById('app');
  if (!app) return;

  db.ref('users/' + username + '/investments').once('value')
    .then(snapshot => {
      const investments = snapshot.val() || {};
      const invList = Object.entries(investments).map(([key, inv]) => ({ key, ...inv }));

      let html = `
        <div class="container">
          <div class="header">
            <h2>Retirar Investimentos</h2>
          </div>
      `;

      if (invList.length === 0) {
        html += '<div class="card text-center"><p class="text-muted">Nenhum investimento para retirar.</p></div>';
      } else {
        invList.forEach(inv => {
          html += `
            <div class="card">
              <h3>${inv.name}</h3>
              <p>Investido: ${inv.amount.toFixed(2)} OSD</p>
              <p>Data: ${inv.date.split('T')[0]}</p>
              <button onclick="confirmWithdraw('${username}', '${inv.key}', ${inv.amount}, '${inv.name}')" class="btn btn-primary mt-2">Retirar</button>
            </div>
          `;
        });
      }

      html += `
          <button onclick="showInvestmentsScreen()" class="btn btn-ghost mt-4">Voltar</button>
        </div>
      `;

      app.innerHTML = html;
      setTimeout(() => lucide.createIcons(), 100);
    })
    .catch(err => {
      showToast('Erro ao carregar investimentos: ' + err.message);
    });
}

function confirmWithdraw(username, invKey, amount, name) {
  if (confirm(`Confirma a retirada de ${amount.toFixed(2)} OSD de ${name}?`)) {
    // Return the amount to balance
    updateUserBalance(username, amount);
    // Remove the investment
    db.ref('users/' + username + '/investments/' + invKey).remove();
    showToast(`✅ ${amount.toFixed(2)} OSD retirados de ${name}.`);
    withdrawFromInvestment(username); // Refresh list
  }
}

function compoundInterestCalculator() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Calculadora de Juros Compostos</h2>
      </div>
      <div class="card">
        <div class="input-group">
          <label for="principal">Valor Inicial (OSD)</label>
          <input type="number" id="principal" placeholder="1000" step="0.01" />
        </div>
        <div class="input-group">
          <label for="rate">Taxa de Juros Anual (%)</label>
          <input type="number" id="rate" placeholder="5" step="0.01" />
        </div>
        <div class="input-group">
          <label for="time">Tempo (anos)</label>
          <input type="number" id="time" placeholder="10" />
        </div>
        <div class="input-group">
          <label for="compounds">Compostos por Ano</label>
          <input type="number" id="compounds" placeholder="12" />
        </div>
        <button onclick="calculateCompound()" class="btn btn-primary w-full mt-4">Calcular</button>
        <p id="result" class="text-center mt-4 text-lg font-bold"></p>
      </div>
      <button onclick="showInvestmentsScreen()" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function calculateCompound() {
  const principal = parseFloat(document.getElementById('principal').value);
  const rate = parseFloat(document.getElementById('rate').value) / 100;
  const time = parseFloat(document.getElementById('time').value);
  const compounds = parseFloat(document.getElementById('compounds').value);

  if (isNaN(principal) || isNaN(rate) || isNaN(time) || isNaN(compounds)) {
    showToast('❌ Preencha todos os campos corretamente.');
    return;
  }

  const amount = principal * Math.pow((1 + rate / compounds), compounds * time);
  const interest = amount - principal;

  document.getElementById('result').innerHTML = `
    Valor Final: ${amount.toFixed(2)} OSD<br>
    Juros Ganho: ${interest.toFixed(2)} OSD
  `;
}
