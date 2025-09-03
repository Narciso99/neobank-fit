function showSignup() {
  document.getElementById('auth-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
}

function showLogin() {
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('recover-form').style.display = 'none';
  document.getElementById('auth-form').style.display = 'block';
}

function showRecover() {
  document.getElementById('auth-form').style.display = 'none';
  document.getElementById('recover-form').style.display = 'block';
}

function signup() {
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;
  const email = `${username}@neobank.com`;
  const iban = `OSPT${Math.random().toString().slice(2, 18)}`;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      firebase.database().ref('users/' + user.uid).set({
        username,
        email,
        iban,
        balance: 1000,
        gameBalance: 0,
        helpsUsed: 0
      }).then(() => {
        showToast('Conta criada com sucesso!');
        showLogin();
      });
    })
    .catch(error => showToast('Erro ao criar conta: ' + error.message));
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const email = `${username}@neobank.com`;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      document.getElementById('auth-screen').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      loadDashboard(userCredential.user.uid);
    })
    .catch(error => showToast('Erro ao logar: ' + error.message));
}

function logout() {
  firebase.auth().signOut().then(() => {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'block';
  });
}

function recoverPassword() {
  const username = document.getElementById('recover-username').value;
  const email = `${username}@neobank.com`;
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => showToast('Email de recuperação enviado!'))
    .catch(error => showToast('Erro: ' + error.message));
}
