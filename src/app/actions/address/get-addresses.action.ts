'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface Address {
	id: string;
	address: string;
	formattedAddress?: string;
	lat?: number;
	lng?: number;
	createdAt: string;
}

export interface GetAddressesResult {
	success: boolean;
	data?: {
		addresses: Address[];
	};
	error?: string;
}

export async function getAddressesAction(): Promise<GetAddressesResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/addresses`, {
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
				error: data.message || data.error || 'Failed to fetch addresses',
			};
		}

		const addresses = (data.addresses || data.data || []).map((addr: any) => ({
			...addr,
			createdAt: addr.createdAt || addr.created_at || new Date().toISOString(),
		}));

		return {
			success: true,
			data: {
				addresses,
			},
		};
	} catch (error) {
		console.error('Error fetching addresses:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}
