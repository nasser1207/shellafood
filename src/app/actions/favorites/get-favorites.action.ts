'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface FavoritesData {
	favProducts: Array<{
		id: string;
		name: string;
		image: string;
		price: string;
		originalPrice: string;
		unit: string;
		storeId?: string;
		storeName?: string;
	}>;
	favStores: Array<{
		id: string;
		name: string;
		type: string;
		rating: string;
		image: string;
	}>;
}

export interface GetFavoritesResult {
	success: boolean;
	data?: FavoritesData;
	error?: string;
}

export async function getFavoritesAction(): Promise<GetFavoritesResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/favorites`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Failed to fetch favorites',
			};
		}

		return {
			success: true,
			data: {
				favProducts: data.favProducts || data.products || [],
				favStores: data.favStores || data.stores || [],
			},
		};
	} catch (error) {
		console.error('Error fetching favorites:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}
