let liveRegion = null;

export function initAccessibility() {
  liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;';
  document.body.appendChild(liveRegion);
}

export function announce(message) {
  if (liveRegion) {
    liveRegion.textContent = message;
  }
}

export function setupKeyboardDnD(card, container, onOrderChange) {
  card.tabIndex = 0;
  card.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      // Implementation for keyboard-based re-ordering
      // For this prototype, we'll announce instructions
      announce('Use arrow keys to move album, Enter to drop.');
    }
  });
}
