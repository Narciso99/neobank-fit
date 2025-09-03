function showSignup() {
  document.getElementById('auth-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
  document.getElementById('recover-form').style.display = 'none';
}

function showLogin() {
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('recover-form').style.display = 'none';
  document.getElementById('auth-form').style.display = 'block';
}

function showRecover() {
  document.getElementById('auth-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('recover-form').style.display = 'block';
}

function signup() {
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value;
  const email = `${username}@neobank.com`;

  // Validação de entrada
  if (!username || username.length < 3) {
    showToast('O usuário deve ter pelo menos 3 caracteres!');
    return;
  }
  if (!password || password.length < 6) {
    showToast('A senha deve ter pelo menos 6 caracteres!');
    return;
  }

  // Verificar se o username já existe
  firebase.database().ref('users').orderByChild('username').equalTo(username).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        showToast('Este usuário já está em uso!');
        return;
      }

      // Gerar IBAN único
      const iban = `OSPT${Math.random().toString().slice(2, 18)}`;

      // Criar usuário no Firebase Authentication
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          // Salvar dados no Realtime Database
          return firebase.database().ref('users/' + user.uid).set({
            username,
            email,
            iban,
            balance: 1000,
            gameBalance: 0,
            helpsUsed: 0
          });
        })
        .then(() => {
          showToast('Conta criada com sucesso!');
          showLogin();
        })
        .catch(error => {
          let errorMessage = 'Erro ao criar conta: ';
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage += 'Este usuário já existe!';
              break;
            case 'auth/invalid-email':
              errorMessage += 'Email inválido!';
              break;
            case 'auth/weak-password':
              errorMessage += 'A senha é muito fraca!';
              break;
            default:
              errorMessage += error.message;
          }
          showToast(errorMessage);
        });
    })
    .catch(error => {
      showToast('Erro ao verificar usuário: ' + error.message);
    });
}

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const email = `${username}@neobank.com`;

  if (!username || !password) {
    showToast('Preencha todos os campos!');
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      document.getElementById('auth-screen').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      loadDashboard(userCredential.user.uid);
    })
    .catch(error => {
      let errorMessage = 'Erro ao logar: ';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage += 'Usuário não encontrado!';
          break;
        case 'auth/wrong-password':
          errorMessage += 'Senha incorreta!';
          break;
        default:
          errorMessage += error.message;
      }
      showToast(errorMessage);
    });
}

function logout() {
  firebase.auth().signOut().then(() => {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'block';
  }).catch(error => {
    showToast('Erro ao sair: ' + error.message);
  });
}

function recoverPassword() {
  const username = document.getElementById('recover-username').value.trim();
  const email = `${username}@neobank.com`;

  if (!username) {
    showToast('Digite o usuário!');
    return;
  }

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      showToast('Email de recuperação enviado!');
      showLogin();
    })
    .catch(error => {
      let errorMessage = 'Erro: ';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage += 'Usuário não encontrado!';
          break;
        default:
          errorMessage += error.message;
      }
      showToast(errorMessage);
    });
}
