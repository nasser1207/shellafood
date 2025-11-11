/**
 * LocalStorage utilities for managing favorites (products, stores, restaurants)
 */

export interface FavoriteProduct {
	id: string;
	name: string;
	nameAr?: string;
	image?: string;
	price?: number;
	originalPrice?: number;
	unit?: string;
	unitAr?: string;
	storeId?: string;
	storeName?: string;
	storeNameAr?: string;
	addedAt: string;
}

export interface FavoriteStore {
	id: string;
	name: string;
	nameAr?: string;
	image?: string;
	logo?: string;
	type?: string;
	typeAr?: string;
	rating?: string;
	addedAt: string;
}

const FAVORITES_STORAGE_KEY = 'shella_favorites';

interface FavoritesStorage {
	products: FavoriteProduct[];
	stores: FavoriteStore[];
}

// Dispatch a custom event when favorites are updated
function dispatchFavoritesUpdateEvent() {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event('favoritesUpdated'));
	}
}

/**
 * Get all favorites from localStorage
 */
export function getFavorites(): FavoritesStorage {
	if (typeof window === 'undefined') {
		return { products: [], stores: [] };
	}
	try {
		const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
		return stored ? JSON.parse(stored) : { products: [], stores: [] };
	} catch (error) {
		console.error("Error parsing favorites from localStorage:", error);
		return { products: [], stores: [] };
	}
}

/**
 * Save favorites to localStorage
 */
function saveFavorites(favorites: FavoritesStorage) {
	if (typeof window === 'undefined') {
		return;
	}
	localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
	dispatchFavoritesUpdateEvent();
}

/**
 * Check if a product is favorited
 */
export function isProductFavorite(productId: string): boolean {
	const favorites = getFavorites();
	return favorites.products.some(p => p.id === productId);
}

/**
 * Check if a store is favorited
 */
export function isStoreFavorite(storeId: string): boolean {
	const favorites = getFavorites();
	return favorites.stores.some(s => s.id === storeId);
}

/**
 * Add product to favorites
 */
export function addProductToFavorites(product: Omit<FavoriteProduct, 'addedAt'>): boolean {
	const favorites = getFavorites();
	
	// Check if already exists
	if (favorites.products.some(p => p.id === product.id)) {
		return false;
	}
	
	favorites.products.push({
		...product,
		addedAt: new Date().toISOString(),
	});
	
	saveFavorites(favorites);
	return true;
}

/**
 * Remove product from favorites
 */
export function removeProductFromFavorites(productId: string): boolean {
	const favorites = getFavorites();
	const initialLength = favorites.products.length;
	favorites.products = favorites.products.filter(p => p.id !== productId);
	
	if (favorites.products.length !== initialLength) {
		saveFavorites(favorites);
		return true;
	}
	return false;
}

/**
 * Add store to favorites
 */
export function addStoreToFavorites(store: Omit<FavoriteStore, 'addedAt'>): boolean {
	const favorites = getFavorites();
	
	// Check if already exists
	if (favorites.stores.some(s => s.id === store.id)) {
		return false;
	}
	
	favorites.stores.push({
		...store,
		addedAt: new Date().toISOString(),
	});
	
	saveFavorites(favorites);
	return true;
}

/**
 * Remove store from favorites
 */
export function removeStoreFromFavorites(storeId: string): boolean {
	const favorites = getFavorites();
	const initialLength = favorites.stores.length;
	favorites.stores = favorites.stores.filter(s => s.id !== storeId);
	
	if (favorites.stores.length !== initialLength) {
		saveFavorites(favorites);
		return true;
	}
	return false;
}

/**
 * Get all favorite products
 */
export function getFavoriteProducts(): FavoriteProduct[] {
	return getFavorites().products;
}

/**
 * Get all favorite stores
 */
export function getFavoriteStores(): FavoriteStore[] {
	return getFavorites().stores;
}

/**
 * Clear all favorites
 */
export function clearAllFavorites() {
	saveFavorites({ products: [], stores: [] });
}

