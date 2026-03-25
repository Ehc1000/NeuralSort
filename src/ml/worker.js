import { loadModel, extractVector } from './model.js';
import { cosineSimilarity } from './similarity.js';

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  try {
    switch (type) {
      case 'INIT':
        await loadModel();
        self.postMessage({ type: 'INIT_COMPLETE' });
        break;

      case 'EXTRACT_VECTORS': {
        const { images } = payload;
        const results = [];
        
        for (const imgData of images) {
          // In a real app, imgData.blob would be converted to ImageBitmap or similar
          // For now, we assume the environment supports what extractVector needs
          const vector = await extractVector(imgData.bitmap);
          results.push({ id: imgData.id, vector });
        }
        
        // Transfer the vectors back to main thread efficiently
        const transferables = results.map(r => r.vector.buffer);
        self.postMessage({ type: 'VECTOR_RESULT', results }, transferables);
        break;
      }

      case 'CALCULATE_SIMILARITY': {
        const { activeProfileVector, candidatePhotos, topN, minThreshold } = payload;
        
        const scoredPhotos = candidatePhotos.map(photo => ({
          id: photo.id,
          similarityScore: cosineSimilarity(activeProfileVector, photo.vector)
        }));
        
        // Filter and sort per hybrid algorithm
        const filtered = scoredPhotos
          .filter(p => p.similarityScore >= minThreshold)
          .sort((a, b) => b.similarityScore - a.similarityScore)
          .slice(0, topN);
          
        self.postMessage({ type: 'SIMILARITY_RESULT', results: filtered });
        break;
      }

      default:
        console.warn('Unknown message type in ML Worker:', type);
    }
  } catch (error) {
    self.postMessage({ type: 'ERROR', error: error.message });
  }
};
