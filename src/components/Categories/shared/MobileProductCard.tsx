"use client";

import { memo, useCallback, useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { Product } from "@/components/Utils/ProductCard";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useProductFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import { navigateToProduct } from "@/lib/utils/categories/navigation";
import { TEST_STORES, TEST_CATEGORIES, TEST_DEPARTMENTS } from "@/lib/data/categories/testData";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface MobileProductCardProps {
	product: Product;
	onClick?: (productId: string) => void;
	onQuickAdd?: (product: Product) => void;
	index?: number;
	storeId?: string;
	storeName?: string;
	storeNameAr?: string;
}

function MobileProductCard({
	product,
	onClick,
	onQuickAdd,
	index = 0,
	storeId,
	storeName,
	storeNameAr,
}: MobileProductCardProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	const { addToCart } = useCart();
	const { toasts, showToast, removeToast } = useToast();
	const [isAdding, setIsAdding] = useState(false);
	const [isAdded, setIsAdded] = useState(false);

	const { isFavorite, isLoading: favoriteLoading, toggleFavorite } =
		useProductFavorites(product.id, {
			name: product.name,
			nameAr: product.nameAr,
			image: product.image,
			price: product.price || 0,
			originalPrice: product.originalPrice,
			unit: product.unit,
			unitAr: product.unitAr,
			storeId: product.storeId || storeId,
			storeName: storeName,
			storeNameAr: storeNameAr,
		});

	const handleQuickAdd = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation();
			if (!product.inStock || isAdding) return;

			const finalStoreId = product.storeId || storeId;
			if (!finalStoreId) {
				showToast(
					isArabic ? "خطأ: معلومات المتجر غير متوفرة" : "Error: Store information not available",
					"error"
				);
				return;
			}

			setIsAdding(true);

			try {
				const result = await addToCart({
					productId: product.id,
					storeId: finalStoreId,
					quantity: 1,
					productName: product.name,
					productNameAr: product.nameAr,
					productImage: product.image,
					priceAtAdd: product.price || 0,
					storeName: storeName || "",
					storeNameAr: storeNameAr,
					stock: product.stockQuantity,
				});

				if (result.success) {
					setIsAdded(true);
					showToast(
						isArabic ? "تم إضافة المنتج للسلة" : "Product added to cart",
						"success"
					);
					onQuickAdd?.(product);
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
		},
		[product, storeId, storeName, storeNameAr, addToCart, showToast, isArabic, onQuickAdd, isAdding]
	);

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

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: index * 0.05, duration: 0.2 }}
			onClick={handleClick}
			className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 active:scale-98 transition-transform cursor-pointer"
		>
			{/* Product Image */}
			<div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
				{product.image ? (
					<Image
						src={product.image}
						alt={isArabic && product.nameAr ? product.nameAr : product.name}
						fill
						sizes={getImageSizes('card')}
						className="object-cover"
						loading="lazy"
						quality={getImageQuality('card')}
						placeholder="blur"
						blurDataURL={getImageBlurDataURL()}
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
						<ShoppingCart className="w-12 h-12 text-gray-400" />
					</div>
				)}

				{/* Badge - Top left */}
				{product.badge && (
					<div
						className={`absolute top-2 ${isArabic ? "right-2" : "left-2"} px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md z-10`}
					>
						{isArabic && product.badgeAr ? product.badgeAr : product.badge}
					</div>
				)}

				{/* Favorite - Top right */}
				<div
					className={`absolute top-2 ${isArabic ? "left-2" : "right-2"} z-10`}
					onClick={(e) => e.stopPropagation()}
				>
					<FavoriteButton
						isFavorite={isFavorite}
						isLoading={favoriteLoading}
						onToggle={toggleFavorite}
						size="sm"
						className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
					/>
				</div>

				{/* Out of stock overlay */}
				{!product.inStock && (
					<div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
						<span className="text-white font-bold text-sm">
							{isArabic ? "غير متوفر" : "Out of Stock"}
						</span>
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className="p-3">
				{/* Name - 2 lines max */}
				<h3
					className={`text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1 min-h-[2.5rem] ${
						isArabic ? "text-right" : "text-left"
					}`}
				>
					{isArabic && product.nameAr ? product.nameAr : product.name}
				</h3>

				{/* Price - Large and prominent */}
				<div
					className={`flex items-baseline gap-1 mb-2 ${
						isArabic ? "flex-row-reverse justify-end" : "justify-start"
					}`}
				>
					<span className="text-lg font-black text-green-600 dark:text-green-400">
						{product.price}
					</span>
					<span className="text-xs text-gray-600 dark:text-gray-400">SAR</span>
					{product.originalPrice && product.originalPrice > (product.price || 0) && (
						<span className="text-xs text-gray-400 dark:text-gray-500 line-through ml-1">
							{product.originalPrice}
						</span>
					)}
				</div>

				{/* Rating - Compact */}
				{product.rating && (
					<div
						className={`flex items-center gap-1 mb-3 ${
							isArabic ? "flex-row-reverse justify-end" : "justify-start"
						}`}
					>
						<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
						<span className="text-xs font-semibold text-gray-900 dark:text-white">
							{product.rating}
						</span>
						{product.reviewsCount && (
							<span className="text-xs text-gray-500 dark:text-gray-400">
								({product.reviewsCount > 999 ? "999+" : product.reviewsCount})
							</span>
						)}
					</div>
				)}

				{/* Add to cart - Full width, easy to tap */}
				{product.inStock ? (
					<button
						onClick={handleQuickAdd}
						disabled={isAdding}
						className={`w-full py-2.5 text-white text-sm font-bold rounded-lg active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
							isAdded 
								? "bg-green-500 dark:bg-green-500" 
								: "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600"
						}`}
					>
						{isAdding ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>{isArabic ? "جاري الإضافة..." : "Adding..."}</span>
							</>
						) : isAdded ? (
							<>
								<Check className="w-4 h-4" />
								<span>{isArabic ? "تمت الإضافة" : "Added"}</span>
							</>
						) : (
							<span>{isArabic ? "أضف" : "Add"}</span>
						)}
					</button>
				) : (
					<button
						disabled
						className="w-full py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed"
					>
						{isArabic ? "غير متوفر" : "Out of Stock"}
					</button>
				)}
			</div>

			{/* Toast Container */}
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
		</motion.div>
	);
}

export default memo(MobileProductCard);

