/**
 * Pricing Calculation Utilities
 * Centralized pricing logic for all order components
 * This ensures consistency across OrderDetails, OrderSummary, OrderPayment, OrderConfirmation, and MyOrders pages
 */

export interface LocationPoint {
	lat: number;
	lng: number;
}

export interface PricingBreakdown {
	basePrice: number;
	platformFee: number;
	subtotal: number;
	vat: number;
	total: number;
	distance: number; // in kilometers
}

export interface OrderPricingData {
	transportType: "motorbike" | "truck";
	locationPoints: Array<{
		location: LocationPoint | null;
	}>;
	isExpress?: boolean;
	requiresRefrigeration?: boolean;
	loadingEquipmentNeeded?: boolean;
}

/**
 * Calculate distance between two geographic points using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
	const R = 6371; // Earth's radius in km
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
		Math.cos((lat2 * Math.PI) / 180) *
		Math.sin(dLon / 2) *
		Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

/**
 * Calculate total distance from location points
 * @param locationPoints - Array of location points with lat/lng
 * @returns Total distance in kilometers
 */
export const calculateTotalDistance = (locationPoints: Array<{ location: LocationPoint | null }>): number => {
	if (!locationPoints || locationPoints.length < 2) return 0;
	
	let totalDist = 0;
	
	for (let i = 0; i < locationPoints.length - 1; i++) {
		const point1 = locationPoints[i];
		const point2 = locationPoints[i + 1];
		
		if (point1.location && point2.location) {
			const dist = calculateDistance(
				point1.location.lat,
				point1.location.lng,
				point2.location.lat,
				point2.location.lng
			);
			totalDist += dist;
		}
	}
	
	return totalDist;
};

/**
 * Calculate base price from order data
 * @param orderData - Order data including transport type, locations, and special requirements
 * @returns Base delivery price
 */
export const calculateBasePrice = (orderData: OrderPricingData): number => {
	const distance = calculateTotalDistance(orderData.locationPoints);
	const isMotorbike = orderData.transportType === "motorbike";
	
	// Price per kilometer based on transport type
	const pricePerKm = isMotorbike ? 2.5 : 5.0;
	let basePrice = distance * pricePerKm;
	
	// Add extra charges for special requirements
	if (orderData.isExpress) {
		basePrice += 20; // Express delivery fee
	}
	if (orderData.requiresRefrigeration) {
		basePrice += 15; // Refrigeration fee
	}
	if (orderData.loadingEquipmentNeeded) {
		basePrice += 25; // Loading equipment fee
	}
	
	// Set minimum base price
	const minimumPrice = isMotorbike ? 15 : 30;
	basePrice = Math.max(basePrice, minimumPrice);
	
	// Round to 2 decimal places
	return Math.round(basePrice * 100) / 100;
};

/**
 * Calculate complete pricing breakdown from order data
 * This is the main function used across all order pages
 * @param orderData - Order data
 * @returns Complete pricing breakdown with all fees
 */
export const calculateOrderPricing = (orderData: OrderPricingData): PricingBreakdown => {
	const distance = calculateTotalDistance(orderData.locationPoints);
	const basePrice = calculateBasePrice(orderData);
	
	return calculatePricing(basePrice, distance);
};

/**
 * Calculate pricing breakdown based on base price
 * @param basePrice - Base delivery/service price
 * @param distance - Total distance in kilometers (optional, for reference)
 * @returns Complete pricing breakdown
 */
export const calculatePricing = (basePrice: number, distance: number = 0): PricingBreakdown => {
	const platformFeeRate = 0.10; // 10% platform fee
	const vatRate = 0.15; // 15% VAT

	const platformFee = Math.round(basePrice * platformFeeRate * 100) / 100;
	const subtotal = basePrice + platformFee;
	const vat = Math.round(subtotal * vatRate * 100) / 100;
	const total = Math.round((subtotal + vat) * 100) / 100;

	return {
		basePrice,
		platformFee,
		subtotal,
		vat,
		total,
		distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
	};
};

/**
 * Format price with currency
 */
export const formatPrice = (price: number, isArabic: boolean): string => {
	return `${price.toFixed(2)} ${isArabic ? "ريال" : "SAR"}`;
};

/**
 * Format distance with unit
 */
export const formatDistance = (distance: number, isArabic: boolean): string => {
	return `${distance.toFixed(1)} ${isArabic ? "كم" : "km"}`;
};

