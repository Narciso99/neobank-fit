// chat.js
function showChatScreen() {
  const user = getCurrentUser();
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>💬 Face Chat - Suporte</h2>
      </div>
      <div class="card" style="height: 400px; overflow-y: auto;" id="chatBox">
        <p><strong>Suporte:</strong> Olá! Como posso ajudar?</p>
      </div>
      <div class="card mt-3">
        <div class="input-group">
          <input type="text" id="chatInput" placeholder="Digite sua mensagem..." class="w-full p-3 rounded-xl border" />
        </div>
        <button onclick="sendMessage('${user.username}')" class="btn btn-primary w-full">Enviar</button>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost mt-3">Voltar</button>
    </div>
  `;

  // Simula resposta automática
  setTimeout(() => {
    addMessage('Suporte', 'Estamos aqui para ajudar com seu NeoBank OS!');
  }, 2000);

  setTimeout(() => {
    addMessage('Suporte', 'Se precisar de ajuda com Pix, jogos ou investimentos, é só perguntar!');
  }, 5000);

  setTimeout(() => lucide.createIcons(), 100);
}

function addMessage(sender, message) {
  const chatBox = document.getElementById('chatBox');
  const msg = document.createElement('p');
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage(username) {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  addMessage(username, message);
  input.value = '';

  // Resposta automática
  setTimeout(() => {
    addMessage('Suporte', 'Obrigado pelo seu feedback!');
  }, 1500);
}
