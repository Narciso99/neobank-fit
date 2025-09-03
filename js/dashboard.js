// js/dashboard.js
function loadDashboard(username) {
  const userRef = db.ref('users/' + username);
  userRef.on('value', snapshot => {
    const user = snapshot.val();
    if (!user) {
      showToast('Usuário não encontrado.');
      showLoginScreen();
      return;
    }
    user.level = Math.floor((user.xp || 0) / 100) + 1;

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="card text-center">
          <h2>Olá, ${user.username}!</h2>
          <p>Saldo: ${user.balance.toFixed(2)} OSD</p>
          <p>Nível: ${user.level}</p>
        </div>
        <button onclick="showGamesScreen()" class="btn btn-primary">Jogar</button>
        <button onclick="showPixScreen()" class="btn btn-secondary">Pix</button>
      </div>
    `;
  });
}
