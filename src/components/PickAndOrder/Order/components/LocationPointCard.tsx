"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, X, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

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
	const [showHelp, setShowHelp] = useState(false);
	const helpRef = useRef<HTMLDivElement>(null);
	const hasLocation = !!point.location;
	const Icon = point.type === "pickup" ? MapPin : Navigation;
	const bgColor = point.type === "pickup" ? "bg-[#31A342]" : "bg-[#FA9D2B]";
	const borderColor = isActive
		? point.type === "pickup"
			? "border-[#31A342]"
			: "border-[#FA9D2B]"
		: "border-gray-200 dark:border-gray-700";

	// Close tooltip when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
				setShowHelp(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

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
					<div className="flex items-center gap-1.5 sm:gap-2 mb-2">
						<Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
						<h4 className="font-bold text-gray-900 dark:text-gray-100 text-xs sm:text-sm truncate">
							{point.label}
						</h4>
						{point.location && (
							<CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 ml-auto" />
						)}
						{!hasLocation && (
							<div className="relative ml-auto" ref={helpRef}>
								<button
									onClick={(e) => {
										e.stopPropagation();
										setShowHelp(!showHelp);
									}}
									className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors p-0.5 sm:p-1 touch-manipulation"
									aria-label={isArabic ? "مساعدة" : "Help"}
								>
									<HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
								</button>
								<AnimatePresence>
									{showHelp && (
										<motion.div
											initial={{ opacity: 0, scale: 0.95, y: -5 }}
											animate={{ opacity: 1, scale: 1, y: 0 }}
											exit={{ opacity: 0, scale: 0.95, y: -5 }}
											className={`absolute ${isArabic ? "left-0" : "right-0"} top-6 sm:top-7 z-50 w-40 sm:w-48 md:w-56 p-2 sm:p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}
											dir={isArabic ? "rtl" : "ltr"}
										>
											<p className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
												{isArabic ? "نصيحة سريعة:" : "Quick Tip:"}
											</p>
											<p>
												{point.type === "pickup"
													? isArabic
														? "انقر على هذه البطاقة ثم حدد موقع الالتقاط على الخريطة."
														: "Click this card then select pickup location on the map."
													: isArabic
													? "انقر على هذه البطاقة ثم حدد موقع التوصيل على الخريطة."
													: "Click this card then select dropoff location on the map."}
											</p>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}
					</div>

					{/* Address Preview */}
					<div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
						{point.location ? (
							<div className="flex items-start gap-1">
								<MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0 mt-0.5" />
								<span className="line-clamp-2">
									{point.streetName && point.city
										? `${point.streetName}, ${point.city}`
										: isArabic
										? "تم تحديد الموقع"
										: "Location selected"}
								</span>
							</div>
						) : (
							<div className="flex items-center gap-1.5 flex-wrap">
								<div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
									<AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
									<span>{isArabic ? "لم يتم التحديد" : "Not selected"}</span>
								</div>
								{onClick && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={(e) => {
											e.stopPropagation();
											onClick();
										}}
										className={`text-[10px] sm:text-xs font-semibold ${
											point.type === "pickup"
												? "text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
												: "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
										} underline touch-manipulation`}
									>
										{isArabic ? "حدد الآن" : "Select Now"}
									</motion.button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

