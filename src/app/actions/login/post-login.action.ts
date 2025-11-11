'use server';

import { LoginInput } from '@/lib/validations/login.validation';
import { ServiceResult } from '@/lib/types/service-result';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export async function loginAction(
	formData: LoginInput
): Promise<ServiceResult<{ userId: string }>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			body: JSON.stringify({
				email: formData.email,
				password: formData.password,
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Login failed',
			};
		}

		// Store token if provided
		if (data.token) {
			// In a real app, you might want to set a cookie here
			// For now, the token will be handled by the client
		}

		return {
			success: true,
			data: { userId: data.user_id || data.id || data.user?.id || '' },
		};
	} catch (error) {
		console.error('Error during login:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

