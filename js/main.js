// main.js - Seguro e funcional
document.addEventListener('DOMContentLoaded', () => {
  // Cria o botão de tema
  const themeToggle = document.createElement('button');
  themeToggle.id = 'theme-toggle';
  themeToggle.innerHTML = '<i data-lucide="sun"></i>';
  themeToggle.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
    border-radius: 50%; background: #003366; color: white; display: flex;
    align-items: center; justify-content: center; z-index: 1000; cursor: pointer;
  `;
  themeToggle.onclick = () => {
    document.documentElement.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    icon.setAttribute('data-lucide', document.documentElement.classList.contains('dark') ? 'moon' : 'sun');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  };
  document.body.appendChild(themeToggle);

  // Inicializa ícones
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Carrega login ou dashboard
  const user = localStorage.getItem('currentUser');
  if (user && typeof loadDashboard === 'function') {
    loadDashboard(user);
  } else if (typeof showLoginScreen === 'function') {
    showLoginScreen();
  } else {
    console.error('Funções não carregadas');
  }
});
