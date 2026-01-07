import type { CoordinateColumns } from '$lib/types/app';

export function detectCoordinateColumns(headers: string[]): CoordinateColumns {
	const latPatterns = ['lat', 'latitude', 'y'];
	const longPatterns = ['lon', 'long', 'lng', 'longitude', 'x'];

	const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());

	// Helper function to match patterns with priority for exact matches
	function findMatchingColumn(patterns: string[]): string | null {
		// First, try exact matches
		for (const pattern of patterns) {
			const index = normalizedHeaders.findIndex((h) => h === pattern);
			if (index !== -1) {
				return headers[index];
			}
		}

		// Then, try patterns that match the entire header (for compound names like "lat_deg")
		for (const pattern of patterns) {
			const index = normalizedHeaders.findIndex((h) => {
				// Skip single-letter patterns for partial matching to avoid false positives
				if (pattern.length === 1) return false;
				return h.includes(pattern);
			});
			if (index !== -1) {
				return headers[index];
			}
		}

		return null;
	}

	const latColumn = findMatchingColumn(latPatterns);
	const longColumn = findMatchingColumn(longPatterns);

	return { latColumn, longColumn };
}
