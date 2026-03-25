# Implementation Plan: NeuralSort Photo Manager

**Branch**: `001-neuralsort-photo-manager` | **Date**: 2026-03-16 | **Spec**: [specs/001-neuralsort-photo-manager/spec.md]
**Input**: Feature specification from `/specs/001-neuralsort-photo-manager/spec.md`

## Summary
Build a local-first photo manager that groups photos by date into user-reorderable albums. The system features an aesthetic "Style Profile" matching engine using MobileNetV3 via TensorFlow.js, with all processing offloaded to a Web Worker and metadata stored in SQL.js (SQLite WASM) for persistence.

## Technical Context

**Language/Version**: JavaScript (ES2022+), Vite 5.1
**Primary Dependencies**: TensorFlow.js (MobileNetV3), SQL.js, WASM-binary-loader
**Storage**: SQL.js (SQLite in WASM), Local FileSystem API (for photo access)
**Testing**: Vitest, Playwright (for drag-and-drop e2e)
**Target Platform**: Modern Web Browsers (Desktop/Mobile)
**Project Type**: Web Application
**Performance Goals**: 60 FPS scrolling with 10k photos, <2s similarity matching for 1k photos
**Constraints**: 100% Local processing (No Cloud ML), WCAG 2.1 AA (Aria-live feedback for drag-and-drop)
**Scale/Scope**: Support for 10,000+ photo metadata entries and vectors

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Privacy**: Design MUST ensure 100% local processing (no unauthorized external calls). (Confirmed: TFJS/SQL.js are local).
- [x] **Performance**: Image rendering MUST use lazy loading and virtualization. (Confirmed: Custom virtual grid planned).
- [x] **ML Reliability**: ML features MUST include automated accuracy and bias benchmark tasks. (Confirmed: Added to task list).
- [x] **Accessibility**: Drag-and-drop interactions MUST be WCAG 2.1 Level AA compliant. (Confirmed: Aria-live and keyboard support planned).

## Project Structure

### Documentation (this feature)

```text
specs/001-neuralsort-photo-manager/
├── plan.md              # This file
├── research.md          # Decisions on TFJS, SQL.js, and Workers
├── data-model.md        # Photos, Albums, StyleProfiles schemas
├── quickstart.md        # Setup instructions
├── contracts/
│   └── worker-api.md    # UI <-> ML Worker message protocol
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── components/          # VirtualGrid, AlbumCard, TrainModal
├── services/            # DatabaseService (SQL.js), PhotoService
├── ml/
│   ├── worker.js        # Web Worker entry point
│   ├── model.js         # MobileNetV3 loading/inference
│   └── similarity.js    # Cosine similarity logic
├── store/               # Local state management
└── utils/               # Exif parser, drag-and-drop handler

tests/
├── e2e/                 # Playwright tests for drag-and-drop
└── unit/                # Vitest for ML logic and DB queries
```

**Structure Decision**: Option 1 (Single project) was selected as this is a browser-only application without a separate backend or API service.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [N/A]     | [N/A]      | [N/A]                               |
