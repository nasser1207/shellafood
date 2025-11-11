'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface RemoveFromCartResult {
	success: boolean;
	error?: string;
}

export async function removeFromCartAction(itemId: string): Promise<RemoveFromCartResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/cart/remove`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			body: JSON.stringify({ item_id: itemId }),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Failed to remove item from cart',
			};
		}

		return {
			success: true,
		};
	} catch (error) {
		console.error('Error removing item from cart:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

