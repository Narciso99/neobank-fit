/**
 * main.js - NeoBank OS
 * Inicialização principal da aplicação com suporte a notificações
 */

function createThemeToggle() {
  if (document.getElementById('theme-toggle')) return;

  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.innerHTML = '<i data-lucide="sun" class="w-6 h-6"></i>';
  toggle.className = 'fixed bottom-8 right-8 w-14 h-14 rounded-full btn btn--primary flex-center shadow-lg';
  
  toggle.onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    const icon = toggle.querySelector('i');
    icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    lucide.createIcons();
    showToast(`✅ Tema alterado para ${isDark ? 'escuro' : 'claro'}.`);
    console.log(`Tema alterado para: ${isDark ? 'dark' : 'light'}`);
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
    toast.className = 'toast show';
    if (msg.includes('✅')) toast.className += ' toast--success';
    else if (msg.includes('❌') || msg.includes('Erro')) toast.className += ' toast--danger';
    else if (msg.includes('ℹ️')) toast.className += ' toast--info';
    setTimeout(() => toast.classList.remove('show'), 3000);
  } else {
    console.error('Elemento de toast não encontrado.');
  }

  // Show browser notification if permission granted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('NeoBank OS', {
      body: msg.replace(/✅|❌|ℹ️|🎮/g, ''), // Remove emojis for cleaner notification
      icon: 'https://api.dicebear.com/9.x/thumbs/svg?seed=neobank',
    });
  }
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showToast('✅ Notificações ativadas!');
      } else {
        console.log('Permissão de notificação negada.');
        showToast('ℹ️ Notificações desativadas. Use as configurações do navegador para ativar.');
      }
    }).catch(err => {
      console.error('Erro ao solicitar permissão de notificação:', err);
      showToast('❌ Erro ao solicitar notificações: ' + err.message);
    });
  }
}

function showLoginScreen() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    return;
  }

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 class="text-center">Bem-vindo ao NeoBank OS</h2>
        <div class="input-group">
          <label for="username" class="field__label">Usuário</label>
          <input type="text" id="username" placeholder="Digite seu usuário" class="input w-full" />
        </div>
        <div class="input-group">
          <label for="password" class="field__label">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" class="input w-full" />
        </div>
        <p id="login-error" class="field__error hidden"></p>
        <button onclick="login()" class="btn btn--primary w-full mt-4">Entrar</button>
        <button onclick="showRegisterScreen()" class="btn btn--ghost w-full mt-2">Criar Conta</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
  console.log('Tela de login carregada.');
}

function showRegisterScreen() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado.');
    showToast('❌ Erro interno: contêiner da aplicação não encontrado.');
    return;
  }

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h2 class="text-center">Criar Conta - NeoBank OS</h2>
        <div class="input-group">
          <label for="username" class="field__label">Usuário</label>
          <input type="text" id="username" placeholder="Digite seu usuário" class="input w-full" />
        </div>
        <div class="input-group">
          <label for="password" class="field__label">Senha</label>
          <input type="password" id="password" placeholder="Digite sua senha" class="input w-full" />
        </div>
        <div class="input-group">
          <label for="confirm-password" class="field__label">Confirmar Senha</label>
          <input type="password" id="confirm-password" placeholder="Confirme sua senha" class="input w-full" />
        </div>
        <p id="register-error" class="field__error hidden"></p>
        <button onclick="register()" class="btn btn--primary w-full mt-4">Criar Conta</button>
        <button onclick="showLoginScreen()" class="btn btn--ghost w-full mt-2">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
  console.log('Tela de registro carregada.');
}

// Simple client-side hashing (for demo purposes; use Firebase Authentication in production)
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

function login() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const error = document.getElementById('login-error');
  if (!usernameInput || !passwordInput || !error) {
    console.error('Elementos de login não encontrados.');
    showToast('❌ Erro interno: formulário de login inválido.');
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    error.textContent = 'Preencha usuário e senha.';
    error.classList.remove('hidden');
    showToast('❌ Preencha usuário e senha.');
    return;
  }

  error.classList.add('hidden');

  db.ref('users/' + username).once('value')
    .then(snapshot => {
      const userData = snapshot.val();
      if (userData) {
        if (userData.password === hashPassword(password)) {
          localStorage.setItem('currentUser', username);
          showToast(`✅ Bem-vindo, ${username}!`);
          loadDashboard(username);
        } else {
          error.textContent = 'Senha incorreta.';
          error.classList.remove('hidden');
          showToast('❌ Senha incorreta.');
        }
      } else {
        error.textContent = 'Usuário não encontrado. Crie uma conta.';
        error.classList.remove('hidden');
        showToast('❌ Usuário não encontrado. Crie uma conta.');
      }
    })
    .catch(err => {
      console.error('Erro ao verificar usuário:', err);
      error.textContent = 'Erro ao verificar usuário.';
      error.classList.remove('hidden');
      showToast('❌ Erro ao verificar usuário: ' + err.message);
    });
}

function register() {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const error = document.getElementById('register-error');
  if (!usernameInput || !passwordInput || !confirmPasswordInput || !error) {
    console.error('Elementos de registro não encontrados.');
    showToast('❌ Erro interno: formulário de registro inválido.');
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!username || !password || !confirmPassword) {
    error.textContent = 'Preencha todos os campos.';
    error.classList.remove('hidden');
    showToast('❌ Preencha todos os campos.');
    return;
  }

  if (password !== confirmPassword) {
    error.textContent = 'As senhas não coincidem.';
    error.classList.remove('hidden');
    showToast('❌ As senhas não coincidem.');
    return;
  }

  db.ref('users/' + username).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        error.textContent = 'Usuário já existe.';
        error.classList.remove('hidden');
        showToast('❌ Usuário já existe.');
      } else {
        const hashedPassword = hashPassword(password);
        db.ref('users/' + username).set({
          username,
          password: hashedPassword,
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
          console.error('Erro ao criar conta:', err);
          error.textContent = 'Erro ao criar conta.';
          error.classList.remove('hidden');
          showToast('❌ Erro ao criar conta: ' + err.message);
        });
      }
    })
    .catch(err => {
      console.error('Erro ao verificar usuário:', err);
      error.textContent = 'Erro ao verificar usuário.';
      error.classList.remove('hidden');
      showToast('❌ Erro ao verificar usuário: ' + err.message);
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
  // Apply saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Request notification permission
  requestNotificationPermission();

  // Initialize essential elements
  createThemeToggle();
  createToastElement();

  // Load dashboard or login screen
  const user = localStorage.getItem('currentUser');
  if (user) {
    db.ref('users/' + user).once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log('Usuário encontrado, carregando dashboard:', user);
          loadDashboard(user);
        } else {
          console.error('Usuário não encontrado no Firebase:', user);
          localStorage.removeItem('currentUser');
          showToast('❌ Sessão inválida. Faça login novamente.');
          showLoginScreen();
        }
      })
      .catch(err => {
        console.error('Erro ao verificar sessão:', err);
        showToast('❌ Erro ao verificar sessão: ' + err.message);
        showLoginScreen();
      });
  } else {
    showLoginScreen();
  }

  // Initialize icons
  setTimeout(() => lucide.createIcons(), 200);
});
