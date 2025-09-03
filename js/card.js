function loadCard(uid) {
  firebase.database().ref(`users/${uid}`).once('value', snapshot => {
    const username = snapshot.val().username;
    const lastFour = username.slice(-4).toUpperCase();
    document.getElementById('card-number').textContent = lastFour;
  });
}
