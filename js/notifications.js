function showToast(msg) {
  console.log('Exibindo toast:', msg);
  const toast = document.getElementById('toast');
  if (!toast) {
    console.error('Elemento #toast não encontrado');
    return;
  }
  toast.textContent = msg;
  toast.classList.add('show');
  if (Notification.permission === 'granted') {
    new Notification('NeoBank FIT', {
      body: msg,
      icon: 'img/logo.svg'
    });
  }
  setTimeout(() => toast.classList.remove('show'), 3000);
}
