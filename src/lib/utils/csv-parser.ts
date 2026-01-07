import Papa from 'papaparse';
import type { CSVDataset, ValidationError, GeoJSONWithCRS } from '$lib/types/app';
import { detectCoordinateColumns } from './coordinate-detector';
import { validateDataset } from './coordinate-validator';
import { generateGeoJSON } from './geojson-generator';

export async function parseCSVFile(file: File): Promise<CSVDataset> {
	return new Promise((resolve, reject) => {
		Papa.parse(file, {
			complete: (results) => {
				try {
					const headers = results.data[0] as string[];
					const data = results.data.slice(1) as string[][];

					// Filter out empty rows
					const filteredData = data.filter((row) => row.some((cell) => cell.trim() !== ''));

					const { latColumn, longColumn } = detectCoordinateColumns(headers);

					let validationErrors: ValidationError[] = [];
					let geojson: GeoJSONWithCRS | null = null;

					if (latColumn && longColumn) {
						validationErrors = validateDataset(filteredData, headers, latColumn, longColumn);

						if (validationErrors.length === 0) {
							const name = file.name.replace('.csv', '');
							geojson = generateGeoJSON(filteredData, headers, latColumn, longColumn, name);
						}
					} else {
						validationErrors = [
							{
								row: 0,
								column: '',
								value: null,
								message:
									'Could not auto-detect latitude/longitude columns. Expected column names like: lat, latitude, lng, lon, long, longitude'
							}
						];
					}

					const dataset: CSVDataset = {
						id: crypto.randomUUID(),
						name: file.name,
						file,
						rawData: filteredData,
						headers,
						latColumn,
						longColumn,
						validationErrors,
						geojson,
						styling: {
							color: generateRandomColor(),
							radius: 5,
							opacity: 0.8
						}
					};

					resolve(dataset);
				} catch (error) {
					reject(new Error(`Error processing CSV: ${error instanceof Error ? error.message : String(error)}`));
				}
			},
			error: (error) => {
				reject(new Error(`Error parsing CSV: ${error.message}`));
			}
		});
	});
}

function generateRandomColor(): string {
	const hue = Math.floor(Math.random() * 360);
	return `hsl(${hue}, 70%, 50%)`;
}
