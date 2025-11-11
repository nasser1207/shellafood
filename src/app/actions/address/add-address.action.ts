'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface AddAddressResult {
	success: boolean;
	data?: { id: string; addressId: string };
	error?: string;
}

export async function addAddressAction({
	address,
}: {
	address: string;
}): Promise<AddAddressResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/addresses`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			body: JSON.stringify({ address }),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Failed to add address',
			};
		}

		return {
			success: true,
			data: { 
				id: data.id || data.address_id || '',
				addressId: data.id || data.address_id || '',
			},
		};
	} catch (error) {
		console.error('Error adding address:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}
