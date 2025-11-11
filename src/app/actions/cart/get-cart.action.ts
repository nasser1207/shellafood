'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface CartItem {
	id: string;
	productId: string;
	productName: string;
	productImage: string;
	storeId: string;
	storeName: string;
	quantity: number;
	priceAtAdd: string;
	totalPrice: number;
}

export interface CartData {
	id: string;
	items: CartItem[];
	totalAmount: number;
	itemsCount: number;
}

export interface GetCartResult {
	success: boolean;
	data?: CartData;
	error?: string;
}

export async function getCartAction(): Promise<GetCartResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/cart`, {
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
				error: data.message || data.error || 'Failed to fetch cart',
			};
		}

		const cart = data.cart || data.data || { id: '', items: [] };
		return {
			success: true,
			data: {
				id: cart.id || '',
				items: cart.items || [],
				totalAmount: cart.totalAmount || cart.total || 0,
				itemsCount: cart.itemsCount || cart.items?.length || 0,
			},
		};
	} catch (error) {
		console.error('Error fetching cart:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

