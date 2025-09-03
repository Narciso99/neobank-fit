// main.js
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
  const ref = db.ref('users/' + username);
  ref.transaction(user => {
    if (user) {
      user.balance += amount;
    }
    return user;
  });
}

function addTransaction(username, type, amount) {
  const transaction = {
    id: Date.now(),
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0],
    type,
    amount
  };
  db.ref('users/' + username + '/transactions').push(transaction);
}

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa Lucide
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 200);

  // Verifica Firebase
  if (typeof db === 'undefined') {
    console.error('❌ Firebase não carregado');
    document.getElementById('app').innerHTML = `
      <div class="container">
        <div class="card">
          <h2>Erro: Firebase não carregado</h2>
        </div>
      </div>
    `;
    return;
  }

  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    // Espera 1 segundo para carregar dashboard.js
    setTimeout(() => {
      if (typeof loadDashboard === 'function') {
        loadDashboard(currentUser);
      } else {
        showLoginScreen();
      }
    }, 1000);
  } else {
    showLoginScreen();
  }
});
