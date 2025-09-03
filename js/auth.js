function showLoginScreen() {
  console.log('Exibindo tela de login');
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado');
    return;
  }
  app.innerHTML = `
    <div class="container">
      <div class="text-center mb-8">
        <img src="img/logo.svg" alt="NeoBank FIT" class="w-16 h-16 mx-auto mb-3" />
        <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">NeoBank FIT</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Banco virtual em tempo real</p>
      </div>
      <div class="flex justify-center mb-6">
        <img src="img/avatar-default.png" alt="Avatar" class="w-16 h-16 rounded-full border-4 border-blue-200" />
      </div>
      <div class="card">
        <form id="loginForm" class="space-y-4">
          <div class="input-group">
            <label>Usuário</label>
            <input type="text" name="username" required class="w-full p-3 rounded-xl border" />
          </div>
          <div class="input-group">
            <label>Senha</label>
            <input type="password" name="password" required class="w-full p-3 rounded-xl border" />
          </div>
          <button type="submit" class="btn btn-primary">Entrar</button>
          <button type="button" id="btnRegister" class="btn btn-secondary mt-2">Criar Conta</button>
          <button type="button" id="btnGoogle" class="btn btn-secondary mt-2">Entrar com Google</button>
        </form>
      </div>
      <div class="mt-4 text-center">
        <button id="toggleTheme" class="text-sm text-indigo-600 underline">Alternar Modo</button>
      </div>
    </div>
  `;
  document.getElementById('loginForm').onsubmit = handleLogin;
  document.getElementById('btnRegister').onclick = showRegisterScreen;
  document.getElementById('btnGoogle').onclick = googleSignIn;
  document.getElementById('toggleTheme').onclick = toggleDarkMode;
  setTimeout(() => lucide.createIcons(), 100);
}

function showRegisterScreen() {
  console.log('Exibindo tela de cadastro');
  const app = document.getElementById('app');
  if (!app) {
    console.error('Elemento #app não encontrado');
    return;
  }
  app.innerHTML = `
    <div class="container">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Criar Conta</h1>
      </div>
      <div class="flex justify-center mb-6">
        <img src="img/avatar-default.png" alt="Avatar" class="w-16 h-16 rounded-full border-4 border-blue-200" />
      </div>
      <div class="card">
        <form id="registerForm" class="space-y-4">
          <div class="input-group">
            <label>Nome</label>
            <input type="text" name="username" required class="w-full p-3 rounded-xl border" />
          </div>
          <div class="input-group">
            <label>Senha</label>
            <input type="password" name="password" required class="w-full p-3 rounded-xl border" />
          </div>
          <button type="submit" class="btn btn-primary">Registrar</button>
          <button type="button" id="btnGoogle" class="btn btn-secondary mt-2">Cadastrar com Google</button>
          <button type="button" id="btnBack" class="btn btn-secondary mt-2">Voltar</button>
        </form>
      </div>
    </div>
  `;
  document.getElementById('registerForm').onsubmit = handleRegister;
  document.getElementById('btnGoogle').onclick = googleSignIn;
  document.getElementById('btnBack').onclick = showLoginScreen;
  setTimeout(() => lucide.createIcons(), 100);
}

function handleLogin(e) {
  e.preventDefault();
  console.log('Iniciando login com Email/Senha');
  const username = e.target.username.value.trim();
  const password = e.target.password.value;
  const email = `${username}@neobank.com`;

  if (!username || !password) {
    showToast('Preencha todos os campos!');
    console.error('Erro: Campos de login vazios');
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('Login bem-sucedido, UID:', userCredential.user.uid);
      localStorage.setItem('currentUser', userCredential.user.uid);
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
        case 'auth/network-request-failed':
          errorMessage += 'Falha de rede. Verifique sua conexão!';
          break;
        default:
          errorMessage += error.message;
      }
      showToast(errorMessage);
      console.error('Erro no login:', error.code || 'N/A', error.message);
    });
}

function handleRegister(e) {
  e.preventDefault();
  console.log('Iniciando cadastro com Email/Senha');
  const username = e.target.username.value.trim();
  const password = e.target.password.value;
  const email = `${username}@neobank.com`;

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

  firebase.database().ref('users').orderByChild('username').equalTo(username).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        showToast('Este usuário já está em uso!');
        console.error('Erro: Username já existe', username);
        return Promise.reject(new Error('Username já existe'));
      }

      const iban = `OSPT${Math.random().toString().slice(2, 18)}`;
      console.log('IBAN gerado:', iban);

      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          console.log('Usuário criado com UID:', user.uid);
          const newUser = {
            username,
            email,
            balance: 1000,
            avatar: 'img/avatar-default.png',
            level: 1,
            xp: 0,
            iban,
            transactions: {},
            achievements: [],
            createdAt: new Date().toISOString()
          };
          return firebase.database().ref('users/' + user.uid).set(newUser);
        })
        .then(() => {
          localStorage.setItem('currentUser', userCredential.user.uid);
          addAchievement(userCredential.user.uid, 'Primeiro Passo', 'Conta criada com sucesso!');
          showToast('Conta criada com sucesso!');
          console.log('Dados do usuário salvos no Realtime Database');
          loadDashboard(userCredential.user.uid);
        });
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
        case 'auth/network-request-failed':
          errorMessage += 'Falha de rede. Verifique sua conexão!';
          break;
        default:
          errorMessage += error.message;
      }
      showToast(errorMessage);
      console.error('Erro no cadastro:', error.code || 'N/A', error.message);
    });
}

function googleSignIn() {
  console.log('Iniciando login/cadastro com Google');
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      const username = (user.email.split('@')[0] || `google_user_${Date.now()}`).replace(/[^a-zA-Z0-9]/g, '');
      console.log('Usuário Google autenticado, UID:', user.uid, 'Username:', username);

      return firebase.database().ref('users').orderByChild('username').equalTo(username).once('value')
        .then(snapshot => {
          if (!snapshot.exists()) {
            const iban = `OSPT${Math.random().toString().slice(2, 18)}`;
            console.log('IBAN gerado para Google user:', iban);
            const newUser = {
              username,
              email: user.email,
              balance: 1000,
              avatar: 'img/avatar-default.png',
              level: 1,
              xp: 0,
              iban,
              transactions: {},
              achievements: [],
              createdAt: new Date().toISOString()
            };
            return firebase.database().ref('users/' + user.uid).set(newUser);
          }
        })
        .then(() => {
          localStorage.setItem('currentUser', user.uid);
          addAchievement(user.uid, 'Primeiro Passo', 'Conta criada com Google!');
          showToast('Login com Google bem-sucedido!');
          console.log('Dados do usuário Google salvos ou já existentes');
          loadDashboard(user.uid);
        });
    })
    .catch(error => {
      let errorMessage = 'Erro no login com Google: ';
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage += 'Popup fechado pelo usuário!';
          break;
        case 'auth/network-request-failed':
          errorMessage += 'Falha de rede. Verifique sua conexão!';
          break;
        case 'auth/popup-blocked':
          errorMessage += 'Popup bloqueado pelo navegador!';
          break;
        default:
          errorMessage += error.message;
      }
      showToast(errorMessage);
      console.error('Erro no Google Sign-In:', error.code || 'N/A', error.message);
    });
}

function toggleDarkMode() {
  console.log('Alternando tema');
  document.documentElement.classList.toggle('dark');
}
