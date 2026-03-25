import { renderAlbumCard } from './AlbumCard.js';

export function renderVirtualGrid(parent, albums, photosByAlbumId) {
  const container = document.createElement('div');
  container.id = 'virtual-grid';
  container.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    justify-content: flex-start;
  `;

  parent.innerHTML = '';
  parent.appendChild(container);

  albums.sort((a, b) => a.display_order - b.display_order).forEach(album => {
    const photos = photosByAlbumId[album.id] || [];
    const card = renderAlbumCard(album, photos);
    container.appendChild(card);
  });

  return container;
}
