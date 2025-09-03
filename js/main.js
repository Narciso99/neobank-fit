/**
 * main.js - NeoBank OS
 * Ponto de entrada com todas as funções globais
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
    icon.setAttribute('data-lucide', document.documentElement.classList.contains('dark') ? 'moon' : 'sun');
    lucide.createIcons();
    // Salva preferência
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };

  document.body.appendChild(toggle);
  lucide.createIcons();
}

// Função para mostrar notificações
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Função para copiar texto para a área de transferência
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

// Função para obter o usuário atual
function getCurrentUser() {
  const username = localStorage.getItem('currentUser');
  return username ? { username } : null;
}

// Atualiza o saldo do usuário
function updateUserBalance(username, amount) {
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

// Adiciona uma transação
function addTransaction(username, type, amount, target = null) {
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

// Mostra modal para resgatar código
function showRedemptionModal() {
  const user = getCurrentUser();
  if (!user) return;

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Resgatar Código de Jogo</h3>
        <p class="text-sm text-muted mb-4">Digite o código gerado nos jogos para adicionar OSD à sua conta.</p>
        <div class="input-group">
          <label>Código de Resgate</label>
          <input type="text" id="redeemCode" placeholder="OSD-ALICE-123456789" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="redeemCode()" class="btn btn-primary w-full mt-3">Resgatar</button>
        <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost w-full mt-2">Voltar</button>
      </div>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

// Resgata um código de jogo
function redeemCode() {
  const user = getCurrentUser();
  const codeInput = document.getElementById('redeemCode');
  const code = codeInput ? codeInput.value.trim() : '';

  if (!code) {
    alert('Digite um código.');
    return;
  }

  db.ref('redemption_codes/' + code).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (!data) {
        alert('Código inválido.');
        return;
      }
      if (data.used) {
        alert('Código já usado.');
        return;
      }
      if (data.username !== user.username) {
        alert('Este código não pertence a você.');
        return;
      }

      // Atualiza saldo
      updateUserBalance(user.username, data.amount);
      addTransaction(user.username, 'deposit', data.amount, 'Código de Jogo');

      // Marca como usado
      db.ref('redemption_codes/' + code).update({ used: true });

      showToast(`+${data.amount} OSD resgatados!`);
      setTimeout(() => loadDashboard(user.username), 1000);
    })
    .catch(err => {
      console.error('Erro ao resgatar código:', err);
      alert('Erro ao verificar código.');
    });
}

// Quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Cria o botão de tema
  createThemeToggle();

  // Restaura tema salvo
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.querySelector('i').setAttribute('data-lucide', 'moon');
      lucide.createIcons();
    }
  }

  // Carrega o dashboard ou tela de login
  con
