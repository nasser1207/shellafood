'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

type Category = {
	id: string;
	name: string;
	description?: string;
	image?: string;
};

export interface GetCategoriesActionResult {
	categories: Category[];
	cached: boolean;
	success: boolean;
}

export interface GetCategoriesErrorResult {
	error: string;
}

export type GetCategoriesResult = GetCategoriesActionResult | GetCategoriesErrorResult;

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
				error: data.message || data.error || 'Failed to fetch categories',
			};
		}

		return {
			categories: data.categories || data.data || [],
			cached: false,
			success: true,
		};
	} catch (error) {
		console.error('Error fetching categories:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

