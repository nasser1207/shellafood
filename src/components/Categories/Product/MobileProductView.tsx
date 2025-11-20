"use client";

import { useState, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Heart,
	Star,
	CheckCircle,
	XCircle,
	Truck,
	Minus,
	Plus,
	ShoppingCart,
	ChevronDown,
	Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/components/Utils/ProductCard";
import { Store } from "@/components/Utils/StoreCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProductFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import FavoriteButton from "@/components/ui/FavoriteButton";
import ExpandableSection from "../shared/ExpandableSection";
import MobileProductCard from "../shared/MobileProductCard";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface MobileProductViewProps {
	product: Product;
	relatedProducts: Product[];
	store?: Store | null;
}

function MobileProductView({
	product,
	relatedProducts,
	store,
}: MobileProductViewProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const direction = isArabic ? "rtl" : "ltr";
	const router = useRouter();
	const { addToCart, isLoading: cartLoading } = useCart();
	const { showToast, toasts, removeToast } = useToast();
	const [quantity, setQuantity] = useState(1);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	const { isFavorite, isLoading: favoriteLoading, toggleFavorite } =
		useProductFavorites(product.id, {
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

	// Use images array if available, otherwise fallback to single image
	const images = useMemo(() => {
		if ((product as any).images && Array.isArray((product as any).images)) {
			return (product as any).images;
		}
		return product.image ? [product.image] : [];
	}, [product]);

	const isOutOfStock = useMemo(() => product?.inStock === false, [product]);

	const calculateDiscount = useCallback(() => {
		if (!product.originalPrice || !product.price) return 0;
		return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
	}, [product]);

	const handleAddToCart = useCallback(async () => {
		if (!product.storeId && !store?.id) {
			showToast(
				isArabic ? "خطأ: معلومات المتجر غير متوفرة" : "Error: Store information not available",
				"error"
			);
			return;
		}

		const storeId = product.storeId || store?.id;
		if (!storeId) {
			showToast(
				isArabic ? "خطأ: معرف المتجر غير متوفر" : "Error: Store ID not available",
				"error"
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
				storeName: store?.name || "",
				storeNameAr: store?.nameAr,
				storeLogo: store?.logo || undefined,
				stock: product.stockQuantity,
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

		} catch (error) {
			console.error("Error adding to cart:", error);
			showToast(
				isArabic ? "حدث خطأ في الاتصال" : "Connection error",
				"error"
			);
		} finally {
			setIsAddingToCart(false);
		}
	}, [product, store, quantity, addToCart, showToast, isArabic]);

	const handleShare = useCallback(async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: isArabic && product.nameAr ? product.nameAr : product.name,
					text: `${isArabic && product.nameAr ? product.nameAr : product.name} - ${product.price} SAR`,
					url: window.location.href,
				});
			} catch (err) {
				// User cancelled or error occurred
			}
		} else {
			// Fallback: Copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			showToast(isArabic ? "تم نسخ الرابط" : "Link copied", "success");
		}
	}, [product, isArabic, showToast]);

	const decrementQty = useCallback(() => {
		setQuantity((prev) => Math.max(1, prev - 1));
	}, []);

	const incrementQty = useCallback(() => {
		setQuantity((prev) => {
			const maxQty = product.stockQuantity || 999;
			return Math.min(maxQty, prev + 1);
		});
	}, [product.stockQuantity]);

	const displayName = isArabic && product.nameAr ? product.nameAr : product.name;
	const displayDescription = isArabic && product.descriptionAr ? product.descriptionAr : product.description;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			{/* Full-screen image gallery */}
			<div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800">
				{images.length > 0 ? (
					<>
						<Image
							src={images[currentImageIndex]}
							alt={`${displayName} ${currentImageIndex + 1}`}
							fill
							priority={currentImageIndex === 0}
							className="object-cover"
							sizes={getImageSizes('gallery')}
							quality={getImageQuality('gallery')}
							placeholder="blur"
							blurDataURL={getImageBlurDataURL()}
						/>

						{/* Image indicators */}
						{images.length > 1 && (
							<div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 `}>
								{images.map((_: string, index: number) => (
									<button
										key={index}
										onClick={() => setCurrentImageIndex(index)}
										className={`w-2 h-2 rounded-full transition-all ${
											currentImageIndex === index
												? "bg-white w-6"
												: "bg-white/50"
										}`}
									/>
								))}
							</div>
						)}
					</>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
						<ShoppingCart className="w-24 h-24 text-gray-400" />
					</div>
				)}

				{/* Floating back button */}
				<button
					onClick={() => router.back()}
					className={`absolute top-4 ${isArabic ? "right-4" : "left-4"} z-10 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-95 transition-transform`}
				>
					<ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
				</button>

				{/* Floating actions */}
				<div className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} z-10 flex gap-2`}>
					<button
						onClick={handleShare}
						className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center active:scale-95 transition-transform"
					>
						<Share2 className="w-5 h-5 text-gray-900 dark:text-white" />
					</button>
					<div onClick={(e) => e.stopPropagation()}>
						<FavoriteButton
							isFavorite={isFavorite}
							isLoading={favoriteLoading}
							onToggle={toggleFavorite}
							size="sm"
							className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
						/>
					</div>
				</div>

				{/* Badge overlay */}
				{product.badge && (
					<div
						className={`absolute bottom-4 ${isArabic ? "right-4" : "left-4"} px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full z-10`}
					>
						{isArabic && product.badgeAr ? product.badgeAr : product.badge}
					</div>
				)}
			</div>

			{/* Product Info - Scrollable */}
			<div className="bg-white dark:bg-gray-900 rounded-t-3xl -mt-6 relative z-10" dir={direction}>
				<div className={`px-4 py-6 space-y-6 ${isArabic ? 'text-right' : 'text-left'}`}>
					{/* Name & Brand */}
					<div>
						{product.brand && (
							<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{product.brand}</p>
						)}
						<h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{displayName}</h1>
					</div>

					{/* Rating & Reviews */}
					{product.rating && (
						<div className={`flex items-center gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
							<div className={`flex items-center gap-1 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg ${isArabic ? 'flex-row-reverse' : ''}`}>
								<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
								<span className="text-sm font-bold">{product.rating}</span>
							</div>
							{product.reviewsCount && (
								<button className="text-sm text-gray-600 hover:text-green-600">
									{product.reviewsCount > 999 ? "999+" : product.reviewsCount}+{" "}
									{isArabic ? "تقييم" : "reviews"}
								</button>
							)}
						</div>
					)}

					{/* Price */}
					<div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
						<div
							className={`flex items-baseline gap-2 mb-1 ${isArabic ? 'flex-row-reverse' : ''}`}
						>
							<span className="text-3xl font-black text-green-600 dark:text-green-400">
								{typeof product.price === 'number' ? product.price : product.price}
							</span>
							<span className="text-lg text-gray-600 dark:text-gray-400">SAR</span>
							{product.originalPrice && product.originalPrice > (typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0).replace(/[^0-9.]/g, '')) || 0) && (
								<>
									<span className="text-lg text-gray-400 dark:text-gray-500 line-through">
										{typeof product.originalPrice === 'number' ? product.originalPrice : product.originalPrice}
									</span>
									<span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
										{calculateDiscount()}% {isArabic ? 'خصم' : 'OFF'}
									</span>
								</>
							)}
						</div>
						<p className={`text-sm text-gray-600 dark:text-gray-400 ${isArabic ? 'text-right' : 'text-left'}`}>
							{isArabic ? "لكل " : "Per "}
							{isArabic && product.unitAr ? product.unitAr : product.unit}
						</p>
					</div>

					{/* Stock Status */}
					<div className={isArabic ? 'text-right' : 'text-left'}>
						{product.inStock ? (
							<div className={`flex items-center gap-2 text-green-600 ${isArabic ? 'flex-row-reverse' : ''}`}>
								<CheckCircle className="w-5 h-5" />
								<span className="font-semibold">{isArabic ? "متوفر" : "In Stock"}</span>
								{product.stockQuantity && product.stockQuantity < 10 && (
									<span className="text-orange-600">
										({isArabic ? "متبقي " : "Only "}
										{product.stockQuantity} {isArabic ? "فقط!" : "left!"})
									</span>
								)}
							</div>
						) : (
							<div className={`flex items-center gap-2 text-red-600 ${isArabic ? 'flex-row-reverse' : ''}`}>
								<XCircle className="w-5 h-5" />
								<span className="font-semibold">{isArabic ? "غير متوفر" : "Out of Stock"}</span>
							</div>
						)}
					</div>

					{/* Delivery Info */}
					{product.deliveryTime && (
						<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
							<div className={`flex items-center gap-3 `}>
								<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
									<Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
								</div>
								<div className={isArabic ? "text-right" : "text-left"}>
									<p className="font-bold text-gray-900 dark:text-white">
										{isArabic && product.deliveryTimeAr
											? product.deliveryTimeAr
											: product.deliveryTime}
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{isArabic ? "اطلب الآن، احصل عليه اليوم" : "Order now, get it today"}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Description - Expandable */}
					{displayDescription && (
						<ExpandableSection
							title={isArabic ? "الوصف" : "Description"}
							defaultExpanded={true}
						>
							<p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
								{displayDescription}
							</p>
						</ExpandableSection>
					)}

					{/* Additional Product Details */}
					{/* Ingredients */}
					{(product as any).ingredients && (
						<ExpandableSection
							title={isArabic ? "المكونات" : "Ingredients"}
							defaultExpanded={false}
						>
							<p className={`text-gray-700 dark:text-gray-300 leading-relaxed text-sm ${isArabic ? 'text-right' : 'text-left'}`}>
								{(product as any).ingredients}
							</p>
						</ExpandableSection>
					)}

					{/* Nutrition Information */}
					{(product as any).nutrition && (
						<ExpandableSection
							title={isArabic ? "المعلومات الغذائية" : "Nutrition Information"}
							defaultExpanded={false}
						>
							<div className={`space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}>
								{typeof (product as any).nutrition === 'object' ? (
									Object.entries((product as any).nutrition).map(([key, value]: [string, any]) => (
										<div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
											<span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
											<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{String(value)}</span>
										</div>
									))
								) : (
									<p className="text-sm text-gray-700 dark:text-gray-300">{(product as any).nutrition}</p>
								)}
							</div>
						</ExpandableSection>
					)}

					{/* Allergens */}
					{(product as any).allergens && (
						<ExpandableSection
							title={isArabic ? "مسببات الحساسية" : "Allergens"}
							defaultExpanded={false}
						>
							<div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
								<p className={`text-sm text-orange-800 dark:text-orange-200 ${isArabic ? 'text-right' : 'text-left'}`}>
									{(product as any).allergens}
								</p>
							</div>
						</ExpandableSection>
					)}

					{/* Storage Instructions */}
					{(product as any).storage && (
						<ExpandableSection
							title={isArabic ? "تعليمات التخزين" : "Storage Instructions"}
							defaultExpanded={false}
						>
							<p className={`text-sm text-gray-700 dark:text-gray-300 ${isArabic ? 'text-right' : 'text-left'}`}>
								{(product as any).storage}
							</p>
						</ExpandableSection>
					)}

					{/* Product Specifications */}
					{(product as any).specifications && (
						<ExpandableSection
							title={isArabic ? "المواصفات" : "Specifications"}
							defaultExpanded={false}
						>
							<div className={`space-y-2 ${isArabic ? 'text-right' : 'text-left'}`}>
								{typeof (product as any).specifications === 'object' ? (
									Object.entries((product as any).specifications).map(([key, value]: [string, any]) => (
										<div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
											<span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
											<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{String(value)}</span>
										</div>
									))
								) : (
									<p className="text-sm text-gray-700 dark:text-gray-300">{(product as any).specifications}</p>
								)}
							</div>
						</ExpandableSection>
					)}

					{/* Related Products */}
					{relatedProducts.length > 0 && (
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
								{isArabic ? "منتجات ذات صلة" : "Related Products"}
							</h2>
							<div className="grid grid-cols-2 gap-3">
								{relatedProducts.slice(0, 4).map((p, index) => (
									<MobileProductCard
										key={p.id}
										product={p}
										index={index}
										storeId={store?.id}
										storeName={store?.name}
										storeNameAr={store?.nameAr}
									/>
								))}
							</div>
						</div>
					)}

					{/* Bottom spacing for sticky button */}
					<div className="h-24" />
				</div>
			</div>

			{/* Toast Container */}
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />

			{/* Sticky Bottom Bar - Add to Cart */}
			<div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 pb-safe shadow-2xl" dir={direction}>
				<div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
					{/* Quantity selector */}
					<div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
						<button
							onClick={decrementQty}
							disabled={quantity <= 1}
							className="w-10 h-10 flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Minus className="w-4 h-4" />
						</button>
						<span className="w-12 h-10 flex items-center justify-center font-bold text-gray-900 dark:text-white border-x-2 border-gray-300 dark:border-gray-600">
							{quantity}
						</span>
						<button
							onClick={incrementQty}
							disabled={quantity >= (product.stockQuantity || 999)}
							className="w-10 h-10 flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Plus className="w-4 h-4" />
						</button>
					</div>

					{/* Add to cart button */}
					<button
						onClick={handleAddToCart}
						disabled={isOutOfStock || isAddingToCart || cartLoading}
						className="relative flex-1 h-12 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white font-extrabold rounded-xl active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 overflow-hidden group"
					>
						{/* Animated background effect */}
						{!isAddingToCart && !cartLoading && !isOutOfStock && (
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-700" />
						)}
						
						<div className="relative flex items-center gap-2">
							{isAddingToCart || cartLoading ? (
								<>
									<div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
									<span className="text-sm">{isArabic ? "جاري الإضافة..." : "Adding..."}</span>
								</>
							) : isOutOfStock ? (
								<span className="text-sm">{isArabic ? "غير متوفر" : "Out of Stock"}</span>
							) : (
								<>
									<ShoppingCart className="w-5 h-5" />
									<span className="text-sm">
										{isArabic ? "أضف للسلة" : "Add to Cart"} •{" "}
										{(() => {
											const price = typeof product.price === 'number' 
												? product.price 
												: typeof product.price === 'string' 
													? parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0
													: 0;
											return (price * quantity).toFixed(2);
										})()} SAR
									</span>
								</>
							)}
						</div>
					</button>
				</div>
                        </div>
                </div>
        );
}

export default memo(MobileProductView);

