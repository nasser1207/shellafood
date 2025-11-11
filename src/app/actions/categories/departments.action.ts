'use server';

import { Product } from '@/components/Utils/ProductCard';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface GetDepartmentProductsResult {
	success: boolean;
	products?: Product[];
	error?: string;
}

export async function getDepartmentProductsAction(
	categorySlug: string,
	storeSlug: string,
	departmentSlug: string
): Promise<GetDepartmentProductsResult> {
	try {
		const response = await fetch(
			`${BASE_URL}/api/v1/stores/${encodeURIComponent(storeSlug)}/departments/${encodeURIComponent(departmentSlug)}?category=${encodeURIComponent(categorySlug)}`,
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
				error: data.message || data.error || 'Failed to fetch department products',
			};
		}

		return {
			success: true,
			products: data.products || data.data || [],
		};
	} catch (error) {
		console.error('Error fetching department products:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

