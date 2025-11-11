'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface RemoveStoreFromFavoritesResult {
	success: boolean;
	error?: string;
	message?: string;
}

export async function removeStoreFromFavoritesAction({
	storeId,
}: {
	storeId: string;
}): Promise<RemoveStoreFromFavoritesResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/favorites`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			body: JSON.stringify({ store_id: storeId }),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Failed to remove store from favorites',
			};
		}

		return {
			success: true,
			message: data.message || 'Store removed from favorites',
		};
	} catch (error) {
		console.error('Error removing store from favorites:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}
