"use client";

import { useMemo, useState, useCallback, memo } from "react";
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
import MobileProductView from "./MobileProductView";
import { useMobile } from "@/hooks/useMobile";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";


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
function ProductView({ product, relatedProducts, store }: ProductViewProps) {
	// Call all hooks first (hooks rules - must be called in same order)
	const isMobile = useMobile(768);
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

	// Use mobile view on mobile devices (after all hooks are called)
	if (isMobile) {
		return <MobileProductView product={product} relatedProducts={relatedProducts} store={store} />;
	}

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
			// Ensure price is a number
			const price = typeof product.price === 'number' 
				? product.price 
				: typeof product.price === 'string' 
					? parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0
					: 0;

			const result = await addToCart({ 
				productId: product.id, 
				storeId: storeId,
				quantity,
				productName: product.name,
				productNameAr: product.nameAr,
				productImage: product.image,
				priceAtAdd: price,
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
		<>
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" dir={direction}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
					{/* Product Image */}
					<div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700/50 p-6 sm:p-8 relative overflow-hidden group">
						{/* Decorative gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 dark:from-green-500/10 dark:to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
						
						{/* Badge if available */}
						{product.badge && (
							<div className={`absolute ${isArabic ? 'right-6' : 'left-6'} top-6 z-20`}>
								<div className="relative">
									<div className="absolute inset-0 bg-red-500 blur-xl opacity-50 animate-pulse" />
									<div className="relative px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full text-white text-sm font-bold shadow-lg">
										{isArabic && product.badgeAr ? product.badgeAr : product.badge}
									</div>
								</div>
							</div>
						)}
						
						{/* Heart Icon on Image */}
						<div className={`absolute ${isArabic ? 'left-6' : 'right-6'} top-6 z-20`}>
							<FavoriteButton
								isFavorite={isProductFavorite}
								isLoading={isProductFavoriteLoading}
								onToggle={toggleProductFavorite}
								size="md"
								className="shadow-2xl backdrop-blur-md bg-white/95 dark:bg-gray-800/95 hover:scale-110 transition-transform duration-200"
							/>
						</div>
						
						<div className="relative aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded-xl overflow-hidden shadow-inner">
							{product.image ? (
								<Image
									src={product.image}
									alt={product.name}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-500"
									loading="eager"
									priority
									sizes={getImageSizes('gallery')}
									quality={getImageQuality('gallery')}
									placeholder="blur"
									blurDataURL={getImageBlurDataURL()}
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-gray-200 dark:from-gray-600 to-gray-300 dark:to-gray-700 flex items-center justify-center">
									<svg className="h-32 w-32 text-gray-400 dark:text-gray-500 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							)}
							
							{/* Image corner decoration */}
							<div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/20 to-transparent dark:from-black/20 pointer-events-none" />
						</div>
					</div>

					{/* Product Info */}
					<div className={`bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700/50 p-6 sm:p-10 ${isArabic ? 'text-right' : 'text-left'} relative overflow-hidden`} dir={direction}>
						{/* Decorative corner gradient */}
						<div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-green-500/10 to-transparent dark:from-green-500/20 rounded-full -translate-x-20 -translate-y-20 pointer-events-none" />
						<div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-500/10 to-transparent dark:from-blue-500/20 rounded-full translate-x-20 translate-y-20 pointer-events-none" />
						
						<div className="relative z-10">
							{/* Brand & Name */}
							<div className="mb-8">
								{product.brand && (
									<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full mb-4">
										<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
										</svg>
										<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
											{product.brand}
										</span>
									</div>
								)}
								<h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight tracking-tight">
									{isArabic && product.nameAr ? product.nameAr : product.name}
								</h1>
							</div>
						</div>

							{/* Rating & Reviews */}
							{product.rating && (
								<div className={`flex items-center gap-3 mb-8 ${isArabic ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
									<div className={`relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-800/50 shadow-sm ${isArabic ? 'flex-row-reverse' : ''}`}>
										<div className="flex gap-0.5">
											{[...Array(5)].map((_, i) => (
												<svg key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
											))}
										</div>
										<span className="text-base font-bold text-gray-900 dark:text-gray-100">{product.rating}</span>
									</div>
									{product.reviewsCount && (
										<button className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors duration-200 underline-offset-4 hover:underline">
											{product.reviewsCount > 999 ? '999+' : product.reviewsCount} {isArabic ? 'تقييم' : 'reviews'}
										</button>
									)}
								</div>
							)}

							{/* Price Section */}
							<div className={`mb-8 pb-8 border-b-2 border-dashed border-gray-200 dark:border-gray-700 ${isArabic ? 'text-right' : 'text-left'}`}>
								<div className={`flex items-baseline gap-4 flex-wrap ${isArabic ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
									{product.price && (
										<div className="relative">
											<div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-20 blur-xl" />
											<div className="relative flex items-baseline gap-2">
												<span className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
													{typeof product.price === 'number' ? product.price : product.price}
												</span>
												<span className="text-xl sm:text-2xl font-bold text-gray-500 dark:text-gray-400">
													{isArabic ? "ريال" : "SAR"}
												</span>
											</div>
										</div>
									)}
									{product.originalPrice && product.originalPrice !== product.price && (
										<div className="flex flex-col gap-2">
											<div className="flex items-center gap-2">
												<span className="text-xl text-gray-400 dark:text-gray-500 line-through">
													{typeof product.originalPrice === 'number' ? product.originalPrice : product.originalPrice}
												</span>
												<span className="text-sm text-gray-400 dark:text-gray-500">{isArabic ? "ريال" : "SAR"}</span>
											</div>
											{(() => {
												const originalPrice = typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat(String(product.originalPrice).replace(/[^0-9.]/g, '')) || 0;
												const currentPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;
												const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
												return discount > 0 ? (
													<div className="relative inline-flex">
														<div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 rounded-full opacity-20 blur-md animate-pulse" />
														<span className="relative px-4 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold rounded-full shadow-lg">
															{isArabic ? `خصم ${discount}%` : `SAVE ${discount}%`}
														</span>
													</div>
												) : null;
											})()}
										</div>
									)}
								</div>
								{product.unit && (
									<div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
										<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
										</svg>
										<span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
											{isArabic ? 'لكل ' : 'Per '}{isArabic && product.unitAr ? product.unitAr : product.unit}
										</span>
									</div>
								)}
							</div>

							{/* Product Details Section */}
							<div className="mb-8 space-y-4">
								{/* Stock Status */}
								{!isOutOfStock && (
									<div className={`relative p-5 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/20 border-2 border-green-200/50 dark:border-green-800/50 shadow-lg shadow-green-100/50 dark:shadow-green-900/20 overflow-hidden group hover:shadow-xl hover:shadow-green-100 dark:hover:shadow-green-900/30 transition-all duration-300 ${isArabic ? 'text-right' : 'text-left'}`}>
										{/* Animated background effect */}
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
										
										<div className={`relative flex items-center gap-4 ${isArabic ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
											<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
												<svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											</div>
											<div className={isArabic ? 'text-right' : 'text-left'}>
												<span className="text-lg font-extrabold text-green-800 dark:text-green-200 block">
													{isArabic ? 'متوفر في المخزون' : 'In Stock'}
												</span>
												{product.stockQuantity && product.stockQuantity < 20 ? (
													<div className="flex items-center gap-2 mt-1">
														<span className="relative flex h-2 w-2">
															<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
															<span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
														</span>
														<span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
															{isArabic ? `${product.stockQuantity} قطعة متبقية فقط - اطلب الآن!` : `Only ${product.stockQuantity} items left - Order now!`}
														</span>
													</div>
												) : (
													<span className="text-sm text-green-700/80 dark:text-green-300/80 font-medium">
														{isArabic ? 'متوفر بكميات كبيرة' : 'Ready to ship'}
													</span>
												)}
											</div>
										</div>
									</div>
								)}

								{isOutOfStock && (
									<div className={`relative p-5 rounded-2xl bg-gradient-to-br from-red-50 via-rose-50 to-red-50 dark:from-red-900/20 dark:via-rose-900/20 dark:to-red-900/20 border-2 border-red-200/50 dark:border-red-800/50 shadow-lg shadow-red-100/50 dark:shadow-red-900/20 overflow-hidden ${isArabic ? 'text-right' : 'text-left'}`}>
										<div className={`flex items-center gap-4 ${isArabic ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
											<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
												<svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											</div>
											<div className={isArabic ? 'text-right' : 'text-left'}>
												<span className="text-lg font-extrabold text-red-800 dark:text-red-200 block">
													{isArabic ? 'نفد المخزون' : 'Out of Stock'}
												</span>
												<span className="text-sm text-red-700/80 dark:text-red-300/80 font-medium">
													{isArabic ? 'سيتوفر قريباً' : 'Will be available soon'}
												</span>
											</div>
										</div>
									</div>
								)}

								{/* Delivery Time */}
								{product.deliveryTime && (
									<div className={`relative flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-blue-900/20 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/20 overflow-hidden group hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/30 transition-all duration-300 ${isArabic ? 'justify-end flex-row-reverse text-right' : 'justify-start text-left'}`}>
										{/* Animated background effect */}
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
										
										<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
											<svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
											</svg>
										</div>
										<div className={`relative ${isArabic ? 'text-right' : 'text-left'}`}>
											<span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
												{isArabic ? 'وقت التوصيل المتوقع' : 'Delivery Time'}
											</span>
											<span className="text-lg font-bold text-gray-900 dark:text-gray-100">
												{isArabic && product.deliveryTimeAr ? product.deliveryTimeAr : product.deliveryTime}
											</span>
										</div>
									</div>
								)}
						</div>

							{/* Description */}
							{product.description && (
								<div className="mb-8 pb-8 border-b-2 border-dashed border-gray-200 dark:border-gray-700">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
										</div>
										<h3 className={`text-xl font-extrabold text-gray-900 dark:text-gray-100 ${isArabic ? 'text-right' : 'text-left'}`}>
											{isArabic ? 'الوصف' : 'Description'}
										</h3>
									</div>
									<p className={`text-gray-700 dark:text-gray-300 text-base leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
										{isArabic && product.descriptionAr ? product.descriptionAr : product.description}
									</p>
								</div>
							)}

							{/* Additional Product Details */}
							<div className="mb-8 space-y-4">
								{/* Ingredients */}
								{(product as any).ingredients && (
									<div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
										<div className="flex items-center gap-2 mb-3">
											<svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
											</svg>
											<h4 className={`text-base font-extrabold text-gray-900 dark:text-gray-100 ${isArabic ? 'text-right' : 'text-left'}`}>
												{isArabic ? 'المكونات' : 'Ingredients'}
											</h4>
										</div>
										<p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
											{(product as any).ingredients}
										</p>
									</div>
								)}

							{/* Nutrition Information */}
							{(product as any).nutrition && (
								<div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
									<h4 className={`text-base font-bold text-gray-900 dark:text-gray-100 mb-3 ${isArabic ? 'text-right' : 'text-left'}`}>
										{isArabic ? 'المعلومات الغذائية' : 'Nutrition Information'}
									</h4>
									<div className={`space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}>
										{typeof (product as any).nutrition === 'object' ? (
											Object.entries((product as any).nutrition).map(([key, value]: [string, any]) => (
												<div key={key} className="flex justify-between items-center">
													<span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
													<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
												</div>
											))
										) : (
											<p className="text-sm text-gray-700 dark:text-gray-300">{(product as any).nutrition}</p>
										)}
									</div>
								</div>
							)}

							{/* Allergens */}
							{(product as any).allergens && (
								<div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
									<h4 className={`text-base font-bold text-orange-900 dark:text-orange-300 mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
										{isArabic ? 'مسببات الحساسية' : 'Allergens'}
									</h4>
									<p className={`text-sm text-orange-800 dark:text-orange-200 ${isArabic ? 'text-right' : 'text-left'}`}>
										{(product as any).allergens}
									</p>
								</div>
							)}

							{/* Storage Instructions */}
							{(product as any).storage && (
								<div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
									<h4 className={`text-base font-bold text-gray-900 dark:text-gray-100 mb-2 ${isArabic ? 'text-right' : 'text-left'}`}>
										{isArabic ? 'تعليمات التخزين' : 'Storage Instructions'}
									</h4>
									<p className={`text-sm text-gray-700 dark:text-gray-300 ${isArabic ? 'text-right' : 'text-left'}`}>
										{(product as any).storage}
									</p>
								</div>
							)}

							{/* Product Specifications */}
							{(product as any).specifications && (
								<div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
									<h4 className={`text-base font-bold text-gray-900 dark:text-gray-100 mb-3 ${isArabic ? 'text-right' : 'text-left'}`}>
										{isArabic ? 'المواصفات' : 'Specifications'}
									</h4>
									<div className={`space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}>
										{typeof (product as any).specifications === 'object' ? (
											Object.entries((product as any).specifications).map(([key, value]: [string, any]) => (
												<div key={key} className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700 last:border-0">
													<span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
													<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{String(value)}</span>
												</div>
											))
										) : (
											<p className="text-sm text-gray-700 dark:text-gray-300">{(product as any).specifications}</p>
										)}
									</div>
								</div>
							)}

							{/* Expiry Date */}
							{(product as any).expiryDate && (
								<div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
									<div className={`flex items-center gap-2 ${isArabic ? 'justify-end' : 'justify-start'}`}>
										<svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
										<div className={isArabic ? 'text-right' : 'text-left'}>
											<span className="text-sm font-semibold text-gray-900 dark:text-gray-100 block">
												{isArabic ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}
											</span>
											<span className="text-sm text-gray-700 dark:text-gray-300">{(product as any).expiryDate}</span>
										</div>
									</div>
								</div>
							)}
						</div>

							{/* Quantity & Actions */}
							<div className={`space-y-6 ${isArabic ? 'text-right' : 'text-left'}`}>
								{/* Quantity Selector */}
								<div>
									<label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
										<svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
										</svg>
										{isArabic ? 'الكمية' : 'Quantity'}
									</label>
									<div className={`inline-flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg`}>
										<button
											onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
											disabled={quantity <= 1}
											className="px-6 py-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all font-extrabold text-xl text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
											aria-label={isArabic ? "تقليل الكمية" : "Decrease Quantity"}
										>
											<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
											</svg>
										</button>
										<div className="px-8 py-4 text-xl min-w-[5rem] text-center border-x-2 border-gray-300 dark:border-gray-600 font-black text-gray-900 dark:text-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
											{quantity}
										</div>
										<button
											onClick={() => setQuantity(prev => prev + 1)}
											disabled={product.stockQuantity !== undefined && quantity >= product.stockQuantity}
											className="px-6 py-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all font-extrabold text-xl text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
											aria-label={isArabic ? "زيادة الكمية" : "Increase Quantity"}
										>
											<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
											</svg>
										</button>
									</div>
								</div>

								{/* Action Buttons */}
								<div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4`}>
									{/* Add to Cart Button */}
									<button
										onClick={handleAddToCart}
										disabled={isAddingToCart || cartLoading || isOutOfStock}
										className={`flex-1 relative flex items-center justify-center gap-3 rounded-2xl px-8 py-5 text-white text-lg font-extrabold transition-all duration-300 shadow-2xl overflow-hidden group ${
											isAddingToCart || cartLoading || isOutOfStock
												? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
												: 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:shadow-green-500/50 active:scale-[0.98]'
										}`}
									>
										{/* Animated background */}
										{!isAddingToCart && !cartLoading && !isOutOfStock && (
											<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
										)}
										
										<div className="relative flex items-center gap-3">
											{isAddingToCart || cartLoading ? (
												<>
													<div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
													<span>{isArabic ? "جاري الإضافة..." : "Adding..."}</span>
												</>
											) : (
												<>
													<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
													</svg>
													<span>{isArabic ? "إضافة للسلة" : "Add to Cart"}</span>
												</>
											)}
										</div>
									</button>

									{/* Add to Favorite Button */}
									<button
										onClick={toggleProductFavorite}
										disabled={isProductFavoriteLoading}
										className={`relative flex items-center justify-center gap-2 rounded-2xl px-8 py-5 text-lg font-bold transition-all duration-300 shadow-xl active:scale-[0.98] border-2 overflow-hidden group ${
											isProductFavorite
												? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:shadow-red-200 dark:hover:shadow-red-900/30'
												: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400'
										} ${isProductFavoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
										aria-label={isProductFavorite ? (isArabic ? "إزالة من المفضلة" : "Remove from favorites") : (isArabic ? "إضافة للمفضلة" : "Add to favorites")}
									>
										{/* Animated background */}
										{!isProductFavoriteLoading && (
											<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
										)}
										
										<div className="relative flex items-center gap-2">
											{isProductFavoriteLoading ? (
												<div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
											) : (
												<>
													<svg 
														className={`w-6 h-6 transition-all duration-300 ${
															isProductFavorite ? 'fill-current scale-110' : 'fill-none'
														}`}
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth={isProductFavorite ? 0 : 2.5}
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
														/>
													</svg>
													<span className="hidden sm:inline font-extrabold">
														{isProductFavorite ? (isArabic ? "في المفضلة" : "Favorited") : (isArabic ? "إضافة للمفضلة" : "Add to Favorite")}
													</span>
												</>
											)}
										</div>
									</button>
								</div>
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
			</div>
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
		</>
	);
}

export default memo(ProductView);
