'use server';

import { NearbyStore } from '@/lib/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface GetNearbyStoresActionResult {
	stores: NearbyStore[];
	userLocation: { lat: number; lng: number };
	maxDistance: number;
	total: number;
}

export interface GetNearbyStoresErrorResult {
	error: string;
}

export type GetNearbyStoresResult = GetNearbyStoresActionResult | GetNearbyStoresErrorResult;

export async function getNearbyStoresAction(args: {
	lat: number;
	lng: number;
	limit?: number;
	maxDistance?: number;
}): Promise<GetNearbyStoresResult> {
	try {
		const params = new URLSearchParams({
			lat: args.lat.toString(),
			lng: args.lng.toString(),
		});

		if (args.limit) {
			params.append('limit', args.limit.toString());
		}

		if (args.maxDistance) {
			params.append('maxDistance', args.maxDistance.toString());
		}

		const response = await fetch(`${BASE_URL}/api/v1/stores/nearby?${params.toString()}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				error: data.message || data.error || 'Failed to fetch nearby stores',
			};
		}

		return {
			stores: data.stores || data.data || [],
			userLocation: { lat: args.lat, lng: args.lng },
			maxDistance: args.maxDistance || 10,
			total: data.total || data.stores?.length || 0,
		};
	} catch (error) {
		console.error('Error fetching nearby stores:', error);
		return {
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

