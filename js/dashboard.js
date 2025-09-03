function loadDashboard(uid) {
  firebase.database().ref(`users/${uid}`).on('value', snapshot => {
    const data = snapshot.val();
    document.getElementById('balance').textContent = data.balance.toFixed(2);
    document.getElementById('game-balance').textContent = data.gameBalance.toFixed(2);
    loadCard(uid);
    loadTransactions(uid);
  });
}
