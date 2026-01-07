# Mapcel

CSV to GeoJSON + MapLibre Converter

## Overview

Mapcel is a static web application that converts CSV files containing geographic coordinates to GeoJSON format with MapLibre GL JS visualization code. All processing happens client-side in the browser.

## Features

- **Multiple CSV Upload**: Drag-and-drop or browse to upload multiple CSV files
- **Auto-Detection**: Automatically detects latitude/longitude columns
- **Validation**: Validates coordinates and reports errors
- **GeoJSON Output**: Outputs in WGS84 (EPSG:4326) projection with proper CRS declaration
- **Live Preview**: Interactive MapLibre preview of your data
- **Customization**:
  - Circle color, radius, and opacity per dataset
  - Map style URL configuration
  - Min/max zoom levels
  - Enable/disable map controls
- **Export**: Download ZIP with GeoJSON files and MapLibre JS code

## Tech Stack

- **Svelte 5** - Modern reactive framework with runes
- **SvelteKit** - App framework with static adapter
- **MapLibre GL JS** - Map rendering
- **PapaParse** - CSV parsing
- **Proj4** - Coordinate projection
- **JSZip** - ZIP file generation
- **TypeScript** - Type safety

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm run dev

# Type check
pnpm run check

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## CSV Format Requirements

CSV files must contain coordinate columns with recognizable names:

- **Latitude**: `lat`, `latitude`, `y` (case-insensitive)
- **Longitude**: `lon`, `long`, `lng`, `longitude`, `x` (case-insensitive)

Coordinates must be in WGS84 format:

- Latitude: -90 to 90
- Longitude: -180 to 180

### Example CSV

```csv
name,lat,lng,population
New York,40.7128,-74.0060,8336817
London,51.5074,-0.1278,9002488
Tokyo,35.6762,139.6503,13960000
```

## Output

The tool generates a ZIP file containing:

1. **GeoJSON files** (`.geojson`) - One per CSV, in WGS84 (EPSG:4326) projection with CRS declaration
2. **MapLibre code** (`map.js`) - JavaScript to render the map
3. **README** (`README.md`) - Usage instructions
