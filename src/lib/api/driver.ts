/**
 * API client for driver registration endpoints
 * Handles zones and driver registration
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';
const DEFAULT_LANG = 'ar';

export interface Zone {
	id: number;
	name: string;
	status?: number;
}

export interface DriverRegistrationData {
	f_name: string;
	l_name: string;
	email: string;
	phone: string;
	identity_number: string;
	identity_type: string; // 'national_id' or 'iqama'
	zone_id: number;
	password: string;
	identity_image?: File;
	driving_license_image?: File;
	driver_license_image?: File;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	status: number;
}

/**
 * Get list of available zones for driver registration
 */
export async function getDriverZonesList(lang: string = DEFAULT_LANG): Promise<ApiResponse<Zone[]>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/zone/list`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
			},
			cache: 'no-store',
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
 * Register a new delivery driver
 */
export async function registerDriver(
	data: DriverRegistrationData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<any>> {
	try {
		const formData = new FormData();
		
		// Append text fields
		formData.append('f_name', data.f_name);
		formData.append('l_name', data.l_name);
		formData.append('email', data.email);
		formData.append('phone', data.phone);
		formData.append('identity_number', data.identity_number);
		formData.append('identity_type', data.identity_type);
		formData.append('zone_id', data.zone_id.toString());
		formData.append('password', data.password);

		// Append files if provided
		if (data.identity_image) {
			formData.append('identity_image', data.identity_image);
		}
		if (data.driving_license_image) {
			formData.append('driving_license_image', data.driving_license_image);
		}
		if (data.driver_license_image) {
			formData.append('driver_license_image', data.driver_license_image);
		}

		// Debug: Log form data values (excluding files)
		console.log('Driver Registration Data:', {
			f_name: data.f_name,
			l_name: data.l_name,
			email: data.email,
			phone: data.phone,
			identity_number: data.identity_number,
			identity_type: data.identity_type,
			zone_id: data.zone_id,
			has_identity_image: !!data.identity_image,
			has_driving_license: !!data.driving_license_image,
			has_driver_license: !!data.driver_license_image,
		});

		const response = await fetch(`${BASE_URL}/api/v1/delivery-man/store`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'X-LANG': lang,
				// Note: Don't set Content-Type header - browser will set it with boundary for FormData
			},
			body: formData,
		});

		const responseData = await response.json();
		
		console.log('API Response Status:', response.status);
		console.log('API Response Data:', responseData);

		if (!response.ok) {
			console.error('Registration failed:', responseData);
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
		console.error('Error registering driver:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

