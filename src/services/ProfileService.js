import DatabaseService from './DatabaseService.js';

const ProfileService = {
  async createProfile(name, photoIds) {
    const db = DatabaseService.getDb();
    
    // Fetch vectors for selected photos
    const vectors = [];
    for (const id of photoIds) {
      const result = db.exec(`SELECT vector FROM Photos WHERE id = ${id}`);
      if (result.length > 0) {
        const blob = result[0].values[0][0];
        vectors.push(DatabaseService.blobToVector(blob));
      }
    }

    if (vectors.length !== 10) {
      throw new Error(`Expected 10 vectors, but found ${vectors.length}. Ensure vectors are extracted first.`);
    }

    // Calculate mean vector
    const vectorLength = vectors[0].length;
    const meanVector = new Float32Array(vectorLength);
    for (let i = 0; i < vectorLength; i++) {
      let sum = 0;
      for (let j = 0; j < vectors.length; j++) {
        sum += vectors[j][i];
      }
      meanVector[i] = sum / vectors.length;
    }

    // Persist profile
    const meanVectorBlob = DatabaseService.vectorToBlob(meanVector);
    db.run('INSERT INTO StyleProfiles (name, mean_vector) VALUES (?, ?)', [
      name, meanVectorBlob
    ]);
    
    const profileId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];

    // Persist training links
    for (const photoId of photoIds) {
      db.run('INSERT INTO ProfileTrainingPhotos (profile_id, photo_id) VALUES (?, ?)', [
        profileId, photoId
      ]);
    }

    return profileId;
  },

  getProfiles() {
    const db = DatabaseService.getDb();
    const result = db.exec('SELECT * FROM StyleProfiles');
    return result.length > 0 
      ? result[0].values.map(row => ({ id: row[0], name: row[1], mean_vector: row[2] }))
      : [];
  }
};

export default ProfileService;
