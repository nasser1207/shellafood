'use server';

import { Category } from '@/components/Utils/CategoryCard';
import { Store } from '@/components/Utils/StoreCard';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface GetCategoriesResult {
	success: boolean;
	categories?: Category[];
	error?: string;
}

export interface GetStoresByCategoryResult {
	success: boolean;
	category?: Category;
	stores?: Store[];
	error?: string;
}

export async function getCategoriesAction(): Promise<GetCategoriesResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/categories`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Failed to fetch categories',
			};
		}

		return {
			success: true,
			categories: data.categories || data.data || [],
		};
	} catch (error) {
		console.error('Error fetching categories:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

export async function getStoresByCategoryAction(
	categorySlug: string
): Promise<GetStoresByCategoryResult> {
	try {
		const response = await fetch(
			`${BASE_URL}/api/v1/stores/by-category?category=${encodeURIComponent(categorySlug)}`,
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
				error: data.message || data.error || 'Failed to fetch stores',
			};
		}

		return {
			success: true,
			category: data.category || { id: categorySlug, name: categorySlug, description: '', image: '' },
			stores: data.stores || data.data || [],
		};
	} catch (error) {
		console.error('Error fetching stores by category:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}
