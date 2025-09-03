/**
 * pix.js - NeoBank OS
 * Gerencia transações Pix
 */

function processPix(username, target, amount, callback) {
  if (!target || !amount || amount <= 0) {
    showToast('❌ Preencha o destinatário e um valor válido.');
    callback(false);
    return;
  }

  db.ref('users/' + target).once('value')
    .then(snapshot => {
      if (!snapshot.exists()) {
        showToast('❌ Destinatário não encontrado.');
        callback(false);
        return;
      }

      db.ref('users/' + username + '/balance').once('value')
        .then(snapshot => {
          const balance = snapshot.val() || 0;
          if (balance < amount) {
            showToast('❌ Saldo insuficiente.');
            callback(false);
            return;
          }

          updateUserBalance(username, -amount);
          updateUserBalance(target, amount);
          addTransaction(username, 'pix_out', amount, target);
          addTransaction(target, 'pix_in', amount, username);
          showToast(`✅ Pix de ${amount.toFixed(2)} OSD enviado para ${target}!`);
          callback(true);
        })
        .catch(err => {
          console.error('Erro ao verificar saldo:', err);
          showToast('❌ Erro ao verificar saldo: ' + err.message);
          callback(false);
        });
    })
    .catch(err => {
      console.error('Erro ao verificar destinatário:', err);
      showToast('❌ Erro ao verificar destinatário: ' + err.message);
      callback(false);
    });
}
