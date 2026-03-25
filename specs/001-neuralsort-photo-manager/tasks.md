# Tasks: NeuralSort Photo Manager

**Input**: Design documents from `specs/001-neuralsort-photo-manager/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/worker-api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- File paths are absolute or relative to project root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize project structure with Vite, SQL.js, and TensorFlow.js dependencies
- [x] T002 Configure Vite to handle WASM binaries for SQL.js and TFJS
- [x] T003 [P] Setup Vitest and Playwright testing frameworks per plan.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required for all user stories

- [x] T004 Implement `src/services/DatabaseService.js` for SQL.js initialization and schema creation (Photos, Albums, StyleProfiles)
- [x] T005 [P] Implement `src/ml/worker.js` as the Web Worker entry point per contract
- [x] T006 [P] Implement `src/ml/model.js` to load MobileNetV3 in the Web Worker
- [x] T007 Implement `src/utils/PhotoIngestor.js` for Exif date extraction and automatic album grouping logic
- [x] T008 [P] Setup base `src/store/index.js` for local state management (albums, active profile)
- [x] T029 [P] Create `src/components/SplashLoader.js` for UI state during WASM (SQL.js/TFJS) initialization (CHK002)

**Checkpoint**: Foundation ready - User Story implementation can begin

---

## Phase 3: User Story 1 - Grouping and Re-ordering Albums (Priority: P1) 🎯 MVP

**Goal**: Photos are grouped by date into albums that can be re-ordered via drag-and-drop.

**Independent Test**: Add photos with different dates; verify they appear in separate albums. Drag album A before album B; refresh and verify order persists.

### Implementation for User Story 1

- [x] T009 [P] [US1] Create `src/components/VirtualGrid.js` for high-performance gallery rendering
- [x] T010 [P] [US1] Create `src/components/AlbumCard.js` for album preview and metadata display
- [x] T011 [US1] Implement drag-and-drop handler in `src/utils/DnDHandler.js` with `display_order` persistence and conflict resolution (FR-010)
- [x] T012 [US1] Implement accessibility layer for drag-and-drop in `src/utils/AccessibilityService.js` (Aria-live)
- [x] T013 [US1] Connect `DatabaseService.js` to UI for real-time album updates and storage limit notifications (FR-009)

**Checkpoint**: User Story 1 (MVP) is fully functional and testable

---

## Phase 4: User Story 2 - Creating a Style Profile (Priority: P2)

**Goal**: Create named "Style Profiles" by selecting 10 photos and extracting their aesthetic vectors.

**Independent Test**: Select 10 photos in "Train" mode; save as "Summer"; verify "Summer" appears in profile list with correct training photo references.

### Implementation for User Story 2

- [x] T014 [P] [US2] Implement `EXTRACT_VECTORS` command in `src/ml/worker.js`
- [x] T015 [P] [US2] Create `src/components/TrainModal.js` for photo selection (10-photo limit enforcement)
- [x] T016 [US2] Implement Style Profile logic in `src/services/ProfileService.js` (Mean vector calculation)
- [x] T017 [US2] Persist Style Profile and `ProfileTrainingPhotos` in the database

**Checkpoint**: User Story 2 is functional; users can now "train" the system

---

## Phase 5: User Story 3 - Discovering Matching Photos (Priority: P2)

**Goal**: Suggest photos that match the active Style Profile using a hybrid threshold logic.

**Independent Test**: Activate "Summer" profile; verify that matching suggestions (up to 50, >0.6 similarity) are highlighted or filtered.

### Implementation for User Story 3

- [x] T018 [P] [US3] Implement Cosine Similarity logic in `src/ml/similarity.js` (inside Worker)
- [x] T019 [P] [US3] Implement `CALCULATE_SIMILARITY` command in `src/ml/worker.js` (Hybrid Top N + Threshold)
- [x] T020 [US3] Create `src/components/SuggestionOverlay.js` to highlight matching photos in the grid
- [x] T021 [US3] Implement profile switching logic in the main dashboard UI

**Checkpoint**: All core features are functional

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T022 [P] Performance optimization: Verify 60 FPS scrolling with 10k photos using `VirtualGrid.js`
- [x] T023 [P] ML Model reliability: Run accuracy and bias benchmarks in `tests/unit/ml_audit.test.js`
- [x] T024 Accessibility audit: Verify WCAG 2.1 Level AA compliance across all UI components
- [x] T025 [P] Final documentation update in `specs/001-neuralsort-photo-manager/quickstart.md`
- [x] T026 Run end-to-end drag-and-drop validation with Playwright in `tests/e2e/dnd.test.js`
- [x] T027 [P] Privacy audit: Verify zero network calls during ML inference using browser network monitor (SC-003)
- [x] T028 Performance audit: Verify drag-and-drop input latency < 100ms for 50 albums (SC-001)

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 2 (Foundational)** depends on **Phase 1 (Setup)**.
- **Phase 3 (US1)**, **Phase 4 (US2)**, and **Phase 5 (US3)** can run in parallel *after* Phase 2 is complete.
- **Phase 6 (Polish)** depends on all User Story phases.

### Parallel Opportunities
- T005, T006, and T007 can be worked on simultaneously.
- UI Components (T009, T010, T015, T020) can be developed in parallel once data models are defined.

---

## Implementation Strategy

### MVP First
1. Complete Setup + Foundational.
2. Focus exclusively on **User Story 1** (Album Grouping & Re-ordering).
3. Validate with a local library of 100+ photos.

### Incremental Delivery
- Following US1, implement US2 to allow profile creation.
- Finally, implement US3 to enable the matching/suggestion engine.
