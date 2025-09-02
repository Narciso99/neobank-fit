// No modal de depósito, adicione:
<button onclick="redeemCode()" class="btn btn-primary mt-3">Resgatar Código de Jogo</button>

// Função para resgatar código
function redeemCode() {
  const user = getCurrentUser();
  const code = prompt('Digite seu código de resgate:');
  if (!code) return;

  db.ref('redemption_codes/' + code).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (!data || data.used || data.username !== user.username) {
        alert('Código inválido ou já usado.');
        return;
      }

      // Atualiza saldo principal
      updateUserBalance(user.username, data.amount);
      addTransaction(user.username, 'deposit', data.amount, 'Código de Jogo');

      // Marca como usado
      db.ref('redemption_codes/' + code).update({ used: true });

      showToast(`+${data.amount} OSD resgatados!`);
      loadDashboard(user.username);
    })
    .catch(err => {
      alert('Erro: ' + err.message);
    });
}
