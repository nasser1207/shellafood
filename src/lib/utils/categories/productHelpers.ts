/**
 * Product utility functions
 * Reusable helpers for product-related calculations and formatting
 */

import { Product } from "@/types/categories";

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (product: Product): number => {
	if (!product.originalPrice || product.originalPrice <= product.price) {
		return 0;
	}
	return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
};

/**
 * Format price with currency
 */
export const formatPrice = (price: number, currency = 'SAR', language: 'ar' | 'en' = 'en'): string => {
	const formattedPrice = price.toFixed(2);
	const currencySymbol = language === 'ar' ? 'ريال' : currency;
	return `${formattedPrice} ${currencySymbol}`;
};

/**
 * Check if product is available
 */
export const isProductAvailable = (product: Product): boolean => {
	return product.inStock && (product.stockQuantity === undefined || product.stockQuantity > 0);
};

/**
 * Get badge color class based on badge type
 */
export const getProductBadgeColor = (badge?: string): string => {
	if (!badge) return '';
	
	const badgeLower = badge.toLowerCase();
	const colors: Record<string, string> = {
		'sale': 'bg-red-500',
		'تخفيض': 'bg-red-500',
		'new': 'bg-green-500',
		'جديد': 'bg-green-500',
		'popular': 'bg-orange-500',
		'شائع': 'bg-orange-500',
		'limited': 'bg-purple-500',
		'محدود': 'bg-purple-500',
		'hot': 'bg-red-600',
		'حار': 'bg-red-600',
	};
	
	return colors[badgeLower] || 'bg-gray-500';
};

/**
 * Get product display name based on language
 */
export const getProductName = (product: Product, language: 'ar' | 'en' = 'en'): string => {
	return language === 'ar' && product.nameAr ? product.nameAr : product.name;
};

/**
 * Get product display description based on language
 */
export const getProductDescription = (product: Product, language: 'ar' | 'en' = 'en'): string => {
	return language === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
};

/**
 * Get product display unit based on language
 */
export const getProductUnit = (product: Product, language: 'ar' | 'en' = 'en'): string => {
	return language === 'ar' && product.unitAr ? product.unitAr : product.unit;
};

/**
 * Get product display badge based on language
 */
export const getProductBadge = (product: Product, language: 'ar' | 'en' = 'en'): string | undefined => {
	return language === 'ar' && product.badgeAr ? product.badgeAr : product.badge;
};

/**
 * Get product images array (fallback to single image)
 */
export const getProductImages = (product: Product): string[] => {
	if (product.images && product.images.length > 0) {
		return product.images;
	}
	return product.image ? [product.image] : [];
};

/**
 * Check if product has discount
 */
export const hasDiscount = (product: Product): boolean => {
	return product.originalPrice !== undefined && 
		   product.originalPrice > product.price;
};

/**
 * Get stock status text
 */
export const getStockStatus = (product: Product, language: 'ar' | 'en' = 'en'): string => {
	if (!product.inStock) {
		return language === 'ar' ? 'نفد المخزون' : 'Out of Stock';
	}
	
	if (product.stockQuantity !== undefined && product.stockQuantity < 10) {
		return language === 'ar' 
			? `متبقي ${product.stockQuantity} فقط!` 
			: `Only ${product.stockQuantity} left!`;
	}
	
	return language === 'ar' ? 'متوفر' : 'In Stock';
};

/**
 * Format rating with reviews count
 */
export const formatRating = (product: Product, language: 'ar' | 'en' = 'en'): string => {
	if (!product.rating) return '';
	
	const rating = product.rating.toFixed(1);
	const reviews = product.reviewsCount 
		? product.reviewsCount > 999 
			? '999+' 
			: product.reviewsCount.toString()
		: '';
	
	if (!reviews) return rating;
	
	return language === 'ar' 
		? `${rating} (${reviews} ${product.reviewsCount === 1 ? 'تقييم' : 'تقييمات'})`
		: `${rating} (${reviews} ${product.reviewsCount === 1 ? 'review' : 'reviews'})`;
};

