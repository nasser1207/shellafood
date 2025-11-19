"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Star, Phone, MapPin, Truck, Bike, CheckCircle2, Clock, Award, Shield, MessageCircle, UserCircle } from "lucide-react";
import Image from "next/image";

interface Driver {
	id: string;
	name: string;
	rating: number;
	completedTrips: number;
	vehicleType: string;
	vehicleModel: string;
	licensePlate: string;
	phone: string;
	distance: string;
	estimatedArrival: string;
	avatar: string;
}

interface PriceBreakdown {
	basePrice: number;
	distanceCharge: number;
	extraCharges: { label: string; amount: number }[];
	total: number;
}

interface AutoSelectConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	driver: Driver;
	priceBreakdown: PriceBreakdown;
	isArabic: boolean;
	isMotorbike: boolean;
}

export default function AutoSelectConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	driver,
	priceBreakdown,
	isArabic,
	isMotorbike,
}: AutoSelectConfirmModalProps) {
	const router = useRouter();
	const VehicleIcon = isMotorbike ? Bike : Truck;
	
	// Dynamic colors based on vehicle type
	const primaryColor = isMotorbike ? "#FA9D2B" : "#31A342";
	const primaryHover = isMotorbike ? "#E88D26" : "#2a8f38";
	const bgGradient = isMotorbike 
		? "from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-900/20" 
		: "from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20";
	const borderColor = isMotorbike
		? "border-orange-200 dark:border-orange-800"
		: "border-green-200 dark:border-green-800";

	const handleViewDetails = () => {
		// Store modal state in sessionStorage before navigating
		sessionStorage.setItem("autoSelectModalOpen", "true");
		sessionStorage.setItem("autoSelectModalDriverId", driver.id);
		router.push(`/driver/${driver.id}?fromModal=true`);
	};

	const handleChat = () => {
		// Store modal state in sessionStorage before navigating
		sessionStorage.setItem("autoSelectModalOpen", "true");
		sessionStorage.setItem("autoSelectModalDriverId", driver.id);
		router.push(`/driver/${driver.id}/chat?fromModal=true`);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" dir={isArabic ? "rtl" : "ltr"}>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ duration: 0.2 }}
							className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
						>
							{/* Close Button */}
							<button
								onClick={onClose}
								className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
							>
								<X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
							</button>

							{/* Content */}
							<div className="p-6 sm:p-8">
							{/* Header */}
							<div className="text-center mb-6">
								<div 
									className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
									style={{ backgroundColor: primaryColor }}
								>
									<CheckCircle2 className="w-8 h-8 text-white" />
								</div>
								<h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
									{isArabic ? "تأكيد الطلب" : "Confirm Order"}
								</h2>
								<p className="text-sm text-gray-600 dark:text-gray-400">
					{isArabic
								? (isMotorbike ? "تم اختيار أفضل سائق دراجة نارية لك" : "تم اختيار أفضل سائق شاحنة لك")
								: (isMotorbike ? "Best motorbike driver selected for you" : "Best truck driver selected for you")}
								</p>
							</div>

							{/* Driver Card */}
							<div className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-4 sm:p-6 mb-6 border ${borderColor}`}>
								<div className="flex items-start gap-4 mb-4">
									{/* Driver Avatar */}
									<div className="relative flex-shrink-0">
										<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
											<Image
												src={driver.avatar}
												alt={driver.name}
												width={96}
												height={96}
												className="object-cover w-full h-full"
											/>
										</div>
										<div 
											className="absolute -bottom-2 -right-2 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
											style={{ backgroundColor: primaryColor }}
										>
											<div className="flex items-center gap-1">
												<Star className="w-3 h-3 fill-current" />
												<span>{driver.rating}</span>
											</div>
										</div>
									</div>

									{/* Driver Info */}
									<div className="flex-1 min-w-0">
										<h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">
											{driver.name}
										</h3>
										<div className="flex items-center gap-2 mb-2">
											<Award className="w-4 h-4" style={{ color: primaryColor }} />
											<span className="text-sm text-gray-600 dark:text-gray-400">
												{driver.completedTrips} {isArabic ? "رحلة مكتملة" : "completed trips"}
											</span>
										</div>
										<a
											href={`tel:${driver.phone}`}
											className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
											style={{ color: primaryColor }}
											onMouseEnter={(e) => (e.currentTarget.style.color = primaryHover)}
											onMouseLeave={(e) => (e.currentTarget.style.color = primaryColor)}
										>
											<Phone className="w-4 h-4" />
											<span>{driver.phone}</span>
										</a>
									</div>
								</div>

									{/* Vehicle Info */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
											<div className="flex items-center gap-2 mb-1">
												<VehicleIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
												<span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
													{isArabic ? "المركبة" : "Vehicle"}
												</span>
											</div>
											<p className="text-sm font-bold text-gray-900 dark:text-white">
												{driver.vehicleModel}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">{driver.licensePlate}</p>
										</div>

										<div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
											<div className="flex items-center gap-2 mb-1">
												<Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
												<span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
													{isArabic ? "وقت الوصول" : "Arrival Time"}
												</span>
											</div>
											<p className="text-sm font-bold text-gray-900 dark:text-white">
												{driver.estimatedArrival}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{driver.distance} {isArabic ? "بعيد" : "away"}
											</p>
										</div>
									</div>

									{/* Trust Badge */}
									<div className="mt-4 flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
										<Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
										<span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
											{isArabic ? "سائق معتمد ومؤمن" : "Verified & Insured Driver"}
										</span>
									</div>

								{/* Action Buttons - Chat & Details */}
								<div className="mt-4 grid grid-cols-2 gap-3">
									<button
										onClick={handleViewDetails}
										className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl font-bold transition-all hover:bg-gray-50 dark:hover:bg-gray-700"
										style={{
											borderColor: undefined,
										}}
										onMouseEnter={(e) => (e.currentTarget.style.borderColor = primaryColor)}
										onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
									>
										<UserCircle className="w-5 h-5" />
										<span className="text-sm">{isArabic ? "عرض التفاصيل" : "Show Details"}</span>
									</button>
									<button
										onClick={handleChat}
										className="flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
										style={{ backgroundColor: primaryColor }}
										onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = primaryHover)}
										onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
									>
										<MessageCircle className="w-5 h-5" />
										<span className="text-sm">{isArabic ? "محادثة" : "Chat"}</span>
									</button>
								</div>
							</div>

							{/* Price Breakdown */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
								<h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
									<MapPin className="w-5 h-5" style={{ color: primaryColor }} />
									{isArabic ? "تفاصيل السعر" : "Price Breakdown"}
								</h3>

								<div className="space-y-3">
									{/* Base Price */}
									<div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{isArabic ? "السعر الأساسي" : "Base Price"}
										</span>
										<span className="text-sm font-bold text-gray-900 dark:text-white">
											{priceBreakdown.basePrice.toFixed(2)} {isArabic ? "ريال" : "SAR"}
										</span>
									</div>

									{/* Distance Charge */}
									<div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{isArabic ? "رسوم المسافة" : "Distance Charge"}
										</span>
										<span className="text-sm font-bold text-gray-900 dark:text-white">
											{priceBreakdown.distanceCharge.toFixed(2)} {isArabic ? "ريال" : "SAR"}
										</span>
									</div>

									{/* Extra Charges */}
									{priceBreakdown.extraCharges.map((charge, index) => (
										<div
											key={index}
											className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700"
										>
											<span className="text-sm text-gray-600 dark:text-gray-400">{charge.label}</span>
											<span className="text-sm font-bold text-gray-900 dark:text-white">
												{charge.amount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
											</span>
										</div>
									))}

									{/* Total */}
									<div className="flex items-center justify-between pt-3">
										<span className="text-base font-black text-gray-900 dark:text-white">
											{isArabic ? "الإجمالي" : "Total"}
										</span>
										<span className="text-2xl font-black" style={{ color: primaryColor }}>
											{priceBreakdown.total.toFixed(2)} {isArabic ? "ريال" : "SAR"}
										</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="grid grid-cols-2 gap-3">
								<button
									onClick={onClose}
									className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-bold transition-all"
								>
									{isArabic ? "إلغاء" : "Cancel"}
								</button>
								<button
									onClick={onConfirm}
									className="px-6 py-3 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
									style={{ backgroundColor: primaryColor }}
									onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = primaryHover)}
									onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
								>
									{isArabic ? "تأكيد الطلب" : "Confirm Order"}
								</button>
							</div>

								{/* Footer Note */}
								<p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
									{isArabic
										? "بالتأكيد، أنت توافق على شروط الخدمة وسياسة الخصوصية"
										: "By confirming, you agree to terms of service and privacy policy"}
								</p>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}

