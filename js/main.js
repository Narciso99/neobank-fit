if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg;
    t.classList.add('show');
    if (Notification.permission === 'granted') {
      new Notification('NeoBank OS', { body: msg });
    }
    setTimeout(() => t.classList.remove('show'), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const u = localStorage.getItem('currentUser');
  if (u) {
    db.ref('users/' + u).once('value').then(s => s.exists() ? loadDashboard(u) : showLoginScreen());
  } else {
    showLoginScreen();
  }
  setTimeout(() => lucide.createIcons(), 200);
});
