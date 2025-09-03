function showPix() {
  document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
  document.getElementById('pix-screen').style.display = 'block';
}

function sendPix() {
  const pixKey = document.getElementById('pix-key').value;
  const amount = parseFloat(document.getElementById('pix-amount').value);
  const uid = firebase.auth().currentUser.uid;

  if (!pixKey.endsWith('@neobank.os') || amount <= 0) {
    showToast('Chave Pix ou valor inválido!');
    return;
  }

  const username = pixKey.split('@')[0];
  firebase.database().ref('users').orderByChild('username').equalTo(username).once('value', snapshot => {
    if (!snapshot.exists()) {
      showToast('Usuário não encontrado!');
      return;
    }

    const recipientUid = Object.keys(snapshot.val())[0];
    firebase.database().ref(`users/${uid}`).once('value').then(userSnapshot => {
      const senderBalance = userSnapshot.val().balance;
      if (senderBalance < amount) {
        showToast('Saldo insuficiente!');
        return;
      }

      firebase.database().ref(`users/${uid}`).update({ balance: senderBalance - amount });
      firebase.database().ref(`users/${recipientUid}`).update({
        balance: snapshot.val()[recipientUid].balance + amount
      });

      firebase.database().ref(`transactions/${uid}`).push({
        type: 'pix',
        amount: -amount,
        date: Date.now()
      });

      firebase.database().ref(`transactions/${recipientUid}`).push({
        type: 'pix',
        amount,
        date: Date.now()
      });

      showToast('Pix enviado com sucesso!');
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Você recebeu ${amount} OSD via Pix!`);
      }
      backToDashboard();
    });
  });
}

function showTransfer() {
  document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
  document.getElementById('transfer-screen').style.display = 'block';
}

function transfer() {
  const iban = document.getElementById('iban').value;
  const amount = parseFloat(document.getElementById('transfer-amount').value);
  const uid = firebase.auth().currentUser.uid;

  if (!iban.startsWith('OSPT') || iban.length !== 22 || amount <= 0) {
    showToast('IBAN ou valor inválido!');
    return;
  }

  firebase.database().ref('users').orderByChild('iban').equalTo(iban).once('value', snapshot => {
    if (!snapshot.exists()) {
      showToast('IBAN não encontrado!');
      return;
    }

    const recipientUid = Object.keys(snapshot.val())[0];
    firebase.database().ref(`users/${uid}`).once('value').then(userSnapshot => {
      const senderBalance = userSnapshot.val().balance;
      if (senderBalance < amount) {
        showToast('Saldo insuficiente!');
        return;
      }

      firebase.database().ref(`users/${uid}`).update({ balance: senderBalance - amount });
      firebase.database().ref(`users/${recipientUid}`).update({
        balance: snapshot.val()[recipientUid].balance + amount
      });

      firebase.database().ref(`transactions/${uid}`).push({
        type: 'withdraw',
        amount: -amount,
        date: Date.now()
      });

      firebase.database().ref(`transactions/${recipientUid}`).push({
        type: 'deposit',
        amount,
        date: Date.now()
      });

      showToast('Transferência realizada com sucesso!');
      backToDashboard();
    });
  });
}
