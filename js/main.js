/**
 * main.js - NeoBank OS
 * Ponto de entrada com funções globais
 */

// Cria o botão flutuante de tema
function createThemeToggle() {
  if (document.getElementById('theme-toggle')) return;

  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.innerHTML = '<i data-lucide="sun" class="w-6 h-6"></i>';
  toggle.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
    border-radius: 50%; background: #003366; color: white; display: flex;
    align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    z-index: 1000; cursor: pointer; border: none; outline: none;
  `;

  toggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const icon = toggle.querySelector('i');
    icon.setAttribute('data-lucide', document.documentElement.classList.contains('dark') ? 'moon' : 'sun');
    lucide.createIcons();
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };

  document.body.appendChild(toggle);
  lucide.createIcons();
}

// Mostra toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

// Copia texto
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast('✅ Código copiado!'))
    .catch(err => alert('Falha ao copiar: ' + err.message));
}

// Mostra sticker
function showSticker(emoji) {
  const sticker = document.createElement('div');
  sticker.innerHTML = `<span style="
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-size: 80px; z-index: 1000; animation: pop 0.6s ease-out;
  ">${emoji}</span>`;
  document.body.appendChild(sticker);
  setTimeout(() => document.body.removeChild(sticker), 1000);
}

// Obtém usuário atual
function getCurrentUser() {
  return { username: localStorage.getItem('currentUser') };
}

// Atualiza saldo
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

// Adiciona transação
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

// Resgata código
function showRedemptionModal() {
  const user = getCurrentUser();
  if (!user) return;

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

function redeemCode() {
  const user = getCurrentUser();
  const code = document.getElementById('redeemCode').value.trim();

  if (!code) return alert('Digite um código.');

  db.ref('redemption_codes/' + code).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (!data || data.used || data.username !== user.username) {
        alert('Código inválido ou já usado.');
        return;
      }

      updateUserBalance(user.username, data.amount);
      addTransaction(user.username, 'deposit', data.amount, 'Código de Jogo');
      db.ref('redemption_codes/' + code).update({ used: true });
      showToast(`+${data.amount} OSD resgatados!`);
      setTimeout(() => loadDashboard(user.username), 1000);
    });
}

// Quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  createThemeToggle();

  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    db.ref('users/' + currentUser).once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          loadDashboard(currentUser);
        } else {
          localStorage.removeItem('currentUser');
          showLoginScreen();
        }
      });
  } else {
    showLoginScreen();
  }

  setTimeout(() => lucide.createIcons(), 200);
});
