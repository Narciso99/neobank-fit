/**
 * pix.js - Sistema de Pix
 */

function showPixScreen() {
  const user = getCurrentUser();
  if (!user) return;

  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Pix - NeoBank FIT</h2>
      </div>
      <div class="card">
        <h3>Sua Chave Pix</h3>
        <p class="text-primary mt-2">${user.username}@neobank.fit</p>
        <button onclick="copyPixKey('${user.username}')" class="btn btn-secondary mt-3">Copiar Chave</button>
      </div>
      <div class="card">
        <h3>Enviar Pix</h3>
        <input type="text" id="pixKey" placeholder="alice@neobank.fit" class="w-full p-3 border rounded-xl my-2" />
        <input type="number" id="pixAmount" placeholder="100" class="w-full p-3 border rounded-xl my-2" />
        <button onclick="sendPix()" class="btn btn-primary">Enviar Pix</button>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-4">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function copyPixKey(key) {
  navigator.clipboard.writeText(key + '@neobank.fit');
  showToast('Chave Pix copiada!');
}

function sendPix() {
  const keyInput = document.getElementById('pixKey');
  const amountInput = document.getElementById('pixAmount');
  if (!keyInput || !amountInput) return;

  const key = keyInput.value.trim();
  const username = key.replace('@neobank.fit', '').trim();
  const amount = parseFloat(amountInput.value);
  const sender = getCurrentUser();

  if (!username || !amount || amount <= 0) {
    alert('Preencha todos os campos.');
    return;
  }

  db.ref('users/' + username).once('value').then(snap => {
    if (!snap.exists()) {
      alert('Usuário não encontrado.');
      return;
    }

    db.ref('users/' + sender.username).once('value').then(userSnap => {
      if (userSnap.val().balance < amount) {
        alert('Saldo insuficiente.');
        return;
      }

      updateUserBalance(sender.username, -amount);
      updateUserBalance(username, amount);
      addTransaction(sender.username, 'pix_out', amount, username);
      addTransaction(username, 'pix_in', amount, sender.username);
      showToast(`${amount} FIT$ enviado via Pix!`);
      setTimeout(() => loadDashboard(sender.username), 1500);
    });
  });
}
