function showSignup() {
  console.log('Exibindo tela de cadastro');
  document.getElementById('auth-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
  document.getElementById('recover-form').style.display = 'none';
}

function showLogin() {
  console.log('Exibindo tela de login');
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('recover-form').style.display = 'none';
  document.getElementById('auth-form').style.display = 'block';
}

function showRecover() {
  console.log('Exibindo tela de recuperação');
  document.getElementById('auth-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('recover-form').style.display = 'block';
}

function signup() {
  console.log('Iniciando processo de cadastro');
  const username = document.getElementById('signup-username').value.trim();
  const password = document.getElementById('signup-password').value;
  const email = `${username}@neobank.com`;

  // Validação de entrada
  if (!username || username.length < 3) {
    showToast('O usuário deve ter pelo menos 3 caracteres!');
    console.error('Erro: Username inválido', username);
    return;
  }
  if (!password || password.length < 6) {
    showToast('A senha deve ter pelo menos 6 caracteres!');
    console.error('Erro: Senha inválida', password);
    return;
  }

  // Verificar se o Firebase está inicializado
  if (!firebase.auth()) {
    showToast('Erro: Firebase não inicializado corretamente!');
    console.error('Firebase Auth não está disponível');
    return;
  }

  // Verificar se o username já existe no Realtime Database
  console.log('Verificando unicidade do username:', username);
  firebase.database().ref('users').orderByChild('username').equalTo(username).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        showToast('Este usuário já está em uso!');
        console.error('Erro: Username já existe', username);
        return;
      }

      // Gerar IBAN único
      const iban = `OSPT${Math.random().toString().slice(2, 18)}`;
      console.log('IBAN gerado:', iban);

      // Criar usuário no Firebase Authentication
      console.log('Criando usuário com email:', email);
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          console.log('Usuário criado com UID:', user.uid);

          // Salvar dados no Realtime Database
          return firebase.database().ref('users/' + user.uid).set({
            username,
            email,
            iban,
            balance: 1000,
           {gmBalance: 0,
            helpsUsed: 0
          });
        })
        .then(() => {
          showToast('Conta criada com sucesso!');
          console.log('Dados do usuário salvos no Realtime Database');
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
            case 'auth/operation-not-allowed':
              errorMessage += 'Cadastro por email/senha não habilitado!';
              break;
            default:
              errorMessage += error.message;
          }
          showToast(errorMessage);
          console.error('Erro no cadastro:', error.code, error.message);
        });
    })
    .catch(error => {
      show toast('Erro ao verificar usuário: ' + error.message);
      console.error('Erro ao verificar username:', error.message);
    });
}

function login() {
  console.log('Iniciando processo de login');
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const email = `${username}@neobank.com`;

  if (!username || !password) {
    showToast('Preencha todos os campos!');
    console.error('Erro: Campos de login vazios');
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('Login bem-sucedido, UID:', userCredential.user.uid);
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
        case 'auth/invalid-email':
          errorMessage += 'Email inválido!';
          break;
        default:
          errorMessage += error.message;
      }
      showToast(errorMessage);
      console.error('Erro no login:', error.code, error.message);
    });
}

function logout() {
  console.log('Iniciando logout');
  firebase.auth().signOut()
    .then(() => {
      console.log('Logout bem-sucedido');
      document.getElementById('dashboard').style.display = 'none';
      document.getElementById('auth-screen').style.display = 'block';
    })
    .catch(error => {
      showToast('Erro ao sair: ' + error.message);
      console.error('Erro no logout:', error.message);
    });
}

function recoverPassword() {
  console.log('Iniciando recuperação de senha');
  const username = document.getElementById('recover-username').value.trim();
  const email = `${username}@neobank.com`;

  if (!username) {
    showToast('Digite o usuário!');
    console.error('Erro: Campo de recuperação vazio');
    return;
  }

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      showToast('Email de recuperação enviado!');
      console.log('Email de recuperação enviado para:', email);
      showLogin();
    })
    .catch(error => {
      let errorMessage = 'Erro: ';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage += 'Usuário não encontrado!';
          break;
        case 'auth/invalid-email':
          errorMessage += 'Email inválido!';
          break;
        default:
          errorMessage += error.message;
      }
      showToast(errorMessage);
      console.error('Erro na recuperação:', error.code, error.message);
    });
}
