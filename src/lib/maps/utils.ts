/**
 * Shared Google Maps utilities
 * Expert-level optimization for maximum cost reduction and performance
 * 
 * Features:
 * - Advanced caching (memory + IndexedDB)
 * - Request deduplication
 * - Request throttling
 * - Smart cache management
 */

// Shared geocoder instance (singleton pattern)
let geocoderInstance: google.maps.Geocoder | null = null;

/**
 * Get or create shared Geocoder instance
 * Prevents creating multiple instances (cost optimization)
 */
export const getGeocoder = (): google.maps.Geocoder | null => {
	if (typeof window === 'undefined') return null;
	
	if (!geocoderInstance && window.google?.maps) {
		geocoderInstance = new window.google.maps.Geocoder();
	}
	
	return geocoderInstance;
};

// Request deduplication: Prevent duplicate simultaneous requests
const pendingRequests = new Map<string, Promise<{ address: string; details: string }>>();

/**
 * Geocoding result cache
 * Reduces API calls for same coordinates (major cost savings)
 */
interface CachedGeocode {
	address: string;
	details: string;
	timestamp: number;
}

// Memory cache (fast access)
const geocodeCache = new Map<string, CachedGeocode>();
const CACHE_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days (increased from 24h)

// IndexedDB cache (persistent across sessions)
let dbInstance: IDBDatabase | null = null;
const DB_NAME = 'google_maps_cache';
const DB_VERSION = 1;
const STORE_NAME = 'geocode_cache';

/**
 * Initialize IndexedDB for persistent caching
 * Survives page reloads - major cost savings!
 */
const initIndexedDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		if (typeof window === 'undefined' || !window.indexedDB) {
			reject(new Error('IndexedDB not available'));
			return;
		}

		if (dbInstance) {
			resolve(dbInstance);
			return;
		}

		const request = window.indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			dbInstance = request.result;
			resolve(dbInstance);
		};

		request.onupgradeneeded = (event: any) => {
			const db = event.target.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
				store.createIndex('timestamp', 'timestamp', { unique: false });
			}
		};
	});
};

/**
 * Load cache from IndexedDB on initialization
 */
const loadCacheFromDB = async () => {
	try {
		const db = await initIndexedDB();
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.getAll();

		await new Promise<void>((resolve, reject) => {
			request.onsuccess = () => {
				const entries = request.result;
				const now = Date.now();
				
				entries.forEach((entry: any) => {
					// Only load non-expired entries
					if (now - entry.timestamp < CACHE_DURATION) {
						geocodeCache.set(entry.key, {
							address: entry.address,
							details: entry.details,
							timestamp: entry.timestamp
						});
					}
				});
				
				resolve();
			};
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		// IndexedDB not available or failed - continue with memory cache only
		if (process.env.NODE_ENV === 'development') {
			console.warn('IndexedDB cache unavailable, using memory cache only:', error);
		}
	}
};

/**
 * Save to IndexedDB (async, non-blocking)
 */
const saveToIndexedDB = async (key: string, value: CachedGeocode) => {
	try {
		const db = await initIndexedDB();
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		store.put({ key, ...value });
	} catch (error) {
		// Silent fail - memory cache still works
	}
};

// Initialize IndexedDB cache on module load (if available)
if (typeof window !== 'undefined') {
	loadCacheFromDB().catch(() => {
		// Continue without IndexedDB
	});
}

/**
 * Reverse geocode with advanced caching and deduplication
 * Expert-level optimization to minimize API calls
 */
export const reverseGeocode = async (
	lat: number,
	lng: number,
	language: 'ar' | 'en' = 'en'
): Promise<{ address: string; details: string }> => {
	const geocoder = getGeocoder();
	if (!geocoder) {
		throw new Error('Geocoder not available');
	}

	// Create cache key (rounded to 4 decimal places = ~11 meters precision)
	const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}_${language}`;
	
	// Step 1: Check memory cache first (fastest)
	const cached = geocodeCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		requestStats.cacheHits++;
		return { address: cached.address, details: cached.details };
	}

	// Step 2: Check if same request is already pending (deduplication)
	if (pendingRequests.has(cacheKey)) {
		requestStats.deduplicated++;
		return pendingRequests.get(cacheKey)!;
	}

	// Track cache miss
	requestStats.cacheMisses++;
	requestStats.totalRequests++;

	// Step 3: Create new request
	const requestPromise = (async () => {
		try {
			const response = await geocoder.geocode({
				location: { lat, lng },
				language: language
			});

			let address = '';
			let details = '';

			if (response.results && response.results.length > 0) {
				const result = response.results[0];
				address = result.formatted_address || 
					result.address_components.map((comp: any) => comp.long_name).join(', ');
				
				// Extract building/floor details
				const addressComponents = result.address_components || [];
				const streetNumber = addressComponents.find((comp: any) => 
					comp.types.includes('street_number')
				);
				const subpremise = addressComponents.find((comp: any) => 
					comp.types.includes('subpremise')
				);
				
				if (subpremise) {
					details = subpremise.long_name;
				} else if (streetNumber) {
					details = streetNumber.long_name;
				}
			}

			const result = { address, details };
			const cacheValue = {
				...result,
				timestamp: Date.now()
			};
			
			// Cache in memory (fast access)
			geocodeCache.set(cacheKey, cacheValue);
			
			// Cache in IndexedDB (persistent across sessions)
			saveToIndexedDB(cacheKey, cacheValue).catch(() => {
				// Silent fail - memory cache still works
			});

			// Clean old cache entries (keep last 2000 entries for better hit rate)
			if (geocodeCache.size > 2000) {
				const entries = Array.from(geocodeCache.entries());
				entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
				const toKeep = entries.slice(0, 2000);
				geocodeCache.clear();
				toKeep.forEach(([key, value]) => geocodeCache.set(key, value));
			}

			return result;
		} catch (error) {
			console.error('Reverse geocoding error:', error);
			throw error;
		} finally {
			// Remove from pending requests after completion
			pendingRequests.delete(cacheKey);
		}
	})();

	// Store pending request for deduplication
	pendingRequests.set(cacheKey, requestPromise);

	return requestPromise;
};

/**
 * Clear geocode cache
 */
export const clearGeocodeCache = () => {
	geocodeCache.clear();
};

/**
 * Shared map configuration constants
 * Centralized to reduce bundle size and ensure consistency
 */
export const MAP_CONFIG = {
	containerStyle: {
		width: '100%',
		height: '100%'
	},
	defaultCenter: {
		lat: 24.7136, // Riyadh
		lng: 46.6753
	},
	defaultZoom: 12,
	// Only load what's needed (cost optimization)
	libraries: ['places'] as ("places" | "geometry" | "drawing" | "visualization")[],
	mapOptions: {
		zoom: 12,
		disableDefaultUI: false,
		zoomControl: true,
		streetViewControl: true,
		mapTypeControl: true,
		fullscreenControl: true,
		gestureHandling: 'greedy' as const,
		clickableIcons: false, // Reduces unnecessary API calls
	},
} as const;

/**
 * Advanced debounce with immediate option
 * Prevents excessive API calls during rapid interactions
 */
export const debounce = <T extends (...args: any[]) => any>(
	func: T,
	wait: number,
	immediate: boolean = false
): ((...args: Parameters<T>) => void) => {
	let timeout: NodeJS.Timeout | null = null;
	
	return (...args: Parameters<T>) => {
		const callNow = immediate && !timeout;
		
		if (timeout) clearTimeout(timeout);
		
		timeout = setTimeout(() => {
			timeout = null;
			if (!immediate) func(...args);
		}, wait);
		
		if (callNow) func(...args);
	};
};

/**
 * Throttle function - ensures function is called at most once per interval
 * Different from debounce - useful for scroll/resize events
 */
export const throttle = <T extends (...args: any[]) => any>(
	func: T,
	limit: number
): ((...args: Parameters<T>) => void) => {
	let inThrottle: boolean;
	
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
};

/**
 * Request statistics (for monitoring/debugging)
 */
let requestStats = {
	totalRequests: 0,
	cacheHits: 0,
	cacheMisses: 0,
	deduplicated: 0
};

export const getRequestStats = () => ({ ...requestStats });

export const resetRequestStats = () => {
	requestStats = {
		totalRequests: 0,
		cacheHits: 0,
		cacheMisses: 0,
		deduplicated: 0
	};
};

