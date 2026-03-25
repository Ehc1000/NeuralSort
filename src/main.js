import DatabaseService from './services/DatabaseService.js';
import { Store } from './store/index.js';
import { renderSplashLoader } from './components/SplashLoader.js';
import { renderVirtualGrid } from './components/VirtualGrid.js';
import { setupDnD } from './utils/DnDHandler.js';
import { initAccessibility, announce } from './utils/AccessibilityService.js';
import { renderTrainModal } from './components/TrainModal.js';
import ProfileService from './services/ProfileService.js';
import { renderSuggestionOverlay, clearSuggestions } from './components/SuggestionOverlay.js';
import PhotoIngestor from './utils/PhotoIngestor.js';

const appRoot = document.querySelector('#app');
let mlWorker = null;

async function init() {
  const splash = renderSplashLoader(appRoot);
  initAccessibility();

  try {
    splash.updateText('Loading Database...');
    await DatabaseService.init();
    
    splash.updateText('Initializing ML Worker...');
    initWorker();

    splash.updateText('Ready!');
    refreshStore();

    splash.hide();
    render();

    Store.subscribe(() => render());

  } catch (error) {
    console.error('Initialization failed:', error);
    splash.updateText('Error: ' + error.message);
  }
}

function initWorker() {
  mlWorker = new Worker(new URL('./ml/worker.js', import.meta.url), { type: 'module' });
  mlWorker.onmessage = (e) => {
    const { type, results, error } = e.data;
    if (type === 'VECTOR_RESULT') {
      saveVectors(results);
    } else if (type === 'SIMILARITY_RESULT') {
      Store.setState({ matchingSuggestions: results });
    } else if (type === 'ERROR') {
      console.error('ML Worker Error:', error);
    }
  };
  mlWorker.postMessage({ type: 'INIT' });
}

function saveVectors(results) {
  const db = DatabaseService.getDb();
  db.run('BEGIN TRANSACTION');
  results.forEach(res => {
    const blob = DatabaseService.vectorToBlob(res.vector);
    db.run('UPDATE Photos SET vector = ? WHERE id = ?', [blob, res.id]);
  });
  db.run('COMMIT');
  console.log(`Saved ${results.length} vectors to DB.`);
}

function refreshStore() {
  const db = DatabaseService.getDb();
  
  const albumsResult = db.exec('SELECT * FROM Albums ORDER BY display_order');
  const albums = albumsResult.length > 0 
    ? albumsResult[0].values.map(row => ({
        id: row[0], title: row[1], date_key: row[2], display_order: row[3]
      }))
    : [];

  const photosResult = db.exec('SELECT * FROM Photos');
  const photos = photosResult.length > 0
    ? photosResult[0].values.map(row => ({
        id: row[0], path: row[1], date_taken: row[2], album_id: row[3], vector: row[4]
      }))
    : [];

  const photosByAlbumId = {};
  photos.forEach(p => {
    if (!photosByAlbumId[p.album_id]) photosByAlbumId[p.album_id] = [];
    photosByAlbumId[p.album_id].push(p);
  });

  const profiles = ProfileService.getProfiles();

  Store.setState({ albums, photos, photosByAlbumId, styleProfiles: profiles });
}

function render() {
  const { albums, photosByAlbumId, styleProfiles, activeProfile, matchingSuggestions, photos } = Store.getState();
  
  // Header / Controls
  let controls = document.getElementById('app-controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'app-controls';
    controls.style.cssText = 'padding: 20px; background: #eee; border-bottom: 1px solid #ccc; display: flex; align-items: center; gap: 20px;';
    appRoot.before(controls);
  }

  controls.innerHTML = `
    <button id="btn-import" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Import Photos</button>
    <input type="file" id="file-input" multiple accept="image/*" style="display: none;">
    <button id="btn-train" style="padding: 8px 16px;">Train New Style</button>
    <div style="display: flex; align-items: center; gap: 10px;">
      <label for="profile-select">Active Style:</label>
      <select id="profile-select">
        <option value="">None</option>
        ${styleProfiles.map(p => `<option value="${p.id}" ${activeProfile?.id === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
      </select>
    </div>
  `;

  controls.querySelector('#btn-import').onclick = () => {
    controls.querySelector('#file-input').click();
  };

  controls.querySelector('#file-input').onchange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await PhotoIngestor.ingestPhotos(files);
      refreshStore();
      announce(`${files.length} photos imported.`);
    }
  };

  controls.querySelector('#btn-train').onclick = () => {
    renderTrainModal(document.body, photos, async (name, photoIds) => {
      await ProfileService.createProfile(name, photoIds);
      refreshStore();
      announce(`Profile "${name}" created.`);
    });
  };

  controls.querySelector('#profile-select').onchange = (e) => {
    const profileId = e.target.value;
    const profile = styleProfiles.find(p => p.id == profileId);
    Store.setState({ activeProfile: profile, matchingSuggestions: [] });
    
    if (profile) {
      // Trigger matching
      const profileVector = DatabaseService.blobToVector(profile.mean_vector);
      const candidates = photos
        .filter(p => p.vector && p.vector.length > 0)
        .map(p => ({ id: p.id, vector: DatabaseService.blobToVector(p.vector) }));
      
      mlWorker.postMessage({
        type: 'CALCULATE_SIMILARITY',
        payload: {
          activeProfileVector: profileVector,
          candidatePhotos: candidates,
          topN: 50,
          minThreshold: 0.6
        }
      });
    }
  };

  // Main Grid
  const gridContainer = renderVirtualGrid(appRoot, albums, photosByAlbumId || {});
  
  // Apply suggestions
  if (matchingSuggestions && matchingSuggestions.length > 0) {
    matchingSuggestions.forEach(s => {
      const card = gridContainer.querySelector(`.album-card[data-id="${findAlbumIdForPhoto(s.id)}"]`);
      if (card) renderSuggestionOverlay(card, s.similarityScore);
    });
  }

  setupDnD(gridContainer, (newOrder) => {
    announce('Album order updated and saved.');
    Store.setAlbums(albums.map(a => {
      const match = newOrder.find(o => o.id === a.id);
      return match ? { ...a, display_order: match.display_order } : a;
    }));
  });
}

function findAlbumIdForPhoto(photoId) {
  const { photos } = Store.getState();
  const photo = photos.find(p => p.id === photoId);
  return photo ? photo.album_id : null;
}

init();
