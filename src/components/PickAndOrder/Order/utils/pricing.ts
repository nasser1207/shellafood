/**
 * Pricing Calculation Utilities
 * Centralized pricing logic for order components
 */

export interface PricingBreakdown {
	basePrice: number;
	platformFee: number;
	subtotal: number;
	vat: number;
	total: number;
}

/**
 * Calculate pricing breakdown based on base price
 * @param basePrice - Base delivery/service price
 * @returns Complete pricing breakdown
 */
export const calculatePricing = (basePrice: number): PricingBreakdown => {
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
	};
};

/**
 * Format price with currency
 */
export const formatPrice = (price: number, isArabic: boolean): string => {
	return `${price.toFixed(2)} ${isArabic ? "ريال" : "SAR"}`;
};

