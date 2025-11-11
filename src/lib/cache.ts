// نظام التخزين المؤقت البسيط
interface CacheItem<T> {
	data: T;
	timestamp: number;
	ttl: number; // Time To Live بالثواني
}

class SimpleCache {
	private cache = new Map<string, CacheItem<any>>();

	set<T>(key: string, data: T, ttlSeconds: number = 300): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl: ttlSeconds * 1000, // تحويل إلى ميلي ثانية
		});
	}

	get<T>(key: string): T | null {
		const item = this.cache.get(key);
		
		if (!item) {
			return null;
		}

		// فحص انتهاء الصلاحية
		if (Date.now() - item.timestamp > item.ttl) {
			this.cache.delete(key);
			return null;
		}

		return item.data as T;
	}

	has(key: string): boolean {
		const item = this.cache.get(key);
		
		if (!item) {
			return false;
		}

		// فحص انتهاء الصلاحية
		if (Date.now() - item.timestamp > item.ttl) {
			this.cache.delete(key);
			return false;
		}

		return true;
	}

	delete(key: string): void {
		this.cache.delete(key);
	}

	clear(): void {
		this.cache.clear();
	}

	// تنظيف العناصر المنتهية الصلاحية
	cleanup(): void {
		const now = Date.now();
		for (const [key, item] of this.cache.entries()) {
			if (now - item.timestamp > item.ttl) {
				this.cache.delete(key);
			}
		}
	}

	// إحصائيات التخزين المؤقت
	getStats() {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
		};
	}
}

// إنشاء instance واحد للتطبيق
export const cache = new SimpleCache();

// تنظيف دوري كل 5 دقائق
if (typeof window === 'undefined') {
	setInterval(() => {
		cache.cleanup();
	}, 5 * 60 * 1000);
}

// دوال مساعدة للاستخدام
export const cacheKey = {
	stores: (query?: string) => `stores:${query || 'all'}`,
	categories: () => 'categories:all',
	products: (storeId?: string) => `products:${storeId || 'all'}`,
	search: (query: string) => `search:${query}`,
	user: (userId: string) => `user:${userId}`,
};

// دالة للتحقق من صحة البيانات المخزنة مؤقتاً
export const isValidCacheData = <T>(data: T | null): data is T => {
	return data !== null && data !== undefined;
};
