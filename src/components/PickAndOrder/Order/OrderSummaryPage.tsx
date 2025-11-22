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
	Loader2,
} from "lucide-react";
import Image from "next/image";
import { AutoSelectConfirmModal } from "./components";
import { calculateOrderPricing, formatPrice as formatPriceUtil, formatDistance, calculateTotalDistance, calculateDistance } from "./utils/pricing";

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
	const [routeSegments, setRouteSegments] = useState<any[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showNotification, setShowNotification] = useState(false);
	const [showAutoSelectModal, setShowAutoSelectModal] = useState(false);
	const [isAutoSelectLoading, setIsAutoSelectLoading] = useState(false);

	// User info - try to get from localStorage or use sender info from order
	const currentUser = useMemo(() => {
		// Try to get user data from localStorage (if logged in)
		if (typeof window !== "undefined") {
			try {
				const userDataStr = localStorage.getItem("userData");
				if (userDataStr) {
					const userData = JSON.parse(userDataStr);
					if (userData.name && userData.phone) {
						return {
							name: userData.name,
							phone: userData.phone,
						};
					}
				}
			} catch (error) {
				console.error("Error loading user data:", error);
			}
		}

		// Fallback: use sender info from first pickup point if available
		if (orderData && orderData.locationPoints && orderData.locationPoints.length > 0) {
			const firstPickup = orderData.locationPoints.find((p) => p.type === "pickup");
			if (firstPickup && firstPickup.recipientName && firstPickup.recipientPhone) {
				return {
					name: firstPickup.recipientName,
					phone: firstPickup.recipientPhone,
				};
			}
		}

		// Final fallback
		return {
			name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
			phone: "+966 50 123 4567",
		};
	}, [isArabic, orderData]);

	// Import centralized pricing utilities
	// Note: calculateDistance and calculateTotalDistance are imported from utils/pricing

	const calculateEstimatedTime = useCallback((distance: number): number => {
		// Average speed: 40 km/h for city driving
		return Math.round((distance / 40) * 60);
	}, []);

	// Mock available drivers (would come from API in production)
	const availableDrivers = useMemo(() => {
		if (!orderData || !orderData.locationPoints.length) return [];
		
		const pickupPoint = orderData.locationPoints.find(p => p.type === "pickup");
		if (!pickupPoint || !pickupPoint.location) return [];

		const referenceLocation = pickupPoint.location;
		
		const allDriversRaw = [
			{
				id: "1",
				name: "Mohammed Ahmed",
				nameAr: "محمد أحمد",
				avatar: "/driver1.jpg",
				rating: 4.9,
				reviewsCount: 1250,
				pricePerKm: isMotorbike ? 2.5 : 5.0,
				experience: isArabic ? "8 سنوات" : "8 years",
				location: isArabic ? "الرياض" : "Riyadh",
				vehicleType: isMotorbike ? "motorbike" : "truck",
				vehicleModel: isMotorbike 
					? (isArabic ? "هوندا 2023" : "Honda 2023")
					: (isArabic ? "إيسوزو 5 طن" : "Isuzu 5 Ton"),
				licensePlate: "ABC 1234",
				phone: "+966 55 987 6543",
				lat: referenceLocation.lat + (Math.random() - 0.5) * 0.1,
				lng: referenceLocation.lng + (Math.random() - 0.5) * 0.1,
			},
			{
				id: "2",
				name: "Ahmed Al-Saud",
				nameAr: "أحمد السعود",
				avatar: "/driver2.jpg",
				rating: 4.8,
				reviewsCount: 980,
				pricePerKm: isMotorbike ? 2.6 : 5.2,
				experience: isArabic ? "6 سنوات" : "6 years",
				location: isArabic ? "الرياض" : "Riyadh",
				vehicleType: isMotorbike ? "motorbike" : "truck",
				vehicleModel: isMotorbike 
					? (isArabic ? "سوزوكي 2022" : "Suzuki 2022")
					: (isArabic ? "ميتسوبيشي 5 طن" : "Mitsubishi 5 Ton"),
				licensePlate: "DEF 5678",
				phone: "+966 50 123 4567",
				lat: referenceLocation.lat + (Math.random() - 0.5) * 0.1,
				lng: referenceLocation.lng + (Math.random() - 0.5) * 0.1,
			},
			{
				id: "3",
				name: "Khalid Al-Mutairi",
				nameAr: "خالد المطيري",
				avatar: "/driver1.jpg",
				rating: 4.7,
				reviewsCount: 750,
				pricePerKm: isMotorbike ? 2.4 : 4.9,
				experience: isArabic ? "5 سنوات" : "5 years",
				location: isArabic ? "الرياض" : "Riyadh",
				vehicleType: isMotorbike ? "motorbike" : "truck",
				vehicleModel: isMotorbike 
					? (isArabic ? "بي إم دبليو 2023" : "BMW 2023")
					: (isArabic ? "نيسان 5 طن" : "Nissan 5 Ton"),
				licensePlate: "GHI 9012",
				phone: "+966 55 555 5555",
				lat: referenceLocation.lat + (Math.random() - 0.5) * 0.1,
				lng: referenceLocation.lng + (Math.random() - 0.5) * 0.1,
			},
		];

		return allDriversRaw.map((driver) => {
			const distance = calculateDistance(
				referenceLocation.lat,
				referenceLocation.lng,
				driver.lat,
				driver.lng
			);
			return {
				...driver,
				distance: Math.round(distance * 10) / 10,
				estimatedTime: calculateEstimatedTime(distance),
			};
		}).sort((a, b) => {
			// Sort by rating first, then by distance
			if (b.rating !== a.rating) return b.rating - a.rating;
			return (a.distance || 0) - (b.distance || 0);
		});
	}, [orderData, isMotorbike, isArabic, calculateDistance, calculateEstimatedTime]);

	// Select best driver (highest rating, closest distance)
	const selectedDriver = useMemo(() => {
		if (!availableDrivers.length) {
			// Fallback mock data
			return {
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
			};
		}

		const bestDriver = availableDrivers[0];
		return {
			id: bestDriver.id,
			name: isArabic ? bestDriver.nameAr : bestDriver.name,
			rating: bestDriver.rating,
			completedTrips: bestDriver.reviewsCount,
			vehicleType: bestDriver.vehicleType === "motorbike" ? "Motorbike" : "Truck",
			vehicleModel: bestDriver.vehicleModel,
			licensePlate: bestDriver.licensePlate,
			phone: bestDriver.phone,
			distance: isArabic ? `${bestDriver.distance} كم` : `${bestDriver.distance} km`,
			estimatedArrival: isArabic 
				? `${bestDriver.estimatedTime} دقيقة` 
				: `${bestDriver.estimatedTime} mins`,
			avatar: bestDriver.avatar,
		};
	}, [availableDrivers, isArabic, isMotorbike]);

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

	// Load order data from sessionStorage - supports both old and new formats
	useEffect(() => {
		// Dynamic import to avoid circular dependencies
		import("./utils/dataConverter").then(({ loadAndConvertOrderData, getRouteSegments, isNewFormat }) => {
			// Check if data is in new format (routeSegments)
			if (isNewFormat()) {
				const segments = getRouteSegments();
				if (segments) {
					setRouteSegments(segments);
					// Also load converted data for backward compatibility
					const data = loadAndConvertOrderData();
					if (data) {
						setOrderData(data);
					}
					console.log("Route segments loaded:", segments);
				}
			} else {
				// Old format - use converted data
				const data = loadAndConvertOrderData();
				if (data) {
					setOrderData(data);
					console.log("Order data loaded (old format):", data);
				}
			}
			setIsLoading(false);
		}).catch((error) => {
			console.error("Error loading order data:", error);
			setIsLoading(false);
		});
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

	// Calculate pricing using centralized utility
	const pricingData = useMemo(() => {
		if (!orderData || !orderData.locationPoints) {
			return null;
		}

		try {
			const pricing = calculateOrderPricing({
				transportType: isMotorbike ? "motorbike" : "truck",
				locationPoints: orderData.locationPoints,
				isExpress: orderData.isExpress,
				requiresRefrigeration: orderData.requiresRefrigeration,
				loadingEquipmentNeeded: orderData.loadingEquipmentNeeded,
			});
			
			return pricing;
		} catch (error) {
			console.error("Error calculating pricing:", error);
			return null;
		}
	}, [orderData, isMotorbike]);

	// Get distance and delivery fee from pricing data
	const totalDistance = useMemo(() => {
		return pricingData?.distance.toFixed(1) || "0.0";
	}, [pricingData]);

	const deliveryFee = useMemo(() => {
		return pricingData?.total.toFixed(2) || "0.00";
	}, [pricingData]);

	// Calculate price breakdown for confirmation modal
	const priceBreakdown = useMemo(() => {
		if (!pricingData || !orderData) return null;

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

		return {
			basePrice: pricingData.basePrice,
			distanceCharge: pricingData.basePrice, // For display purposes
			extraCharges,
			total: pricingData.total,
		};
	}, [pricingData, orderData, isArabic]);

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
		
		// Store pricing data for subsequent pages
		if (pricingData && typeof window !== "undefined") {
			sessionStorage.setItem("orderPricing", JSON.stringify(pricingData));
		}
		
		router.push(`/pickandorder/${transportType}/order/choose-driver?type=${orderType}`);
	}, [router, transportType, orderType, completionPercentage, showIncompleteNotification, pricingData]);

	const handlePlatformRecommendation = useCallback(() => {
		console.log("handlePlatformRecommendation - completionPercentage:", completionPercentage);
		if (completionPercentage < 100) {
			console.log("Form incomplete, showing notification");
			showIncompleteNotification();
			return;
		}
		console.log("Form complete, loading driver...");
		
		// Store pricing data for subsequent pages
		if (pricingData && typeof window !== "undefined") {
			sessionStorage.setItem("orderPricing", JSON.stringify(pricingData));
		}
		
		// Show loading state first
		setIsAutoSelectLoading(true);
		// Simulate API call to select best driver (in production, this would be a real API call)
		setTimeout(() => {
			setIsAutoSelectLoading(false);
			setShowAutoSelectModal(true);
		}, 500); // Short delay to show loading, then show modal
	}, [completionPercentage, showIncompleteNotification, pricingData]);

	const handleConfirmAutoSelect = useCallback(() => {
		setShowAutoSelectModal(false);
		// Clean up sessionStorage
		sessionStorage.removeItem("autoSelectModalOpen");
		sessionStorage.removeItem("autoSelectModalDriverId");
		
		// Store pricing data for payment page
		if (pricingData && typeof window !== "undefined") {
			sessionStorage.setItem("orderPricing", JSON.stringify(pricingData));
		}
		
		// Navigate to payment/confirmation page
		setTimeout(() => {
			router.push(`/pickandorder/${transportType}/order/payment?type=${orderType}&autoSelect=true&driverId=${selectedDriver.id}`);
		}, 300);
	}, [router, transportType, orderType, selectedDriver.id, pricingData]);

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
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
						{isArabic ? "جاري التحميل..." : "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	if (!orderData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
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
						className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
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
			className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6"
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
						<div className="bg-yellow-500 dark:bg-yellow-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3">
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
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-6"
					>
							<div className="text-center space-y-3 sm:space-y-4">
								{/* Badges */}
								<div className="flex flex-wrap items-center justify-center gap-2">
									<div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-full">
										<Navigation className="h-3.5 w-3.5" />
										<span className="text-xs font-semibold">
											{isMultiDirection
												? isArabic ? "نقل متعدد" : "Multi-Direction"
												: isArabic ? "اتجاه واحد" : "One-Way"}
										</span>
									</div>
									<div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-full">
										<VehicleIcon className="h-3.5 w-3.5" />
										<span className="text-xs font-semibold">
											{isMotorbike ? (isArabic ? "دراجة نارية" : "Motorbike") : isArabic ? "شاحنة" : "Truck"}
										</span>
									</div>
								</div>

								{/* Title */}
								<div>
									<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
										{isArabic ? "ملخص الطلب" : "Order Summary"}
									</h1>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{isArabic ? "راجع تفاصيل طلبك قبل المتابعة" : "Review your order before proceeding"}
									</p>
								</div>

								{/* Completion Progress */}
								<div className="max-w-md mx-auto">
									<div className="relative">
										<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: `${completionPercentage}%` }}
												transition={{ duration: 1, ease: "easeOut" }}
												className={`h-full rounded-full ${
													completionPercentage === 100
														? "bg-green-600"
														: completionPercentage >= 70
														? "bg-yellow-500"
														: "bg-red-500"
												}`}
											/>
										</div>
											</div>
									<p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center">
										{completionPercentage === 100 ? (
											<span className="flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400 font-semibold">
												<CheckCircle2 className="w-4 h-4" />
												{isArabic ? "الطلب مكتمل!" : "Order Complete!"}
											</span>
										) : (
											<span className="flex items-center justify-center gap-1.5">
												<AlertCircle className="w-4 h-4" />
												{completionPercentage}% {isArabic ? "مكتمل" : "complete"}
									</span>
										)}
									</p>
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
								<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
											<UserCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								</div>
										<div>
											<h2 className="text-base font-semibold text-gray-900 dark:text-white">
												{isArabic ? "معلومات المرسل" : "Sender Info"}
											</h2>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{isArabic ? "من حسابك" : "From your profile"}
										</p>
									</div>
								</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
										<div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
											<div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
												<UserCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
											</div>
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">{isArabic ? "الاسم" : "Name"}</p>
												<p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.name}</p>
											</div>
										</div>
										<div className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
											<div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
												<Phone className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
											</div>
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">{isArabic ? "الهاتف" : "Phone"}</p>
												<p className="text-sm font-semibold text-gray-900 dark:text-white font-mono text-left" dir="ltr">{currentUser.phone}</p>
											</div>
										</div>
									</div>
								</div>
							</motion.div>

							{/* Location Points - Only for One-Way Orders */}
							{!isMultiDirection && (
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2 }}
									className="relative group"
								>
								<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
											<MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
										</div>
										<div>
											<h2 className="text-base font-semibold text-gray-900 dark:text-white">
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
												<div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
													<div className="flex items-start gap-2">
														<div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
															<span className="text-white text-xs font-semibold">{idx + 1}</span>
														</div>
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-1">
																<span className="text-xs font-semibold text-green-700 dark:text-green-400 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 rounded">
																	{isArabic ? "التقاط" : "PICKUP"}
																</span>
															</div>
															<p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
																{point.label}
															</p>
															<p className="text-xs text-gray-600 dark:text-gray-400 break-words">
																{(() => {
																	const parts = [];
																	if (point.streetName) parts.push(point.streetName);
																	if (point.areaName) parts.push(point.areaName);
																	if (point.city) parts.push(point.city);
																	if (point.building) parts.push(point.building);
																	
																	return parts.length > 0 
																		? parts.join(", ") 
																		: (isArabic ? "الموقع محدد" : "Location selected");
																})()}
															</p>
															{point.additionalDetails && (
																<p className="text-xs text-gray-500 dark:text-gray-500 mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
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
												<div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
													<div className="flex items-start gap-2">
														<div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
															<span className="text-white text-xs font-semibold">
																	{pickupPoints.length + idx + 1}
																</span>
								</div>
														<div className="flex-1 min-w-0">
															<div className="flex items-center gap-2 mb-1">
																<span className="text-xs font-semibold text-orange-700 dark:text-orange-400 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/50 rounded">
																	{isArabic ? "توصيل" : "DROPOFF"}
																</span>
							</div>
															<p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
																{point.label}
															</p>
															<p className="text-xs text-gray-600 dark:text-gray-400 break-words mb-2">
																{(() => {
																	const parts = [];
																	if (point.streetName) parts.push(point.streetName);
																	if (point.areaName) parts.push(point.areaName);
																	if (point.city) parts.push(point.city);
																	if (point.building) parts.push(point.building);
																	
																	return parts.length > 0 
																		? parts.join(", ") 
																		: (isArabic ? "الموقع محدد" : "Location selected");
																})()}
															</p>
															{point.recipientName && (
																<div className="text-xs space-y-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
																	<div className="flex items-center gap-1.5">
																		<UserCircle className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
																		<span className="font-medium text-gray-900 dark:text-white">
																			{point.recipientName}
																		</span>
																	</div>
																	<div className="flex items-center gap-1.5">
																		<Phone className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
																		<span className="font-mono text-gray-700 dark:text-gray-300 text-left" dir="ltr">
																			{point.recipientPhone}
																		</span>
																	</div>
																</div>
															)}
															{point.additionalDetails && (
																<p className="text-xs text-gray-500 dark:text-gray-500 mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
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
							)}

							{/* Multi-Direction Segments - Enhanced Design */}
							{isMultiDirection && routeSegments && routeSegments.length > 0 ? (
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									className="relative group"
								>
									<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
												<Navigation className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
											</div>
											<div>
												<h2 className="text-base font-semibold text-gray-900 dark:text-white">
													{isArabic ? "المسارات" : "Route Segments"}
												</h2>
												<span className="text-xs text-gray-500 dark:text-gray-400">
													{routeSegments.length} {isArabic ? "مسار" : "segment"}{routeSegments.length > 1 ? (isArabic ? "" : "s") : ""}
												</span>
											</div>
										</div>

										{/* Segments List */}
										<div className="space-y-3">
											{routeSegments.map((segment, segmentIndex) => (
												<div
													key={segment.id}
													className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
												>
													{/* Segment Header */}
													<div className="mb-3">
														<span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
															{isArabic ? `المسار ${segmentIndex + 1}` : `Segment ${segmentIndex + 1}`}
														</span>
													</div>

													{/* Package Type/Title */}
													{segment.packageDetails?.description && (
														<div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
															<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
																{isArabic ? "نوع الطرد" : "Package Type"}
															</p>
															<p className="text-sm font-medium text-gray-900 dark:text-white">
																{segment.packageDetails.description}
																					</p>
																				</div>
																			)}

													{/* Pickup */}
													<div className="mb-2">
														<p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
															{isArabic ? "التقاط" : "Pickup"}
														</p>
														<p className="text-sm font-medium text-gray-900 dark:text-white">
															{segment.pickupPoint.streetName || segment.pickupPoint.areaName || segment.pickupPoint.city || (isArabic ? "موقع الالتقاط" : "Pickup Location")}
														</p>
														{segment.pickupPoint.city && (
															<p className="text-xs text-gray-500 dark:text-gray-400">
																{segment.pickupPoint.city}
															</p>
														)}
													</div>

													{/* Dropoff */}
													<div>
														<p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
															{isArabic ? "توصيل" : "Dropoff"}
														</p>
														<p className="text-sm font-medium text-gray-900 dark:text-white">
															{segment.dropoffPoint.streetName || segment.dropoffPoint.areaName || segment.dropoffPoint.city || (isArabic ? "موقع التوصيل" : "Dropoff Location")}
														</p>
														{segment.dropoffPoint.city && (
															<p className="text-xs text-gray-500 dark:text-gray-400">
																{segment.dropoffPoint.city}
															</p>
														)}
													</div>
																						</div>
											))}
										</div>
									</div>
								</motion.div>
							) : (
								/* Package Details - Single Package (Old Format) */
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4 }}
									className="relative group"
								>
									<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
												<Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
											</div>
											<div>
												<h2 className="text-base font-semibold text-gray-900 dark:text-white">
													{isArabic ? "تفاصيل الطرود" : "Package Details"}
												</h2>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{isArabic ? "معلومات الشحنة" : "Shipment info"}
												</p>
											</div>
										</div>

										{orderData ? (
										// Fallback to old format for backward compatibility
										<div className="space-y-3">
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
												{orderData.packageDescription && (
													<div className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
														<div className="flex items-center gap-2 mb-1">
															<div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded">
																<Package className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
															</div>
															<p className="text-xs text-gray-500 dark:text-gray-400">
																{isArabic ? "الوصف" : "Description"}
															</p>
														</div>
														<p className="text-sm font-semibold text-gray-900 dark:text-white">
															{orderData.packageDescription}
														</p>
													</div>
												)}

												{orderData.packageWeight && (
													<div className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
														<div className="flex items-center gap-2 mb-1">
															<div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
																<Weight className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />
															</div>
															<p className="text-xs text-gray-500 dark:text-gray-400">
																{isArabic ? "الوزن" : "Weight"}
															</p>
														</div>
														<p className="text-sm font-semibold text-gray-900 dark:text-white">
															{orderData.packageWeight} <span className="text-xs">{isArabic ? "كجم" : "kg"}</span>
														</p>
													</div>
												)}
											</div>

											{orderData.packageDimensions && (
												<div className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
													<div className="flex items-center gap-2 mb-1">
														<div className="p-1 bg-teal-100 dark:bg-teal-900/30 rounded">
															<Ruler className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
														</div>
														<p className="text-xs text-gray-500 dark:text-gray-400">
															{isArabic ? "الأبعاد" : "Dimensions"}
														</p>
													</div>
													<p className="text-sm font-semibold text-gray-900 dark:text-white">
														{orderData.packageDimensions} <span className="text-xs">{isArabic ? "سم" : "cm"}</span>
													</p>
												</div>
											)}

											{orderData.specialInstructions && (
												<div className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
													<div className="flex items-center gap-2 mb-1.5">
														<div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
															<FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
														</div>
														<p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
															{isArabic ? "ملاحظات خاصة" : "Special Instructions"}
														</p>
													</div>
													<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
														{orderData.specialInstructions}
													</p>
												</div>
											)}

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
									) : null}
								</div>
							</motion.div>
							)}
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
								<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
									<div className="flex items-center gap-2 mb-4">
										<div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
											<Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
								</div>
										<h3 className="text-base font-semibold text-gray-900 dark:text-white">
											{isArabic ? "ملخص التكلفة" : "Cost Summary"}
										</h3>
								</div>

									<div className="space-y-3">
										{/* Distance */}
										<div className="pb-3 border-b border-gray-200 dark:border-gray-700">
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
												{isArabic ? "المسافة" : "Distance"}
											</p>
											<p className="text-lg font-semibold text-gray-900 dark:text-white">
												{totalDistance} <span className="text-sm text-gray-500">{isArabic ? "كم" : "km"}</span>
											</p>
						</div>

										{/* Estimated Fee */}
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
													{isArabic ? "الرسوم المتوقعة" : "Estimated Fee"}
											</p>
											<p className="text-2xl font-bold text-gray-900 dark:text-white">
												{deliveryFee} <span className="text-sm text-gray-500">{isArabic ? "ريال" : "SAR"}</span>
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
									<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
										<div className="flex items-center gap-3 mb-4">
											<div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
												<VehicleIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
											</div>
											<div>
												<h3 className="text-base font-semibold text-gray-900 dark:text-white">
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
												<div className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
													<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
														{isArabic ? "نوع الشاحنة" : "Truck Type"}
													</p>
													<p className="text-sm font-semibold text-gray-900 dark:text-white">
														{getTruckTypeName(orderData.truckType)}
													</p>
												</div>
											)}

											{orderData.cargoType && (
												<div className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-2">
													<div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
														<Box className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
													</div>
													<span className="text-xs text-gray-700 dark:text-gray-300">
														{isArabic ? "البضاعة:" : "Cargo:"} <strong className="font-semibold">{orderData.cargoType}</strong>
													</span>
												</div>
											)}

											{orderData.packageType && (
												<div className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center gap-2">
													<div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded">
														<Package className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
													</div>
													<span className="text-xs text-gray-700 dark:text-gray-300">
														{isArabic ? "الطرد:" : "Package:"} <strong className="font-semibold">{orderData.packageType}</strong>
													</span>
												</div>
											)}

											{orderData.isFragile && (
												<div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center gap-2">
													<div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded">
														<AlertTriangle className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
													</div>
													<span className="text-xs text-orange-700 dark:text-orange-300 font-semibold">
														{isArabic ? "بضاعة قابلة للكسر" : "Fragile Items"}
													</span>
												</div>
											)}

											{orderData.requiresRefrigeration && (
												<div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
													<div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
														<Box className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
													</div>
													<span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
														{isArabic ? "يتطلب تبريد" : "Refrigeration Required"}
													</span>
												</div>
											)}

											{orderData.loadingEquipmentNeeded && (
												<div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg flex items-center gap-2">
													<div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
														<Truck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
													</div>
													<span className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
														{isArabic ? "معدات تحميل" : "Loading Equipment"}
													</span>
												</div>
											)}

											{orderData.isDocuments && (
												<div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-2">
													<div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
														<FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
													</div>
													<span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
														{isArabic ? "مستندات مهمة" : "Important Documents"}
													</span>
												</div>
											)}

											{orderData.isExpress && (
												<div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
													<div className="p-1 bg-red-100 dark:bg-red-900/30 rounded">
														<Clock className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
													</div>
													<span className="text-xs text-red-700 dark:text-red-300 font-semibold">
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
							className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm sm:text-base"
						>
							<Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
							<span>{isArabic ? "تعديل التفاصيل" : "Edit Details"}</span>
						</button>

						{/* Driver Selection - One Row */}
						<div className="flex flex-row gap-2 sm:gap-3 w-full">
							{/* Platform Auto */}
							<button
								onClick={handlePlatformRecommendation}
								disabled={isAutoSelectLoading}
								className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
							>
								{isAutoSelectLoading ? (
									<Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 animate-spin" />
								) : (
									<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
								)}
								<span className="truncate">
									{isAutoSelectLoading 
										? (isArabic ? "جاري الاختيار..." : "Selecting...")
										: (isArabic ? "المنصة تختار" : "Auto Select")
									}
								</span>
								{!isAutoSelectLoading && (
									<ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 ${isArabic ? "rotate-180" : ""}`} />
								)}
							</button>

							{/* Manual Selection */}
							<button
								onClick={handleChooseDriver}
								className="flex-1 flex items-center justify-center gap-2 px-3 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
							>
								<span className="truncate">{isArabic ? "أختار بنفسي" : "I Choose Myself"}</span>
								<ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 ${isArabic ? "rotate-180" : ""}`} />
							</button>
						</div>
					</div>

					{/* Info Notice */}
					<div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
						<div className="flex items-start gap-2">
							<div className="p-1 bg-green-100 dark:bg-green-900/30 rounded flex-shrink-0">
								<CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
							</div>
							<p className="text-xs text-gray-600 dark:text-gray-400">
								{isArabic
									? "ستتمكن من مراجعة السعر النهائي بعد اختيار السائق"
									: "You'll review the final price after selecting a driver"}
							</p>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Loading Overlay for Auto Select */}
			<AnimatePresence>
				{isAutoSelectLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							transition={{ duration: 0.15 }}
							className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4"
						>
							<Loader2 className="w-12 h-12 text-[#31A342] dark:text-[#4ade80] animate-spin" />
							<p className="text-lg font-bold text-gray-900 dark:text-white">
								{isArabic ? "جاري اختيار أفضل سائق..." : "Selecting best driver..."}
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

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
