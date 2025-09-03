/**
 * card.js - NeoBank OS
 * Gerencia a exibição do cartão virtual
 */

function showCardScreen(username) {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    return;
  }

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Cartão Virtual</h3>
        <div class="vcard">
          <div class="vcard__chip"></div>
          <p class="vcard__number">**** **** **** 1234</p>
          <p class="vcard__name">${username.toUpperCase()}</p>
        </div>
        <button onclick="loadDashboard('${username}')" class="btn btn--ghost w-full mt-4">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
  showToast('ℹ️ Cartão virtual exibido.');
}
