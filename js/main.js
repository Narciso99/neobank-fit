// js/main.js
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
      .catch(() => showLoginScreen());
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
