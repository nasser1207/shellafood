import { useState, useCallback, useMemo } from "react";
import { TEST_STORES, TEST_PRODUCTS } from "@/lib/data/categories/testData";
import { Store } from "@/components/Utils/StoreCard";
import { Product } from "@/components/Utils/ProductCard";

export interface SearchOptions {
	query: string;
	filters?: {
		sortBy?: "relevance" | "rating" | "distance" | "price";
		minRating?: number | null;
		priceRange?: [number, number] | null;
		categories?: string[];
	};
}

interface SearchResult {
	stores: Store[];
	products: Product[];
	total: number;
}

/**
 * Custom hook for search functionality
 */
export function useSearch() {
	const [isSearching, setIsSearching] = useState(false);

	const performSearch = useCallback(
		async ({ query, filters = {} }: SearchOptions): Promise<SearchResult> => {
			if (!query.trim()) {
				return { stores: [], products: [], total: 0 };
			}

			setIsSearching(true);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 300));

			try {
				const searchLower = query.toLowerCase();

				// Filter stores
				let storeResults: Store[] = TEST_STORES.filter((store) => {
					const nameMatch = store.name?.toLowerCase().includes(searchLower);
					const nameArMatch = store.nameAr?.toLowerCase().includes(searchLower);
					const descMatch = store.description?.toLowerCase().includes(searchLower);
					return nameMatch || nameArMatch || descMatch;
				}) as Store[];

				// Filter products
				let productResults: Product[] = TEST_PRODUCTS.filter((product) => {
					const nameMatch = product.name?.toLowerCase().includes(searchLower);
					const nameArMatch = product.nameAr?.toLowerCase().includes(searchLower);
					return nameMatch || nameArMatch;
				}) as Product[];

				// Apply filters
				if (filters.minRating) {
					storeResults = storeResults.filter(
						(store) => parseFloat(store.rating || "0") >= filters.minRating!
					);
				}

				if (filters.priceRange) {
					const [min, max] = filters.priceRange;
					productResults = productResults.filter((product) => {
						const price = product.price || 0;
						return price >= min && price <= max;
					});
				}

				// Sort results
				if (filters.sortBy === "rating") {
					storeResults.sort((a, b) => {
						const ratingA = parseFloat(a.rating || "0");
						const ratingB = parseFloat(b.rating || "0");
						return ratingB - ratingA;
					});
				} else if (filters.sortBy === "price") {
					productResults.sort((a, b) => (a.price || 0) - (b.price || 0));
				}

				return {
					stores: storeResults,
					products: productResults,
					total: storeResults.length + productResults.length,
				};
			} finally {
				setIsSearching(false);
			}
		},
		[]
	);

	return {
		performSearch,
		isSearching,
	};
}

