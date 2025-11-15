"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/components/Utils/ProductCard";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useProductFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/Toast";
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
	const { addToCart } = useCart();
	const { showToast } = useToast();

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
			if (!product.inStock) return;

			const finalStoreId = product.storeId || storeId;
			if (!finalStoreId) {
				showToast(
					isArabic ? "خطأ: معلومات المتجر غير متوفرة" : "Error: Store information not available",
					"error"
				);
				return;
			}

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
					showToast(
						isArabic ? "تم الإضافة للسلة" : "Added to cart",
						"success"
					);
					onQuickAdd?.(product);
				} else if (result.requiresClearCart) {
					showToast(
						isArabic
							? "لديك منتجات من متجر آخر في السلة"
							: "You have items from a different store in your cart",
						"warning"
					);
				}
			} catch (error) {
				showToast(
					isArabic ? "حدث خطأ" : "An error occurred",
					"error"
				);
			}
		},
		[product, storeId, storeName, storeNameAr, addToCart, showToast, isArabic, onQuickAdd]
	);

	const handleClick = useCallback(() => {
		onClick?.(product.id);
	}, [onClick, product.id]);

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
						className="w-full py-2.5 bg-green-600 dark:bg-green-500 text-white text-sm font-bold rounded-lg active:scale-95 transition-transform hover:bg-green-700 dark:hover:bg-green-600"
					>
						{isArabic ? "أضف" : "Add"}
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
		</motion.div>
	);
}

export default memo(MobileProductCard);

