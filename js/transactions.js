function loadTransactions(uid, limit = 5) {
  const transactionList = document.getElementById('transaction-list');
  transactionList.innerHTML = '';
  firebase.database().ref(`transactions/${uid}`).limitToLast(limit).once('value', snapshot => {
    snapshot.forEach(child => {
      const { type, amount, date } = child.val();
      const li = document.createElement('li');
      li.innerHTML = `<span style="color: ${type === 'deposit' ? '#00C853' : type === 'withdraw' ? 'red' : type === 'pix' ? '#005BEA' : 'purple'}">${type} - ${amount} OSD - ${new Date(date).toLocaleString()}</span>`;
      transactionList.appendChild(li);
    });
  });
}

function showAllTransactions() {
  document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
  document.getElementById('transactions-screen').style.display = 'block';
  const allTransactionList = document.getElementById('all-transaction-list');
  allTransactionList.innerHTML = '';
  firebase.auth().currentUser && firebase.database().ref(`transactions/${firebase.auth().currentUser.uid}`).once('value', snapshot => {
    snapshot.forEach(child => {
      const { type, amount, date } = child.val();
      const li = document.createElement('li');
      li.innerHTML = `<span style="color: ${type === 'deposit' ? '#00C853' : type === 'withdraw' ? 'red' : type === 'pix' ? '#005BEA' : 'purple'}">${type} - ${amount} OSD - ${new Date(date).toLocaleString()}</span>`;
      allTransactionList.appendChild(li);
    });
  });
}
