/**
 * Custom hook for product actions
 * Consolidates add to cart, favorites, and navigation logic
 */

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./useCart";
import { useProductFavorites } from "./useFavorites";
import { useToast } from "@/components/ui/Toast";
import { Product } from "@/types/categories";
import { navigateToProductFromContext } from "@/lib/utils/categories/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export function useProductActions() {
	const { addToCart } = useCart();
	const router = useRouter();
	const { showToast } = useToast();
	const { language } = useLanguage();
	const isArabic = language === 'ar';

	const handleAddToCart = useCallback(async (
		product: Product,
		quantity: number = 1,
		storeId?: string,
		storeName?: string,
		storeNameAr?: string
	) => {
		const targetStoreId = product.storeId || storeId;
		
		if (!targetStoreId) {
			showToast(
				isArabic ? "خطأ: معرف المتجر غير متوفر" : "Error: Store ID not available",
				"error"
			);
			return;
		}

		const result = await addToCart({
			productId: product.id,
			storeId: targetStoreId,
			quantity,
			productName: product.name,
			productNameAr: product.nameAr,
			productImage: product.image,
			priceAtAdd: product.price || 0,
			storeName: storeName || '',
			storeNameAr: storeNameAr,
		});

		if (result.success) {
			showToast(
				result.message || (isArabic ? "تم إضافة المنتج للسلة بنجاح" : "Product added to cart successfully"),
				"success"
			);
		} else if (result.requiresClearCart) {
			showToast(
				isArabic
					? "لديك منتجات من متجر آخر في السلة. يرجى إفراغ السلة أولاً"
					: "You have items from a different store in your cart. Please clear cart first",
				"warning"
			);
		} else {
			showToast(
				result.error || (isArabic ? "حدث خطأ أثناء إضافة المنتج للسلة" : "Error adding product to cart"),
				"error"
			);
		}
	}, [addToCart, showToast, isArabic]);

	const handleViewProduct = useCallback((
		product: Product,
		categorySlug: string,
		storeSlug: string,
		departmentSlug: string
	) => {
		navigateToProductFromContext(router, product, categorySlug, storeSlug, departmentSlug);
	}, [router]);

	return {
		handleAddToCart,
		handleViewProduct,
	};
}

