# Research: NeuralSort Photo Manager

## Technical Decisions

### 1. ML Model: TensorFlow.js with MobileNetV3
- **Decision**: Use `@tensorflow-models/mobilenet` or a custom MobileNetV3 model loaded via `tf.loadGraphModel`.
- **Rationale**: MobileNetV3 is specifically designed for mobile and edge devices, providing a balance between latency and accuracy. TFJS allows this to run entirely in the browser (local processing).
- **Alternatives Considered**: 
    - CLIP-lite: Better semantic matching but much larger model size (50MB+ vs ~5MB for MobileNet). Rejected for initial MVP to ensure fast load times.
    - MediaPipe: Good for face/pose, but less flexible for generic aesthetic "Style Profile" extraction.

### 2. Storage: SQL.js (SQLite in WASM)
- **Decision**: Use `sql.js` for metadata and feature vector storage.
- **Rationale**: Provides robust relational querying for date-based grouping and persistence. Since it's WASM-based, it stays 100% local.
- **Alternatives Considered**: 
    - IndexedDB: Native but more complex for complex relational queries and re-ordering indices.
    - LocalStorage: Limited to 5MB, insufficient for 10k+ photo metadata and vectors.

### 3. Computation: Web Workers
- **Decision**: Move TensorFlow.js feature extraction and similarity calculations to a dedicated Web Worker.
- **Rationale**: Required to meet **SC-001** and **SC-002** (60 FPS UI). Vector extraction is CPU/GPU intensive and would otherwise block the main thread, causing UI lag.

### 4. UI: Virtualized Rendering
- **Decision**: Implement a custom virtual list or use a lightweight library if available for Vanilla JS.
- **Rationale**: Essential for handling 10,000+ photos without crashing the DOM. Only the visible albums and photos will be rendered.

## Best Practices

- **Memory Management**: Explicitly call `tf.dispose()` to prevent memory leaks in the Web Worker.
- **WASM Loading**: Preload `sql.js` and `tfjs` WASM binaries for faster startup.
- **Security**: Use Subresource Integrity (SRI) for external WASM/JS dependencies if not bundled locally.
