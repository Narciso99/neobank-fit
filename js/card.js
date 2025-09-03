function showCardScreen() {
  const user = getCurrentUser();
  const last4 = user.username.slice(-4).toUpperCase().padStart(4, 'X');
  const uniqueNumber = `VISA-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${last4}-X${Date.now().toString().slice(-4)}`;
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <div class="container">
      <div class="header">
        <h2>Cartão Virtual</h2>
      </div>
      <div class="card relative overflow-hidden" style="background: linear-gradient(135deg, #0033aa, #00aaff, #0055cc); color: #ffffff; height: 220px; border-radius: 20px; position: relative; transition: transform 0.3s ease;">
        <div class="absolute inset-0" style="background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 70%); opacity: 0.3;"></div>
        <div class="absolute top-4 right-4">
          <i data-lucide="wifi" class="text-white opacity-70" style="font-size: 24px;"></i>
        </div>
        <div class="absolute top-4 left-4">
          <div style="width: 40px; height: 28px; background: linear-gradient(90deg, #ccc, #aaa); border-radius: 4px; box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);"></div>
        </div>
        <div class="absolute top-4 right-8">
          <div style="font-size: 24px; font-weight: 700; color: #ffffff; text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);">VISA</div>
        </div>
        <div class="absolute bottom-8 left-6">
          <div class="text-sm opacity-80 tracking-wide">Número do Cartão</div>
          <div class="text-xl font-mono tracking-wider" style="letter-spacing: 2px; text-shadow: 0 0 8px rgba(0, 170, 255, 0.5);">${uniqueNumber}</div>
          <div class="flex justify-between mt-6 text-sm">
            <span>VAL: 05/28</span>
            <span class="uppercase" style="text-shadow: 0 0 4px rgba(255, 255, 255, 0.3);">${user.username.toUpperCase()}</span>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1) 50%, transparent); animation: shimmer 3s infinite linear;"></div>
      </div>
      <div class="card">
        <h3>Limite Disponível</h3>
        <p class="balance-display">1.500,00 OSD</p>
      </div>
      <button onclick="loadDashboard('${user.username}')" class="btn btn-ghost">Voltar</button>
    </div>
    <style>
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    </style>
  `;
  setTimeout(() => lucide.createIcons(), 100);
}
