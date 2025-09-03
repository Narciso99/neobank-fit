if ('Notification' in window && Notification.permission === 'default') {
  console.log('Solicitando permissão para notificações');
  Notification.requestPermission();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM carregado, verificando usuário');
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    firebase.database().ref('users/' + currentUser).once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          loadDashboard(currentUser);
        } else {
          localStorage.removeItem('currentUser');
          showLoginScreen();
        }
      })
      .catch(err => {
        showToast('Erro ao verificar usuário: ' + err.message);
        console.error('Erro ao verificar usuário:', err.message);
        showLoginScreen();
      });
  } else {
    showLoginScreen();
  }
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 200);
});
