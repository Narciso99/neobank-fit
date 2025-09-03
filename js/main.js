/**
 * main.js - NeoBank OS
 * Inicialização principal da aplicação
 */

function createThemeToggle() {
  if (document.getElementById('theme-toggle')) return;

  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.innerHTML = '<i data-lucide="sun" class="w-6 h-6"></i>';
  toggle.className = 'fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform';
  
  toggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const icon = toggle.querySelector('i');
    icon.setAttribute('data-lucide', document.documentElement.classList.contains('dark') ? 'moon' : 'sun');
    lucide.createIcons();
  };

  document.body.appendChild(toggle);
  lucide.createIcons();
}

function createToastElement() {
  if (document.getElementById('toast')) return;

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  document.body.appendChild(toast);
}

function showToast(msg) {
  createToastElement();
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

function showLoginScreen() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    return;
  }

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 class="text-2xl font-bold mb-4 text-center">Bem-vindo ao NeoBank OS</h2>
        <div class="input-group">
          <label for="username">Usuário</label>
          <input type="text" id="username" placeholder="Digite seu usuário" class="w-full" />
        </div>
        <button onclick="login()" class="btn btn-primary w-full mt-4">Entrar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function login() {
  const usernameInput = document.getElementById('username');
  const username = usernameInput ? usernameInput.value.trim() : '';

  if (!username) {
    showToast('❌ Por favor, digite um usuário.');
    return;
  }

  // Verifica se o usuário existe no Firebase
  db.ref('users/' + username).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        localStorage.setItem('currentUser', username);
        showToast(`✅ Bem-vindo, ${username}!`);
        loadDashboard(username);
      } else {
        // Cria novo usuário
        db.ref('users/' + username).set({
          username,
          balance: 1000,
          xp: 0,
          level: 1,
          avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=' + username,
          transactions: {},
          investments: {}
        }).then(() => {
          localStorage.setItem('currentUser', username);
          showToast(`✅ Conta criada para ${username}!`);
          loadDashboard(username);
        }).catch(err => {
          showToast('❌ Erro ao criar conta: ' + err.message);
          console.error('Erro ao criar conta:', err);
        });
      }
    })
    .catch(err => {
      showToast('❌ Erro ao verificar usuário: ' + err.message);
      console.error('Erro ao verificar usuário:', err);
    });
}

function getCurrentUser() {
  const username = localStorage.getItem('currentUser');
  if (!username) {
    showLoginScreen();
    return null;
  }
  return { username };
}

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa elementos essenciais
  createThemeToggle();
  createToastElement();

  // Carrega o dashboard ou tela de login
  const user = localStorage.getItem('currentUser');
  if (user) {
    loadDashboard(user);
  } else {
    showLoginScreen();
  }

  // Inicializa ícones
  setTimeout(() => lucide.createIcons(), 200);
});
