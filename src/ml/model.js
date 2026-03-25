import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model = null;

export async function loadModel() {
  if (model) return model;
  
  // Use WASM backend for better performance in worker if available, otherwise CPU
  // WebGL is usually not available in Web Workers without specialized setup
  await tf.setBackend('cpu'); 
  await tf.ready();
  
  model = await mobilenet.load({
    version: 2,
    alpha: 1.0
  });
  
  return model;
}

export async function extractVector(imageElement) {
  if (!model) await loadModel();
  
  // MobileNetV3/V2 infer returns intermediate activation if requested, 
  // but the mobilenet wrapper usually returns classifications.
  // We want the feature vector (embedding).
  // The mobilenet model has an 'infer' method.
  const embedding = model.infer(imageElement, true); 
  const vector = await embedding.data();
  embedding.dispose();
  
  return new Float32Array(vector);
}
