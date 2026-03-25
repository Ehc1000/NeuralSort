export function renderSuggestionOverlay(photoCard, score) {
  const overlay = document.createElement('div');
  overlay.className = 'suggestion-overlay';
  overlay.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(40, 167, 69, 0.9);
    color: #fff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    pointer-events: none;
  `;
  overlay.textContent = `${Math.round(score * 100)}% Match`;
  
  photoCard.style.position = 'relative';
  photoCard.appendChild(overlay);
  photoCard.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.5)';
  photoCard.style.borderColor = '#28a745';
}

export function clearSuggestions(container) {
  container.querySelectorAll('.suggestion-overlay').forEach(o => o.remove());
  container.querySelectorAll('.album-card').forEach(c => {
    c.style.boxShadow = 'none';
    c.style.borderColor = '#ccc';
  });
}
