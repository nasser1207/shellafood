'use server';

import { KaidhaUserInput } from '@/lib/validations/kaidha.validation';
import { ServiceResult } from '@/lib/types/service-result';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export async function postFormKaidhaAction(
	formData: KaidhaUserInput
): Promise<ServiceResult<{ id: string }>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/kaidha/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			body: JSON.stringify(formData),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Failed to submit kaidha form',
			};
		}

		return {
			success: true,
			data: { id: data.id || data.user_id || '' },
		};
	} catch (error) {
		console.error('Error submitting kaidha form:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

