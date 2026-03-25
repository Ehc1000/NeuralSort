import { describe, it, expect } from 'vitest';
import { cosineSimilarity } from '../../src/ml/similarity.js';

describe('ML Reliability Audit', () => {
  it('should correctly calculate similarity between identical vectors', () => {
    const vec = new Float32Array([1, 0, 0.5]);
    expect(cosineSimilarity(vec, vec)).toBeCloseTo(1.0);
  });

  it('should correctly calculate similarity between orthogonal vectors', () => {
    const vecA = new Float32Array([1, 0]);
    const vecB = new Float32Array([0, 1]);
    expect(cosineSimilarity(vecA, vecB)).toBe(0);
  });

  it('should handle zero vectors gracefully', () => {
    const vecA = new Float32Array([0, 0]);
    const vecB = new Float32Array([1, 1]);
    expect(cosineSimilarity(vecA, vecB)).toBe(0);
  });
});
