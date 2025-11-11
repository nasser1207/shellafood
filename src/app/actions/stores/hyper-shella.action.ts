'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface HyperShellaCategory {
	id: string;
	name: string;
	image?: string;
}

export interface GetHyperShellaCategoriesResult {
	success: boolean;
	categories?: HyperShellaCategory[];
	error?: string;
}

export async function getHyperShellaCategoriesAction(): Promise<GetHyperShellaCategoriesResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/hyper-shella-categories`, {
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
				error: data.message || data.error || 'Failed to fetch hyper shella categories',
			};
		}

		return {
			success: true,
			categories: data.categories || data.data || [],
		};
	} catch (error) {
		console.error('Error fetching hyper shella categories:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

