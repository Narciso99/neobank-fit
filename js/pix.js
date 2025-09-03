function getCurrentUser() {
  const uid = localStorage.getItem('currentUser');
  if (!uid) return null;
  let userData = null;
  firebase.database().ref('users/' + uid).once('value')
    .then(snapshot => {
      userData = snapshot.val();
    })
    .catch(error => {
      console.error('Erro ao buscar usuário:', error.message);
    });
  return userData ? { uid, ...userData } : null;
}

function generatePixQrCode(username) {
  const pixKey = `${username}@neobank.fit`;
  const data = `PIX:${pixKey}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
}

function showPixScreen() {
  console.log('Exibindo tela de Pix');
  const user = getCurrentUser();
  if (!user) {
    showToast('Você precisa estar logado.');
    console.error('Erro: Usuário não logado');
    showLoginScreen();
    return;
  }
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado');
    return;
  }
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Pix - NeoBank FIT</h2>
      </div>
      <div class="card">
        <h3 class="font-semibold">Receber Pix</h3>
        <p class="text-sm text-muted mb-2">Compartilhe seu QR Code ou chave</p>
        <div class="flex justify-center my-4">
          <img src="${generatePixQrCode(user.username)}" alt="QR Code Pix" class="w-40 h-40 border-4 border-blue-200 rounded-lg" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVSUk8gUVJDb2RlPC90ZXh0Pjwvc3ZnPg==';" />
        </div>
        <p class="text-center text-primary font-medium">${user.username}@neobank.fit</p>
        <button onclick="copyPixKey('${user.username}')" class="btn btn-secondary mt-3 w-full">Copiar Chave</button>
      </div>
      <div class="card">
        <h3 class="font-semibold">Enviar Pix</h3>
        <div class="input-group">
          <label>Chave (usuário@neobank.fit)</label>
          <input type="text" id="pixKey" placeholder="alice@neobank.fit" class="w-full p-3 rounded-xl border" />
        </div>
        <div class="input-group">
          <label>Valor (FIT$)</label>
          <input type="number" id="pixAmount" placeholder="100" class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="sendPix()" class="btn btn-primary w-full">Enviar Pix</button>
      </div>
      <button onclick="loadDashboard('${user.uid}')" class="btn btn-ghost mt-4 w-full">Voltar para o Dashboard</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function copyPixKey(username) {
  console.log('Copiando chave Pix:', username);
  const pixKey = `${username}@neobank.fit`;
  navigator.clipboard.writeText(pixKey)
    .then(() => {
      showToast('Chave Pix copiada!');
      console.log('Chave Pix copiada com sucesso');
    })
    .catch(err => {
      showToast('Erro ao copiar chave.');
      console.error('Falha ao copiar:', err.message);
    });
}

function sendPix() {
  console.log('Iniciando envio de Pix');
  const keyInput = document.getElementById('pixKey');
  const amountInput = document.getElementById('pixAmount');
  if (!keyInput || !amountInput) {
    showToast('Campos não encontrados.');
    console.error('Erro: Campos de Pix não encontrados');
    return;
  }
  const rawKey = keyInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const sender = getCurrentUser();
  if (!sender) {
    showToast('Você precisa estar logado.');
    console.error('Erro: Usuário não logado');
    return;
  }
  const targetUsername = rawKey.replace('@neobank.fit', '').trim();
  if (!targetUsername) {
    showToast('Por favor, insira uma chave Pix válida.');
    console.error('Erro: Chave Pix inválida', rawKey);
    return;
  }
  if (targetUsername === sender.username) {
    showToast('Você não pode enviar Pix para si mesmo.');
    console.error('Erro: Tentativa de Pix para si mesmo');
    return;
  }
  if (!amount || amount <= 0) {
    showToast('Informe um valor válido.');
    console.error('Erro: Valor inválido', amount);
    return;
  }
  const senderRef = firebase.database().ref('users/' + sender.uid);
  const targetRef = firebase.database().ref('users').orderByChild('username').equalTo(targetUsername);
  targetRef.once('value')
    .then(snapshot => {
      if (!snapshot.exists()) {
        showToast('Usuário não encontrado.');
        console.error('Erro: Usuário não encontrado', targetUsername);
        throw new Error('Usuário não encontrado');
      }
      const targetUid = Object.keys(snapshot.val())[0];
      return senderRef.once('value')
        .then(senderSnap => {
          const senderData = senderSnap.val();
          if (!senderData) {
            throw new Error('Dados do remetente não encontrados');
          }
          if (senderData.balance < amount) {
            showToast('Saldo insuficiente.');
            console.error('Erro: Saldo insuficiente', senderData.balance, amount);
            throw new Error('Saldo insuficiente');
          }
          const now = new Date();
          const transactionId = 'pix_' + now.getTime();
          const updates = {};
          updates['users/' + sender.uid + '/balance'] = senderData.balance - amount;
          updates['users/' + sender.uid + '/xp'] = (senderData.xp || 0) + amount * 0.1;
          updates['users/' + targetUid + '/balance'] = firebase.database.ServerValue.increment(amount);
          updates['users/' + targetUid + '/xp'] = firebase.database.ServerValue.increment(amount * 0.1);
          updates['users/' + sender.uid + '/transactions/' + transactionId] = {
            id: transactionId,
            type: 'pix_out',
            amount,
            target: targetUsername,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0]
          };
          updates['users/' + targetUid + '/transactions/' + transactionId] = {
            id: transactionId,
            type: 'pix_in',
            amount,
            target: sender.username,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0]
          };
          return firebase.database().ref().update(updates)
            .then(() => {
              addAchievement(sender.uid, 'Pix Enviado', `${amount} FIT$ enviados para ${targetUsername}.`);
            });
        });
    })
    .then(() => {
      showToast(`Pix de ${amount} FIT$ enviado para ${targetUsername}!`);
      console.log('Pix enviado com sucesso:', amount, 'para', targetUsername);
      setTimeout(() => loadDashboard(sender.uid), 1500);
    })
    .catch(err => {
      showToast('Erro: ' + err.message);
      console.error('Erro ao enviar Pix:', err.message);
    });
}
