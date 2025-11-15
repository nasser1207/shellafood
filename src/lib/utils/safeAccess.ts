/**
 * Safe access utilities for null/undefined handling
 * Prevents runtime errors from missing data
 */

import { Product, Store } from "@/types/categories";

export const safeAccess = {
	product: {
		name: (product: Product | null | undefined, language: 'ar' | 'en' = 'en'): string => {
			if (!product) return language === 'ar' ? 'منتج غير معروف' : 'Unknown Product';
			return language === 'ar' && product.nameAr ? product.nameAr : product.name;
		},
		
		price: (product: Product | null | undefined): number => {
			if (!product || typeof product.price !== 'number') return 0;
			return product.price;
		},
		
		images: (product: Product | null | undefined): string[] => {
			if (!product) return [];
			if (product.images && product.images.length > 0) {
				return product.images;
			}
			return product.image ? [product.image] : [];
		},
		
		availability: (product: Product | null | undefined): boolean => {
			if (!product) return false;
			return product.inStock && (product.stockQuantity === undefined || product.stockQuantity > 0);
		},
		
		description: (product: Product | null | undefined, language: 'ar' | 'en' = 'en'): string => {
			if (!product) return '';
			return language === 'ar' && product.descriptionAr ? product.descriptionAr : product.description;
		},
	},
	
	store: {
		name: (store: Store | null | undefined, language: 'ar' | 'en' = 'en'): string => {
			if (!store) return language === 'ar' ? 'متجر غير معروف' : 'Unknown Store';
			return language === 'ar' && store.nameAr ? store.nameAr : store.name;
		},
		
		rating: (store: Store | null | undefined): number => {
			if (!store || typeof store.rating !== 'number') return 0;
			return store.rating;
		},
		
		deliveryTime: (store: Store | null | undefined, language: 'ar' | 'en' = 'en'): string => {
			if (!store) return '';
			return language === 'ar' && store.deliveryTimeAr ? store.deliveryTimeAr : store.deliveryTime;
		},
	},
};

