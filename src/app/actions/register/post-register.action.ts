'use server';

import { RegisterInput } from '@/lib/validations/register.validation';
import { ServiceResult } from '@/lib/types/service-result';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export async function registerAction(
	formData: RegisterInput
): Promise<ServiceResult<{ id: string }>> {
	try {
		// Split fullName into first and last name
		const nameParts = formData.fullName.trim().split(/\s+/);
		const firstName = nameParts[0] || '';
		const lastName = nameParts.slice(1).join(' ') || firstName;

		const response = await fetch(`${BASE_URL}/api/v1/auth/sign-up`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			body: JSON.stringify({
				name: formData.fullName,
				f_name: firstName,
				l_name: lastName,
				phone: formData.phoneNumber,
				email: formData.email,
				password: formData.password,
				birth_date: formData.birthDate.toISOString().split('T')[0],
				ref_code: '',
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Registration failed',
			};
		}

		return {
			success: true,
			data: { id: data.id || data.user_id || '' },
		};
	} catch (error) {
		console.error('Error during registration:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

