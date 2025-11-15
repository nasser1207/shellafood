/**
 * Search utility functions
 */

export interface SearchHistoryItem {
	term: string;
	timestamp: number;
}

const SEARCH_HISTORY_KEY = "searchHistory";
const MAX_HISTORY_ITEMS = 10;

/**
 * Get search history from localStorage
 */
export function getSearchHistory(): SearchHistoryItem[] {
	if (typeof window === "undefined") return [];
	
	try {
		const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
		if (!stored) return [];
		return JSON.parse(stored);
	} catch {
		return [];
	}
}

/**
 * Save search term to history
 */
export function saveToSearchHistory(term: string): void {
	if (typeof window === "undefined" || !term.trim()) return;

	try {
		const history = getSearchHistory();
		const filtered = history.filter((item) => item.term.toLowerCase() !== term.toLowerCase());
		const updated = [
			{ term: term.trim(), timestamp: Date.now() },
			...filtered,
		].slice(0, MAX_HISTORY_ITEMS);

		localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
		
		// Dispatch event for cross-tab sync
		window.dispatchEvent(new Event("searchHistoryUpdated"));
	} catch (error) {
		console.error("Failed to save search history:", error);
	}
}

/**
 * Remove item from search history
 */
export function removeFromSearchHistory(term: string): void {
	if (typeof window === "undefined") return;

	try {
		const history = getSearchHistory();
		const updated = history.filter((item) => item.term.toLowerCase() !== term.toLowerCase());
		localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
		window.dispatchEvent(new Event("searchHistoryUpdated"));
	} catch (error) {
		console.error("Failed to remove from search history:", error);
	}
}

/**
 * Clear all search history
 */
export function clearSearchHistory(): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(SEARCH_HISTORY_KEY);
		window.dispatchEvent(new Event("searchHistoryUpdated"));
	} catch (error) {
		console.error("Failed to clear search history:", error);
	}
}

/**
 * Get search suggestions based on query
 */
export function getSearchSuggestions(query: string, maxResults: number = 5): string[] {
	if (!query.trim() || typeof window === "undefined") return [];

	const history = getSearchHistory();
	const queryLower = query.toLowerCase();

	return history
		.filter((item) => item.term.toLowerCase().includes(queryLower))
		.slice(0, maxResults)
		.map((item) => item.term);
}

