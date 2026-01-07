import type { Feature, Point } from 'geojson';

// Extended GeoJSON FeatureCollection with CRS
export interface GeoJSONWithCRS {
	type: 'FeatureCollection';
	name: string;
	crs: {
		type: 'name';
		properties: {
			name: string;
		};
	};
	features: Feature<Point>[];
}

export interface CSVDataset {
	id: string;
	name: string;
	file: File;
	rawData: string[][];
	headers: string[];
	latColumn: string | null;
	longColumn: string | null;
	validationErrors: ValidationError[];
	geojson: GeoJSONWithCRS | null;
	styling: DatasetStyling;
}

export interface DatasetStyling {
	color: string;
	radius: number;
	opacity: number;
}

export interface ValidationError {
	row: number;
	column: string;
	value: unknown;
	message: string;
}

export interface MapSettings {
	styleUrl: string;
	minZoom: number;
	maxZoom: number;
	enableControls: boolean;
	initialCenter: [number, number];
	initialZoom: number;
}

export interface CoordinateColumns {
	latColumn: string | null;
	longColumn: string | null;
}
