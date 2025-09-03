function createThemeToggle() {
  if (document.getElementById('theme-toggle')) return;

  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.innerHTML = '<i data-lucide="sun" class="w-6 h-6"></i>';
  toggle.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
    border-radius: 50%; background: #003366; color: white; display: flex;
    align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    z-index: 1000; cursor: pointer; border: none; outline: none;
  `;

  toggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const icon = toggle.querySelector('i');
    icon.setAttribute('data-lucide', document.documentElement.classList.contains('dark') ? 'moon' : 'sun');
    lucide.createIcons();
  };

  document.body.appendChild(toggle);
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
  if (user) {
    loadDashboard(user);
  } else {
    showLoginScreen();
  }
  setTimeout(() => lucide.createIcons(), 200);
});
