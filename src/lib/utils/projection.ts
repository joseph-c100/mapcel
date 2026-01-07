import proj4 from 'proj4';

// Define projections
const WGS84 = 'EPSG:4326';
const WEB_MERCATOR = 'EPSG:3857';

export function convertToWebMercator(longitude: number, latitude: number): [number, number] {
	const [x, y] = proj4(WGS84, WEB_MERCATOR, [longitude, latitude]);
	return [x, y];
}

export function convertToWGS84(x: number, y: number): [number, number] {
	const [longitude, latitude] = proj4(WEB_MERCATOR, WGS84, [x, y]);
	return [longitude, latitude];
}
