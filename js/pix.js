/**
 * NeoBank FIT - pix.js
 * Sistema completo de Pix com QR Code, cópia de chave e notificações
 */

// Garante que getCurrentUser está definido
function getCurrentUser() {
  const username = localStorage.getItem('currentUser');
  return username ? { username } : null;
}

/**
 * Gera URL do QR Code com a chave Pix
 */
function generatePixQrCode(username) {
  const pixKey = `${username}@neobank.fit`;
  const data = `PIX:${pixKey}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
}

/**
 * Abre a tela de Pix com chave e QR Code
 */
function showPixScreen() {
  const user = getCurrentUser();
  if (!user) {
    alert('Você precisa estar logado.');
    showLoginScreen();
    return;
  }

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Pix - NeoBank FIT</h2>
      </div>

      <!-- Seção: Receber Pix -->
      <div class="card">
        <h3 class="font-semibold">Receber Pix</h3>
        <p class="text-sm text-muted mb-2">Compartilhe seu QR Code ou chave</p>
        
        <!-- QR Code -->
        <div class="flex justify-center my-4">
          <img 
            src="${generatePixQrCode(user.username)}" 
            alt="QR Code Pix" 
            class="w-40 h-40 border-4 border-blue-200 rounded-lg"
            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVSUk8gUVJDb2RlPC90ZXh0Pjwvc3ZnPg==';"
          />
        </div>

        <!-- Chave Pix -->
        <p class="text-center text-primary font-medium">${user.username}@neobank.fit</p>
        <button onclick="copyPixKey('${user.username}')" class="btn btn-secondary mt-3 w-full">
          Copiar Chave
        </button>
      </div>

      <!-- Seção: Enviar Pix -->
      <div class="card">
        <h3 class="font-semibold">Enviar Pix</h3>
        <div class="input-group">
          <label>Chave (usuário@neobank.fit)</label>
          <input 
            type="text" 
            id="pixKey" 
            placeholder="alice@neobank.fit" 
            class="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" 
          />
        </div>
        <div class="input-group">
          <label>Valor (FIT$)</label>
          <input 
            type="number" 
            id="pixAmount" 
            placeholder="100" 
            class="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" 
          />
        </div>
        <button onclick="sendPix()" class="btn btn-primary w-full">Enviar Pix</button>
      </div>

      <!-- Botão Voltar -->
      <button 
        onclick="loadDashboard('${user.username}')" 
        class="btn btn-ghost mt-4 w-full">
        Voltar para o Dashboard
      </button>
    </div>
  `;

  // Inicializa ícones
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 100);
}

/**
 * Copia a chave Pix para a área de transferência
 */
function copyPixKey(username) {
  const pixKey = `${username}@neobank.fit`;
  navigator.clipboard.writeText(pixKey)
    .then(() => {
      showToast('Chave Pix copiada!');
    })
    .catch(err => {
      console.error('Falha ao copiar:', err);
      alert('Não foi possível copiar. Tente manualmente.');
    });
}

/**
 * Envia Pix para outro usuário
 */
function sendPix() {
  const keyInput = document.getElementById('pixKey');
  const amountInput = document.getElementById('pixAmount');

  if (!keyInput || !amountInput) {
    alert('Campos não encontrados.');
    return;
  }

  const rawKey = keyInput.value.trim();
  const amount = parseFloat(amountInput.value);

  const sender = getCurrentUser();
  if (!sender) {
    alert('Você precisa estar logado.');
    return;
  }

  // Extrai o username da chave
  const targetUsername = rawKey.replace('@neobank.fit', '').trim();

  // Validações
  if (!targetUsername) {
    alert('Por favor, insira uma chave Pix válida.');
    return;
  }

  if (targetUsername === sender.username) {
    alert('Você não pode enviar Pix para si mesmo.');
    return;
  }

  if (!amount || amount <= 0) {
    alert('Informe um valor válido.');
    return;
  }

  // Referências no Firebase
  const senderRef = db.ref('users/' + sender.username);
  const targetRef = db.ref('users/' + targetUsername);

  // 1. Verifica se o destinatário existe
  targetRef.once('value')
    .then(snapshot => {
      if (!snapshot.exists()) {
        throw new Error('Usuário não encontrado: ' + targetUsername);
      }
      // 2. Verifica saldo do remetente
      return senderRef.once('value');
    })
    .then(senderSnap => {
      const senderData = senderSnap.val();
      if (!senderData) {
        throw new Error('Dados do remetente não encontrados.');
      }
      if (senderData.balance < amount) {
        throw new Error('Saldo insuficiente.');
      }

      // 3. Prepara atualizações atômicas
      const now = new Date();
      const transactionId = 'pix_' + now.getTime();

      const updates = {};

      // Atualiza saldo e XP do remetente
      updates['users/' + sender.username + '/balance'] = senderData.balance - amount;
      updates['users/' + sender.username + '/xp'] = (senderData.xp || 0) + amount * 0.1;

      // Usa ServerValue.increment para o destinatário
      updates['users/' + targetUsername + '/balance'] = firebase.database.ServerValue.increment(amount);
      updates['users/' + targetUsername + '/xp'] = firebase.database.ServerValue.increment(amount * 0.1);

      // Transação do remetente
      updates['users/' + sender.username + '/transactions/' + transactionId] = {
        id: transactionId,
        type: 'pix_out',
        amount: amount,
        target: targetUsername,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0]
      };

      // Transação do destinatário
      updates['users/' + targetUsername + '/transactions/' + transactionId] = {
        id: transactionId,
        type: 'pix_in',
        amount: amount,
        target: sender.username,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0]
      };

      // 4. Executa todas as atualizações
      return db.ref().update(updates);
    })
    .then(() => {
      showToast(`Pix de ${amount} FIT$ enviado para ${targetUsername}!`);
      setTimeout(() => loadDashboard(sender.username), 1500);
    })
    .catch(err => {
      console.error('Erro ao enviar Pix:', err);
      let message = 'Erro desconhecido.';
      if (err.message.includes('não encontrado')) message = 'Usuário não encontrado.';
      else if (err.message.includes('saldo')) message = 'Saldo insuficiente.';
      else if (err.message.includes('campos')) message = 'Preencha todos os campos.';
      alert('Erro: ' + message);
    });
}