export function renderTrainModal(parent, photos, onTrain) {
  const modal = document.createElement('div');
  modal.id = 'train-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 800px;
    max-height: 80%;
    overflow-y: auto;
  `;

  content.innerHTML = `
    <h2>Create Style Profile</h2>
    <p>Select exactly 10 photos to define your style.</p>
    <input type="text" id="profile-name" placeholder="Profile Name (e.g. Summer)" style="width: 100%; padding: 10px; margin-bottom: 20px;">
    <div id="photo-selection-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;"></div>
    <div style="margin-top: 20px; text-align: right;">
      <button id="cancel-train" style="padding: 10px 20px; margin-right: 10px;">Cancel</button>
      <button id="start-train" disabled style="padding: 10px 20px; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor: not-allowed;">Train (0/10)</button>
    </div>
  `;

  const grid = content.querySelector('#photo-selection-grid');
  const selectedPhotos = new Set();
  const startBtn = content.querySelector('#start-train');

  photos.forEach(photo => {
    const img = document.createElement('img');
    img.src = photo.path;
    img.style.cssText = `
      width: 100px;
      height: 100px;
      object-fit: cover;
      cursor: pointer;
      border: 3px solid transparent;
    `;
    img.onclick = () => {
      if (selectedPhotos.has(photo.id)) {
        selectedPhotos.delete(photo.id);
        img.style.borderColor = 'transparent';
      } else if (selectedPhotos.size < 10) {
        selectedPhotos.add(photo.id);
        img.style.borderColor = '#007bff';
      }
      
      const count = selectedPhotos.size;
      startBtn.textContent = `Train (${count}/10)`;
      startBtn.disabled = count !== 10;
      startBtn.style.cursor = count === 10 ? 'pointer' : 'not-allowed';
    };
    grid.appendChild(img);
  });

  modal.appendChild(content);
  parent.appendChild(modal);

  content.querySelector('#cancel-train').onclick = () => modal.remove();
  startBtn.onclick = () => {
    const name = content.querySelector('#profile-name').value;
    if (!name) {
      alert('Please enter a name for your profile.');
      return;
    }
    onTrain(name, Array.from(selectedPhotos));
    modal.remove();
  };
}
