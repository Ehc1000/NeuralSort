# Quickstart: NeuralSort Photo Manager

## Development Setup

### 1. Prerequisites
- **Node.js**: v18 or later.
- **WASM Support**: Modern browser (Chrome 100+, Safari 15.4+, Firefox 100+).

### 2. Initialization
```bash
# Install dependencies
npm install
```

### 3. Local Execution
```bash
# Start the Vite development server
npm run dev
```
Navigate to `http://localhost:5173`.

## Architecture Note

- **Local Processing**: The app functions entirely in the browser. No data is sent to a backend.
- **ML Worker**: Feature extraction occurs in a background Web Worker (`src/ml/worker.js`) to maintain 60 FPS UI performance.
- **SQL.js**: The database is initialized via `src/services/DatabaseService.js` and stored in memory. 
- **State Management**: Managed via a simple reactive store in `src/store/index.js`.

## Testing

### Unit Tests (Vitest)
```bash
npm test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

## Troubleshooting

- **TFJS Load Error**: Ensure your browser supports WebGL or WASM.
- **SQL.js Load Error**: Check if `sql-wasm.wasm` is being served correctly from the `public/` directory.
