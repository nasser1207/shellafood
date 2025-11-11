import { useState, useEffect } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ClientCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

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
}

// إنشاء instance واحد للتطبيق
const clientCache = new ClientCache();

// Hook للاستخدام في المكونات
export function useClientCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // التحقق من التخزين المؤقت أولاً
      const cachedData = clientCache.get<T>(key);
      
      if (cachedData) {
        setData(cachedData);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        setData(result);
        clientCache.set(key, result, ttlSeconds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key, ttlSeconds]);

  const refetch = async () => {
    clientCache.delete(key);
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      clientCache.set(key, result, ttlSeconds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
}

// دوال مساعدة
export const cacheKeys = {
  stores: () => 'client:stores',
  categories: () => 'client:categories',
  storeCategories: (storeName: string) => `client:store-categories:${storeName}`,
  storeDetails: (storeName: string) => `client:store-details:${storeName}`,
  products: (storeName: string, category?: string) => 
    `client:products:${storeName}${category ? `:${category}` : ''}`,
};

export { clientCache };
