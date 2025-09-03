function showInvestments() {
  document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
  document.getElementById('investments-screen').style.display = 'block';
}

function invest() {
  const amount = parseFloat(document.getElementById('investment-amount').value);
  const option = document.getElementById('investment-option').value;
  const uid = firebase.auth().currentUser.uid;

  if (amount <= 0) {
    showToast('Valor inválido!');
    return;
  }

  firebase.database().ref(`users/${uid}`).once('value').then(snapshot => {
    const balance = snapshot.val().balance;
    if (balance < amount) {
      showToast('Saldo insuficiente!');
      return;
    }

    const returns = { tech: 0.08, crypto: 0.15, gold: 0.03 };
    const returnAmount = amount * returns[option];

    setTimeout(() => {
      firebase.database().ref(`users/${uid}`).update({ balance: balance - amount + returnAmount });
      firebase.database().ref(`transactions/${uid}`).push({
        type: 'investment',
        amount: returnAmount,
        date: Date.now()
      });
      showToast(`Investimento concluído! Ganho: ${returnAmount.toFixed(2)} OSD`);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Investimento concluído! Ganho: ${returnAmount.toFixed(2)} OSD`);
      }
      backToDashboard();
    }, 3000);
  });
}
