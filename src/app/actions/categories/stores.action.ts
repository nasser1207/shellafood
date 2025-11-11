'use server';

import { Store } from '@/components/Utils/StoreCard';
import { Product } from '@/components/Utils/ProductCard';
import { Department } from '@/components/Utils/DepartmentCard';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface GetStoreBySlugResult {
	success: boolean;
	store?: Store;
	departments?: Department[];
	recommendedProducts?: Product[];
	popularProducts?: Product[];
	error?: string;
}

export async function getStoreBySlugAction(
	categorySlug: string,
	storeSlug: string
): Promise<GetStoreBySlugResult> {
	try {
		const response = await fetch(
			`${BASE_URL}/api/v1/stores/${encodeURIComponent(storeSlug)}?category=${encodeURIComponent(categorySlug)}`,
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
				error: data.message || data.error || 'Failed to fetch store',
			};
		}

		return {
			success: true,
			store: data.store || data,
			departments: data.departments || data.categories || [],
			recommendedProducts: data.recommendedProducts || data.recommended || [],
			popularProducts: data.popularProducts || data.popular || [],
		};
	} catch (error) {
		console.error('Error fetching store by slug:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}
