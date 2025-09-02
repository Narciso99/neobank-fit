/**
 * NeoBank FIT - main.js
 * Ponto de entrada do app
 * Garante que o DOM está pronto antes de carregar a tela
 */

// Solicita permissão para notificações
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Função para mostrar notificações
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  // Notificação do navegador (se permitida)
  if (Notification.permission === 'granted') {
    new Notification('NeoBank FIT', {
      body: msg,
      icon: 'img/logo.svg'
    });
  }

  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');

  if (currentUser) {
    // Verifica se o usuário existe no Firebase
    db.ref('users/' + currentUser).once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          loadDashboard(currentUser);
        } else {
          localStorage.removeItem('currentUser');
          showLoginScreen();
        }
      })
      .catch(err => {
        console.error('Erro ao verificar usuário:', err);
        showLoginScreen();
      });
  } else {
    showLoginScreen();
  }

  // Inicializa ícones após o DOM estar pronto
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 200);
});