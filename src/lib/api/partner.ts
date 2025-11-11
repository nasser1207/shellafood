/**
 * API client for partner registration endpoints
 * Handles zones, modules, and partner registration
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';
const DEFAULT_LANG = 'ar';

export interface Zone {
	id: number;
	name: string;
}

export interface Module {
	id: number;
	module_name: string;
	zone_id: number;
}

export interface PartnerRegistrationData {
	f_name: string;
	l_name: string;
	phone: string;
	email: string;
	password: string;
	zone_id: number;
	module_id: number;
	store_name: string;
	address: string;
	latitude: string;
	longitude: string;
	logo?: File;
	cover_photo?: File;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	status: number;
}

/**
 * Get list of available zones
 */
export async function getZonesList(lang: string = DEFAULT_LANG): Promise<ApiResponse<Zone[]>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/zone/list`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
			},
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Failed to fetch zones' }));
			return {
				error: errorData.message || 'Failed to fetch zones',
				status: response.status,
			};
		}

		const data = await response.json();
		return {
			data: Array.isArray(data) ? data : data.data || data.zones || [],
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Get modules by zone ID
 */
export async function getModulesByZone(
	zoneId: number,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<Module[]>> {
	try {
		const response = await fetch(
			`${BASE_URL}/api/v1/module?zone_id=${zoneId}`,
			{
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'X-LANG': lang,
				},
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: 'Failed to fetch modules' }));
			return {
				error: errorData.message || 'Failed to fetch modules',
				status: response.status,
			};
		}

		const data = await response.json();
		return {
			data: Array.isArray(data) ? data : data.data || data.modules || [],
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Register a new partner/vendor
 */
export async function registerPartner(
	data: PartnerRegistrationData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<any>> {
	try {
		const formData = new FormData();
		
		// Append text fields
		formData.append('f_name', data.f_name);
		formData.append('l_name', data.l_name);
		formData.append('phone', data.phone);
		formData.append('email', data.email);
		formData.append('password', data.password);
		formData.append('zone_id', data.zone_id.toString());
		formData.append('module_id', data.module_id.toString());
		formData.append('store_name', data.store_name);
		formData.append('address', data.address);
		formData.append('latitude', data.latitude);
		formData.append('longitude', data.longitude);

		// Append files if provided
		if (data.logo) {
			formData.append('logo', data.logo);
		}
		if (data.cover_photo) {
			formData.append('cover_photo', data.cover_photo);
		}

		const response = await fetch(`${BASE_URL}/api/v1/vendor/register`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
				// Note: Don't set Content-Type header - browser will set it with boundary for FormData
			},
			body: formData,
		});

		const responseData = await response.json();

		if (!response.ok) {
			return {
				error: responseData.message || responseData.error || 'Registration failed',
				status: response.status,
			};
		}

		return {
			data: responseData,
			status: response.status,
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

