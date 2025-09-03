// recovery.js
function showRecoveryScreen() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Recuperar Senha</h3>
        <p class="text-sm text-muted mb-4">Digite seu usuário para receber um link de recuperação.</p>
        <div class="input-group">
          <label>Usuário</label>
          <input type="text" id="recoverUser" placeholder="alice" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="sendRecoveryEmail()" class="btn btn-primary w-full mt-3">Enviar Email</button>
        <button onclick="showLoginScreen()" class="btn btn-ghost w-full mt-2">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function sendRecoveryEmail() {
  const username = document.getElementById('recoverUser').value.trim();

  if (!username) {
    alert('Digite um usuário.');
    return;
  }

  db.ref('users/' + username).once('value')
    .then(snapshot => {
      if (!snapshot.exists()) {
        alert('Usuário não encontrado.');
        return;
      }

      const email = snapshot.val().email || `${username}@neobank.com`;
      showToast(`Email enviado para ${email}!`);
      setTimeout(showLoginScreen, 2000);
    });
}
