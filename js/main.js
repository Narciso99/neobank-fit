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
