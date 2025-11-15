/**
 * Product Service
 * Business logic for product filtering, sorting, and manipulation
 */

import { Product } from "@/types/categories";

export interface FilterState {
	inStock?: boolean;
	hasOffers?: boolean;
	minRating?: number;
	priceRange?: [number, number];
	categories?: string[];
	departments?: string[];
}

export type SortOption = 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';

export class ProductService {
	/**
	 * Filter products based on filter state
	 */
	static filterProducts(
		products: Product[],
		filters: FilterState
	): Product[] {
		return products.filter(product => {
			// In stock filter
			if (filters.inStock && !product.inStock) {
				return false;
			}
			
			// Has offers filter
			if (filters.hasOffers) {
				if (!product.originalPrice || product.originalPrice <= product.price) {
					return false;
				}
			}
			
			// Min rating filter
			if (filters.minRating !== undefined && product.rating < filters.minRating) {
				return false;
			}
			
			// Price range filter
			if (filters.priceRange) {
				const [min, max] = filters.priceRange;
				if (product.price < min || product.price > max) {
					return false;
				}
			}
			
			// Categories filter
			if (filters.categories && filters.categories.length > 0) {
				if (!product.category || !filters.categories.includes(product.category)) {
					return false;
				}
			}
			
			// Departments filter
			if (filters.departments && filters.departments.length > 0) {
				if (!filters.departments.includes(product.department)) {
					return false;
				}
			}
			
			return true;
		});
	}

	/**
	 * Sort products based on sort option
	 */
	static sortProducts(
		products: Product[],
		sortBy: SortOption
	): Product[] {
		const sorted = [...products];
		
		switch (sortBy) {
			case 'price-asc':
				return sorted.sort((a, b) => a.price - b.price);
				
			case 'price-desc':
				return sorted.sort((a, b) => b.price - a.price);
				
			case 'rating':
				return sorted.sort((a, b) => {
					const ratingA = a.rating || 0;
					const ratingB = b.rating || 0;
					return ratingB - ratingA;
				});
				
			case 'name':
				return sorted.sort((a, b) => a.name.localeCompare(b.name));
				
			case 'newest':
				// Assuming products have a createdAt or similar field
				// For now, sort by ID (newer IDs come first)
				return sorted.sort((a, b) => b.id.localeCompare(a.id));
				
			case 'popular':
				return sorted.sort((a, b) => {
					const reviewsA = a.reviewsCount || 0;
					const reviewsB = b.reviewsCount || 0;
					return reviewsB - reviewsA;
				});
				
			default:
				return sorted;
		}
	}

	/**
	 * Filter and sort products in one operation
	 */
	static filterAndSortProducts(
		products: Product[],
		filters: FilterState,
		sortBy: SortOption = 'name'
	): Product[] {
		const filtered = this.filterProducts(products, filters);
		return this.sortProducts(filtered, sortBy);
	}

	/**
	 * Get products by department
	 */
	static getProductsByDepartment(
		products: Product[],
		department: string
	): Product[] {
		return products.filter(p => p.department === department);
	}

	/**
	 * Get products by store
	 */
	static getProductsByStore(
		products: Product[],
		storeId: string
	): Product[] {
		return products.filter(p => p.storeId === storeId);
	}

	/**
	 * Get related products (same store, different department)
	 */
	static getRelatedProducts(
		products: Product[],
		currentProduct: Product,
		limit: number = 6
	): Product[] {
		return products
			.filter(p => 
				p.id !== currentProduct.id &&
				p.storeId === currentProduct.storeId &&
				p.department !== currentProduct.department
			)
			.slice(0, limit);
	}

	/**
	 * Group products by department
	 */
	static groupProductsByDepartment(
		products: Product[]
	): Record<string, Product[]> {
		const grouped: Record<string, Product[]> = {};
		
		products.forEach(product => {
			const dept = product.department || 'other';
			if (!grouped[dept]) {
				grouped[dept] = [];
			}
			grouped[dept].push(product);
		});
		
		return grouped;
	}
}

