"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import ProductCard, { Product } from "@/components/Utils/ProductCard";
import { SectionHeader } from "@/components/Utils/SectionHeader";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useProductFavorites } from "@/hooks/useFavorites";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { navigateToProductFromContext } from "@/lib/utils/categories/navigation";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import { Store } from "@/components/Utils/StoreCard";


interface ProductViewProps {
	product: Product;
	relatedProducts: Product[];
	store?: Store | null;
}

/**
 * Product View Component
 * Displays product details with related products, bilingual support
 * Route: /categories/[category]/[store]/[department]/[product]
 */
export default function ProductView({ product, relatedProducts, store }: ProductViewProps) {
	const { isArabic, direction } = useLanguageDirection();
	const router = useRouter();
	const { addToCart, clearCart, isLoading: cartLoading } = useCart();
	const params = useParams();
	const { toasts, showToast, removeToast } = useToast();
	const [quantity, setQuantity] = useState(1);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const { isFavorite: isProductFavorite, isLoading: isProductFavoriteLoading, toggleFavorite: toggleProductFavorite } = useProductFavorites(product.id, {
		name: product.name,
		nameAr: product.nameAr,
		image: product.image,
		price: product.price || 0,
		originalPrice: product.originalPrice,
		unit: product.unit,
		unitAr: product.unitAr,
		storeId: product.storeId || store?.id,
		storeName: store?.name,
		storeNameAr: store?.nameAr,
	});

	const isOutOfStock = useMemo(() => product?.inStock === false, [product]);

	const handleAddToCart = async () => {
		if (!product.storeId && !store?.id) {
			showToast(
				isArabic ? "خطأ: معلومات المتجر غير متوفرة" : "Error: Store information not available",
				"error",
				isArabic ? "خطأ: معلومات المتجر غير متوفرة" : undefined
			);
			return;
		}

		const storeId = product.storeId || store?.id;
		if (!storeId) {
			showToast(
				isArabic ? "خطأ: معرف المتجر غير متوفر" : "Error: Store ID not available",
				"error",
				isArabic ? "خطأ: معرف المتجر غير متوفر" : undefined
			);
			return;
		}

		setIsAddingToCart(true);
		try {
			const result = await addToCart({ 
				productId: product.id, 
				storeId: storeId,
				quantity,
				productName: product.name,
				productNameAr: product.nameAr,
				productImage: product.image,
				priceAtAdd: product.price || 0,
				storeName: store?.name || '',
				storeNameAr: store?.nameAr,
				storeLogo: store?.logo || undefined,
				stock: product.stockQuantity,
			});
			
			if (result.success) {
				showToast(
					result.message || (isArabic ? "تم إضافة المنتج للسلة بنجاح" : "Product added to cart successfully"),
					"success",
					result.message || (isArabic ? "تم إضافة المنتج للسلة بنجاح" : undefined)
				);
			} else if (result.requiresClearCart) {
				showToast(
					isArabic 
						? "لديك منتجات من متجر آخر في السلة. يرجى إفراغ السلة أولاً" 
						: "You have items from a different store in your cart. Please clear cart first",
					"warning",
					isArabic ? "لديك منتجات من متجر آخر في السلة. يرجى إفراغ السلة أولاً" : undefined
				);
			} else {
				showToast(
					result.error || (isArabic ? "حدث خطأ أثناء إضافة المنتج للسلة" : "Error adding product to cart"),
					"error",
					result.error || (isArabic ? "حدث خطأ أثناء إضافة المنتج للسلة" : undefined)
				);
			}
		} catch (error) {
			showToast(
				isArabic ? "حدث خطأ في الاتصال" : "Connection error",
				"error",
				isArabic ? "حدث خطأ في الاتصال" : undefined
			);
		} finally {
			setIsAddingToCart(false);
		}
	};

	const categorySlug = useMemo(() => {
		if (params?.category) {
			return Array.isArray(params.category) ? params.category[0] : params.category;
		}
		return '';
	}, [params?.category]);

	const storeSlug = useMemo(() => {
		if (params?.store) {
			return Array.isArray(params.store) ? params.store[0] : params.store;
		}
		return '';
	}, [params?.store]);

	const departmentSlug = useMemo(() => {
		if (params?.department) {
			return Array.isArray(params.department) ? params.department[0] : params.department;
		}
		return 'food';
	}, [params?.department]);

	const handleRelatedProductClick = useCallback((id: string) => {
		const relatedProduct = relatedProducts.find(p => p.id === id);
		if (relatedProduct) {
			navigateToProductFromContext(router, relatedProduct, categorySlug, storeSlug, departmentSlug);
		}
	}, [router, relatedProducts, categorySlug, storeSlug, departmentSlug]);

	if (!product) {
		return (
			<div className="min-h-screen bg-gray-50" dir={direction}>
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
							<div className="aspect-square bg-gray-200 rounded-lg" />
						</div>
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse space-y-4">
							<div className="h-8 bg-gray-200 rounded" />
							<div className="h-6 bg-gray-200 rounded" />
							<div className="h-4 bg-gray-200 rounded" />
							<div className="h-10 bg-gray-200 rounded" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Product Image */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 relative">
						{/* Heart Icon on Image */}
						<div className={`absolute ${isArabic ? 'left-4' : 'right-4'} top-6 z-10`}>
							<FavoriteButton
								isFavorite={isProductFavorite}
								isLoading={isProductFavoriteLoading}
								onToggle={toggleProductFavorite}
								size="md"
								className="shadow-lg backdrop-blur-sm bg-white/90 dark:bg-gray-800/90"
							/>
						</div>
						<div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
							{product.image ? (
								<Image
									src={product.image}
									alt={product.name}
									fill
									className="object-cover"
									loading="eager"
									priority
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-gray-200 dark:from-gray-600 to-gray-300 dark:to-gray-700 flex items-center justify-center">
									<svg className="h-24 w-24 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							)}
						</div>
					</div>

					{/* Product Info */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className={`mb-4 ${isArabic ? 'text-right' : 'text-left'}`}>
							{product.brand && (
								<p className="text-sm text-gray-400 dark:text-gray-500 mb-2">{product.brand}</p>
							)}
							<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
								{isArabic && product.nameAr ? product.nameAr : product.name}
							</h1>
						</div>

						{/* Rating & Reviews */}
						{product.rating && (
							<div className={`flex items-center gap-2 mb-4 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
								<div className={`flex items-center ${isArabic ? 'gap-1 flex-row-reverse' : 'gap-1'}`}>
									<svg className="h-5 w-5 text-yellow-400 dark:text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
									<span className="text-base font-semibold text-gray-900 dark:text-gray-100">{product.rating}</span>
								</div>
								{product.reviewsCount && (
									<span className="text-sm text-gray-500 dark:text-gray-400">
										({product.reviewsCount > 999 ? '999+' : product.reviewsCount} {isArabic ? 'تقييم' : 'reviews'})
									</span>
								)}
							</div>
						)}

						{/* Price */}
						{product.price && (
							<div className={`flex items-center gap-3 mb-4 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
								<span className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
									{product.price} {isArabic ? "ريال" : "SAR"}
								</span>
								{product.originalPrice && product.originalPrice !== product.price && (
									<span className="text-lg text-gray-400 dark:text-gray-500 line-through">
										{product.originalPrice} {isArabic ? "ريال" : "SAR"}
									</span>
								)}
							</div>
						)}

						{/* Unit */}
						{product.unit && (
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
								{isArabic ? 'الوحدة: ' : 'Unit: '}{isArabic && product.unitAr ? product.unitAr : product.unit}
							</p>
						)}

						{/* Stock Status */}
						{!isOutOfStock && (
							<div className={`mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800`}>
								<div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
									<svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
									</svg>
									<span className="text-sm font-semibold text-green-700 dark:text-green-300">{isArabic ? 'متوفر' : 'In Stock'}</span>
									{product.stockQuantity && product.stockQuantity < 20 && (
										<span className="text-xs text-gray-600 dark:text-gray-400">
											({product.stockQuantity} {isArabic ? 'متبقي' : 'left'})
										</span>
									)}
								</div>
							</div>
						)}

						{isOutOfStock && (
							<div className={`mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800`}>
								<span className={`text-sm font-semibold text-red-700 dark:text-red-300 ${isArabic ? 'text-right' : 'text-left'}`}>
									{isArabic ? 'نفد المخزون' : 'Out of Stock'}
								</span>
							</div>
						)}

						{/* Delivery Time */}
						{product.deliveryTime && (
							<div className={`flex items-center gap-2 mb-4 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
								<svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span className="text-sm text-gray-600 dark:text-gray-400">
									{isArabic ? 'التوصيل: ' : 'Delivery: '}{isArabic && product.deliveryTimeAr ? product.deliveryTimeAr : product.deliveryTime}
								</span>
							</div>
						)}

						{/* Description */}
						{product.description && (
							<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
								{isArabic && product.descriptionAr ? product.descriptionAr : product.description}
							</p>
						)}

						{/* Quantity & Actions */}
						<div className="space-y-3">
							{/* Quantity Selector */}
							<div className={`inline-flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800`}>
								<button
									onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
									disabled={quantity <= 1}
									className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
									aria-label={isArabic ? "تقليل الكمية" : "Decrease Quantity"}
								>
									-
								</button>
								<div className="px-4 sm:px-6 py-2 text-sm sm:text-base min-w-[3rem] text-center border-x-2 border-gray-300 dark:border-gray-600 font-semibold text-gray-900 dark:text-gray-100">
									{quantity}
								</div>
								<button
									onClick={() => setQuantity(prev => prev + 1)}
									disabled={product.stockQuantity !== undefined && quantity >= product.stockQuantity}
									className="px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
									aria-label={isArabic ? "زيادة الكمية" : "Increase Quantity"}
								>
									+
								</button>
							</div>

							{/* Action Buttons */}
							<div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
								{/* Add to Cart Button */}
								<button
									onClick={handleAddToCart}
									disabled={isAddingToCart || cartLoading || isOutOfStock}
									className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 sm:px-6 py-3 sm:py-3.5 text-white text-sm sm:text-base font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${
										isAddingToCart || cartLoading || isOutOfStock
											? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
											: 'bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600'
									}`}
								>
									{isAddingToCart || cartLoading ? (
										<>
											<div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
											<span>{isArabic ? "جاري الإضافة..." : "Adding to Cart..."}</span>
										</>
									) : (
										<>
											<svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
											</svg>
											<span>{isArabic ? "إضافة للسلة" : "Add to Cart"}</span>
										</>
									)}
								</button>

								{/* Add to Favorite Button */}
								<button
									onClick={toggleProductFavorite}
									disabled={isProductFavoriteLoading}
									className={`flex items-center justify-center gap-2 rounded-lg px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.98] border-2 ${
										isProductFavorite
											? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
											: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400'
									} ${isProductFavoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
									aria-label={isProductFavorite ? (isArabic ? "إزالة من المفضلة" : "Remove from favorites") : (isArabic ? "إضافة للمفضلة" : "Add to favorites")}
								>
									{isProductFavoriteLoading ? (
										<div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
									) : (
										<>
											<svg 
												className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
													isProductFavorite ? 'fill-current' : 'fill-none'
												}`}
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={isProductFavorite ? 0 : 2}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
												/>
											</svg>
											<span className="hidden sm:inline">
												{isProductFavorite ? (isArabic ? "في المفضلة" : "Favorited") : (isArabic ? "إضافة للمفضلة" : "Add to Favorite")}
											</span>
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Related Products */}
				{relatedProducts.length > 0 && (
					<div className="mt-8">
						<SectionHeader title={isArabic ? 'منتجات ذات صلة' : 'Related Products'} isArabic={isArabic} />
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
							{relatedProducts.map((p) => (
								<ProductCard
									key={p.id}
									product={p}
									onClick={handleRelatedProductClick}
									showRating={true}
									showStock={true}
								/>
							))}
						</div>
					</div>
				)}

				{/* Clear Cart Dialog */}
				{false && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
						<div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 ${isArabic ? 'text-right' : 'text-left'}`} dir={direction}>
							<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{isArabic ? 'استبدال السلة' : 'Replace Cart'}</h3>
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{isArabic ? 'لديك منتجات من متجر آخر في سلتك. هل تريد استبدال السلة بهذا المنتج؟' : 'You have items from another store in your cart. Do you want to replace the cart with this item?'}</p>
							<div className={`flex gap-3 `}>
								<button
									onClick={() => {}}
									className="flex-1 rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
								>
									{isArabic ? 'إلغاء' : 'Cancel'}
								</button>
								<button
									onClick={() => {}}
									className="flex-1 rounded-lg px-4 py-2 bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium"
								>
									{isArabic ? 'تأكيد' : 'Confirm'}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
		</div>
	);
}
