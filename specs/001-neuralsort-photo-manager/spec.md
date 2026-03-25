# Feature Specification: NeuralSort Photo Manager

**Feature Branch**: `001-neuralsort-photo-manager`
**Created**: 2026-03-16
**Status**: Draft
**Input**: User description: "Build 'NeuralSort,' a photo manager where users group albums by date. Include a 'Train' mode: users select 10 photos as a 'Style Profile.' The app uses a pre-trained model to extract feature vectors and suggests other photos that match that profile. Drag-and-drop is the primary way to re-order albums on the main dashboard."

## Clarifications

### Session 2026-03-16
- Q: Should the system persist the original 10 photos used for training, or only the resulting feature vectors? â†’ A: Store vectors + references to the 10 source photos (allows viewing/editing training set)
- Q: When a user re-orders albums, how should the new order be persisted? â†’ A: Store an explicit `display_order` integer for each album (simplest retrieval)
- Q: When new photos are added to the library, how should albums be updated? â†’ A: Automatic: Real-time or background update as photos are discovered
- Q: Should the system support multiple named Style Profiles? â†’ A: Multiple: Users can name, save, and switch between several Style Profiles
- Q: How should the system determine if a photo "matches" a Style Profile? â†’ A: Hybrid: Top N, but only if they meet a minimum "good enough" threshold

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Grouping and Re-ordering Albums (Priority: P1)

As a user, I want to see my photos grouped into albums by date and be able to re-order these albums manually via drag-and-drop so that I can organize my memories in a way that makes sense to me.

**Why this priority**: Core functionality for organization and user control.

**Independent Test**: Can be tested by verifying that albums are automatically created based on photo dates and that drag-and-drop interaction successfully persists a new album order.

**Acceptance Scenarios**:

1. **Given** a set of photos with different timestamps, **When** I open the app, **Then** photos are automatically grouped into albums by date (e.g., "March 16, 2026").
2. **Given** multiple date-based albums on the dashboard, **When** I drag an album to a new position, **Then** the album order is updated and remains persisted after a refresh.

---

### User Story 2 - Creating a Style Profile (Priority: P2)

As a user, I want to select exactly 10 photos to "train" a Style Profile so that the app understands my aesthetic preferences.

**Why this priority**: Essential step to enable the "NeuralSort" matching feature.

**Independent Test**: Can be tested by selecting 10 photos in "Train" mode and verifying that a profile is generated and stored locally.

**Acceptance Scenarios**:

1. **Given** I am in "Train" mode, **When** I select 10 photos and click "Generate Profile", **Then** the system extracts feature vectors (locally) and saves the profile.
2. **Given** I am in "Train" mode, **When** I select fewer than 10 photos, **Then** the "Generate Profile" action is disabled or provides feedback.

---

### User Story 3 - Discovering Matching Photos (Priority: P2)

As a user, I want the app to suggest photos from my collection that match my active Style Profile so that I can quickly find similar photos.

**Why this priority**: Key value proposition of the "NeuralSort" feature.

**Independent Test**: Can be tested by applying a Style Profile and verifying that suggested photos have a high similarity score (calculated locally) to the training set.

**Acceptance Scenarios**:

1. **Given** an active Style Profile, **When** I view my photo library, **Then** the app highlights or suggests photos that match the profile's aesthetic.

## Requirements *(mandatory)*

> **Constitution Alignment**: Ensure requirements adhere to Core Principles: Privacy (Local Processing), Performance (Lazy Loading), ML Reliability (Strict Testing), and Accessibility (WCAG 2.1 AA).

### Functional Requirements

- **FR-001**: System MUST automatically group photos into albums based on their capture date (YYYY-MM-DD), updating in real-time or background as new photos are discovered.
- **FR-002**: Dashboard MUST support drag-and-drop re-ordering of albums.
- **FR-003**: System MUST provide a "Train" mode for creating and naming multiple "Style Profiles" using exactly 10 user-selected photos.
- **FR-004**: System MUST extract feature vectors from selected photos using the MobileNetV3 architecture for local vector extraction, with matching results limited to the Top 50 photos meeting a minimum similarity threshold of 0.6.
- **FR-005**: All ML processing (feature extraction and similarity comparison) MUST occur locally on the user's device.
- **FR-006**: Dashboard MUST use lazy loading for image previews to maintain 60 FPS performance during scroll.
- **FR-007**: Drag-and-drop interactions MUST be keyboard-accessible and provide screen reader feedback.
- **FR-008**: System MUST display a user-friendly error message if the ML model or SQL database fails to initialize (Fallback).
- **FR-009**: System MUST notify the user if local storage limits are reached and prevent data-loss by pausing background sync (Persistence Failure).
- **FR-010**: Manual album re-ordering MUST take precedence over automatic date-based sorting; background sync MUST NOT overwrite user-defined `display_order` (Conflict Resolution).

### Key Entities

- **Album**: Represents a collection of photos grouped by date, with a persistent `display_order` integer and associated date metadata.
- **Photo**: Individual media item with metadata (date, path) and an associated feature vector.
- **Style Profile**: A saved set of feature vectors derived from 10 training photos, along with a unique **Name** and references to those 10 specific photos, used to calculate similarity scores.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can re-order 50 albums on the dashboard with zero perceptible lag (input latency < 100ms).
- **SC-002**: Photo gallery scrolling maintains a consistent 60 FPS even with 10,000+ photos in the library.
- **SC-003**: 100% of ML operations are verified to stay on-device (zero network calls to external ML services).
- **SC-004**: Drag-and-drop re-ordering can be fully completed using only keyboard controls.
- **SC-005**: Matching suggestions (Top 50 meeting minimum similarity threshold) appear within 2 seconds of applying a Style Profile for a library of 1,000 photos.

### Assumptions
- Photos have valid "date taken" metadata.
- A pre-trained model suitable for local execution (e.g., MobileNet, CLIP-lite) will be provided or selected.
