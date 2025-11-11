'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface Product {
	id: string;
	name: string;
	image: string;
	price: string;
	originalPrice?: string;
	unit?: string;
	storeId: string;
	storeName: string;
}

export interface GetProductsResult {
	success: boolean;
	data?: {
		products: Product[];
	};
	error?: string;
}

export async function getProductsAction(params?: { limit?: number; exclude?: string }): Promise<GetProductsResult> {
	try {
		const urlParams = new URLSearchParams();
		if (params?.limit) {
			urlParams.append('limit', params.limit.toString());
		}
		if (params?.exclude) {
			urlParams.append('exclude', params.exclude);
		}

		const url = `${BASE_URL}/api/v1/products${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
		const response = await fetch(url, {
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
				error: data.message || data.error || 'Failed to fetch products',
			};
		}

		const products = (data.products || data.data || []).map((p: any) => ({
			...p,
			image: p.image || '',
			price: String(p.price || 0),
			originalPrice: p.originalPrice ? String(p.originalPrice) : undefined,
			storeId: p.storeId || '',
			storeName: p.storeName || p.store?.name || '',
		}));

		return {
			success: true,
			data: {
				products,
			},
		};
	} catch (error) {
		console.error('Error fetching products:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

