"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Package, AlertCircle, CheckCircle2, X, User, Edit2, Clock, HelpCircle, Sparkles, Phone } from "lucide-react";
import type { RouteSegment } from "../types/routeSegment";

interface SegmentCardProps {
	segment: RouteSegment;
	index: number;
	isActive?: boolean;
	isReviewMode?: boolean;
	onClick?: () => void;
	onEdit?: () => void;
	onRemove?: () => void;
	canRemove?: boolean;
	isArabic: boolean;
	completionPercentage?: number;
	onUpdatePhone?: (pointType: "pickup" | "dropoff", phone: string) => void;
}

export const SegmentCard: React.FC<SegmentCardProps> = ({
	segment,
	index,
	isActive = false,
	isReviewMode = false,
	onClick,
	onEdit,
	onRemove,
	canRemove = true,
	isArabic,
	completionPercentage = 0,
	onUpdatePhone,
}) => {
	const [showPickupHelp, setShowPickupHelp] = useState(false);
	const [showDropoffHelp, setShowDropoffHelp] = useState(false);
	const [showPackageHelp, setShowPackageHelp] = useState(false);
	const [showQuickTips, setShowQuickTips] = useState(false);
	const pickupHelpRef = useRef<HTMLDivElement>(null);
	const dropoffHelpRef = useRef<HTMLDivElement>(null);
	const packageHelpRef = useRef<HTMLDivElement>(null);
	const quickTipsRef = useRef<HTMLDivElement>(null);

	const hasPickup = !!segment.pickupPoint.location;
	const hasDropoff = !!segment.dropoffPoint.location;
	const hasPackage = !!segment.packageDetails.description;
	const isCompleted = completionPercentage === 100;
	const isInProgress = completionPercentage > 0 && completionPercentage < 100;
	const needsHelp = !hasPickup || !hasDropoff || !hasPackage;

	// Close tooltips when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (pickupHelpRef.current && !pickupHelpRef.current.contains(event.target as Node)) {
				setShowPickupHelp(false);
			}
			if (dropoffHelpRef.current && !dropoffHelpRef.current.contains(event.target as Node)) {
				setShowDropoffHelp(false);
			}
			if (packageHelpRef.current && !packageHelpRef.current.contains(event.target as Node)) {
				setShowPackageHelp(false);
			}
			if (quickTipsRef.current && !quickTipsRef.current.contains(event.target as Node)) {
				setShowQuickTips(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			whileHover={onClick ? { y: -4, scale: 1.02 } : {}}
			onClick={onClick}
			className={`
				relative bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 transition-all duration-300
				${isActive 
					? "border-[#31A342] dark:border-[#4ade80] shadow-xl shadow-[#31A342]/10 dark:shadow-[#4ade80]/10 ring-4 ring-[#31A342]/20 dark:ring-[#4ade80]/20" 
					: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg"
				}
				${onClick ? "cursor-pointer" : ""}
				overflow-hidden
			`}
		>
			{/* Active Indicator Bar */}
			{isActive && (
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: "100%" }}
					className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#31A342] to-[#4ade80]"
				/>
			)}

			{/* Quick Tips Banner - Show when segment needs completion */}
			{needsHelp && !isReviewMode && (
				<motion.div
					ref={quickTipsRef}
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-2 sm:p-3"
				>
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 sm:gap-2 flex-1">
							<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
							<p className="text-[10px] sm:text-xs font-medium text-blue-900 dark:text-blue-100">
								{isArabic 
									? "انقر على المسار لإكمال التفاصيل بسرعة" 
									: "Click on the segment to quickly complete details"
								}
							</p>
						</div>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setShowQuickTips(!showQuickTips);
							}}
							className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors p-1 touch-manipulation"
							aria-label={isArabic ? "عرض النصائح" : "Show tips"}
						>
							<HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						</button>
					</div>
					<AnimatePresence>
						{showQuickTips && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700 space-y-2"
							>
								{!hasPickup && (
									<div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-200">
										<span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
										<span>{isArabic ? "حدد نقطة الالتقاط من الخريطة" : "Select pickup point from the map"}</span>
									</div>
								)}
								{!hasDropoff && (
									<div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-200">
										<span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
										<span>{isArabic ? "حدد نقطة التوصيل من الخريطة" : "Select dropoff point from the map"}</span>
									</div>
								)}
								{!hasPackage && (
									<div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-200">
										<span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
										<span>{isArabic ? "أضف تفاصيل الطرد (الوصف، الوزن، إلخ)" : "Add package details (description, weight, etc.)"}</span>
									</div>
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			)}

			{/* Header */}
			<div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
				<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
					{/* Status Badge */}
					<div className={`
						relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-white text-xs sm:text-sm flex-shrink-0
						shadow-lg transition-all duration-300
						${isCompleted 
							? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700" 
							: isInProgress
							? "bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600"
							: "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"
						}
					`}>
						{isCompleted ? (
							<CheckCircle2 className="w-6 h-6" />
						) : (
							<span className="text-base">{index + 1}</span>
						)}
						
						{/* Progress Ring for In-Progress */}
						{isInProgress && (
							<svg 
								className="absolute w-full h-full -rotate-90" 
								viewBox="0 0 48 48"
								preserveAspectRatio="xMidYMid meet"
							>
								<circle
									cx="24"
									cy="24"
									r="20"
									stroke="currentColor"
									strokeWidth="2.5"
									fill="none"
									className="text-white/30"
									vectorEffect="non-scaling-stroke"
								/>
								<circle
									cx="24"
									cy="24"
									r="20"
									stroke="currentColor"
									strokeWidth="2.5"
									fill="none"
									className="text-white"
									strokeDasharray={`${2 * Math.PI * 20}`}
									strokeDashoffset={`${2 * Math.PI * 20 * (1 - completionPercentage / 100)}`}
									strokeLinecap="round"
									vectorEffect="non-scaling-stroke"
								/>
							</svg>
						)}
					</div>
					
					<div className="min-w-0 flex-1">
						<h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
							{isArabic ? `المسار ${index + 1}` : `Segment ${index + 1}`}
						</h4>
						{!isReviewMode && (
							<div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
								{isCompleted ? (
									<span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-green-600 dark:text-green-400">
										<CheckCircle2 className="w-3 h-3 flex-shrink-0" />
										<span>{isArabic ? "مكتمل" : "Completed"}</span>
									</span>
								) : isInProgress ? (
									<span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400">
										<Clock className="w-3 h-3 flex-shrink-0" />
										<span>{completionPercentage}% {isArabic ? "مكتمل" : "Complete"}</span>
									</span>
								) : (
									<span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400">
										<AlertCircle className="w-3 h-3 flex-shrink-0" />
										<span>{isArabic ? "في الانتظار" : "Pending"}</span>
									</span>
								)}
							</div>
						)}
					</div>
				</div>
				
				<div className="flex items-center gap-2">
					{isReviewMode && onEdit && (
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={(e) => {
								e.stopPropagation();
								onEdit();
							}}
							className="p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
						>
							<Edit2 className="w-4 h-4" />
						</motion.button>
					)}
					{!isReviewMode && canRemove && onRemove && (
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={(e) => {
								e.stopPropagation();
								onRemove();
							}}
							className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
						>
							<X className="w-4 h-4" />
						</motion.button>
					)}
				</div>
			</div>

			{/* Route Flow */}
			<div className="space-y-2 sm:space-y-3">
				{/* Pickup */}
				<div className={`
					relative p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200
					${hasPickup 
						? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
						: "bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
					}
				`}>
					<div className="flex items-start gap-2 sm:gap-3">
						<div className={`
							w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-md
							${hasPickup 
								? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700" 
								: "bg-gray-300 dark:bg-gray-600"
							}
						`}>
							<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-1">
								<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex-1">
									{isArabic ? "نقطة الالتقاط" : "Pickup Point"}
								</p>
								{hasPickup && onEdit && !isReviewMode && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={(e) => {
											e.stopPropagation();
											onEdit();
										}}
										className="p-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-md transition-all flex-shrink-0"
										aria-label={isArabic ? "تعديل" : "Edit"}
									>
										<Edit2 className="w-3.5 h-3.5" />
									</motion.button>
								)}
								{!hasPickup && !isReviewMode && (
									<div className="relative" ref={pickupHelpRef}>
										<button
											onClick={(e) => {
												e.stopPropagation();
												setShowPickupHelp(!showPickupHelp);
											}}
											className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors p-0.5 sm:p-1 touch-manipulation"
											aria-label={isArabic ? "مساعدة" : "Help"}
										>
											<HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
										</button>
										<AnimatePresence>
											{showPickupHelp && (
												<motion.div
													initial={{ opacity: 0, scale: 0.95, y: -5 }}
													animate={{ opacity: 1, scale: 1, y: 0 }}
													exit={{ opacity: 0, scale: 0.95, y: -5 }}
													className={`absolute ${isArabic ? "left-0 md:left-1/2 md:-translate-x-1/2" : "right-0 md:right-1/2 md:translate-x-1/2"} top-6 sm:top-7 z-[100] w-40 sm:w-48 md:w-64 lg:w-72 p-2 sm:p-2.5 md:p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg md:shadow-xl text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}
													dir={isArabic ? "rtl" : "ltr"}
												>
													<p className="font-semibold mb-1 md:mb-2 text-gray-900 dark:text-gray-100 text-xs md:text-sm">
														{isArabic ? "نصيحة سريعة:" : "Quick Tip:"}
													</p>
													<p className="leading-relaxed">
														{isArabic 
															? "انقر على الخريطة لتحديد موقع الالتقاط. يمكنك البحث عن عنوان أو استخدام موقعك الحالي."
															: "Click on the map to select pickup location. You can search for an address or use your current location."
														}
													</p>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								)}
							</div>
							{hasPickup ? (
								<>
									<p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
										{segment.pickupPoint.streetName || segment.pickupPoint.areaName || segment.pickupPoint.city}
									</p>
									{segment.pickupPoint.contactName && (
										<div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600 dark:text-gray-400">
											<User className="w-3.5 h-3.5" />
											<span className="font-medium">{segment.pickupPoint.contactName}</span>
										</div>
									)}
									{/* Phone Number Display */}
									{segment.pickupPoint.contactPhone && (
										<div className="mt-2">
											<div className={`flex items-center gap-1.5 `}>
											<Phone className="w-3.5 h-3.5 flex-shrink-0 text-green-600 dark:text-green-400" />
										
												<span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate" dir="ltr">
													{segment.pickupPoint.contactPhone}
												</span>
											</div>
										</div>
									)}
								</>
							) : (
								<div className="flex items-center gap-2 flex-wrap">
									<p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 italic">
										{isArabic ? "غير محدد" : "Not selected"}
									</p>
									{!isReviewMode && onClick && (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={(e) => {
												e.stopPropagation();
												onClick();
											}}
											className="text-[10px] sm:text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline touch-manipulation"
										>
											{isArabic ? "حدد الآن" : "Select Now"}
										</motion.button>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Dropoff */}
				<div className={`
					relative p-3 rounded-xl transition-all duration-200
					${hasDropoff 
						? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800" 
						: "bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
					}
				`}>
					<div className="flex items-start gap-3">
						<div className={`
							w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md
							${hasDropoff 
								? "bg-gradient-to-br from-orange-500 to-orange-600" 
								: "bg-gray-300 dark:bg-gray-600"
							}
						`}>
							<Navigation className="w-5 h-5 text-white" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-1">
								<p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex-1">
									{isArabic ? "نقطة التوصيل" : "Dropoff Point"}
								</p>
								{hasDropoff && onEdit && !isReviewMode && (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={(e) => {
											e.stopPropagation();
											onEdit();
										}}
										className="p-1.5 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-md transition-all flex-shrink-0"
										aria-label={isArabic ? "تعديل" : "Edit"}
									>
										<Edit2 className="w-3.5 h-3.5" />
									</motion.button>
								)}
								{!hasDropoff && !isReviewMode && (
									<div className="relative" ref={dropoffHelpRef}>
										<button
											onClick={(e) => {
												e.stopPropagation();
												setShowDropoffHelp(!showDropoffHelp);
											}}
											className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors p-0.5 sm:p-1 touch-manipulation"
											aria-label={isArabic ? "مساعدة" : "Help"}
										>
											<HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
										</button>
										<AnimatePresence>
											{showDropoffHelp && (
												<motion.div
													initial={{ opacity: 0, scale: 0.95, y: -5 }}
													animate={{ opacity: 1, scale: 1, y: 0 }}
													exit={{ opacity: 0, scale: 0.95, y: -5 }}
													className={`absolute ${isArabic ? "left-0 md:left-1/2 md:-translate-x-1/2" : "right-0 md:right-1/2 md:translate-x-1/2"} top-6 sm:top-7 z-[100] w-40 sm:w-48 md:w-64 lg:w-72 p-2 sm:p-2.5 md:p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg md:shadow-xl text-[10px] sm:text-xs md:text-sm text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}
													dir={isArabic ? "rtl" : "ltr"}
												>
													<p className="font-semibold mb-1 md:mb-2 text-gray-900 dark:text-gray-100 text-xs md:text-sm">
														{isArabic ? "نصيحة سريعة:" : "Quick Tip:"}
													</p>
													<p className="leading-relaxed">
														{isArabic 
															? "حدد موقع التوصيل النهائي على الخريطة. تأكد من إضافة معلومات الاتصال للمستلم."
															: "Select the final delivery location on the map. Make sure to add contact information for the recipient."
														}
													</p>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								)}
							</div>
							{hasDropoff ? (
								<>
									<p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
										{segment.dropoffPoint.streetName || segment.dropoffPoint.areaName || segment.dropoffPoint.city}
									</p>
									{segment.dropoffPoint.contactName && (
										<div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600 dark:text-gray-400">
											<User className="w-3.5 h-3.5" />
											<span className="font-medium">{segment.dropoffPoint.contactName}</span>
										</div>
									)}
									{/* Phone Number Display */}
									{segment.dropoffPoint.contactPhone && (
										<div className="mt-2">
											<div className={`flex items-center gap-1.5 `}>
											<Phone className="w-3.5 h-3.5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
												
												<span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate" dir="ltr">
													{segment.dropoffPoint.contactPhone}
												</span>
											</div>
										</div>
									)}
								</>
							) : (
								<div className="flex items-center gap-2 flex-wrap">
									<p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 italic">
										{isArabic ? "غير محدد" : "Not selected"}
									</p>
									{!isReviewMode && onClick && (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={(e) => {
												e.stopPropagation();
												onClick();
											}}
											className="text-[10px] sm:text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline touch-manipulation"
										>
											{isArabic ? "حدد الآن" : "Select Now"}
										</motion.button>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Package Summary */}
			{hasPackage ? (
				<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
					<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
								<Package className="w-4 h-4 text-white" />
							</div>
							<span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
								{isArabic ? "الطرد" : "Package"}
							</span>
						</div>
						<p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
							{segment.packageDetails.description}
						</p>
						<div className="flex items-center flex-wrap gap-2">
							{segment.packageDetails.weight && (
								<span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
									<Package className="w-3 h-3" />
									{segment.packageDetails.weight} {isArabic ? "كجم" : "kg"}
								</span>
							)}
							{segment.packageDetails.isFragile && (
								<span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-lg shadow-sm border border-amber-300 dark:border-amber-700">
									<AlertCircle className="w-3 h-3" />
									{isArabic ? "قابل للكسر" : "Fragile"}
								</span>
							)}
							{segment.packageDetails.requiresRefrigeration && (
								<span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg shadow-sm border border-blue-300 dark:border-blue-700">
									❄️ {isArabic ? "يحتاج تبريد" : "Refrigeration"}
								</span>
							)}
						</div>
					</div>
				</div>
			) : (
				!isReviewMode && (
					<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
						<div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800 border-dashed">
							<div className="flex items-center justify-between gap-2">
								<div className="flex items-center gap-2 flex-1">
									<div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
										<Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
									</div>
									<div className="flex-1">
										<p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
											{isArabic ? "الطرد" : "Package"}
										</p>
										<p className="text-sm text-gray-400 dark:text-gray-500 italic">
											{isArabic ? "غير محدد" : "Not added"}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2 flex-wrap">
									
									{onClick && (
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={(e) => {
												e.stopPropagation();
												onClick();
											}}
											className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline touch-manipulation"
										>
											{isArabic ? "أضف الآن" : "Add Now"}
										</motion.button>
									)}
								</div>
							</div>
						</div>
					</div>
				)
			)}
		</motion.div>
	);
};
