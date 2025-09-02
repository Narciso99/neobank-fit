/**
 * main.js - Inicializa o app
 * Verifica login e carrega a tela correta
 */

// Solicita permissão para notificações
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Função para mostrar toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    // Notificação do navegador
    if (Notification.permission === 'granted') {
      new Notification('NeoBank FIT', { body: msg, icon: 'img/logo.svg' });
    }
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

// Quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    loadDashboard(currentUser);
  } else {
    showLoginScreen();
  }

  // Inicializa ícones
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 200);
});
