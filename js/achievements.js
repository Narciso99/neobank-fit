// achievements.js
function showAchievementsScreen() {
  const user = getCurrentUser();
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Conquistas 🏆</h2>
      </div>
      <div class="card">
        <p>Em breve! Ganhe medalhas jogando e investindo.</p>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}
