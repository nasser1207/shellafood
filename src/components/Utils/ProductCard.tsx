"use client";

import { memo, useCallback, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useProductFavorites } from "@/hooks/useFavorites";
import { navigateToProduct } from "@/lib/utils/categories/navigation";
import { useCart } from "@/hooks/useCart";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import { TEST_STORES, TEST_CATEGORIES, TEST_DEPARTMENTS } from "@/lib/data/categories/testData";
import { Check } from "lucide-react";

export interface Product {
	id: string;
	name: string;
	nameAr?: string;
	slug?: string;
	image?: string;
	price?: number;
	originalPrice?: number;
	badge?: string;
	badgeAr?: string;
	unit?: string;
	unitAr?: string;
	description?: string;
	descriptionAr?: string;
	storeId?: string;
	category?: string;
	department?: string;
	rating?: number;
	reviewsCount?: number;
	inStock?: boolean;
	stockQuantity?: number;
	deliveryTime?: string;
	deliveryTimeAr?: string;
	brand?: string;
}

interface ProductCardProps {
	product: Product;
	onClick?: (productId: string) => void;
	onAddToCart?: (productId: string) => void;
	showAddButton?: boolean;
	className?: string;
	showRating?: boolean;
	showStock?: boolean;
	showDelivery?: boolean;
}

function ProductCard({
	product,
	onClick,
	onAddToCart,
	showAddButton = true,
	className = "",
	showRating = true,
	showStock = true,
	showDelivery = false,
}: ProductCardProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const router = useRouter();
	const { addToCart } = useCart();
	const { toasts, showToast, removeToast } = useToast();
	const [isAdded, setIsAdded] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	
	const { isFavorite, isLoading: favoriteLoading, toggleFavorite } = useProductFavorites(product.id, {
		name: product.name,
		nameAr: product.nameAr,
		image: product.image,
		price: typeof product.price === 'number' ? product.price : parseFloat((product.price as unknown as number)?.toString().replace(/[^0-9.]/g, '') || '0'),
		originalPrice: product.originalPrice ? (typeof product.originalPrice === 'number' ? product.originalPrice : parseFloat((product.originalPrice as unknown as number)?.toString().replace(/[^0-9.]/g, '') || '0')) : undefined as unknown as number | undefined,
		unit: product.unit,
		unitAr: product.unitAr,
		storeId: product.storeId,
	});
	
	const displayName = isArabic && product.nameAr ? product.nameAr : product.name;
	const displayUnit = isArabic && product.unitAr ? product.unitAr : product.unit;
	const displayBadge = isArabic && product.badgeAr ? product.badgeAr : product.badge;

	const handleClick = useCallback(() => {
		if (onClick) {
			onClick(product.id);
			return;
		}

		// Navigate to product details page
		if (!product.slug || !product.storeId) {
			return;
		}

		// Find the store to get categoryId and slug
		const store = TEST_STORES.find(s => s.id === product.storeId);
		if (!store || !store.categoryId || !store.slug) {
			return;
		}

		// Find the category to get slug
		const category = TEST_CATEGORIES.find(c => c.id === store.categoryId);
		if (!category) {
			return;
		}

		// Find the department to get slug
		let departmentSlug = 'food'; // default
		if (product.department) {
			const department = TEST_DEPARTMENTS.find(
				d => d.name === product.department || d.nameAr === product.department
			);
			if (department && department.slug) {
				departmentSlug = department.slug;
			} else {
				// Fallback: convert department name to slug format
				departmentSlug = product.department.toLowerCase().replace(/\s+/g, '-');
			}
		}

		// Navigate to product details
		navigateToProduct(router, category.slug, store.slug, departmentSlug, product);
	}, [router, product, onClick]);

	const handleAddToCartClick = useCallback(async (e: React.MouseEvent) => {
		e.stopPropagation();
		
		// If onAddToCart callback is provided, use it (backward compatibility)
		if (onAddToCart) {
			onAddToCart(product.id);
			return;
		}

		if (!product.storeId) {
			showToast(
				isArabic ? "خطأ: معلومات المتجر غير متوفرة" : "Error: Store information not available",
				"error"
			);
			return;
		}

		// Find store details
		const store = TEST_STORES.find(s => s.id === product.storeId);
		if (!store) {
			showToast(
				isArabic ? "خطأ: المتجر غير موجود" : "Error: Store not found",
				"error"
			);
			return;
		}

		const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || '0').replace(/[^0-9.]/g, ''));

		setIsAdding(true);
		
		try {
			const result = await addToCart({
				productId: product.id,
				storeId: product.storeId,
				quantity: 1,
				productName: product.name,
				productNameAr: product.nameAr,
				productImage: product.image,
				priceAtAdd: price,
				storeName: store.name,
				storeNameAr: store.nameAr,
				storeLogo: store.logo || undefined,
				stock: product.stockQuantity,
			});

			if (result.success) {
				setIsAdded(true);
				showToast(
					isArabic ? "تم إضافة المنتج للسلة" : "Product added to cart",
					"success"
				);
				// Reset added state after 2 seconds
				setTimeout(() => setIsAdded(false), 2000);
			} else if (result.requiresClearCart) {
				showToast(
					isArabic
						? "لديك منتجات من متجر آخر في السلة. يرجى إفراغ السلة أولاً"
						: "You have items from a different store in your cart. Please clear cart first",
					"warning"
				);
			} else {
				showToast(
					result.error || (isArabic ? "حدث خطأ أثناء إضافة المنتج" : "Error adding product"),
					"error"
				);
			}
		} catch (error) {
			console.error("Error adding to cart:", error);
			showToast(
				isArabic ? "حدث خطأ في الاتصال" : "Connection error",
				"error"
			);
		} finally {
			setIsAdding(false);
		}
	}, [product, addToCart, showToast, isArabic, onAddToCart]);

	const isLowStock = product.inStock && product.stockQuantity !== undefined && product.stockQuantity < 10;

	return (
		<div
			dir={direction}
			onClick={handleClick}
			className={`group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm dark:shadow-gray-900/50 transition-all duration-200 hover:shadow-lg dark:hover:shadow-gray-900/70 hover:border-green-300 dark:hover:border-green-600 cursor-pointer ${className}`}
		>
			{/* Image Container */}
			<div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 mb-3">
				{product.image ? (
					<Image
						src={product.image}
						alt={displayName}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
						loading="lazy"
						sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
					/>
				) : (
					<div className="h-full w-full bg-gradient-to-br from-gray-200 dark:from-gray-600 to-gray-300 dark:to-gray-700 flex items-center justify-center">
						<svg className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
				)}

				{/* Badge */}
				{displayBadge && (
					<span className={`absolute top-2 ${isArabic ? 'right-2' : 'left-2'} rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg z-10`}>
						{displayBadge}
					</span>
				)}

				{/* Stock Status Badge */}
				{showStock && !product.inStock && (
					<span className={`absolute top-2 ${isArabic ? 'left-2' : 'right-2'} rounded-full bg-gray-800 px-2.5 py-1 text-xs font-semibold text-white shadow-lg z-10`}>
						{isArabic ? "نفد" : "Out"}
					</span>
				)}
				{showStock && isLowStock && product.inStock && (
					<span className={`absolute top-2 ${isArabic ? 'left-2' : 'right-2'} rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg z-10`}>
						{isArabic ? "كمية محدودة" : "Low Stock"}
					</span>
				)}

				{/* Favorite Button */}
				<div className={`absolute ${isArabic ? 'left-2' : 'right-2'} top-2 z-10`} onClick={(e) => e.stopPropagation()}>
					<FavoriteButton
						isFavorite={isFavorite}
						isLoading={favoriteLoading}
						onToggle={toggleFavorite}
						size="sm"
					/>
				</div>

				{/* Add to Cart Button */}
				{showAddButton && product.inStock !== false && (
					<button
						onClick={handleAddToCartClick}
						disabled={isAdding}
						className={`absolute ${isArabic ? 'left-2' : 'right-2'} bottom-2 rounded-full p-2.5 text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 z-10 disabled:opacity-50 disabled:cursor-not-allowed ${
							isAdded ? "bg-green-500" : "bg-green-600 hover:bg-green-700"
						}`}
						title={isArabic ? (isAdded ? "تمت الإضافة" : "إضافة للسلة") : (isAdded ? "Added" : "Add to cart")}
						aria-label={isArabic ? (isAdded ? "تمت الإضافة" : "إضافة للسلة") : (isAdded ? "Added" : "Add to cart")}
					>
						{isAdding ? (
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : isAdded ? (
							<Check className="w-4 h-4" />
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
							</svg>
						)}
					</button>
				)}
			</div>

			{/* Product Info */}
			<div className={isArabic ? 'text-right' : 'text-left'}>
				{/* Brand */}
				{product.brand && (
					<p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{product.brand}</p>
				)}

				{/* Product Name */}
				<h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5 min-h-[2.5rem] leading-tight">
					{displayName}
				</h3>

				{/* Unit */}
				{displayUnit && (
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{displayUnit}</p>
				)}

				{/* Rating */}
				{showRating && product.rating && (
					<div className={`flex items-center gap-1 mb-2 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
						<svg className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
						<span className="text-xs font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
						{product.reviewsCount && (
							<span className="text-xs text-gray-500 dark:text-gray-400">
								({product.reviewsCount > 999 ? '999+' : product.reviewsCount})
							</span>
						)}
					</div>
				)}

				{/* Delivery Time */}
				{showDelivery && product.deliveryTime && (
					<div className={`flex items-center gap-1 mb-2 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
						<svg className="h-3 w-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span className="text-xs text-gray-500 dark:text-gray-400">
							{isArabic && product.deliveryTimeAr ? product.deliveryTimeAr : product.deliveryTime}
						</span>
					</div>
				)}

				{/* Price */}
				<div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
					{product.price && (
						<span className="text-base font-bold text-green-600 dark:text-green-400">
							{product.price} {isArabic ? "ريال" : "SAR"}
						</span>
					)}
					{product.originalPrice && product.originalPrice !== product.price && (
						<span className="text-xs text-gray-400 dark:text-gray-500 line-through">
							{product.originalPrice} {isArabic ? "ريال" : "SAR"}
						</span>
					)}
				</div>
			</div>

			{/* Toast Container */}
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
		</div>
	);
}

export default memo(ProductCard);
