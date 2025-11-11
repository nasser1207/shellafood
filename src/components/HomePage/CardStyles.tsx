/**
 * Modern Card Styles for HomePage Components
 * Shared styling utilities for consistent, modern UI
 */

import { motion } from "framer-motion";
import { Star, MapPin, Clock, Truck, DollarSign, TrendingUp } from "lucide-react";

// Modern Store Card Component
export const ModernStoreCard = ({
	store,
	onClick,
	storeInfo,
}: {
	store: {
		id: string;
		name: string;
		image?: string | null;
		type?: string | null;
		rating?: number | string | null;
		location?: string | null;
		distance?: number;
	};
	onClick: () => void;
	storeInfo?: {
		distance: string;
		deliveryTime: string;
		deliveryFee: string;
		minimumOrder: string;
		reviewCount: number;
		isOpen: boolean;
		isPopular: boolean;
	};
}) => {
	const rating = parseFloat(store.rating as string) || 0;

	return (
		<motion.button
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			whileHover={{ y: -4, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			onClick={onClick}
			className="group relative flex w-80 flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl md:w-96"
		>
			{/* Image Container */}
			<div className="relative h-52 overflow-hidden">
				{store.image ? (
					<img
						src={store.image}
						alt={store.name}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#10b981]/20 via-[#10b981]/10 to-gray-100">
						<Truck className="h-16 w-16 text-[#10b981]/40" />
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

				{/* Badges */}
				<div className="absolute top-3 right-3 flex flex-col gap-2">
					{storeInfo?.isPopular && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1 text-xs font-bold text-white shadow-lg"
						>
							<TrendingUp className="h-3 w-3" />
							<span>شهير</span>
						</motion.div>
					)}
					{storeInfo?.isOpen !== undefined && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.1 }}
							className={`rounded-full px-3 py-1 text-xs font-bold shadow-lg ${
								storeInfo.isOpen
									? "bg-gradient-to-r from-green-500 to-green-600 text-white"
									: "bg-gray-800 text-white"
							}`}
						>
							{storeInfo.isOpen ? "مفتوح" : "مغلق"}
						</motion.div>
					)}
				</div>

				{/* Rating Badge */}
				{rating > 0 && (
					<div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-sm">
						<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
						<span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col p-5 text-right">
				<h3 className="mb-1 text-xl font-bold text-gray-900">{store.name}</h3>
				{store.type && (
					<p className="mb-3 text-sm text-gray-600">{store.type}</p>
				)}

				{/* Store Info Grid */}
				{storeInfo && (
					<div className="mt-auto space-y-2 border-t border-gray-100 pt-3">
						<div className="flex items-center justify-between text-xs">
							<div className="flex items-center gap-1.5 text-gray-600">
								<MapPin className="h-3.5 w-3.5 text-[#10b981]" />
								<span>{storeInfo.distance}</span>
							</div>
							<div className="flex items-center gap-1.5 text-gray-600">
								<Clock className="h-3.5 w-3.5 text-blue-500" />
								<span>{storeInfo.deliveryTime}</span>
							</div>
						</div>
						<div className="flex items-center justify-between text-xs">
							<div className="flex items-center gap-1.5 text-gray-600">
								<Truck className="h-3.5 w-3.5 text-purple-500" />
								<span>{storeInfo.deliveryFee}</span>
							</div>
							<div className="flex items-center gap-1.5 text-gray-600">
								<DollarSign className="h-3.5 w-3.5 text-orange-500" />
								<span>حد أدنى: {storeInfo.minimumOrder}</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</motion.button>
	);
};

// Modern Discount Card Component
export const ModernDiscountCard = ({
	discount,
	onClick,
	discountInfo,
}: {
	discount: {
		id: string;
		title: string;
		description?: string;
		time: string;
		image: string;
	};
	onClick: () => void;
	discountInfo?: {
		discountPercentage: number;
		originalPrice: string;
		discountedPrice: string;
		validUntil: string;
		category: string;
	};
}) => {
	return (
		<motion.button
			initial={{ opacity: 0, scale: 0.9 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true }}
			whileHover={{ y: -4, scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			onClick={onClick}
			className="group relative flex w-80 flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl md:w-96"
		>
			{/* Image Container */}
			<div className="relative h-52 overflow-hidden">
				<img
					src={discount.image}
					alt={discount.title}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

				{/* Discount Badge */}
				{discountInfo && (
					<motion.div
						initial={{ scale: 0, rotate: -12 }}
						animate={{ scale: 1, rotate: -12 }}
						className="absolute top-4 right-4 rounded-xl bg-gradient-to-br from-red-500 to-red-600 px-4 py-2 shadow-xl"
					>
						<div className="text-center">
							<div className="text-2xl font-black text-white">
								-{discountInfo.discountPercentage}%
							</div>
							<div className="text-xs font-bold text-white/90">خصم</div>
						</div>
					</motion.div>
				)}

				{/* Time Badge */}
				<div className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-lg backdrop-blur-sm">
					{discount.time}
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col p-5 text-right">
				<h3 className="mb-2 text-xl font-bold text-gray-900">{discount.title}</h3>
				{discount.description && (
					<p className="mb-4 line-clamp-2 text-sm text-gray-600">{discount.description}</p>
				)}

				{/* Price Info */}
				{discountInfo && (
					<div className="mt-auto space-y-2 border-t border-gray-100 pt-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-500 line-through">{discountInfo.originalPrice}</span>
							<span className="text-lg font-bold text-[#10b981]">{discountInfo.discountedPrice}</span>
						</div>
						<div className="text-xs text-gray-500">
							صالحة حتى: {new Date(discountInfo.validUntil).toLocaleDateString("ar-SA")}
						</div>
					</div>
				)}
			</div>
		</motion.button>
	);
};

