'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface RemoveProductFromFavoritesResult {
	success: boolean;
	error?: string;
	message?: string;
}

export async function removeProductFromFavoritesAction({
	productId,
}: {
	productId: string;
}): Promise<RemoveProductFromFavoritesResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/favorites`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			body: JSON.stringify({ product_id: productId }),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Failed to remove product from favorites',
			};
		}

		return {
			success: true,
			message: data.message || 'Product removed from favorites',
		};
	} catch (error) {
		console.error('Error removing product from favorites:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}
