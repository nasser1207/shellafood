"use client";

import { memo, useCallback, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Product, ProductCardVariant } from "@/types/categories";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useProductFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/Toast";
import { navigateToProductFromContext } from "@/lib/utils/categories/navigation";
import { 
	formatPrice, 
	getProductName, 
	getProductUnit, 
	getProductBadge,
	isProductAvailable,
	hasDiscount
} from "@/lib/utils/categories/productHelpers";
import { fadeInUp } from "@/lib/utils/categories/animations";
import { cn } from "@/lib/utils";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

// Extended props interface for backward compatibility
interface UnifiedProductCardProps {
	product: Product;
	variant?: ProductCardVariant;
	onClick?: (productId: string) => void;
	onQuickAdd?: (product: Product) => void;
	onAddToCart?: (productId: string) => void; // Backward compatibility
	showActions?: boolean;
	showRating?: boolean;
	showStock?: boolean;
	showDelivery?: boolean;
	className?: string;
	index?: number;
	storeId?: string;
	storeName?: string;
	storeNameAr?: string;
	// Legacy props
	categorySlug?: string;
	storeSlug?: string;
	departmentSlug?: string;
	showAddButton?: boolean; // Backward compatibility
	onQuickView?: (product: Product) => void; // Legacy prop
}

/**
 * Unified ProductCard Component
 * Consolidates all ProductCard variants (default, mobile, compact, list) into a single component
 */
function UnifiedProductCard({
	product,
	variant = 'default',
	onClick,
	onQuickAdd,
	onAddToCart, // Backward compatibility
	showActions = true,
	showRating = true,
	showStock = true,
	showDelivery = false,
	className = "",
	index = 0,
	storeId,
	storeName,
	storeNameAr,
	showAddButton = true, // Backward compatibility
}: UnifiedProductCardProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const router = useRouter();
	const { addToCart } = useCart();
	const { showToast } = useToast();

	// Product favorites hook
	const { isFavorite, isLoading: favoriteLoading, toggleFavorite } = useProductFavorites(
		product.id,
		{
			name: product.name,
			nameAr: product.nameAr,
			image: product.image,
			price: product.price,
			originalPrice: product.originalPrice,
			unit: product.unit,
			unitAr: product.unitAr,
			storeId: product.storeId || storeId,
		}
	);

	// Display values
	const displayName = useMemo(() => getProductName(product, language), [product, language]);
	const displayUnit = useMemo(() => getProductUnit(product, language), [product, language]);
	const displayBadge = useMemo(() => getProductBadge(product, language), [product, language]);
	const isAvailable = useMemo(() => isProductAvailable(product), [product]);
	const hasDiscountPrice = useMemo(() => hasDiscount(product), [product]);

	// Handlers
	const handleClick = useCallback(() => {
		if (onClick) {
			onClick(product.id);
		} else {
			navigateToProductFromContext(router, product);
		}
	}, [router, product, onClick]);

	const handleQuickAdd = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation();
			if (!isAvailable) return;

			// Backward compatibility: use onAddToCart if provided
			if (onAddToCart) {
				onAddToCart(product.id);
				return;
			}

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
					priceAtAdd: product.price,
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
		[product, storeId, storeName, storeNameAr, addToCart, showToast, isArabic, onQuickAdd, onAddToCart, isAvailable]
	);

	// Auto-detect variant if not specified (backward compatibility)
	const detectedVariant = variant || (typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'default');

	// Render based on variant
	if (detectedVariant === 'mobile') {
		return <MobileVariant 
			product={product}
			displayName={displayName}
			displayUnit={displayUnit}
			displayBadge={displayBadge}
			isAvailable={isAvailable}
			hasDiscountPrice={hasDiscountPrice}
			isFavorite={isFavorite}
			favoriteLoading={favoriteLoading}
			toggleFavorite={toggleFavorite}
			onClick={handleClick}
			onQuickAdd={handleQuickAdd}
			showRating={showRating}
			showActions={showActions}
			showAddButton={showAddButton}
			isArabic={isArabic}
			index={index}
			className={className}
		/>;
	}

	if (detectedVariant === 'compact') {
		return <CompactVariant 
			product={product}
			displayName={displayName}
			displayUnit={displayUnit}
			displayBadge={displayBadge}
			isAvailable={isAvailable}
			hasDiscountPrice={hasDiscountPrice}
			isFavorite={isFavorite}
			favoriteLoading={favoriteLoading}
			toggleFavorite={toggleFavorite}
			onClick={handleClick}
			onQuickAdd={handleQuickAdd}
			showRating={showRating}
			showStock={showStock}
			showActions={showActions}
			showAddButton={showAddButton}
			isArabic={isArabic}
			direction={direction}
			index={index}
			className={className}
		/>;
	}

	// Default variant
	return <DefaultVariant 
		product={product}
		displayName={displayName}
		displayUnit={displayUnit}
		displayBadge={displayBadge}
		isAvailable={isAvailable}
		hasDiscountPrice={hasDiscountPrice}
		isFavorite={isFavorite}
		favoriteLoading={favoriteLoading}
		toggleFavorite={toggleFavorite}
		onClick={handleClick}
		onQuickAdd={handleQuickAdd}
		showActions={showActions}
		showAddButton={showAddButton}
		showRating={showRating}
		showStock={showStock}
		showDelivery={showDelivery}
		isArabic={isArabic}
		direction={direction}
		index={index}
		className={className}
	/>;
}

// Mobile Variant Component
interface VariantProps {
	product: Product;
	displayName: string;
	displayUnit: string;
	displayBadge?: string;
	isAvailable: boolean;
	hasDiscountPrice: boolean;
	isFavorite: boolean;
	favoriteLoading: boolean;
	toggleFavorite: () => void;
	onClick: () => void;
	onQuickAdd: (e: React.MouseEvent) => void;
	showRating?: boolean;
	showStock?: boolean;
	showActions?: boolean;
	showAddButton?: boolean;
	isArabic: boolean;
	direction?: string;
	index: number;
	className?: string;
}

function MobileVariant({
	product,
	displayName,
	displayUnit,
	displayBadge,
	isAvailable,
	hasDiscountPrice,
	isFavorite,
	favoriteLoading,
	toggleFavorite,
	onClick,
	onQuickAdd,
	showRating = true,
	showActions = true,
	showAddButton = true,
	showStock = true,
	isArabic,
	index,
	className,
}: VariantProps) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: index * 0.05, duration: 0.2 }}
			onClick={onClick}
			className={cn(
				"relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700",
				"active:scale-98 transition-transform cursor-pointer",
				className
			)}
		>
			{/* Product Image */}
			<div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
				{product.image ? (
					<Image
						src={product.image}
						alt={displayName}
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

				{/* Badge */}
				{displayBadge && (
					<div
						className={cn(
							"absolute top-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md z-10",
							isArabic ? "right-2" : "left-2"
						)}
					>
						{displayBadge}
					</div>
				)}

				{/* Favorite Button */}
				<div
					className={cn("absolute top-2 z-10", isArabic ? "left-2" : "right-2")}
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
				{!isAvailable && (
					<div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
						<span className="text-white font-bold text-sm">
							{isArabic ? "غير متوفر" : "Out of Stock"}
						</span>
					</div>
				)}
			</div>

			{/* Product Info */}
			<div className="p-3">
				{/* Name */}
				<h3
					className={cn(
						"text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1 min-h-[2.5rem]",
						isArabic ? "text-right" : "text-left"
					)}
				>
					{displayName}
				</h3>

				{/* Price */}
				<div
					className={cn(
						"flex items-baseline gap-1 mb-2",
						isArabic ? "flex-row-reverse justify-end" : "justify-start"
					)}
				>
					<span className="text-lg font-black text-green-600 dark:text-green-400">
						{product.price}
					</span>
					<span className="text-xs text-gray-600 dark:text-gray-400">SAR</span>
					{hasDiscountPrice && product.originalPrice && (
						<span className="text-xs text-gray-400 dark:text-gray-500 line-through ml-1">
							{product.originalPrice}
						</span>
					)}
				</div>

				{/* Rating */}
				{showRating && product.rating && (
					<div
						className={cn(
							"flex items-center gap-1 mb-3",
							isArabic ? "flex-row-reverse justify-end" : "justify-start"
						)}
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

				{/* Add to cart button */}
				{isAvailable ? (
					<button
						onClick={onQuickAdd}
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

// Compact Variant Component
function CompactVariant({
	product,
	displayName,
	displayUnit,
	displayBadge,
	isAvailable,
	hasDiscountPrice,
	isFavorite,
	favoriteLoading,
	toggleFavorite,
	onClick,
	onQuickAdd,
	showRating = true,
	showActions = true,
	showAddButton = true,
	showStock = true,
	isArabic,
	direction,
	index,
	className,
}: VariantProps) {
	const isLowStock = isAvailable && product.stockQuantity !== undefined && product.stockQuantity < 10;

	return (
		<motion.div
			dir={direction}
			variants={fadeInUp}
			initial="initial"
			animate="animate"
			onClick={onClick}
			className={cn(
				"group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2",
				"shadow-sm dark:shadow-gray-900/50 transition-all duration-200 hover:shadow-md",
				"hover:border-green-300 dark:hover:border-green-600 cursor-pointer",
				className
			)}
		>
			{/* Image Container */}
			<div className="relative aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700 mb-2">
				{product.image ? (
					<Image
						src={product.image}
						alt={displayName}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
						sizes={getImageSizes('card')}
						quality={getImageQuality('card')}
						placeholder="blur"
						blurDataURL={getImageBlurDataURL()}
					/>
				) : (
					<div className="h-full w-full bg-gradient-to-br from-gray-200 dark:from-gray-600 to-gray-300 dark:to-gray-700 flex items-center justify-center">
						<ShoppingCart className="h-8 w-8 text-gray-400 dark:text-gray-500" />
					</div>
				)}

				{/* Badge */}
				{displayBadge && (
					<span
						className={cn(
							"absolute top-1 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white shadow-lg z-10",
							isArabic ? "right-1" : "left-1"
						)}
					>
						{displayBadge}
					</span>
				)}

				{/* Stock Status */}
				{showStock && !isAvailable && (
					<span
						className={cn(
							"absolute top-1 rounded-full bg-gray-800 px-2 py-0.5 text-xs font-semibold text-white shadow-lg z-10",
							isArabic ? "left-1" : "right-1"
						)}
					>
						{isArabic ? "نفد" : "Out"}
					</span>
				)}
				{showStock && isLowStock && isAvailable && (
					<span
						className={cn(
							"absolute top-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white shadow-lg z-10",
							isArabic ? "left-1" : "right-1"
						)}
					>
						{isArabic ? "كمية محدودة" : "Low Stock"}
					</span>
				)}

				{/* Favorite Button */}
				<div
					className={cn("absolute z-10", isArabic ? "left-1 top-1" : "right-1 top-1")}
					onClick={(e) => e.stopPropagation()}
				>
					<FavoriteButton
						isFavorite={isFavorite}
						isLoading={favoriteLoading}
						onToggle={toggleFavorite}
						size="sm"
					/>
				</div>

				{/* Add to Cart Button */}
				{showActions && showAddButton && isAvailable && (
					<button
						onClick={onQuickAdd}
						className={cn(
							"absolute rounded-full bg-green-600 p-1.5 text-white shadow-lg transition-all duration-200",
							"hover:bg-green-700 hover:scale-110 active:scale-95 z-10",
							isArabic ? "left-1 bottom-1" : "right-1 bottom-1"
						)}
						title={isArabic ? "إضافة للسلة" : "Add to cart"}
						aria-label={isArabic ? "إضافة للسلة" : "Add to cart"}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
						</svg>
					</button>
				)}
			</div>

			{/* Product Info */}
			<div className={cn(isArabic ? "text-right" : "text-left")}>
				{/* Name */}
				<h3 className="line-clamp-2 text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1 min-h-[2rem] leading-tight">
					{displayName}
				</h3>

				{/* Unit */}
				{displayUnit && (
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{displayUnit}</p>
				)}

				{/* Rating */}
				{showRating && product.rating && (
					<div
						className={cn(
							"flex items-center gap-1 mb-1",
							isArabic ? "flex-row-reverse justify-end" : "justify-start"
						)}
					>
						<Star className="h-2.5 w-2.5 text-yellow-400 flex-shrink-0 fill-yellow-400" />
						<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
							{product.rating}
						</span>
					</div>
				)}

				{/* Price */}
				<div
					className={cn(
						"flex items-center gap-1",
						isArabic ? "flex-row-reverse justify-end" : "justify-start"
					)}
				>
					<span className="text-sm font-bold text-green-600 dark:text-green-400">
						{product.price} {isArabic ? "ريال" : "SAR"}
					</span>
					{hasDiscountPrice && product.originalPrice && (
						<span className="text-xs text-gray-400 dark:text-gray-500 line-through">
							{product.originalPrice}
						</span>
					)}
				</div>
			</div>
		</motion.div>
	);
}

// Default Variant Component
function DefaultVariant({
	product,
	displayName,
	displayUnit,
	displayBadge,
	isAvailable,
	hasDiscountPrice,
	isFavorite,
	favoriteLoading,
	toggleFavorite,
	onClick,
	onQuickAdd,
	showActions = true,
	showAddButton = true,
	showRating = true,
	showStock = true,
	showDelivery = false,
	isArabic,
	direction,
	index,
	className,
}: VariantProps & { showActions?: boolean; showDelivery?: boolean }) {
	const isLowStock = isAvailable && product.stockQuantity !== undefined && product.stockQuantity < 10;

	return (
		<motion.div
			dir={direction}
			variants={fadeInUp}
			initial="initial"
			animate="animate"
			onClick={onClick}
			className={cn(
				"group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3",
				"shadow-sm dark:shadow-gray-900/50 transition-all duration-200 hover:shadow-lg",
				"dark:hover:shadow-gray-900/70 hover:border-green-300 dark:hover:border-green-600 cursor-pointer",
				className
			)}
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
						sizes={getImageSizes('card')}
						quality={getImageQuality('card')}
						placeholder="blur"
						blurDataURL={getImageBlurDataURL()}
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
					<span
						className={cn(
							"absolute top-2 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg z-10",
							isArabic ? "right-2" : "left-2"
						)}
					>
						{displayBadge}
					</span>
				)}

				{/* Stock Status Badge */}
				{showStock && !isAvailable && (
					<span
						className={cn(
							"absolute top-2 rounded-full bg-gray-800 px-2.5 py-1 text-xs font-semibold text-white shadow-lg z-10",
							isArabic ? "left-2" : "right-2"
						)}
					>
						{isArabic ? "نفد" : "Out"}
					</span>
				)}
				{showStock && isLowStock && isAvailable && (
					<span
						className={cn(
							"absolute top-2 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg z-10",
							isArabic ? "left-2" : "right-2"
						)}
					>
						{isArabic ? "كمية محدودة" : "Low Stock"}
					</span>
				)}

				{/* Favorite Button */}
				<div
					className={cn("absolute z-10", isArabic ? "left-2 top-2" : "right-2 top-2")}
					onClick={(e) => e.stopPropagation()}
				>
					<FavoriteButton
						isFavorite={isFavorite}
						isLoading={favoriteLoading}
						onToggle={toggleFavorite}
						size="sm"
					/>
				</div>

				{/* Add to Cart Button */}
				{showActions && showAddButton && isAvailable && (
					<button
						onClick={onQuickAdd}
						className={cn(
							"absolute rounded-full bg-green-600 p-2.5 text-white shadow-lg transition-all duration-200",
							"hover:bg-green-700 hover:scale-110 active:scale-95 z-10",
							isArabic ? "left-2 bottom-2" : "right-2 bottom-2"
						)}
						title={isArabic ? "إضافة للسلة" : "Add to cart"}
						aria-label={isArabic ? "إضافة للسلة" : "Add to cart"}
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
						</svg>
					</button>
				)}
			</div>

			{/* Product Info */}
			<div className={cn(isArabic ? "text-right" : "text-left")}>
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
					<div
						className={cn(
							"flex items-center gap-1 mb-2",
							isArabic ? "flex-row-reverse justify-end" : "justify-start"
						)}
					>
						<svg className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
						<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
							{product.rating}
						</span>
						{product.reviewsCount && (
							<span className="text-xs text-gray-500 dark:text-gray-400">
								({product.reviewsCount > 999 ? "999+" : product.reviewsCount})
							</span>
						)}
					</div>
				)}

				{/* Delivery Time */}
				{showDelivery && product.deliveryTime && (
					<div
						className={cn(
							"flex items-center gap-1 mb-2",
							isArabic ? "flex-row-reverse justify-end" : "justify-start"
						)}
					>
						<svg className="h-3 w-3 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span className="text-xs text-gray-500 dark:text-gray-400">
							{isArabic && product.deliveryTimeAr ? product.deliveryTimeAr : product.deliveryTime}
						</span>
					</div>
				)}

				{/* Price */}
				<div
					className={cn(
						"flex items-center gap-2",
						isArabic ? "flex-row-reverse justify-end" : "justify-start"
					)}
				>
					<span className="text-base font-bold text-green-600 dark:text-green-400">
						{product.price} {isArabic ? "ريال" : "SAR"}
					</span>
					{hasDiscountPrice && product.originalPrice && (
						<span className="text-xs text-gray-400 dark:text-gray-500 line-through">
							{product.originalPrice} {isArabic ? "ريال" : "SAR"}
						</span>
					)}
				</div>
			</div>
		</motion.div>
	);
}

export default memo(UnifiedProductCard);

