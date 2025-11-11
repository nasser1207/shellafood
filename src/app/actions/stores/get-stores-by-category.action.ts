'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface GetStoresByCategoryResult {
	success: boolean;
	data?: {
		stores: any[];
		total?: number;
	};
	error?: string;
}

export async function getStoresByCategoryAction(
	categoryName: string,
	pageSize: number = 10,
	offset: number = 0
): Promise<GetStoresByCategoryResult> {
	try {
		const params = new URLSearchParams({
			category: categoryName,
			limit: pageSize.toString(),
			offset: offset.toString(),
		});

		const response = await fetch(`${BASE_URL}/api/v1/stores/by-category?${params.toString()}`, {
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
				error: data.message || data.error || 'Failed to fetch stores',
			};
		}

		return {
			success: true,
			data: {
				stores: data.stores || data.data || [],
				total: data.total || data.stores?.length || 0,
			},
		};
	} catch (error) {
		console.error('Error fetching stores by category:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

