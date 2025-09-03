// transactions.js
function showTransactionModal(type) {
  const user = getCurrentUser();
  if (!user) return;

  let modalHTML = '';

  if (type === 'withdraw') {
    modalHTML = `
      <h3>Sacar OSD</h3>
      <input type="number" id="amount" placeholder="50" class="w-full p-3 border rounded-xl my-3" />
      <button onclick="confirmWithdraw()" class="btn btn-primary w-full">Sacar</button>
    `;
  } else if (type === 'transfer') {
    modalHTML = `
      <h3>Transferir por IBAN</h3>
      <input type="text" id="iban" placeholder="OSPT1234567890123456" class="w-full p-3 border rounded-xl my-2" />
      <input type="number" id="amount" placeholder="100" class="w-full p-3 border rounded-xl my-2" />
      <button onclick="confirmTransfer()" class="btn btn-primary w-full">Enviar</button>
    `;
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="container">
      <div class="card">${modalHTML}</div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-3">Voltar</button>
    </div>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}

function confirmWithdraw() {
  const user = getCurrentUser();
  const amount = parseFloat(document.getElementById('amount').value);

  if (!amount || amount <= 0) {
    alert('Valor inválido.');
    return;
  }

  db.ref('users/' + user.username).once('value')
    .then(snapshot => {
      const userData = snapshot.val();
      if (userData.balance < amount) {
        alert('Saldo insuficiente.');
        return;
      }

      updateUserBalance(user.username, -amount);
      addTransaction(user.username, 'withdraw', amount);
      showToast(`-${amount} OSD sacado!`);
      setTimeout(() => loadDashboard(user.username), 500);
    });
}

function confirmTransfer() {
  const user = getCurrentUser();
  const iban = document.getElementById('iban').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);

  if (!iban.startsWith('OSPT') || iban.length !== 22) {
    alert('IBAN inválido.');
    return;
  }

  if (!amount || amount <= 0) {
    alert('Valor inválido.');
    return;
  }

  db.ref('users').orderByChild('iban').equalTo(iban).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          const target = child.key;
          db.ref('users/' + user.username).once('value')
            .then(userSnap => {
              if (userSnap.val().balance < amount) {
                alert('Saldo insuficiente.');
                return;
              }

              updateUserBalance(user.username, -amount);
              updateUserBalance(target, amount);
              addTransaction(user.username, 'transfer_out', amount, target);
              addTransaction(target, 'transfer_in', amount, user.username);
              showToast(`${amount} OSD enviado para ${target}!`);
              setTimeout(() => loadDashboard(user.username), 1000);
            });
        });
      } else {
        alert('IBAN não encontrado.');
      }
    });
}
