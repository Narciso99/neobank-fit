# NeoBank FIT

Banco virtual fictício 100% offline com gamificação, transferências, gráficos e dark mode.

## 🚀 Como rodar

1. Clone este repositório.
2. Abra `index.html` no navegador (Chrome, Firefox).
3. Use normalmente: cadastre-se, transfira, acompanhe seu saldo.

## 📱 Como empacotar em APK (sem Android Studio)

Use **Capacitor** ou **Apache Cordova**:

### Com Capacitor:

```bash
npm install -g @capacitor/cli
npx cap init
npx cap add android
npx cap copy
npx cap open android