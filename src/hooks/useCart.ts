'use client';

import { useState, useCallback } from 'react';
import { 
	addToCartStorage, 
	clearCartStorage, 
	getCartItems,
	type CartProductItem 
} from '@/lib/utils/cartStorage';

interface AddToCartParams {
	productId: string;
	storeId: string;
	quantity?: number;
	productName?: string;
	productNameAr?: string;
	productImage?: string;
	priceAtAdd: number;
	storeName?: string;
	storeNameAr?: string;
	storeLogo?: string;
	stock?: number;
}

interface AddToCartResponse {
	success?: boolean;
	message?: string;
	error?: string;
	requiresClearCart?: boolean;
}

export function useCart() {
	const [isLoading, setIsLoading] = useState(false);

	const addToCart = useCallback(async ({ 
		productId, 
		storeId, 
		quantity = 1,
		productName = '',
		productNameAr,
		productImage,
		priceAtAdd,
		storeName = '',
		storeNameAr,
		storeLogo,
		stock,
	}: AddToCartParams): Promise<AddToCartResponse> => {
		setIsLoading(true);
		try {
			const result = addToCartStorage({
				productId,
				storeId,
				quantity,
				productName,
				productNameAr,
				productImage,
				priceAtAdd,
				storeName,
				storeNameAr,
				storeLogo,
				stock,
			});
			
			if (!result.success) {
				return {
					error: result.message || 'حدث خطأ أثناء إضافة المنتج للسلة',
					requiresClearCart: result.requiresClearCart,
				};
			}

			return {
				success: true,
				message: result.message || 'تم إضافة المنتج للسلة بنجاح',
			};
		} catch (error) {
			console.error('خطأ في إضافة المنتج للسلة:', error);
			return {
				error: 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
			};
		} finally {
			setIsLoading(false);
		}
	}, []);

	const clearCart = useCallback(async (): Promise<boolean> => {
		setIsLoading(true);
		try {
			clearCartStorage();
			return true;
		} catch (error) {
			console.error('خطأ في إفراغ السلة:', error);
			return false;
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		addToCart,
		clearCart,
		isLoading,
	};
}
