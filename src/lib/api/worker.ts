/**
 * API client for worker registration endpoints
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';
const DEFAULT_LANG = 'ar';

export interface WorkerRegistrationData {
	first_name: string;
	last_name: string;
	email: string;
	driver_type: string; // 'delivery', 'service', etc.
	area: string;
	vehicle_type: string; // 'motorcycle', 'car', 'bicycle', etc.
	id_type: string; // 'national_id', 'iqama'
	id_number: string;
	id_image?: File;
	zone_id?: number;
	module_id?: number;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	status: number;
}

/**
 * Register a new worker
 */
export async function registerWorker(
	data: WorkerRegistrationData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<any>> {
	try {
		const formData = new FormData();
		
		// Append text fields
		formData.append('first_name', data.first_name);
		formData.append('last_name', data.last_name);
		formData.append('email', data.email);
		formData.append('driver_type', data.driver_type);
		formData.append('area', data.area);
		formData.append('vehicle_type', data.vehicle_type);
		formData.append('id_type', data.id_type);
		formData.append('id_number', data.id_number);

		// Append optional fields
		if (data.zone_id) {
			formData.append('zone_id', data.zone_id.toString());
		}
		if (data.module_id) {
			formData.append('module_id', data.module_id.toString());
		}

		// Append file if provided
		if (data.id_image) {
			formData.append('id_image', data.id_image);
		}

		const response = await fetch(`${BASE_URL}/api/v1/workers`, {
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
		console.error('Error registering worker:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

