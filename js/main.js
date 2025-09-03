/**
 * main.js - NeoBank OS
 * Apenas funções globais. Nenhum código executado diretamente.
 * Evita erros de inicialização.
 */

// Função para mostrar notificações
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

// Função para obter o usuário atual
function getCurrentUser() {
  const username = localStorage.getItem('currentUser');
  return username ? { username } : null;
}

// Atualiza o saldo do usuário
function updateUserBalance(username, amount) {
  if (typeof db === 'undefined') {
    console.error('Firebase não inicializado');
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

// Adiciona uma transação
function addTransaction(username, type, amount, target = null) {
  if (typeof db === 'undefined') {
    console.error('Firebase não inicializado');
    return;
  }
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

// Copia texto para a área de transferência
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast('✅ Código copiado!'))
    .catch(err => {
      console.error('Erro ao copiar:', err);
      alert('Falha ao copiar: ' + err.message);
    });
}

// Mostra um sticker animado
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

// Cria o botão flutuante de tema
function createThemeToggle() {
  if (typeof document === 'undefined') return;

  // Evita múltiplas criações
  if (document.getElementById('theme-toggle')) return;

  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.innerHTML = '<i data-lucide="sun" class="w-6 h-6"></i>';
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
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    z-index: 1000;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
  `;

  toggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const icon = toggle.querySelector('i');
    icon.setAttribute('data-lucide', document.documentElement.classList.contains('dark') ? 'moon' : 'sun');
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };

  document.body.appendChild(toggle);

  // Define ícone inicial
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    toggle.querySelector('i').setAttribute('data-lucide', 'moon');
  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// Mostra modal para resgatar código
function showRedemptionModal() {
  const user = getCurrentUser();
  if (!user || !document.getElementById('app')) return;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">Resgatar Código de Jogo</h3>
        <p class="text-sm text-muted mb-4">Digite o código gerado nos jogos.</p>
        <div class="input-group">
          <label>Código</label>
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

  if (typeof db === 'undefined') {
    alert('Erro: Firebase não inicializado.');
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

      updateUserBalance(user.username, data.amount);
      addTransaction(user.username, 'deposit', data.amount, 'Código de Jogo');

      db.ref('redemption_codes/' + code).update({ used: true });

      showToast(`+${data.amount} OSD resgatados!`);
      setTimeout(() => loadDashboard(user.username), 1000);
    })
    .catch(err => {
      console.error('Erro ao resgatar código:', err);
      alert('Erro ao verificar código.');
    });
}

// Inicialização segura
document.addEventListener('DOMContentLoaded', () => {
  // Cria o botão de tema
  setTimeout(createThemeToggle, 500);

  // Verifica se o Firebase está carregado
  if (typeof db === 'undefined') {
    console.error('❌ Firebase não foi carregado. Verifique o index.html');
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

  // Inicializa ícones
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 1200);
});
