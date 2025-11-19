"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, X, CheckCircle2, AlertCircle } from "lucide-react";

interface LocationPointCardProps {
	point: {
		id: string;
		type: "pickup" | "dropoff";
		label: string;
		location: { lat: number; lng: number } | null;
		streetName: string;
		city: string;
	};
	index: number;
	isActive: boolean;
	onClick: () => void;
	onRemove?: () => void;
	isArabic: boolean;
	canRemove: boolean;
}

export default function LocationPointCard({
	point,
	index,
	isActive,
	onClick,
	onRemove,
	isArabic,
	canRemove,
}: LocationPointCardProps) {
	const Icon = point.type === "pickup" ? MapPin : Navigation;
	const bgColor = point.type === "pickup" ? "bg-[#31A342]" : "bg-[#FA9D2B]";
	const borderColor = isActive
		? point.type === "pickup"
			? "border-[#31A342]"
			: "border-[#FA9D2B]"
		: "border-gray-200 dark:border-gray-700";

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			onClick={onClick}
			className={`relative p-4 rounded-xl border-2 ${borderColor} ${
				isActive
					? point.type === "pickup"
						? "bg-gradient-to-br from-green-50 to-white dark:from-green-900/30 dark:to-gray-800 shadow-lg ring-2 ring-[#31A342]/20 dark:ring-[#31A342]/40"
						: "bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/30 dark:to-gray-800 shadow-lg ring-2 ring-[#FA9D2B]/20 dark:ring-[#FA9D2B]/40"
					: "bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
			} cursor-pointer transition-all duration-200`}
		>
			{/* Remove Button */}
			{canRemove && onRemove && (
				<button
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors z-10"
				>
					<X className="w-3 h-3" />
				</button>
			)}

			<div className="flex items-start gap-3">
				{/* Number Badge */}
				<div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
					<span className="text-white font-bold text-lg">{index + 1}</span>
				</div>

				<div className="flex-1 min-w-0">
					{/* Label */}
					<div className="flex items-center gap-2 mb-2">
						<Icon className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
						<h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">
							{point.label}
						</h4>
						{point.location && (
							<CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 ml-auto" />
						)}
					</div>

					{/* Address Preview */}
					<div className="text-xs text-gray-600 dark:text-gray-400">
						{point.location ? (
							<div className="flex items-start gap-1">
								<MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
								<span className="line-clamp-2">
									{point.streetName && point.city
										? `${point.streetName}, ${point.city}`
										: isArabic
										? "تم تحديد الموقع"
										: "Location selected"}
								</span>
							</div>
						) : (
							<div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
								<AlertCircle className="w-3 h-3 flex-shrink-0" />
								<span>{isArabic ? "لم يتم التحديد" : "Not selected"}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

