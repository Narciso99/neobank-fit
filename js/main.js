const firebaseConfig = {
  apiKey: "AIzaSyCwa1oA6Pwk7idNq-Uu_nNfrasXMOhCrmk",
  authDomain: "neobank-fit.firebaseapp.com",
  databaseURL: "https://neobank-fit-default-rtdb.firebaseio.com",
  projectId: "neobank-fit",
  storageBucket: "neobank-fit.firebasestorage.app",
  messagingSenderId: "1084469171756",
  appId: "1:1084469171756:web:72696d6690053182752389"
};

try {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase inicializado com sucesso');
} catch (error) {
  console.error('Erro ao inicializar Firebase:', error.message);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

function showActions() {
  document.querySelector('.actions').style.display = 'block';
}

function backToDashboard() {
  document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
  document.getElementById('dashboard').style.display = 'block';
}

if ('Notification' in window) {
  Notification.requestPermission();
}
