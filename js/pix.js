// pix.js
function showPixScreen() {
  const user = getCurrentUser();
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Pix - NeoBank OS</h2>
      </div>
      <div class="card">
        <h3>Chave Pix</h3>
        <p class="text-primary mt-2">${user.username}@neobank.os</p>
        <button onclick="copyPixKey('${user.username}')" class="btn btn-secondary mt-3">Copiar Chave</button>
      </div>
      <div class="card">
        <h3>Enviar Pix</h3>
        <input type="text" id="pixKey" placeholder="alice@neobank.os" class="w-full p-3 border rounded-xl my-2" />
        <input type="number" id="pixAmount" placeholder="100" class="w-full p-3 border rounded-xl my-2" />
        <button onclick="sendPix()" class="btn btn-primary">Enviar Pix</button>
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
  const key = document.getElementById('pixKey').value.trim().replace('@neobank.os', '');
  const amount = parseFloat(document.getElementById('pixAmount').value);
  const sender = getCurrentUser();

  db.ref('users/' + key).once('value').then(snap => {
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
      updateUserBalance(key, amount);
      addTransaction(sender.username, 'pix_out', amount, key);
      addTransaction(key, 'pix_in', amount, sender.username);
      showToast(`${amount} OSD enviado via Pix!`);
      setTimeout(() => loadDashboard(sender.username), 1500);
    });
  });
}
