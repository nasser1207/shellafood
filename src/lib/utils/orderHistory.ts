import { Product } from '@/components/Utils/ProductCard';
import { TEST_PRODUCTS } from '@/lib/data/categories/testData';

/**
 * Mock function to get last order items for a store
 * In production, this should fetch from API based on user's order history
 */
export function getLastOrderItems(storeId: string): Product[] {
	// Generate consistent "last order" based on storeId hash
	const hash = storeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const itemCount = (hash % 3) + 3; // 3-5 items
	
	// Get products from this store
	const storeProducts = TEST_PRODUCTS.filter(p => p.storeId === storeId);
	
	// If store has products, use them; otherwise use random products
	if (storeProducts.length > 0) {
		// Shuffle and take items
		const shuffled = [...storeProducts].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, Math.min(itemCount, storeProducts.length));
	}
	
	// Fallback: use random products from all products
	const shuffled = [...TEST_PRODUCTS].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, itemCount);
}

/**
 * Mock function to get last order date
 * In production, fetch actual order date from API
 */
export function getLastOrderDate(storeId: string, language: 'ar' | 'en' = 'en'): string {
	const hash = storeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const daysAgo = (hash % 14) + 1; // 1-14 days ago
	
	if (language === 'ar') {
		if (daysAgo === 1) return 'منذ يوم واحد';
		if (daysAgo === 2) return 'منذ يومين';
		if (daysAgo <= 10) return `منذ ${daysAgo} أيام`;
		return `منذ ${daysAgo} يوم`;
	}
	
	if (daysAgo === 1) return '1 day ago';
	return `${daysAgo} days ago`;
}

