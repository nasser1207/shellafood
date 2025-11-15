"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaStar, FaGift, FaClock, FaShoppingCart } from "react-icons/fa";

interface PointCardProps {
	offer: {
		image: string;
		title: string;
		price: string;
		points: number;
		expirationDate?: string;
	};
	isArabic?: boolean;
}

export default function PointCard({ offer, isArabic = false }: PointCardProps) {
	const { language } = useLanguage();
	const currentIsArabic = isArabic || language === 'ar';
	const direction = currentIsArabic ? 'rtl' : 'ltr';

	return (
		<div 
			className="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
			dir={direction}
		>
			{/* Offer Badge */}
			<div className={`absolute top-3 ${currentIsArabic ? 'right-3' : 'left-3'} z-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
				{offer.price}
			</div>

			{/* Offer Image */}
			<div className="relative h-48 w-full overflow-hidden">
				<img
					src={offer.image}
					alt={offer.title}
					className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
					onError={(e) => {
						// Fallback to a placeholder if image fails to load
						e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E";
					}}
				/>
				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
			</div>

			{/* Offer Details */}
			<div className={`flex flex-col p-4 ${currentIsArabic ? 'text-right' : 'text-left'}`}>
				{/* Title */}
				<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
					{offer.title}
				</h3>

				{/* Points and Price */}
				<div className={`flex items-center justify-between mb-3 ${currentIsArabic ? 'flex-row' : 'flex-row'}`}>
					<div className={`flex items-center gap-2 ${currentIsArabic ? 'flex-row' : 'flex-row'}`}>
						<div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
							<FaStar className="text-yellow-600 dark:text-yellow-400 text-sm" />
						</div>
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{offer.points} {currentIsArabic ? 'نقطة' : 'Points'}
						</span>
					</div>
					<div className={`flex items-center gap-2 ${currentIsArabic ? 'flex-row' : 'flex-row'}`}>
						<div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
							<FaGift className="text-green-600 dark:text-green-400 text-sm" />
						</div>
						<span className="text-sm font-medium text-green-600 dark:text-green-400">
							{offer.price}
						</span>
					</div>
				</div>

				{/* Expiration Date (if available) */}
				{offer.expirationDate && (
					<div className={`flex items-center gap-2 mb-3 ${currentIsArabic ? 'flex-row' : 'flex-row'}`}>
						<FaClock className="text-gray-400 dark:text-gray-500 text-xs" />
						<span className="text-xs text-gray-500 dark:text-gray-400">
							{currentIsArabic ? 'ينتهي في' : 'Expires'} {offer.expirationDate}
						</span>
					</div>
				)}

				{/* Action Button */}
				<button className={`w-full py-2 px-4 bg-green-500 dark:bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 ${currentIsArabic ? 'flex-row' : 'flex-row'}`}>
					<FaShoppingCart className="text-sm" />
					{currentIsArabic ? 'استخدم النقاط' : 'Use Points'}
				</button>
			</div>
		</div>
	);
}
