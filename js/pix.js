// pix.js
function showPixScreen() {
  const user = getCurrentUser();
  if (!user) return;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Pix - NeoBank OS</h2>
      </div>
      <div class="card">
        <h3>Sua Chave Pix</h3>
        <p class="text-primary mt-2">${user.username}@neobank.os</p>
        <button onclick="copyPixKey('${user.username}')" class="btn btn-secondary mt-3">Copiar Chave</button>
      </div>
      <div class="card">
        <h3>Enviar Pix</h3>
        <div class="input-group">
          <label>Chave (usuário@neobank.os)</label>
          <input type="text" id="pixKey" placeholder="alice@neobank.os" class="w-full p-3 rounded-xl border" />
        </div>
        <div class="input-group">
          <label>Valor (OSD)</label>
          <input type="number" id="pixAmount" placeholder="100" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="sendPix()" class="btn btn-primary w-full mt-3">Enviar Pix</button>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function copyPixKey(key) {
  navigator.clipboard.writeText(key + '@neobank.os');
  showToast('Chave Pix copiada!');
}

function sendPix() {
  const user = getCurrentUser();
  const keyInput = document.getElementById('pixKey');
  const amountInput = document.getElementById('pixAmount');

  if (!keyInput || !amountInput) return;

  const key = keyInput.value.trim().replace('@neobank.os', '').trim();
  const amount = parseFloat(amountInput.value);

  if (!key || !amount || amount <= 0) {
    alert('Preencha todos os campos.');
    return;
  }

  // Verifica se o destinatário existe
  db.ref('users/' + key).once('value')
    .then(snapshot => {
      if (!snapshot.exists()) {
        alert('Usuário não encontrado.');
        return;
      }

      // Verifica saldo do remetente
      return db.ref('users/' + user.username).once('value')
        .then(userSnap => {
          const userData = userSnap.val();
          if (userData.balance < amount) {
            alert('Saldo insuficiente.');
            return;
          }

          // Atualiza saldo do remetente
          updateUserBalance(user.username, -amount);

          // Atualiza saldo do destinatário
          updateUserBalance(key, amount);

          // Adiciona transações
          addTransaction(user.username, 'pix_out', amount, key);
          addTransaction(key, 'pix_in', amount, user.username);

          // Notificação
          showToast(`${amount} OSD enviado via Pix para ${key}!`);
          setTimeout(() => loadDashboard(user.username), 1500);
        });
    })
    .catch(err => {
      console.error('Erro ao enviar Pix:', err);
      alert('Erro ao enviar Pix. Tente novamente.');
    });
}
