import type { CSVDataset, MapSettings } from '$lib/types/app';

export function generateMapLibreCode(datasets: CSVDataset[], settings: MapSettings): string {
	const geojsonFiles = datasets.map((ds, index) => {
		const filename = `${ds.name.replace('.csv', '')}.geojson`;
		return { filename, dataset: ds, index };
	});

	const fetchStatements = geojsonFiles
		.map(
			({ filename, index }) =>
				`  const response${index} = await fetch('./${filename}');
  const geojsonData${index} = await response${index}.json();`
		)
		.join('\n');

	const addLayerStatements = geojsonFiles
		.map(
			({ dataset, index }) =>
				`  map.addSource('dataset-${index}', {
    type: 'geojson',
    data: geojsonData${index}
  });

  map.addLayer({
    id: 'dataset-${index}-circles',
    type: 'circle',
    source: 'dataset-${index}',
    paint: {
      'circle-radius': ${dataset.styling.radius},
      'circle-color': '${dataset.styling.color}',
      'circle-opacity': ${dataset.styling.opacity}
    }
  });`
		)
		.join('\n\n');

	return `// MapLibre GL JS Map Code
// Include this script after loading MapLibre GL JS library
// Required: <script src="https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.js"></script>
// Required: <link href="https://unpkg.com/maplibre-gl@5/dist/maplibre-gl.css" rel="stylesheet" />

(async function() {
  // Load GeoJSON files
${fetchStatements}

  // Initialize map
  const map = new maplibregl.Map({
    container: 'map',
    style: '${settings.styleUrl}',
    center: [${settings.initialCenter[0]}, ${settings.initialCenter[1]}],
    zoom: ${settings.initialZoom},
    minZoom: ${settings.minZoom},
    maxZoom: ${settings.maxZoom}${!settings.enableControls ? ',\n    interactive: false' : ''}
  });

${settings.enableControls ? '  map.addControl(new maplibregl.NavigationControl());\n' : ''}
  map.on('load', () => {
${addLayerStatements}
  });
})();
`;
}
