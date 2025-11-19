"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	ArrowRight,
	Edit2,
	MapPin,
	UserCircle,
	Phone,
	Truck,
	Package,
	Sparkles,
	Navigation,
	CheckCircle2,
	AlertCircle,
	Bike,
	Box,
	AlertTriangle,
	FileText,
	Clock,
	Weight,
	Ruler,
	Image as ImageIcon,
	Video,
	X,
} from "lucide-react";
import Image from "next/image";
import { AutoSelectConfirmModal } from "./components";

interface OrderSummaryPageProps {
	transportType: string;
	orderType: string;
}

interface LocationPoint {
	id: string;
	type: "pickup" | "dropoff";
	label: string;
	location: { lat: number; lng: number } | null;
	streetName: string;
	areaName: string;
	city: string;
	building: string;
	additionalDetails: string;
	buildingPhoto: string | null;
	recipientName: string;
	recipientPhone: string;
}

interface OrderData {
	transportType: string;
	orderType: string;
	locationPoints: LocationPoint[];
	packageDescription: string;
	packageWeight: string;
	packageDimensions: string;
	specialInstructions: string;
	packageImages?: string[];
	packageVideo?: string | null;
	// Vehicle-specific fields
	truckType?: string;
	cargoType?: string;
	isFragile?: boolean;
	requiresRefrigeration?: boolean;
	loadingEquipmentNeeded?: boolean;
	packageType?: string;
	isDocuments?: boolean;
	isExpress?: boolean;
}

export default function OrderSummaryPage({ transportType, orderType }: OrderSummaryPageProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMotorbike = transportType === "motorbike";
	const isMultiDirection = orderType === "multi-direction";

	const [orderData, setOrderData] = useState<OrderData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showNotification, setShowNotification] = useState(false);
	const [showAutoSelectModal, setShowAutoSelectModal] = useState(false);

	// User info (from auth in production)
	const currentUser = useMemo(
		() => ({
			name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
			phone: "+966 50 123 4567",
		}),
		[isArabic]
	);

	// Mock driver data (would come from backend in production)
	const selectedDriver = useMemo(
		() => ({
			id: "DRV-001",
			name: isArabic ? "محمد أحمد" : "Mohammed Ahmed",
			rating: 4.9,
			completedTrips: 1250,
			vehicleType: isMotorbike ? "Motorbike" : "Truck",
			vehicleModel: isMotorbike
				? isArabic
					? "هوندا 2023"
					: "Honda 2023"
				: isArabic
				? "إيسوزو 5 طن"
				: "Isuzu 5 Ton",
			licensePlate: "ABC 1234",
			phone: "+966 55 987 6543",
			distance: isArabic ? "3.5 كم" : "3.5 km",
			estimatedArrival: isArabic ? "15-20 دقيقة" : "15-20 mins",
			avatar: "/driver1.jpg",
		}),
		[isArabic, isMotorbike]
	);

	// Calculate completion percentage
	const completionPercentage = useMemo(() => {
		if (!orderData) return 0;

		const requiredFields: boolean[] = [];
		
		// Location points validation
		orderData.locationPoints.forEach((point) => {
			// Check if location is set (location is an object with lat/lng)
			requiredFields.push(!!(point.location && point.location.lat && point.location.lng));
			
			// Check additional details
			requiredFields.push(!!(point.additionalDetails && point.additionalDetails.trim()));
			
			// For dropoff points, check recipient info
			if (point.type === "dropoff") {
				requiredFields.push(!!(point.recipientName && point.recipientName.trim()));
				requiredFields.push(!!(point.recipientPhone && point.recipientPhone.trim()));
			}
		});
		
		// Package details
		requiredFields.push(!!(orderData.packageDescription && orderData.packageDescription.trim()));
		requiredFields.push(!!(orderData.packageWeight && orderData.packageWeight.trim()));

		// Vehicle-specific (truck requires truckType)
		if (transportType === "truck") {
			requiredFields.push(!!(orderData.truckType && orderData.truckType.trim()));
		}

		const completed = requiredFields.filter((field) => field === true).length;
		const total = requiredFields.length;
		
		return total > 0 ? Math.round((completed / total) * 100) : 0;
	}, [orderData, transportType]);

	// Load order data from sessionStorage
	useEffect(() => {
		const storedData = sessionStorage.getItem("pickAndOrderDetails");
		if (storedData) {
			try {
				const parsed = JSON.parse(storedData);
				setOrderData(parsed);
				console.log("Order data loaded:", parsed);
			} catch (error) {
				console.error("Error parsing order data:", error);
			}
		} else {
			console.log("No order data found in sessionStorage");
		}
		setIsLoading(false);
	}, []);

	// Debug completion percentage
	useEffect(() => {
		if (orderData) {
			console.log("Completion percentage calculated:", completionPercentage);
		}
	}, [completionPercentage, orderData]);

	// Check if modal should be reopened after navigation back
	useEffect(() => {
		// Check sessionStorage for modal state
		const modalShouldBeOpen = sessionStorage.getItem("autoSelectModalOpen") === "true";
		
		// Also check URL for fromModal parameter (handles browser back button)
		const urlParams = new URLSearchParams(window.location.search);
		const fromModal = urlParams.get("fromModal");
		
		if ((fromModal === "true" || modalShouldBeOpen) && orderData && !isLoading) {
			// Small delay to ensure page is fully loaded
			setTimeout(() => {
				setShowAutoSelectModal(true);
			}, 300);
		}
	}, [orderData, isLoading]);

	// Listen for browser back/forward navigation
	useEffect(() => {
		const handlePopState = () => {
			const modalShouldBeOpen = sessionStorage.getItem("autoSelectModalOpen") === "true";
			if (modalShouldBeOpen && orderData && !isLoading) {
				setTimeout(() => {
					setShowAutoSelectModal(true);
				}, 100);
			}
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [orderData, isLoading]);

	// Clean up sessionStorage when modal is closed
	const handleCloseModal = useCallback(() => {
		setShowAutoSelectModal(false);
		sessionStorage.removeItem("autoSelectModalOpen");
		sessionStorage.removeItem("autoSelectModalDriverId");
		
		// Clean up URL parameter if present
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has("fromModal")) {
			urlParams.delete("fromModal");
			const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;
			window.history.replaceState({}, "", newUrl);
		}
	}, []);

	// Calculate total distance (mock for now)
	const totalDistance = useMemo(() => {
		if (!orderData) return "0";
		const pointsCount = orderData.locationPoints.length;
		return (pointsCount * 5.5).toFixed(1);
	}, [orderData]);

	// Calculate delivery fee
	const deliveryFee = useMemo(() => {
		if (!orderData) return "0.00";
		const baseFee = isMotorbike ? 2.5 : 5.0;
		const fee = parseFloat(totalDistance) * baseFee;
		
		// Add extra for special requirements
		let extraFee = 0;
		if (orderData.isExpress) extraFee += 20;
		if (orderData.requiresRefrigeration) extraFee += 15;
		if (orderData.loadingEquipmentNeeded) extraFee += 25;
		
		return (fee + extraFee).toFixed(2);
	}, [orderData, isMotorbike, totalDistance]);

	// Mock price breakdown for modal
	const priceBreakdown = useMemo(() => {
		if (!orderData) return null;

		const basePrice = isMotorbike ? 15 : 30;
		const distanceCharge = parseFloat(totalDistance) * (isMotorbike ? 2.5 : 5);

		const extraCharges: { label: string; amount: number }[] = [];
		if (orderData.isExpress) {
			extraCharges.push({
				label: isArabic ? "توصيل سريع" : "Express Delivery",
				amount: 20,
			});
		}
		if (orderData.requiresRefrigeration) {
			extraCharges.push({
				label: isArabic ? "تبريد" : "Refrigeration",
				amount: 15,
			});
		}
		if (orderData.loadingEquipmentNeeded) {
			extraCharges.push({
				label: isArabic ? "معدات تحميل" : "Loading Equipment",
				amount: 25,
			});
		}

		const extraTotal = extraCharges.reduce((sum, charge) => sum + charge.amount, 0);
		const total = basePrice + distanceCharge + extraTotal;

		return {
			basePrice,
			distanceCharge,
			extraCharges,
			total,
		};
	}, [orderData, totalDistance, isMotorbike, isArabic]);

	const handleEdit = useCallback(() => {
		router.push(`/pickandorder/${transportType}/order/details?type=${orderType}`);
	}, [router, transportType, orderType]);

	const showIncompleteNotification = useCallback(() => {
		console.log("showIncompleteNotification called");
		setShowNotification(true);
		const timer = setTimeout(() => {
			setShowNotification(false);
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

	const handleChooseDriver = useCallback(() => {
		console.log("handleChooseDriver - completionPercentage:", completionPercentage);
		if (completionPercentage < 100) {
			console.log("Form incomplete, showing notification");
			showIncompleteNotification();
			return;
		}
		console.log("Form complete, navigating...");
		router.push(`/pickandorder/${transportType}/order/choose-driver?type=${orderType}`);
	}, [router, transportType, orderType, completionPercentage, showIncompleteNotification]);

	const handlePlatformRecommendation = useCallback(() => {
		console.log("handlePlatformRecommendation - completionPercentage:", completionPercentage);
		if (completionPercentage < 100) {
			console.log("Form incomplete, showing notification");
			showIncompleteNotification();
			return;
		}
		console.log("Form complete, showing modal...");
		setShowAutoSelectModal(true);
	}, [completionPercentage, showIncompleteNotification]);

	const handleConfirmAutoSelect = useCallback(() => {
		setShowAutoSelectModal(false);
		// Clean up sessionStorage
		sessionStorage.removeItem("autoSelectModalOpen");
		sessionStorage.removeItem("autoSelectModalDriverId");
		// Navigate to payment/confirmation page
		setTimeout(() => {
			router.push(`/pickandorder/${transportType}/order/payment?type=${orderType}&autoSelect=true&driverId=${selectedDriver.id}`);
		}, 300);
	}, [router, transportType, orderType, selectedDriver.id]);

	const VehicleIcon = isMotorbike ? Bike : Truck;

	const pickupPoints = orderData?.locationPoints.filter((p) => p.type === "pickup") || [];
	const dropoffPoints = orderData?.locationPoints.filter((p) => p.type === "dropoff") || [];

	// Helper function to get truck type display name
	const getTruckTypeName = useCallback((type: string) => {
		const types: { [key: string]: { ar: string; en: string } } = {
			small: { ar: "شاحنة صغيرة (حتى 1.5 طن)", en: "Small Truck (up to 1.5 tons)" },
			medium: { ar: "شاحنة متوسطة (1.5 - 3 طن)", en: "Medium Truck (1.5 - 3 tons)" },
			large: { ar: "شاحنة كبيرة (3 - 7 طن)", en: "Large Truck (3 - 7 tons)" },
			flatbed: { ar: "شاحنة مسطحة", en: "Flatbed Truck" },
			refrigerated: { ar: "شاحنة مبردة", en: "Refrigerated Truck" },
			container: { ar: "شاحنة حاوية", en: "Container Truck" },
			crane: { ar: "شاحنة رافعة", en: "Crane Truck" },
		};
		return types[type] ? types[type][isArabic ? "ar" : "en"] : type;
	}, [isArabic]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-[#31A342] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
						{isArabic ? "جاري التحميل..." : "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	if (!orderData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
				<div className="text-center max-w-md">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
						{isArabic ? "لم يتم العثور على البيانات" : "No Data Found"}
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						{isArabic
							? "يرجى إكمال تفاصيل الطلب أولاً"
							: "Please complete order details first"}
					</p>
					<button
						onClick={handleEdit}
						className="px-6 py-3 bg-[#31A342] hover:bg-[#2a8f38] text-white font-semibold rounded-xl transition-colors"
					>
						{isArabic ? "إكمال التفاصيل" : "Complete Details"}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-3 sm:py-6 lg:py-8"
		>
			{/* Notification Toast */}
			<AnimatePresence>
				{showNotification && (
					<motion.div
						initial={{ opacity: 0, y: -50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -20, scale: 0.95 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className={`fixed top-4 ${isArabic ? "left-4 right-auto" : "right-4 left-auto"} z-50 max-w-md w-full sm:w-auto mx-3 sm:mx-0`}
						dir={isArabic ? "rtl" : "ltr"}
					>
						<div className="bg-amber-500 dark:bg-amber-600 text-white rounded-2xl shadow-2xl p-4 flex items-start gap-3 border border-amber-400 dark:border-amber-500">
							<div className="p-1.5 bg-white/20 rounded-lg">
								<AlertCircle className="w-5 h-5 flex-shrink-0" />
							</div>
							<div className="flex-1 min-w-0">
								<p className={`text-sm font-bold ${isArabic ? "text-right" : "text-left"} mb-1`}>
									{isArabic
										? `الطلب غير مكتمل (${completionPercentage}%)`
										: `Order Incomplete (${completionPercentage}%)`}
								</p>
								<p className="text-xs opacity-95 mb-2">
									{isArabic
										? "يرجى إكمال جميع الحقول المطلوبة"
										: "Please complete all required fields"}
								</p>
								<button
									onClick={handleEdit}
									className="text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all"
								>
									{isArabic ? "إكمال التفاصيل" : "Complete Details"}
								</button>
							</div>
							<button
								onClick={() => setShowNotification(false)}
								className="flex-shrink-0 hover:bg-white/20 p-1 rounded-lg transition-all"
							>
								<X className="w-5 h-5" />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="space-y-3 sm:space-y-5"
				>
					{/* Header - Modern & Compact */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="relative"
					>
						{/* Background Pattern */}
						<div className="absolute inset-0 bg-gradient-to-br from-[#31A342]/5 via-transparent to-[#FA9D2B]/5 dark:from-[#31A342]/10 dark:to-[#FA9D2B]/10 rounded-3xl -z-10" />
						
						<div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-4 sm:p-6 lg:p-8">
							<div className="text-center space-y-3 sm:space-y-4">
								{/* Badges */}
								<div className="flex flex-wrap items-center justify-center gap-2">
									<div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#31A342] text-white rounded-full shadow-lg">
										<Navigation className="h-3.5 w-3.5" />
										<span className="text-xs font-bold">
											{isMultiDirection
												? isArabic ? "نقل متعدد" : "Multi-Direction"
												: isArabic ? "اتجاه واحد" : "One-Way"}
										</span>
									</div>
									<div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FA9D2B] text-white rounded-full shadow-lg">
										<VehicleIcon className="h-3.5 w-3.5" />
										<span className="text-xs font-bold">
											{isMotorbike ? (isArabic ? "دراجة نارية" : "Motorbike") : isArabic ? "شاحنة" : "Truck"}
										</span>
									</div>
								</div>

								{/* Title */}
								<div>
									<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">
										{isArabic ? "ملخص الطلب" : "Order Summary"}
									</h1>
									<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
										{isArabic ? "راجع تفاصيل طلبك قبل المتابعة" : "Review your order before proceeding"}
									</p>
								</div>

								{/* Completion Progress - Enhanced */}
								<div className="max-w-md mx-auto">
									<div className="relative">
										{/* Progress Bar Background */}
										<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: `${completionPercentage}%` }}
												transition={{ duration: 1, ease: "easeOut" }}
												className={`h-full rounded-full ${
													completionPercentage === 100
														? "bg-gradient-to-r from-green-400 to-emerald-500"
														: completionPercentage >= 70
														? "bg-gradient-to-r from-yellow-400 to-orange-500"
														: "bg-gradient-to-r from-red-400 to-red-500"
												}`}
											/>
										</div>
										{/* Percentage Badge */}
										<div className={`absolute -top-1 ${isArabic ? "right-0" : "left-0"} transform ${isArabic ? "translate-x-1/2" : "-translate-x-1/2"}`}
											style={{ [isArabic ? "right" : "left"]: `${completionPercentage}%` }}
										>
											<div className={`px-2 py-1 rounded-lg text-xs font-bold text-white shadow-lg ${
												completionPercentage === 100
													? "bg-gradient-to-r from-green-500 to-emerald-600"
													: completionPercentage >= 70
													? "bg-gradient-to-r from-yellow-500 to-orange-600"
													: "bg-gradient-to-r from-red-500 to-red-600"
											}`}>
												{completionPercentage}%
											</div>
										</div>
									</div>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
										{completionPercentage === 100 ? (
											<span className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 font-semibold">
												<CheckCircle2 className="w-3.5 h-3.5" />
												{isArabic ? "الطلب مكتمل!" : "Order Complete!"}
											</span>
										) : (
											<span className="flex items-center justify-center gap-1">
												<AlertCircle className="w-3.5 h-3.5" />
												{isArabic ? `${100 - completionPercentage}% متبقي` : `${100 - completionPercentage}% remaining`}
									</span>
										)}
									</p>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Main Summary Card - Grid Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
						{/* Left Column - Main Details */}
						<div className="lg:col-span-2 space-y-3 sm:space-y-4">
							{/* Sender Info - Simplified */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.1 }}
								className="relative group"
							>
								<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 sm:p-5 hover:shadow-xl transition-shadow">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
											<UserCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
								</div>
										<div>
											<h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
												{isArabic ? "معلومات المرسل" : "Sender"}
											</h2>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{isArabic ? "من حسابك" : "From your profile"}
										</p>
									</div>
								</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
											<div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
												<UserCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
											</div>
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">{isArabic ? "الاسم" : "Name"}</p>
												<p className="text-sm font-bold text-gray-900 dark:text-white">{currentUser.name}</p>
											</div>
										</div>
										<div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
											<div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
												<Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
											</div>
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">{isArabic ? "الهاتف" : "Phone"}</p>
												<p className="text-sm font-bold text-gray-900 dark:text-white font-mono">{currentUser.phone}</p>
											</div>
										</div>
									</div>
								</div>
							</motion.div>

							{/* Location Points */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 }}
								className="relative group"
							>
								<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 sm:p-5 hover:shadow-xl transition-shadow">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 rounded-xl bg-[#31A342] flex items-center justify-center">
											<MapPin className="h-6 w-6 text-white" />
										</div>
										<div>
											<h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
												{isArabic ? "المواقع" : "Locations"}
											</h2>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{pickupPoints.length + dropoffPoints.length} {isArabic ? "موقع" : "points"}
											</p>
										</div>
									</div>

									<div className="space-y-2">
										{/* Pickup Points */}
										{pickupPoints.map((point, idx) => (
											<motion.div
												key={point.id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.3 + idx * 0.1 }}
												className="group/point"
											>
												<div className="relative p-3 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-green-900/30 border-2 border-green-200 dark:border-green-700 rounded-xl hover:shadow-md transition-all">
													<div className="flex items-start gap-3">
														<div className="relative">
															<div className="w-10 h-10 bg-gradient-to-br from-[#31A342] to-[#2a8f38] rounded-xl flex items-center justify-center shadow-lg">
																<span className="text-white font-black text-sm">{idx + 1}</span>
															</div>
															<div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping" />
														</div>
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-1">
																<span className="text-xs font-bold text-green-700 dark:text-green-400 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 rounded-full">
																	{isArabic ? "التقاط" : "PICKUP"}
																</span>
															</div>
															<p className="font-bold text-sm text-gray-900 dark:text-white mb-1">
																{point.label}
															</p>
															<p className="text-xs text-gray-600 dark:text-gray-400 break-words">
																{point.streetName && point.city
																	? `${point.streetName}, ${point.city}`
																	: isArabic ? "الموقع محدد" : "Location selected"}
															</p>
															{point.additionalDetails && (
																<p className="text-xs text-gray-500 dark:text-gray-500 mt-2 p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
																	{point.additionalDetails}
																</p>
															)}
									</div>
								</div>
							</div>
											</motion.div>
										))}

										{/* Dropoff Points */}
										{dropoffPoints.map((point, idx) => (
											<motion.div
												key={point.id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.3 + (pickupPoints.length + idx) * 0.1 }}
												className="group/point"
											>
												<div className="relative p-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-orange-900/30 dark:via-amber-900/30 dark:to-orange-900/30 border-2 border-orange-200 dark:border-orange-700 rounded-xl hover:shadow-md transition-all">
													<div className="flex items-start gap-3">
														<div className="relative">
															<div className="w-10 h-10 bg-gradient-to-br from-[#FA9D2B] to-[#E88D26] rounded-xl flex items-center justify-center shadow-lg">
																<span className="text-white font-black text-sm">
																	{pickupPoints.length + idx + 1}
																</span>
															</div>
															<div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-ping" />
								</div>
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-1">
																<span className="text-xs font-bold text-orange-700 dark:text-orange-400 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/50 rounded-full">
																	{isArabic ? "توصيل" : "DROPOFF"}
																</span>
							</div>
															<p className="font-bold text-sm text-gray-900 dark:text-white mb-1">
																{point.label}
															</p>
															<p className="text-xs text-gray-600 dark:text-gray-400 break-words mb-2">
																{point.streetName && point.city
																	? `${point.streetName}, ${point.city}`
																	: isArabic ? "الموقع محدد" : "Location selected"}
															</p>
															{point.recipientName && (
																<div className="text-xs space-y-1 p-2 bg-white dark:bg-gray-900/70 border border-orange-200 dark:border-orange-800 rounded-lg">
																	<div className="flex items-center gap-1.5">
																		<UserCircle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
																		<span className="font-semibold text-gray-900 dark:text-white">
																			{point.recipientName}
																		</span>
																	</div>
																	<div className="flex items-center gap-1.5">
																		<Phone className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
																		<span className="font-mono text-gray-700 dark:text-gray-300">
																			{point.recipientPhone}
																		</span>
																	</div>
																</div>
															)}
															{point.additionalDetails && (
																<p className="text-xs text-gray-500 dark:text-gray-500 mt-2 p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
																	{point.additionalDetails}
																</p>
															)}
														</div>
													</div>
												</div>
											</motion.div>
										))}
									</div>
								</div>
							</motion.div>

							{/* Package Details - Simplified */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4 }}
								className="relative group"
							>
								<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 sm:p-5 hover:shadow-xl transition-shadow">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
											<Package className="h-6 w-6 text-gray-600 dark:text-gray-400" />
										</div>
										<div>
											<h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
												{isArabic ? "تفاصيل الطرد" : "Package"}
											</h2>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{isArabic ? "معلومات الشحنة" : "Shipment info"}
										</p>
									</div>
								</div>

									<div className="space-y-3">
										{/* Description & Weight Grid */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
												<div className="flex items-center gap-2 mb-1.5">
													<div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
														<Package className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
													</div>
													<p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
														{isArabic ? "الوصف" : "Description"}
													</p>
												</div>
												<p className="text-sm font-bold text-gray-900 dark:text-white">
													{orderData.packageDescription}
												</p>
											</div>

											<div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
												<div className="flex items-center gap-2 mb-1.5">
													<div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
														<Weight className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
													</div>
													<p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
														{isArabic ? "الوزن" : "Weight"}
													</p>
												</div>
												<p className="text-sm font-black text-gray-900 dark:text-white">
													{orderData.packageWeight} <span className="text-xs">{isArabic ? "كجم" : "kg"}</span>
												</p>
											</div>
										</div>

										{/* Dimensions */}
										{orderData.packageDimensions && (
											<div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
												<div className="flex items-center gap-2 mb-1.5">
													<div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
														<Ruler className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
													</div>
													<p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
														{isArabic ? "الأبعاد" : "Dimensions"}
													</p>
												</div>
												<p className="text-sm font-bold text-gray-900 dark:text-white">
													{orderData.packageDimensions} <span className="text-xs">{isArabic ? "سم" : "cm"}</span>
												</p>
											</div>
										)}

										{/* Special Instructions */}
										{orderData.specialInstructions && (
											<div className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
												<div className="flex items-center gap-2 mb-2">
													<div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
														<FileText className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
													</div>
													<p className="text-xs font-bold text-gray-700 dark:text-gray-300">
														{isArabic ? "ملاحظات خاصة" : "Special Instructions"}
													</p>
												</div>
												<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
													{orderData.specialInstructions}
												</p>
											</div>
										)}

										{/* Package Images */}
										{orderData.packageImages && orderData.packageImages.length > 0 && (
											<div>
												<div className="flex items-center gap-2 mb-3">
													<div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
														<ImageIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
													</div>
													<p className="text-sm font-black text-gray-900 dark:text-white">
														{isArabic ? "صور الطرد" : "Package Images"}
													</p>
													<span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-full">
														{orderData.packageImages.length}
													</span>
												</div>
												<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
													{orderData.packageImages.map((image, index) => (
														<motion.div
															key={index}
															initial={{ opacity: 0, scale: 0.9 }}
															animate={{ opacity: 1, scale: 1 }}
															transition={{ delay: 0.5 + index * 0.05 }}
															className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-md hover:shadow-xl transition-all duration-200 group/img"
														>
															<Image
																src={image}
																alt={`Package image ${index + 1}`}
																fill
																className="object-cover transition-transform duration-300 group-hover/img:scale-110"
															/>
															<div className="absolute bottom-1.5 left-1.5 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-black shadow-lg flex items-center gap-1">
																<ImageIcon className="w-3 h-3" />
																<span>{index + 1}</span>
															</div>
															<div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-200" />
														</motion.div>
													))}
												</div>
											</div>
										)}

										{/* Package Video */}
										{orderData.packageVideo && (
											<div>
												<div className="flex items-center gap-2 mb-2">
													<div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
														<Video className="h-4 w-4 text-gray-600 dark:text-gray-400" />
													</div>
													<p className="text-sm font-black text-gray-900 dark:text-white">
														{isArabic ? "فيديو الطرد" : "Package Video"}
													</p>
												</div>
												<div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-md">
													<video
														src={orderData.packageVideo}
														controls
														className="w-full h-48 sm:h-64 object-cover"
													/>
													<div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-black shadow-lg flex items-center gap-1">
														<Video className="w-3 h-3" />
														{isArabic ? "فيديو" : "Video"}
													</div>
												</div>
											</div>
										)}
									</div>
								</div>
							</motion.div>
							</div>

						{/* Right Column - Sidebar (Pricing & Vehicle Details) */}
						<div className="lg:col-span-1 space-y-3 sm:space-y-4">
							{/* Pricing Summary */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 }}
								className="relative sticky top-4"
							>
								<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-4 sm:p-5">
									<div className="text-center mb-4">
										<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#31A342] mb-3">
											<Sparkles className="w-8 h-8 text-white" />
								</div>
										<h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">
											{isArabic ? "ملخص التكلفة" : "Cost Summary"}
										</h3>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{isArabic ? "تقدير أولي" : "Preliminary estimate"}
									</p>
								</div>

									<div className="space-y-3">
										{/* Distance */}
										<div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
													{isArabic ? "إجمالي المسافة" : "Total Distance"}
												</span>
												<Navigation className="w-4 h-4 text-[#31A342]" />
							</div>
											<p className="text-3xl font-black text-gray-900 dark:text-white">
												{totalDistance}
												<span className="text-sm ml-1 text-gray-500">{isArabic ? "كم" : "km"}</span>
											</p>
						</div>

										{/* Estimated Fee */}
										<div className="p-4 bg-gradient-to-br from-[#31A342] to-[#2a8f38] rounded-xl shadow-lg">
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs font-semibold text-white/80">
													{isArabic ? "الرسوم المتوقعة" : "Estimated Fee"}
												</span>
												<Sparkles className="w-4 h-4 text-white/80" />
								</div>
											<p className="text-3xl font-black text-white">
												{deliveryFee}
												<span className="text-sm ml-1 opacity-80">{isArabic ? "ريال" : "SAR"}</span>
											</p>
											<p className="text-xs text-white/70 mt-2">
												{isArabic ? "* السعر النهائي بعد اختيار السائق" : "* Final price after driver selection"}
									</p>
								</div>
							</div>
						</div>
					</motion.div>

							{/* Vehicle-Specific Details - Simplified */}
							{(orderData.truckType || orderData.cargoType || orderData.packageType || orderData.isFragile || orderData.isExpress) && (
								<motion.div
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 }}
									className="relative"
								>
									<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 sm:p-5 hover:shadow-xl transition-shadow">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
												<VehicleIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
											</div>
											<div>
												<h3 className="text-base font-black text-gray-900 dark:text-white">
													{isMotorbike
														? isArabic ? "تفاصيل الدراجة" : "Bike Details"
														: isArabic ? "تفاصيل الشاحنة" : "Truck Details"}
												</h3>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{isArabic ? "متطلبات النقل" : "Transport requirements"}
												</p>
											</div>
										</div>

										<div className="space-y-2">
											{orderData.truckType && (
												<div className="p-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
													<div className="flex items-center gap-2">
														<div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
															<Truck className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
														</div>
														<div>
															<p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
																{isArabic ? "نوع الشاحنة" : "Truck Type"}
															</p>
															<p className="text-sm font-black text-gray-900 dark:text-white">
																{getTruckTypeName(orderData.truckType)}
															</p>
														</div>
													</div>
												</div>
											)}

											{orderData.cargoType && (
												<div className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-2">
													<Box className="h-4 w-4 text-gray-600 dark:text-gray-400" />
													<span className="text-xs text-gray-700 dark:text-gray-300">
														{isArabic ? "البضاعة:" : "Cargo:"} <strong className="font-bold">{orderData.cargoType}</strong>
													</span>
												</div>
											)}

											{orderData.packageType && (
												<div className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-2">
													<Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
													<span className="text-xs text-gray-700 dark:text-gray-300">
														{isArabic ? "الطرد:" : "Package:"} <strong className="font-bold">{orderData.packageType}</strong>
													</span>
												</div>
											)}

											{orderData.isFragile && (
												<div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg flex items-center gap-2">
													<AlertTriangle className="h-4 w-4 text-orange-600" />
													<span className="text-xs text-orange-700 dark:text-orange-300 font-bold">
														{isArabic ? "بضاعة قابلة للكسر" : "Fragile Items"}
													</span>
												</div>
											)}

											{orderData.requiresRefrigeration && (
												<div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center gap-2">
													<Box className="h-4 w-4 text-blue-600" />
													<span className="text-xs text-blue-700 dark:text-blue-300 font-bold">
														{isArabic ? "يتطلب تبريد" : "Refrigeration Required"}
													</span>
												</div>
											)}

											{orderData.loadingEquipmentNeeded && (
												<div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg flex items-center gap-2">
													<Truck className="h-4 w-4 text-purple-600" />
													<span className="text-xs text-purple-700 dark:text-purple-300 font-bold">
														{isArabic ? "معدات تحميل" : "Loading Equipment"}
													</span>
												</div>
											)}

											{orderData.isDocuments && (
												<div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center gap-2">
													<FileText className="h-4 w-4 text-blue-600" />
													<span className="text-xs text-blue-700 dark:text-blue-300 font-bold">
														{isArabic ? "مستندات مهمة" : "Important Documents"}
													</span>
												</div>
											)}

											{orderData.isExpress && (
												<div className="p-2.5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-lg flex items-center gap-2">
													<Clock className="h-4 w-4 text-red-600 animate-pulse" />
													<span className="text-xs text-red-700 dark:text-red-300 font-black">
														{isArabic ? "توصيل سريع" : "Express Delivery"}
													</span>
												</div>
											)}
										</div>
									</div>
								</motion.div>
							)}
						</div>
					</div>

					{/* Action Buttons - Mobile Optimized */}
					<div className="space-y-3 sm:space-y-4">
						{/* Edit Button */}
						<button
							onClick={handleEdit}
							className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md text-sm sm:text-base"
						>
							<Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
							<span>{isArabic ? "تعديل التفاصيل" : "Edit Details"}</span>
						</button>

						{/* Driver Selection - One Row */}
						<div className="flex flex-row gap-2 sm:gap-3 w-full">
							{/* Platform Auto */}
							<button
								onClick={handlePlatformRecommendation}
								className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-3 sm:px-4 sm:py-4 bg-gradient-to-r from-[#31A342] to-[#2a8f38] hover:from-[#2a8f38] hover:to-[#258533] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base"
							>
								<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
								<span className="truncate">{isArabic ? "المنصة تختار" : "Auto Select"}</span>
								<ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 ${isArabic ? "rotate-180" : ""}`} />
							</button>

							{/* Manual Selection */}
							<button
								onClick={handleChooseDriver}
								className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-3 sm:px-4 sm:py-4 bg-[#FA9D2B] hover:bg-[#E88D26] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base"
							>
								<span className="truncate">{isArabic ? "أختار بنفسي" : "I Choose Myself"}</span>
								<ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 ${isArabic ? "rotate-180" : ""}`} />
							</button>
						</div>
					</div>

					{/* Info Notice */}
					<div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4">
						<div className="flex items-start gap-2">
							<CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#31A342] flex-shrink-0 mt-0.5" />
							<p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
								{isArabic
									? "ستتمكن من مراجعة السعر النهائي بعد اختيار السائق"
									: "You'll review the final price after selecting a driver"}
							</p>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Auto Select Confirmation Modal */}
			{priceBreakdown && (
				<AutoSelectConfirmModal
					isOpen={showAutoSelectModal}
					onClose={handleCloseModal}
					onConfirm={handleConfirmAutoSelect}
					driver={selectedDriver}
					priceBreakdown={priceBreakdown}
					isArabic={isArabic}
					isMotorbike={isMotorbike}
				/>
			)}
		</div>
	);
}
