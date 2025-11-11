'use server';

import { SearchResult } from '@/lib/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

export interface SearchActionResult {
	success: boolean;
	results?: SearchResult[];
	error?: string;
}

export async function searchAction(term: string): Promise<SearchActionResult> {
	try {
		if (!term || term.trim().length === 0) {
			return {
				success: true,
				results: [],
			};
		}

		const response = await fetch(`${BASE_URL}/api/v1/search?q=${encodeURIComponent(term)}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-LANG': 'ar',
			},
			credentials: 'include',
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				success: false,
				error: data.message || data.error || 'Search failed',
			};
		}

		return {
			success: true,
			results: data.results || data.data || [],
		};
	} catch (error) {
		console.error('Error performing search:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
}

