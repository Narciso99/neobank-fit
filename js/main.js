// main.js

// Botão flutuante de tema
function createThemeToggle() {
  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.innerHTML = '<i data-lucide="sun" class="w-6 h-6"></i>';
  toggle.onclick = toggleTheme;
  document.body.appendChild(toggle);
  lucide.createIcons();
}

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const icon = document.querySelector('#theme-toggle i');
  icon.setAttribute('data-lucide', document.documentElement.classList.contains('dark') ? 'moon' : 'sun');
  lucide.createIcons();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  createThemeToggle();
  const user = localStorage.getItem('currentUser');
  if (user) loadDashboard(user);
  else showLoginScreen();

  setTimeout(() => lucide.createIcons(), 200);
});
