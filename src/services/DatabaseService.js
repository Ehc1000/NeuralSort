import initSqlJs from 'sql.js';

let db = null;
let SQL = null;

const DatabaseService = {
  async init() {
    if (db) return db;

    SQL = await initSqlJs({
      locateFile: file => `/${file}`
    });

    db = new SQL.Database();
    this.createSchema();
    return db;
  },

  createSchema() {
    db.run(`
      CREATE TABLE IF NOT EXISTS Albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date_key TEXT NOT NULL UNIQUE,
        display_order INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL UNIQUE,
        date_taken TEXT NOT NULL,
        album_id INTEGER,
        vector BLOB NOT NULL,
        FOREIGN KEY (album_id) REFERENCES Albums(id)
      );

      CREATE TABLE IF NOT EXISTS StyleProfiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        mean_vector BLOB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ProfileTrainingPhotos (
        profile_id INTEGER,
        photo_id INTEGER,
        PRIMARY KEY (profile_id, photo_id),
        FOREIGN KEY (profile_id) REFERENCES StyleProfiles(id),
        FOREIGN KEY (photo_id) REFERENCES Photos(id)
      );
    `);
  },

  async save() {
    const data = db.export();
    // In a real app, we'd save this to IndexedDB or a file.
    // For this prototype, we'll keep it in memory for the session.
    console.log('Database exported, size:', data.length);
    return data;
  },

  getDb() {
    return db;
  },

  // Helper to convert Float32Array to Uint8Array for BLOB storage
  vectorToBlob(vector) {
    return new Uint8Array(vector.buffer);
  },

  // Helper to convert BLOB back to Float32Array
  blobToVector(blob) {
    return new Float32Array(blob.buffer);
  }
};

export default DatabaseService;
