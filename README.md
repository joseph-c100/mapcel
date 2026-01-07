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

### Using the Generated Files

1. Create an HTML file:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Map</title>
  <script src="https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js"></script>
  <link href="https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css" rel="stylesheet" />
  <style>
    body { margin: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="./map.js"></script>
</body>
</html>
```

2. Serve the files via HTTP (not `file://`):

```bash
# Python
python -m http.server

# Node.js
npx http-server

# Or use VS Code Live Server extension
```

## Project Structure

```
mapcel/
├── src/
│   ├── lib/
│   │   ├── components/          # Svelte components
│   │   ├── stores/              # State management
│   │   ├── types/               # TypeScript types
│   │   └── utils/               # Utility functions
│   ├── routes/                  # SvelteKit routes
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── app.html                 # HTML template
│   └── app.css                  # Global styles
├── static/                      # Static assets
├── package.json
├── svelte.config.js            # SvelteKit config
├── vite.config.ts              # Vite config
└── tsconfig.json               # TypeScript config
```

## Architecture

### State Management
Uses Svelte 5 runes (`$state`, `$derived`, `$effect`) in a centralized store class.

### Core Pipeline
1. **Upload** → `FileUploader.svelte`
2. **Parse** → `csv-parser.ts` (PapaParse)
3. **Detect** → `coordinate-detector.ts`
4. **Validate** → `coordinate-validator.ts`
5. **Convert** → `geojson-generator.ts` (with projection)
6. **Preview** → `MapPreview.svelte` (MapLibre)
7. **Export** → `zip-generator.ts` + `maplibre-generator.ts`

### Projection
- Input: WGS84 (EPSG:4326) - standard lat/long
- Output: WGS84 (EPSG:4326) - standard lat/long with CRS declaration
- MapLibre automatically handles projection for display

## License

MIT

## Contributing

Pull requests welcome! This project follows The Economist's bespoke template conventions for interactive journalism.
