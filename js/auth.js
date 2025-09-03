/**
 * auth.js - NeoBank OS
 * Gerencia autenticação de usuários
 */

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

function loginUser(username, password, callback) {
  if (!username || !password) {
    showToast('❌ Preencha usuário e senha.');
    callback(false);
    return;
  }

  db.ref('users/' + username).once('value')
    .then(snapshot => {
      const userData = snapshot.val();
      if (userData && userData.password === hashPassword(password)) {
        localStorage.setItem('currentUser', username);
        showToast(`✅ Bem-vindo, ${username}!`);
        callback(true);
      } else {
        showToast('❌ Usuário ou senha incorretos.');
        callback(false);
      }
    })
    .catch(err => {
      console.error('Erro ao verificar usuário:', err);
      showToast('❌ Erro ao verificar usuário: ' + err.message);
      callback(false);
    });
}

function registerUser(username, password, callback) {
  if (!username || !password) {
    showToast('❌ Preencha todos os campos.');
    callback(false);
    return;
  }

  db.ref('users/' + username).once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        showToast('❌ Usuário já existe.');
        callback(false);
      } else {
        const hashedPassword = hashPassword(password);
        db.ref('users/' + username).set({
          username,
          password: hashedPassword,
          balance: 1000,
          xp: 0,
          level: 1,
          avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=' + username,
          transactions: {},
          investments: {},
          achievements: {}
        }).then(() => {
          localStorage.setItem('currentUser', username);
          showToast(`✅ Conta criada para ${username}!`);
          callback(true);
        }).catch(err => {
          console.error('Erro ao criar conta:', err);
          showToast('❌ Erro ao criar conta: ' + err.message);
          callback(false);
        });
      }
    })
    .catch(err => {
      console.error('Erro ao verificar usuário:', err);
      showToast('❌ Erro ao verificar usuário: ' + err.message);
      callback(false);
    });
}
