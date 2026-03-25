# Data Model: NeuralSort Photo Manager

## Database Schema (SQL.js / SQLite)

### 1. Photos Table
Stores metadata for individual photos and their extracted aesthetic feature vectors.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique ID |
| path | TEXT | NOT NULL, UNIQUE | Local file path or reference |
| date_taken | TEXT | NOT NULL | ISO-8601 format (YYYY-MM-DD) |
| album_id | INTEGER | FOREIGN KEY | References Albums(id) |
| vector | BLOB | NOT NULL | Float32Array serialized (feature vector) |

### 2. Albums Table
Groups photos by date, with persistent user-defined ordering.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique ID |
| title | TEXT | NOT NULL | Album name (default: date_taken) |
| date_key | TEXT | NOT NULL, UNIQUE | YYYY-MM-DD used for auto-grouping |
| display_order | INTEGER | NOT NULL | User-defined sorting position |

### 3. StyleProfiles Table
Stores named aesthetic profiles created in "Train" mode.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY | Unique ID |
| name | TEXT | NOT NULL, UNIQUE | User-provided name (e.g., "Summer") |
| mean_vector | BLOB | NOT NULL | Averaged feature vector from 10 photos |

### 4. ProfileTrainingPhotos Table
Links Style Profiles to their 10 source photos (B-reference requirement).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| profile_id | INTEGER | FOREIGN KEY | References StyleProfiles(id) |
| photo_id | INTEGER | FOREIGN KEY | References Photos(id) |
| PRIMARY KEY | (profile_id, photo_id) | | |

## State Transitions & Validation

- **Photo Ingestion**: 
    - File Added â†’ Extract Exif Date â†’ Assign to (or Create) Album.
    - Status: Pending ML Extraction â†’ Vector Computed â†’ Ready for Matching.
- **Album Re-ordering**:
    - Update `display_order` for affected albums in a single transaction.
- **Style Profile Creation**:
    - Select Exactly 10 Photos â†’ Compute Mean Vector â†’ Save Profile.
