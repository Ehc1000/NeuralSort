import DatabaseService from '../services/DatabaseService.js';

const PhotoIngestor = {
  async ingestPhotos(photoFiles) {
    const db = DatabaseService.getDb();
    
    for (const file of photoFiles) {
      const date = await this.getPhotoDate(file);
      const dateKey = this.formatDateKey(date);
      
      // Create a temporary URL for the browser to display the local file
      const blobUrl = URL.createObjectURL(file);
      
      // Ensure album exists
      let albumId = this.getAlbumId(dateKey);
      if (!albumId) {
        albumId = this.createAlbum(dateKey);
      }
      
      // Store photo reference
      this.savePhoto(blobUrl, dateKey, albumId);
    }
  },

  async getPhotoDate(file) {
    // In a real app, use an EXIF library. 
    // Here we use the last modified date as a fallback.
    return new Date(file.lastModified || Date.now());
  },

  formatDateKey(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  },

  getAlbumId(dateKey) {
    const db = DatabaseService.getDb();
    const result = db.exec(`SELECT id FROM Albums WHERE date_key = '${dateKey}'`);
    return result.length > 0 ? result[0].values[0][0] : null;
  },

  createAlbum(dateKey) {
    const db = DatabaseService.getDb();
    const orderResult = db.exec('SELECT MAX(display_order) FROM Albums');
    const nextOrder = (orderResult[0]?.values[0][0] || 0) + 1;
    
    db.run('INSERT INTO Albums (title, date_key, display_order) VALUES (?, ?, ?)', [
      dateKey, dateKey, nextOrder
    ]);
    
    return db.exec('SELECT last_insert_rowid()')[0].values[0][0];
  },

  savePhoto(path, dateTaken, albumId) {
    const db = DatabaseService.getDb();
    // Vector is empty until ML extraction runs
    db.run('INSERT INTO Photos (path, date_taken, album_id, vector) VALUES (?, ?, ?, ?)', [
      path, dateTaken, albumId, new Uint8Array(0)
    ]);
  }
};

export default PhotoIngestor;
