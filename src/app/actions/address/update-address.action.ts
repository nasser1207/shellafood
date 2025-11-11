'use server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface UpdateAddressResult {
	success: boolean;
	error?: string;
}

export async function updateAddressAction({
	addressId,
	address,
}: {
	addressId: string;
	address: string;
}): Promise<UpdateAddressResult> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/addresses/${addressId}`, {
			method: 'PUT',
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
				error: data.message || data.error || 'Failed to update address',
			};
		}

		return {
			success: true,
		};
	} catch (error) {
		console.error('Error updating address:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}
