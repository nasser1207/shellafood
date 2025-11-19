"use client";

import React from "react";
import Image from "next/image";
import { X, Star, Phone, MessageCircle, MapPin, Truck, Bike, Award, Calendar, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DriverProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
	driver: {
		id: string;
		name: string;
		nameAr: string;
		avatar: string;
		rating: number;
		reviewsCount: number;
		pricePerKm: number;
		experience: string;
		vehicleType: "truck" | "motorbike";
		vehicleModel: string;
		licensePlate: string;
		phone?: string;
		completedOrders?: number;
		joinDate?: string;
		specialties?: string[];
	};
	onChat?: () => void;
	onCall?: () => void;
}

export default function DriverProfileModal({ 
	isOpen, 
	onClose, 
	driver,
	onChat,
	onCall 
}: DriverProfileModalProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	if (!isOpen) return null;

	const VehicleIcon = driver.vehicleType === "truck" ? Truck : Bike;

	return (
		<div 
			className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
			onClick={onClose}
		>
			<div 
				className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
					isArabic ? "text-right" : "text-left"
				}`}
				onClick={(e) => e.stopPropagation()}
				dir={isArabic ? "rtl" : "ltr"}
			>
				{/* Header with Background */}
				<div className="relative bg-gradient-to-br from-[#31A342] to-[#2a8f38] p-6 sm:p-8">
					<button
						onClick={onClose}
						className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all"
						aria-label={isArabic ? "إغلاق" : "Close"}
					>
						<X className="w-5 h-5" />
					</button>

					{/* Driver Avatar & Basic Info */}
					<div className="flex flex-col items-center text-center">
						<div className="relative mb-4">
							<Image
								src={driver.avatar}
								alt={driver.name}
								width={120}
								height={120}
								className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-white/30"
							/>
							<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
								<VehicleIcon className="w-6 h-6 text-[#31A342]" />
							</div>
						</div>
						
						<h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
							{isArabic ? driver.nameAr : driver.name}
						</h2>
						
						{/* Rating */}
						<div className="flex items-center gap-2 mb-4">
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-5 h-5 ${
											i < Math.floor(driver.rating)
												? "text-yellow-400 fill-yellow-400"
												: "text-white/30"
										}`}
									/>
								))}
							</div>
							<span className="text-white font-semibold">
								{driver.rating} ({driver.reviewsCount} {isArabic ? "تقييم" : "reviews"})
							</span>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3 w-full max-w-md">
							{onCall && (
								<button
									onClick={onCall}
									className="flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-[#31A342] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
								>
									<Phone className="w-5 h-5" />
									{isArabic ? "اتصال" : "Call"}
								</button>
							)}
							{onChat && (
								<button
									onClick={onChat}
									className="flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-[#31A342] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
								>
									<MessageCircle className="w-5 h-5" />
									{isArabic ? "محادثة" : "Chat"}
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-6 sm:p-8 space-y-6">
					{/* Vehicle Information */}
					<section>
						<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
							<VehicleIcon className="w-5 h-5 text-[#31A342]" />
							{isArabic ? "معلومات المركبة" : "Vehicle Information"}
						</h3>
						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
									{isArabic ? "نوع المركبة" : "Vehicle Type"}
								</p>
								<p className="font-semibold text-gray-900 dark:text-gray-100">
									{driver.vehicleType === "truck" 
										? (isArabic ? "شاحنة" : "Truck")
										: (isArabic ? "دراجة نارية" : "Motorbike")
									}
								</p>
							</div>
							<div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
									{isArabic ? "الموديل" : "Model"}
								</p>
								<p className="font-semibold text-gray-900 dark:text-gray-100">
									{driver.vehicleModel}
								</p>
							</div>
							<div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl col-span-2">
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
									{isArabic ? "رقم اللوحة" : "License Plate"}
								</p>
								<p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
									{driver.licensePlate}
								</p>
							</div>
						</div>
					</section>

					{/* Experience & Stats */}
					<section>
						<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
							<Award className="w-5 h-5 text-[#31A342]" />
							{isArabic ? "الخبرة والإحصائيات" : "Experience & Stats"}
						</h3>
						<div className="grid grid-cols-3 gap-4">
							<div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
								<Calendar className="w-6 h-6 text-[#31A342] mx-auto mb-2" />
								<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
									{isArabic ? "الخبرة" : "Experience"}
								</p>
								<p className="text-lg font-bold text-gray-900 dark:text-gray-100">
									{driver.experience}
								</p>
							</div>
							<div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
								<CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
								<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
									{isArabic ? "الطلبات" : "Orders"}
								</p>
								<p className="text-lg font-bold text-gray-900 dark:text-gray-100">
									{driver.completedOrders || 150}+
								</p>
							</div>
							<div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
								<Star className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2 fill-current" />
								<p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
									{isArabic ? "التقييم" : "Rating"}
								</p>
								<p className="text-lg font-bold text-gray-900 dark:text-gray-100">
									{driver.rating}
								</p>
							</div>
						</div>
					</section>

					{/* Pricing */}
					<section>
						<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
							{isArabic ? "التسعير" : "Pricing"}
						</h3>
						<div className="p-6 bg-gradient-to-br from-[#31A342]/5 to-[#31A342]/10 dark:from-[#31A342]/10 dark:to-[#31A342]/20 rounded-xl border-2 border-[#31A342]/30">
							<div className="text-center">
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
									{isArabic ? "السعر لكل كيلومتر" : "Price per Kilometer"}
								</p>
								<p className="text-4xl font-black text-[#31A342]">
									{driver.pricePerKm} <span className="text-xl">{isArabic ? "ريال" : "SAR"}</span>
								</p>
							</div>
						</div>
					</section>

					{/* Specialties */}
					{driver.specialties && driver.specialties.length > 0 && (
						<section>
							<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
								{isArabic ? "التخصصات" : "Specialties"}
							</h3>
							<div className="flex flex-wrap gap-2">
								{driver.specialties.map((specialty, index) => (
									<span
										key={index}
										className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
									>
										{specialty}
									</span>
								))}
							</div>
						</section>
					)}

					{/* Trust Badge */}
					<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
						<p className="text-sm text-blue-800 dark:text-blue-300 text-center">
							{isArabic
								? "جميع السائقين تم التحقق منهم وفحصهم لضمان سلامتك"
								: "All drivers are verified and screened for your safety"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

