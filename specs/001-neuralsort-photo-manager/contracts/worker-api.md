# Contract: ML Web Worker API

## Communication Protocol
- Message Format: JSON or Transferable Objects (Float32Array)
- Interface: `postMessage` / `onmessage`

## Message Payloads (UI â†’ Worker)

### 1. `EXTRACT_VECTORS`
Triggered for photo ingestion or style profile training.
- **Payload**:
  ```typescript
  {
    type: "EXTRACT_VECTORS",
    images: Array<{ id: number, blob: Blob | ImageBitmap }>
  }
  ```
- **Response**: `VECTOR_RESULT`

### 2. `CALCULATE_SIMILARITY`
Triggered when applying a Style Profile to find matching photos.
- **Payload**:
  ```typescript
  {
    type: "CALCULATE_SIMILARITY",
    activeProfileVector: Float32Array,
    candidatePhotos: Array<{ id: number, vector: Float32Array }>,
    topN: number,          // Default 50 per user spec
    minThreshold: number   // Default 0.6 per user spec
  }
  ```
- **Response**: `SIMILARITY_RESULT`

## Message Payloads (Worker â†’ UI)

### 1. `VECTOR_RESULT`
- **Payload**:
  ```typescript
  {
    type: "VECTOR_RESULT",
    results: Array<{ id: number, vector: Float32Array }>
  }
  ```

### 2. `SIMILARITY_RESULT`
- **Payload**:
  ```typescript
  {
    type: "SIMILARITY_RESULT",
    results: Array<{ id: number, similarityScore: number }>
  }
  ```

## Quality Constraints
- Worker MUST use `tf.setBackend('wasm')` or `tf.setBackend('webgl')` for performance.
- Results MUST be returned as Transferable Objects (Float32Array) to avoid serialization overhead.
