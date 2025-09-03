/**
 * main.js - NeoBank OS
 * Ponto de entrada do app
 * Funções globais, inicialização e controle de tema
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
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    // Salva preferência
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  document.body.appendChild(toggle);

  // Define ícone inicial com base no tema
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    toggle.querySelector('i').setAttribute('data-lucide', 'moon');
  }

  // Inicializa os ícones
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

// Função para copiar texto
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast('✅ Código copiado!'))
    .catch(err => {
      console.error('Erro ao copiar:', err);
      alert('Falha ao copiar: ' + err.message);
    });
}

// Função para mostrar stickers animados
function showSticker(emoji) {
  const sticker = document.createElement('div');
  sticker.innerHTML = `<span style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 80px;
    z-index: 1000;
    animation: pop 0.6s ease-out;
  ">${emoji}</span>`;
  document.body.appendChild(sticker);
  setTimeout(() => document.body.removeChild(sticker), 1000);
}

// Função para obter usuário atual
function getCurrentUser() {
  const username = localStorage.getItem('currentUser');
  return username ? { username } : null;
}

// Quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  createThemeToggle();

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
        console.error('Erro ao carregar usuário:', err);
        showToast('Erro ao carregar dados. Tente novamente.');
        showLoginScreen();
      });
  } else {
    showLoginScreen();
  }

  // Inicializa ícones do Lucide
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 200);
});
