import type { ValidationError } from '$lib/types/app';

export function validateCoordinate(
	value: unknown,
	type: 'lat' | 'long'
): { valid: boolean; error?: string } {
	const num = parseFloat(String(value));

	if (isNaN(num)) {
		return { valid: false, error: 'Not a valid number' };
	}

	if (type === 'lat') {
		if (num < -90 || num > 90) {
			return { valid: false, error: 'Latitude must be between -90 and 90' };
		}
	} else {
		if (num < -180 || num > 180) {
			return { valid: false, error: 'Longitude must be between -180 and 180' };
		}
	}

	return { valid: true };
}

export function validateDataset(
	data: string[][],
	headers: string[],
	latColumn: string,
	longColumn: string
): ValidationError[] {
	const errors: ValidationError[] = [];
	const latIndex = headers.indexOf(latColumn);
	const longIndex = headers.indexOf(longColumn);

	data.forEach((row, rowIndex) => {
		const latValidation = validateCoordinate(row[latIndex], 'lat');
		const longValidation = validateCoordinate(row[longIndex], 'long');

		if (!latValidation.valid) {
			errors.push({
				row: rowIndex + 2, // +2 because row 0 is headers and we want 1-indexed for user display
				column: latColumn,
				value: row[latIndex],
				message: latValidation.error!
			});
		}

		if (!longValidation.valid) {
			errors.push({
				row: rowIndex + 2, // +2 because row 0 is headers and we want 1-indexed for user display
				column: longColumn,
				value: row[longIndex],
				message: longValidation.error!
			});
		}
	});

	return errors;
}
