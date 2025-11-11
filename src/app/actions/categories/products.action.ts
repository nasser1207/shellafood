'use server';

import { Product } from '@/components/Utils/ProductCard';
import { Store } from '@/components/Utils/StoreCard';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface GetProductBySlugResult {
	success: boolean;
	product?: Product;
	relatedProducts?: Product[];
	store?: Store;
	error?: string;
}

export async function getProductBySlugAction(
	categorySlug: string,
	storeSlug: string,
	departmentSlug: string,
	productSlug: string
): Promise<GetProductBySlugResult> {
	try {
		const response = await fetch(
			`${BASE_URL}/api/v1/products/${encodeURIComponent(productSlug)}?category=${encodeURIComponent(categorySlug)}&store=${encodeURIComponent(storeSlug)}&department=${encodeURIComponent(departmentSlug)}`,
			{
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'X-LANG': 'ar',
				},
				credentials: 'include',
				cache: 'no-store',
			}
		);

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Failed to fetch product',
			};
		}

		return {
			success: true,
			product: data.product || data,
			relatedProducts: data.relatedProducts || data.related || [],
			store: data.store,
		};
	} catch (error) {
		console.error('Error fetching product by slug:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

