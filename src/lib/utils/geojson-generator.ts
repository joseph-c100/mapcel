import type { Feature, Point } from 'geojson';
import type { GeoJSONWithCRS } from '$lib/types/app';

export function generateGeoJSON(
	data: string[][],
	headers: string[],
	latColumn: string,
	longColumn: string,
	name: string
): GeoJSONWithCRS {
	const latIndex = headers.indexOf(latColumn);
	const longIndex = headers.indexOf(longColumn);

	const features: Feature<Point>[] = data
		.map((row) => {
			const lat = parseFloat(row[latIndex]);
			const long = parseFloat(row[longIndex]);

			if (isNaN(lat) || isNaN(long)) return null;

			// Build properties from all columns
			const properties: Record<string, unknown> = {};
			headers.forEach((header, i) => {
				properties[header] = row[i];
			});

			const feature: Feature<Point> = {
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [long, lat]
				},
				properties
			};
			return feature;
		})
		.filter((f): f is Feature<Point> => f !== null);

	return {
		type: 'FeatureCollection',
		name: name,
		crs: {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::4326'
			}
		},
		features
	};
}
