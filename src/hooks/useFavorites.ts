import { useState, useEffect, useCallback } from 'react';
import {
	isProductFavorite,
	isStoreFavorite,
	addProductToFavorites as addProductToFavoritesStorage,
	removeProductFromFavorites as removeProductFromFavoritesStorage,
	addStoreToFavorites as addStoreToFavoritesStorage,
	removeStoreFromFavorites as removeStoreFromFavoritesStorage,
	type FavoriteProduct,
	type FavoriteStore,
} from '@/lib/utils/favoritesStorage';
import { useToast } from '@/components/ui/Toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseFavoritesReturn {
	isFavorite: boolean;
	isLoading: boolean;
	toggleFavorite: () => Promise<void>;
	checkFavoriteStatus: () => Promise<void>;
}

// Hook for product favorites with localStorage and toast
export function useProductFavorites(productId: string, productData?: Partial<FavoriteProduct>): UseFavoritesReturn {
	const [state, setState] = useState<{ isFavorite: boolean; isLoading: boolean }>({
		isFavorite: false,
		isLoading: false
	});
	const { showToast } = useToast();
	const { language } = useLanguage();
	const isArabic = language === 'ar';

	const checkFavoriteStatus = useCallback(async () => {
		if (!productId) return;
		const isFav = isProductFavorite(productId);
		setState(prev => ({ ...prev, isFavorite: isFav }));
	}, [productId]);

	const toggleFavorite = useCallback(async () => {
		if (!productId) return;
		
		setState(prev => ({ ...prev, isLoading: true }));
		
		try {
			const isFav = isProductFavorite(productId);
			
			if (isFav) {
				// Remove from favorites
				const removed = removeProductFromFavoritesStorage(productId);
				if (removed) {
					setState(prev => ({ 
						...prev, 
						isFavorite: false,
						isLoading: false 
					}));
					showToast(
						isArabic ? "تم إزالة المنتج من المفضلة" : "Product removed from favorites",
						"success",
						isArabic ? "تم إزالة المنتج من المفضلة" : undefined
					);
				}
			} else {
				// Add to favorites
				if (productData) {
					const added = addProductToFavoritesStorage({
						id: productId,
						name: productData.name || '',
						nameAr: productData.nameAr,
						image: productData.image,
						price: productData.price,
						originalPrice: productData.originalPrice,
						unit: productData.unit,
						unitAr: productData.unitAr,
						storeId: productData.storeId,
						storeName: productData.storeName,
						storeNameAr: productData.storeNameAr,
					});
					
					if (added) {
						setState(prev => ({ 
							...prev, 
							isFavorite: true,
							isLoading: false 
						}));
						showToast(
							isArabic ? "تم إضافة المنتج للمفضلة" : "Product added to favorites",
							"success",
							isArabic ? "تم إضافة المنتج للمفضلة" : undefined
						);
					}
				} else {
					// Fallback if no product data
					const added = addProductToFavoritesStorage({
						id: productId,
						name: `Product ${productId}`,
					});
					if (added) {
						setState(prev => ({ 
							...prev, 
							isFavorite: true,
							isLoading: false 
						}));
						showToast(
							isArabic ? "تم إضافة المنتج للمفضلة" : "Product added to favorites",
							"success",
							isArabic ? "تم إضافة المنتج للمفضلة" : undefined
						);
					}
				}
			}
		} catch (error) {
			console.error('Error toggling favorite:', error);
			setState(prev => ({ ...prev, isLoading: false }));
			showToast(
				isArabic ? "حدث خطأ أثناء تحديث المفضلة" : "Error updating favorites",
				"error",
				isArabic ? "حدث خطأ أثناء تحديث المفضلة" : undefined
			);
		}
	}, [productId, productData, isArabic, showToast]);

	useEffect(() => {
		checkFavoriteStatus();
		
		// Listen for favorites updates
		const handleFavoritesUpdate = () => {
			checkFavoriteStatus();
		};
		
		window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
		return () => {
			window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
		};
	}, [checkFavoriteStatus]);

	return {
		isFavorite: state.isFavorite,
		isLoading: state.isLoading,
		toggleFavorite,
		checkFavoriteStatus
	};
}

// Hook for store favorites with localStorage and toast
export function useStoreFavorites(storeId: string, storeData?: Partial<FavoriteStore>): UseFavoritesReturn {
	const [state, setState] = useState<{ isFavorite: boolean; isLoading: boolean }>({
		isFavorite: false,
		isLoading: false
	});
	const { showToast } = useToast();
	const { language } = useLanguage();
	const isArabic = language === 'ar';

	const checkFavoriteStatus = useCallback(async () => {
		if (!storeId) return;
		const isFav = isStoreFavorite(storeId);
		setState(prev => ({ ...prev, isFavorite: isFav }));
	}, [storeId]);

	const toggleFavorite = useCallback(async () => {
		if (!storeId) return;
		
		setState(prev => ({ ...prev, isLoading: true }));
		
		try {
			const isFav = isStoreFavorite(storeId);
			
			if (isFav) {
				// Remove from favorites
				const removed = removeStoreFromFavoritesStorage(storeId);
				if (removed) {
					setState(prev => ({ 
						...prev, 
						isFavorite: false,
						isLoading: false 
					}));
					showToast(
						isArabic ? "تم إزالة المتجر من المفضلة" : "Store removed from favorites",
						"success",
						isArabic ? "تم إزالة المتجر من المفضلة" : undefined
					);
				}
			} else {
				// Add to favorites
				if (storeData) {
					const added = addStoreToFavoritesStorage({
						id: storeId,
						name: storeData.name || '',
						nameAr: storeData.nameAr,
						image: storeData.image,
						logo: storeData.logo,
						type: storeData.type,
						typeAr: storeData.typeAr,
						rating: storeData.rating,
					});
					
					if (added) {
						setState(prev => ({ 
							...prev, 
							isFavorite: true,
							isLoading: false 
						}));
						showToast(
							isArabic ? "تم إضافة المتجر للمفضلة" : "Store added to favorites",
							"success",
							isArabic ? "تم إضافة المتجر للمفضلة" : undefined
						);
					}
				} else {
					// Fallback if no store data
					const added = addStoreToFavoritesStorage({
						id: storeId,
						name: `Store ${storeId}`,
					});
					if (added) {
						setState(prev => ({ 
							...prev, 
							isFavorite: true,
							isLoading: false 
						}));
						showToast(
							isArabic ? "تم إضافة المتجر للمفضلة" : "Store added to favorites",
							"success",
							isArabic ? "تم إضافة المتجر للمفضلة" : undefined
						);
					}
				}
			}
		} catch (error) {
			console.error('Error toggling favorite:', error);
			setState(prev => ({ ...prev, isLoading: false }));
			showToast(
				isArabic ? "حدث خطأ أثناء تحديث المفضلة" : "Error updating favorites",
				"error",
				isArabic ? "حدث خطأ أثناء تحديث المفضلة" : undefined
			);
		}
	}, [storeId, storeData, isArabic, showToast]);

	useEffect(() => {
		checkFavoriteStatus();
		
		// Listen for favorites updates
		const handleFavoritesUpdate = () => {
			checkFavoriteStatus();
		};
		
		window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
		return () => {
			window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
		};
	}, [checkFavoriteStatus]);

	return {
		isFavorite: state.isFavorite,
		isLoading: state.isLoading,
		toggleFavorite,
		checkFavoriteStatus
	};
}
