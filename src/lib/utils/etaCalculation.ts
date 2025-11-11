/**
 * ETA Calculation Utilities
 * Calculates estimated time of arrival based on distance and speed
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number
): number {
	const R = 6371; // Earth's radius in kilometers
	const dLat = toRadians(lat2 - lat1);
	const dLng = toRadians(lng2 - lng1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) *
			Math.cos(toRadians(lat2)) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;

	return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

/**
 * Calculate ETA in minutes based on distance
 * @param distanceKm Distance in kilometers
 * @param averageSpeedKmh Average speed in km/h (default: 40 km/h for city driving)
 * @returns ETA in minutes
 */
export function calculateETA(
	distanceKm: number,
	averageSpeedKmh: number = 40
): number {
	if (distanceKm <= 0) return 0;
	const timeHours = distanceKm / averageSpeedKmh;
	const timeMinutes = Math.ceil(timeHours * 60);
	return Math.max(1, timeMinutes); // Minimum 1 minute
}

/**
 * Calculate ETA from coordinates
 * @param driverLat Driver/Technician latitude
 * @param driverLng Driver/Technician longitude
 * @param userLat User destination latitude
 * @param userLng User destination longitude
 * @param averageSpeedKmh Average speed in km/h
 * @returns ETA in minutes
 */
export function calculateETAFromCoordinates(
	driverLat: number,
	driverLng: number,
	userLat: number,
	userLng: number,
	averageSpeedKmh: number = 40
): number {
	const distance = calculateDistance(driverLat, driverLng, userLat, userLng);
	return calculateETA(distance, averageSpeedKmh);
}

/**
 * Get ETA timestamp (current time + ETA minutes)
 * @param etaMinutes ETA in minutes
 * @returns ISO timestamp string
 */
export function getETATimestamp(etaMinutes: number): string {
	const now = new Date();
	const etaDate = new Date(now.getTime() + etaMinutes * 60 * 1000);
	return etaDate.toISOString();
}

/**
 * Format ETA minutes to human-readable string
 * @param minutes ETA in minutes
 * @param language Language code ('ar' or 'en')
 * @returns Formatted string
 */
export function formatETA(minutes: number, language: 'ar' | 'en' = 'en'): string {
	if (minutes <= 0) {
		return language === 'ar' ? 'وصل' : 'Arrived';
	}

	if (minutes < 60) {
		return language === 'ar'
			? `${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
			: `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (language === 'ar') {
		if (remainingMinutes === 0) {
			return `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
		}
		return `${hours} ${hours === 1 ? 'ساعة' : 'ساعات'} و ${remainingMinutes} ${remainingMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
	} else {
		if (remainingMinutes === 0) {
			return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
		}
		return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${remainingMinutes === 1 ? 'min' : 'mins'}`;
	}
}

