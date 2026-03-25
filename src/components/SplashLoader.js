export function renderSplashLoader(parent) {
  const splash = document.createElement('div');
  splash.id = 'splash-loader';
  splash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: opacity 0.5s ease;
  `;

  splash.innerHTML = `
    <div class="spinner" style="
      width: 50px;
      height: 50px;
      border: 5px solid #ccc;
      border-top-color: #333;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    "></div>
    <p style="margin-top: 20px; font-family: sans-serif;">Initializing NeuralSort (Loading WASM models)...</p>
    <style>
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  parent.appendChild(splash);

  return {
    hide() {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), 500);
    },
    updateText(text) {
      splash.querySelector('p').textContent = text;
    }
  };
}
