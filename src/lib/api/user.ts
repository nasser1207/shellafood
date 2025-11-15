/**
 * API client for customer authentication endpoints
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';
const DEFAULT_LANG = 'ar';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface CustomerRegistrationData {
	name: string;
	phone: string;
	email?: string;
	password: string;
	ref_code?: string;
}

export interface CustomerLoginData {
	email_or_phone: string;
	password: string;
	field_type: 'phone' | 'email';
	guest_id?: string;
}

export interface OTPLoginData {
	phone: string;
	verified: boolean;
	otp?: string;
	guest_id?: string;
}

export interface VerifyPhoneData {
	phone: string;
	otp: string;
}

export interface CustomerAuthResponse {
	token: string;
	is_phone_verified: 0 | 1;
	is_email_verified: 0 | 1;
	is_personal_info: 0 | 1;
	login_type: 'manual' | 'otp' | 'social';
	user?: {
		id: number;
		name: string;
		email: string;
		phone: string;
	};
}

export interface OTPResponse {
	message: string;
	otp?: string;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	message?: string;
	status: number;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Register a new customer
 * POST /api/v1/auth/sign-up
 */
export async function registerCustomer(
	data: CustomerRegistrationData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<CustomerAuthResponse>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/auth/sign-up`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': lang,
			},
			body: JSON.stringify({
				name: data.name,
				phone: data.phone,
				email: data.email || '',
				password: data.password,
				ref_code: data.ref_code || '',
			}),
		});

		const responseData = await response.json();
		
		console.log('API Response Status:', response.status);
		console.log('API Response Data:', responseData);

		if (!response.ok) {
			console.error('Registration failed:', responseData);
			return {
				error: responseData.message || responseData.error || 'Registration failed',
				message: responseData.message,
				status: response.status,
			};
		}

		// Save token to localStorage if available
		if (responseData.token && typeof window !== 'undefined') {
			localStorage.setItem('customer_token', responseData.token);
		}

		return {
			data: responseData,
			status: response.status,
		};
	} catch (error) {
		console.error('Error registering customer:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Customer login with email/phone and password (Manual login)
 * POST /api/v1/auth/login
 */
export async function loginCustomer(
	data: CustomerLoginData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<CustomerAuthResponse>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-LANG': lang,
			},
			body: JSON.stringify({
				login_type: 'manual',
				email_or_phone: data.email_or_phone,
				password: data.password,
				field_type: data.field_type,
				guest_id: data.guest_id || '',
			}),
		});

		const responseData = await response.json();

		if (!response.ok) {
			return {
				error: responseData.message || responseData.error || 'Login failed',
				message: responseData.message,
				status: response.status,
			};
		}

		// Save token to localStorage
		if (responseData.token && typeof window !== 'undefined') {
			localStorage.setItem('customer_token', responseData.token);
		}

		return {
			data: responseData,
			status: response.status,
		};
	} catch (error) {
		console.error('Error logging in:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Send OTP to phone for login
 * POST /api/v1/auth/login (with login_type: 'otp')
 */
export async function sendOTPLogin(
	phone: string,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<OTPResponse>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-LANG': lang,
			},
			body: JSON.stringify({
				login_type: 'otp',
				phone: phone,
				verified: false,
			}),
		});

		const responseData = await response.json();

		if (!response.ok) {
			return {
				error: responseData.message || responseData.error || 'Failed to send OTP',
				message: responseData.message,
				status: response.status,
			};
		}

		return {
			data: responseData,
			status: response.status,
		};
	} catch (error) {
		console.error('Error sending OTP:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Verify OTP and complete login
 * POST /api/v1/auth/login (with login_type: 'otp' and verified: true)
 */
export async function verifyOTPLogin(
	data: OTPLoginData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<CustomerAuthResponse>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-LANG': lang,
			},
			body: JSON.stringify({
				login_type: 'otp',
				phone: data.phone,
				verified: true,
				otp: data.otp,
				guest_id: data.guest_id || '',
			}),
		});

		const responseData = await response.json();

		if (!response.ok) {
			return {
				error: responseData.message || responseData.error || 'OTP verification failed',
				message: responseData.message,
				status: response.status,
			};
		}

		// Save token to localStorage
		if (responseData.token && typeof window !== 'undefined') {
			localStorage.setItem('customer_token', responseData.token);
		}

		return {
			data: responseData,
			status: response.status,
		};
	} catch (error) {
		console.error('Error verifying OTP:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

/**
 * Verify phone number with OTP
 * POST /api/v1/auth/verify-phone
 */
export async function verifyPhone(
	data: VerifyPhoneData,
	lang: string = DEFAULT_LANG
): Promise<ApiResponse<OTPResponse>> {
	try {
		const response = await fetch(`${BASE_URL}/api/v1/auth/verify-phone`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-LANG': lang,
			},
			body: JSON.stringify({
				phone: data.phone,
				otp: data.otp,
			}),
		});

		const responseData = await response.json();

		if (!response.ok) {
			return {
				error: responseData.message || responseData.error || 'Phone verification failed',
				message: responseData.message,
				status: response.status,
			};
		}

		return {
			data: responseData,
			status: response.status,
		};
	} catch (error) {
		console.error('Error verifying phone:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
			status: 500,
		};
	}
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get customer token from localStorage
 */
export function getCustomerToken(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('customer_token');
}

/**
 * Clear customer token from localStorage
 */
export function clearCustomerToken(): void {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('customer_token');
	}
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
	return !!getCustomerToken();
}

/**
 * Get authorization header for authenticated requests
 */
export function getAuthHeader(): Record<string, string> {
	const token = getCustomerToken();
	return token ? { 'Authorization': `Bearer ${token}` } : {};
}