/**
 * Parse address components from Google Maps Geocoding response
 * Extracts street, area, city, and building information
 */

export interface ParsedAddress {
	street: string;
	area: string;
	city: string;
	building: string;
	fullAddress: string;
}

/**
 * Parse Google Maps geocoding result into structured address components
 */
export const parseAddressComponents = (
	geocodeResult: google.maps.GeocoderResult
): ParsedAddress => {
	const components = geocodeResult.address_components || [];
	const formattedAddress = geocodeResult.formatted_address || "";

	// Helper to find component by type
	const findComponent = (types: string[]) => {
		return components.find((comp) =>
			types.some((type) => comp.types.includes(type))
		);
	};

	// Extract components
	const route = findComponent(["route"]); // Street name
	const sublocality = findComponent(["sublocality", "sublocality_level_1"]); // Area/Neighborhood
	const locality = findComponent(["locality"]); // City
	const administrativeArea = findComponent([
		"administrative_area_level_1",
	]); // Province/State
	const streetNumber = findComponent(["street_number"]); // Building number
	const subpremise = findComponent(["subpremise"]); // Floor/Unit

	// Build address parts
	const street = route?.long_name || "";
	const area = sublocality?.long_name || "";
	const city =
		locality?.long_name ||
		administrativeArea?.long_name ||
		""; // Fallback to province if no city
	const building = subpremise
		? `${streetNumber?.long_name || ""} ${subpremise.long_name}`.trim()
		: streetNumber?.long_name || "";

	return {
		street: street,
		area: area,
		city: city,
		building: building,
		fullAddress: formattedAddress,
	};
};

