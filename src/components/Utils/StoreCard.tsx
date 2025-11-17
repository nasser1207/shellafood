"use client";

import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { History, RefreshCw } from "lucide-react";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useStoreFavorites } from "@/hooks/useFavorites";

export interface Store {
	id: string;
	name: string;
	nameAr?: string;
	description?: string;
	descriptionAr?: string;
	slug?: string;
	type: string;
	typeAr?: string;
	categoryId?: string;
	rating?: string;
	reviewsCount?: number;
	image?: string;
	logo?: string | null;
	location?: string;
	deliveryTime?: string;
	deliveryTimeAr?: string;
	minimumOrder?: string;
	minimumOrderAr?: string;
	fee?: string;
	feeAr?: string;
	hasProducts?: boolean;
	hasCategories?: boolean;
	isOpen?: boolean;
}

interface StoreCardProps {
	store: Store;
	className?: string;
	onClick: (store: Store) => void;
	orderCount?: number; // Number of orders from this store
	showOrderAgain?: boolean; // Show "Order Again" button
	onOrderAgain?: (store: Store) => void; // Handler for "Order Again" click
}

function StoreCard({
	store,
	className = "",	
	onClick,
	orderCount,
	showOrderAgain = false,
	onOrderAgain,
}: StoreCardProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const router = useRouter();
	const { isFavorite, isLoading: favoriteLoading, toggleFavorite } = useStoreFavorites(store.id, {
		name: store.name,
		nameAr: store.nameAr,
		image: store.image,
		logo: store.logo || undefined,
		type: store.type,
		typeAr: store.typeAr,
		rating: store.rating,
	});
	
	const displayName = isArabic && store.nameAr ? store.nameAr : store.name;
	const displayType = isArabic && store.typeAr ? store.typeAr : store.type;

	const handleClick = useCallback(() => {
		onClick(store);
	}, [onClick, store]);

	const handleLocationClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!store.location) return;
		
		const coords = store.location.split(',').map(c => parseFloat(c.trim()));
		if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
			const [lat, lng] = coords;
			window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
		} else {
			window.open(`https://www.google.com/maps/search/${encodeURIComponent(displayName)}`, '_blank');
		}
	};

	const handleOrderAgain = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		if (onOrderAgain) {
			onOrderAgain(store);
		}
	}, [onOrderAgain, store]);

	return (
		<div
			dir={direction}
			onClick={handleClick}
			className={`bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 overflow-hidden transition-all duration-200 relative cursor-pointer hover:shadow-xl dark:hover:shadow-gray-900/70 hover:-translate-y-1 ${className}`}
		>
			{/* Image Container */}
			<div className="relative h-48 bg-gray-200 dark:bg-gray-700">
				{store.image ? (
					<Image
						src={store.image}
						alt={displayName}
						fill
						className="object-cover transition-transform duration-300 hover:scale-105"
						loading="lazy"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
						<svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
					</div>
				)}

				{/* Status Badge */}
				{store.isOpen === false && (
					<div className={`absolute top-3 ${isArabic ? 'right-3' : 'left-3'} bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 z-10`}>
						<span className="text-xs font-semibold text-white">
							{isArabic ? "مغلق" : "Closed"}
						</span>
					</div>
				)}

				{/* Favorite Button */}
				<div className={`absolute ${isArabic ? 'right-4' : 'left-4'} top-4 z-10`} onClick={(e) => e.stopPropagation()}>
					<FavoriteButton
						isFavorite={isFavorite}
						isLoading={favoriteLoading}
						onToggle={toggleFavorite}
						size="md"
					/>
				</div>


				{/* Order Count Badge - On Image */}
				{orderCount !== undefined && orderCount > 0 && (
					<div className={`absolute ${isArabic ? 'left-2 sm:left-3' : 'right-2 sm:right-3'} bottom-2 sm:bottom-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 shadow-md z-10 flex items-center gap-1 sm:gap-1.5`}>
						<History className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
						<span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
							{orderCount} {isArabic ? (orderCount === 1 ? "طلب" : "طلبات") : (orderCount === 1 ? "order" : "orders")}
						</span>
					</div>
				)}

				{/* Location Button */}
				{store.location && (
					<button
						onClick={handleLocationClick}
						className={`absolute ${isArabic ? 'left-4' : 'right-4'} top-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-md transition-all duration-200 hover:shadow-lg z-10`}
						title={isArabic ? "فتح الموقع" : "Open location"}
						aria-label={isArabic ? "فتح الموقع" : "Open location"}
					>
						<svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</button>
				)}

			</div>

			{/* Store Info */}
			<div className={`p-4 flex flex-col ${isArabic ? 'text-right' : 'text-left'}`}>
				{/* Store Name & Type */}
				<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 truncate">{displayName}</h3>
				{displayType && (
					<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{displayType}</p>
				)}

				{/* Rating & Reviews */}
				{store.rating && (
					<div className={`flex items-center gap-2 mb-3 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
						<div className="flex items-center gap-1">
							<svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{store.rating}</span>
						</div>
						{store.reviewsCount && (
							<span className="text-xs text-gray-500 dark:text-gray-400">
								({store.reviewsCount > 999 ? '999+' : store.reviewsCount} {isArabic ? "تقييم" : "reviews"})
							</span>
						)}
					</div>
				)}

				{/* Delivery Info */}
				{store.deliveryTime && (
					<div className={`flex items-center gap-2 mb-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
						<svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span className="text-xs font-medium text-gray-700 dark:text-gray-300">
							{isArabic && store.deliveryTimeAr ? store.deliveryTimeAr : store.deliveryTime}
						</span>
					</div>
				)}

				{/* Minimum Order & Fee */}
				<div className={`flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
					{store.minimumOrder && (
						<span className={`flex items-center ${isArabic ? 'gap-1 flex-row-reverse' : 'gap-1'}`}>
							<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							{isArabic && store.minimumOrderAr ? store.minimumOrderAr : store.minimumOrder}
						</span>
					)}
					{store.fee && (
						<span className={`flex items-center ${isArabic ? 'gap-1 flex-row-reverse' : 'gap-1'} ${store.fee.toLowerCase().includes('free') ? 'text-green-600 dark:text-green-400 font-semibold' : ''}`}>
							<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
							</svg>
							{isArabic && store.feeAr ? store.feeAr : store.fee}
						</span>
					)}
				</div>

				{/* Coming soon message */}
				{store.hasProducts === false && (
					<div className="mt-3 p-2 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg">
						<p className={`text-xs text-orange-700 dark:text-orange-300 text-center font-semibold`}>
							{isArabic ? "قريباً" : "Coming Soon"}
						</p>
					</div>
				)}

				{/* Order Again Button - Positioned below image as expert UX */}
				{showOrderAgain && onOrderAgain && orderCount !== undefined && orderCount > 0 && (
					<motion.button
						onClick={handleOrderAgain}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={`
							w-full mt-3
							flex items-center justify-center gap-1.5 
							px-3 py-2 sm:px-4 sm:py-2.5
							bg-gradient-to-r from-green-600 to-emerald-600
							hover:from-green-700 hover:to-emerald-700
							active:from-green-800 active:to-emerald-800
							text-white text-xs sm:text-sm font-semibold
							rounded-lg shadow-md shadow-green-500/30
							hover:shadow-lg hover:shadow-green-500/40
							border border-green-500/20
							transition-all duration-300
							group
						`}
						aria-label={isArabic ? 'اطلب مجدداً' : 'Order Again'}
					>
						<RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:rotate-180" />
						<span className="drop-shadow-sm">{isArabic ? 'اطلب مجدداً' : 'Order Again'}</span>
					</motion.button>
				)}
			</div>
		</div>
	);
}

export default memo(StoreCard);
