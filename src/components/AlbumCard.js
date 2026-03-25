export function renderAlbumCard(album, photos) {
  const card = document.createElement('div');
  card.className = 'album-card';
  card.dataset.id = album.id;
  card.draggable = true;
  card.style.cssText = `
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    margin: 10px;
    width: 200px;
    background: #fff;
    cursor: grab;
    user-select: none;
  `;

  const previewPhoto = photos[0];
  const previewHtml = previewPhoto 
    ? `<img src="${previewPhoto.path}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;">`
    : `<div style="width: 100%; height: 150px; background: #eee; border-radius: 4px; display: flex; align-items: center; justify-content: center;">No Photos</div>`;

  card.innerHTML = `
    ${previewHtml}
    <h3 style="margin: 10px 0 5px; font-size: 16px;">${album.title}</h3>
    <p style="margin: 0; font-size: 12px; color: #666;">${photos.length} photos</p>
  `;

  return card;
}
