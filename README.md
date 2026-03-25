# NeuralSort Photo Manager

NeuralSort is a privacy-first, browser-based photo manager that organizes your library using local machine learning. It automatically groups photos by date and allows you to create custom "Style Profiles" to discover similar photos across your entire collection.

## Key Features

- **Automatic Organization**: Photos are automatically grouped into albums based on their capture date.
- **Customizable Dashboard**: Re-order your albums using a fluid drag-and-drop interface.
- **Neural Style Profiles**: Select 10 photos to "train" a Style Profile. The app uses a local MobileNetV3 model to suggest other photos that match that aesthetic.
- **Privacy-First**: All processing, from database management to ML feature extraction, happens entirely on your device. No photos or data are ever sent to a server.
- **High Performance**: Uses Web Workers for ML tasks and lazy loading to maintain a smooth 60 FPS experience even with large libraries.

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later.
- **Browser**: A modern browser with WASM and WebGL support (Chrome 100+, Safari 15.4+, Firefox 100+).

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PHOTO
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:
```bash
npm run dev
```
Once started, navigate to `http://localhost:5173` in your browser.

Build for production:
```bash
npm run build
```
Preview the build:
```bash
npm run preview
```

## Testing

### Unit Tests
Run the Vitest suite for ML logic and utility functions:
```bash
npm test
```

### End-to-End Tests
Run Playwright tests for UI interactions and drag-and-drop:
```bash
npm run test:e2e
```

## Tech Stack

- **Frontend**: Vite 5.1, JavaScript (ES2022+)
- **Machine Learning**: TensorFlow.js (MobileNetV3)
- **Database**: SQL.js (SQLite in WASM)
- **Styling**: Vanilla CSS
- **Testing**: Vitest & Playwright

## Project Structure

- `src/ml/`: TensorFlow.js models and similarity logic.
- `src/services/`: Core services like `DatabaseService`.
- `src/components/`: Reusable UI components (VirtualGrid, TrainModal, etc.).
- `specs/`: Detailed project specifications and research.
