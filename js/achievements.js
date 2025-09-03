/**
 * achievements.js - NeoBank OS
 * Gerencia conquistas do usuário
 */

function showAchievementsScreen(username) {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    return;
  }

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Conquistas</h3>
        <p class="text-sm text-muted mb-4">Sistema de conquistas em desenvolvimento.</p>
        <button onclick="loadDashboard('${username}')" class="btn btn--ghost w-full mt-4">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
  showToast('ℹ️ Tela de conquistas carregada.');
}
