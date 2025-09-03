/**
 * main.js - NeoBank OS
 * Ponto de entrada do app
 * Garante que o DOM está pronto antes de carregar a tela
 */

// Cria o botão flutuante de tema (claro/escuro)
function createThemeToggle() {
  // Evita múltiplas criações
  if (document.getElementById('theme-toggle')) return;

  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.innerHTML = '<i data-lucide="sun" class="w-6 h-6"></i>';
  toggle.setAttribute('title', 'Alternar Modo Escuro');
  
  // Estilo do botão
  toggle.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #003366;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
  `;

  // Efeito de pulsação
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(0, 85, 204, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(0, 85, 204, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 85, 204, 0); }
    }
    #theme-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
  `;
  document.head.appendChild(style);

  // Ação do botão
  toggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const icon = toggle.querySelector('i');
    const isDark = document.documentElement.classList.contains('dark');
    icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    // Atualiza ícones
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    // Salva preferência
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  document.body.appendChild(toggle);

  // Inicializa o ícone correto com base na preferência salva
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    toggle.querySelector('i').setAttribute('data-lucide', 'moon');
  }

  // Inicializa os ícones do Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Função para mostrar notificações
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  // Notificação do navegador (se permitido)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('NeoBank OS', {
      body: msg,
      icon: 'img/logo.svg'
    });
  }

  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Solicita permissão para notificações
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Cria o botão de tema
  createThemeToggle();

  // Verifica se há usuário logado
  const currentUser = localStorage.getItem('currentUser');

  if (currentUser) {
    // Verifica no Firebase se o usuário existe
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
        showToast('Erro ao carregar dados. Tente novamente.');
        showLoginScreen();
      });
  } else {
    showLoginScreen();
  }

  // Inicializa ícones do Lucide (com atraso para garantir)
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 200);
});
