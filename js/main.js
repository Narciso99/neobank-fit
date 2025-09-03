// js/main.js
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

function getCurrentUser() {
  return { username: localStorage.getItem('currentUser') };
}

function updateUserBalance(username, amount) {
  if (typeof db === 'undefined') {
    console.error('Firebase não carregado');
    return;
  }
  const ref = db.ref('users/' + username);
  ref.transaction(user => {
    if (user) {
      user.balance += amount;
      user.xp = (user.xp || 0) + amount * 0.1;
      user.level = Math.floor(user.xp / 100) + 1;
    }
    return user;
  });
}

function addTransaction(username, type, amount, target = null) {
  if (typeof db === 'undefined') return;
  const transaction = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0],
    type,
    amount,
    target
  };
  db.ref('users/' + username + '/transactions').push(transaction);
}

// Cria o botão de tema
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 200);

  // Verifica se o Firebase está carregado
  if (typeof db === 'undefined') {
    console.error('❌ Firebase não foi carregado');
    document.getElementById('app').innerHTML = `
      <div class="container">
        <div class="card">
          <h2>Erro: Firebase não carregado</h2>
          <p>Verifique a conexão com o Firebase.</p>
        </div>
      </div>
    `;
    return;
  }

  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    // Espera 1 segundo para garantir que dashboard.js carregou
    setTimeout(() => {
      if (typeof loadDashboard === 'function') {
        loadDashboard(currentUser);
      } else {
        console.error('❌ loadDashboard não está definido');
        showLoginScreen();
      }
    }, 1000);
  } else {
    setTimeout(showLoginScreen, 1000);
  }
});
