'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface UpdateCartResult {
	success: boolean;
	error?: string;
}

export async function updateCartAction({
	itemId,
	quantity,
}: {
	itemId: string;
	quantity: number;
}): Promise<UpdateCartResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/cart/update`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			body: JSON.stringify({ item_id: itemId, quantity }),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Failed to update cart',
			};
		}

		return {
			success: true,
		};
	} catch (error) {
		console.error('Error updating cart:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

