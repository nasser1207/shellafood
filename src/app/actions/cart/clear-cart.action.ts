'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface ClearCartResult {
	success: boolean;
	error?: string;
}

export async function clearCartAction(): Promise<ClearCartResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/cart/clear`, {
			method: 'DELETE',
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
				error: data.message || data.error || 'Failed to clear cart',
			};
		}

		return {
			success: true,
		};
	} catch (error) {
		console.error('Error clearing cart:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

