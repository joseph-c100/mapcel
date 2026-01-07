import JSZip from 'jszip';
import type { CSVDataset, MapSettings } from '$lib/types/app';
import { generateMapLibreCode } from './maplibre-generator';

export async function generateZipFile(
	datasets: CSVDataset[],
	settings: MapSettings
): Promise<Blob> {
	const zip = new JSZip();

	// Add GeoJSON files
	datasets.forEach((dataset) => {
		const filename = `${dataset.name.replace('.csv', '')}.geojson`;
		zip.file(filename, JSON.stringify(dataset.geojson, null, 2));
	});

	// Add MapLibre JS code
	const mapCode = generateMapLibreCode(datasets, settings);
	zip.file('map.js', mapCode);

	// Add README with instructions
	const readme = `# Mapcel Export

## Files Included
${datasets.map((ds) => `- ${ds.name.replace('.csv', '')}.geojson`).join('\n')}
- map.js (MapLibre GL JS code)

## Usage Instructions

1. Create an HTML file with the following content:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Mapcel Map</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js"></script>
  <link href="https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css" rel="stylesheet" />
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="./map.js"></script>
</body>
</html>
\`\`\`

2. Place this HTML file in the same directory as your GeoJSON files and map.js

3. Open the HTML file in a web browser (must be served via HTTP/HTTPS, not file://)
   - You can use a simple HTTP server like:
     - Python: \`python -m http.server\`
     - Node.js: \`npx http-server\`
     - VS Code: Use the "Live Server" extension

## Map Settings
- Style URL: ${settings.styleUrl}
- Min Zoom: ${settings.minZoom}
- Max Zoom: ${settings.maxZoom}
- Controls Enabled: ${settings.enableControls}

Generated with Mapcel
`;

	zip.file('README.md', readme);

	// Generate ZIP
	return await zip.generateAsync({ type: 'blob' });
}

export function downloadZip(blob: Blob, filename: string = 'mapcel-export.zip') {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
