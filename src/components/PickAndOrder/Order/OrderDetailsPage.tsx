"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	MapPin,
	User,
	Phone,
	Loader2,
	X,
	Upload,
	Navigation,
	AlertCircle,
	CheckCircle2,
	Building2,
	Truck,
	Bike,
	ChevronRight,
	Plus,
} from "lucide-react";
import { useJsApiLoader } from "@react-google-maps/api";
import { MAP_CONFIG } from "@/lib/maps/utils";
import { getGeocoder } from "@/lib/maps/utils";
import { parseAddressComponents } from "./utils/addressParser";
import Image from "next/image";
import { LocationPointCard, VehicleSpecificFields, MobileMapSection, PackageDetailsSection } from "./components";
import PhoneInputField from "@/components/Utils/PhoneInput";

interface OrderDetailsPageProps {
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

interface ValidationErrors {
	[key: string]: string;
}

export default function OrderDetailsPage({ transportType, orderType }: OrderDetailsPageProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMultiDirection = orderType === "multi-direction";
	const isMotorbike = transportType === "motorbike";

	// User info - try to get from localStorage or use default
	const currentUser = useMemo(() => {
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
		
		// Fallback
		return {
			name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
			phone: "+966 50 123 4567",
		};
	}, [isArabic]);

	// Location points for multi-direction
	const [locationPoints, setLocationPoints] = useState<LocationPoint[]>([
		{
			id: "pickup-1",
			type: "pickup",
			label: isArabic ? "نقطة الالتقاط الأولى" : "first pickup point",
			location: null,
			streetName: "",
			areaName: "",
			city: "",
			building: "",
			additionalDetails: "",
			buildingPhoto: null,
			recipientName: "",
			recipientPhone: "",
		},
		{
			id: "dropoff-1",
			type: "dropoff",
			label: isArabic ? "نقطة التوصيل الأولى" : "first dropoff point",
			location: null,
			streetName: "",
			areaName: "",
			city: "",
			building: "",
			additionalDetails: "",
			buildingPhoto: null,
			recipientName: "",
			recipientPhone: "",
		},
	]);

	const [activePointId, setActivePointId] = useState<string>(locationPoints[0].id);

	// Package details
	const [packageDescription, setPackageDescription] = useState("");
	const [packageWeight, setPackageWeight] = useState("");
	const [packageDimensions, setPackageDimensions] = useState("");
	const [specialInstructions, setSpecialInstructions] = useState("");
	const [packageImages, setPackageImages] = useState<string[]>([]);
	const [packageVideo, setPackageVideo] = useState<string | null>(null);

	// Vehicle-specific fields - Truck
	const [truckType, setTruckType] = useState("");
	const [cargoType, setCargoType] = useState("");
	const [isFragile, setIsFragile] = useState(false);
	const [requiresRefrigeration, setRequiresRefrigeration] = useState(false);
	const [loadingEquipmentNeeded, setLoadingEquipmentNeeded] = useState(false);

	// Vehicle-specific fields - Motorbike
	const [packageType, setPackageType] = useState("");
	const [isDocuments, setIsDocuments] = useState(false);
	const [isExpress, setIsExpress] = useState(false);

	// Return to pickup option (for one-direction orders only)
	const [returnToPickup, setReturnToPickup] = useState(false);

	// UI state
	const [isGeocoding, setIsGeocoding] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
	const [showNotification, setShowNotification] = useState(false);

	const mapRef = useRef<google.maps.Map | null>(null);

	// Load Google Maps
	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: MAP_CONFIG.libraries,
	});

	const defaultCenter = useMemo(() => MAP_CONFIG.defaultCenter, []);

	const mapCenter = useMemo(() => {
		const activePoint = locationPoints.find((p) => p.id === activePointId);
		return activePoint?.location || defaultCenter;
	}, [locationPoints, activePointId, defaultCenter]);

	const activePoint = useMemo(() => {
		return locationPoints.find((p) => p.id === activePointId);
	}, [locationPoints, activePointId]);

	// Validation
	const validateForm = useCallback((): boolean => {
		const newErrors: ValidationErrors = {};

		// Validate all points
		locationPoints.forEach((point) => {
			if (!point.location) {
				newErrors[`${point.id}-location`] = isArabic
					? "يرجى تحديد الموقع"
					: "Please select location";
			}
			if (!point.additionalDetails.trim()) {
				newErrors[`${point.id}-details`] = isArabic
					? "يرجى إضافة تفاصيل"
					: "Please add details";
			}
			if (point.type === "dropoff") {
				if (!point.recipientName.trim()) {
					newErrors[`${point.id}-name`] = isArabic
						? "يرجى إدخال اسم المستلم"
						: "Please enter recipient name";
				}
				if (!point.recipientPhone.trim()) {
					newErrors[`${point.id}-phone`] = isArabic
						? "يرجى إدخال رقم الهاتف"
						: "Please enter phone";
				}
			}
		});

		// Package validation
		if (!packageDescription.trim()) {
			newErrors.packageDescription = isArabic ? "يرجى وصف الطرد" : "Please describe package";
		}
		if (!packageWeight.trim()) {
			newErrors.packageWeight = isArabic ? "يرجى إدخال الوزن" : "Please enter weight";
		}

		// Vehicle-specific validation
		if (transportType === "truck" && !truckType.trim()) {
			newErrors.truckType = isArabic ? "يرجى اختيار نوع الشاحنة" : "Please select truck type";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [locationPoints, packageDescription, packageWeight, transportType, truckType, isArabic]);

	// Handle map click
	const handleMapClick = useCallback(
		async (event: google.maps.MapMouseEvent) => {
			if (!event.latLng || !isLoaded || !activePointId) return;

			const lat = event.latLng.lat();
			const lng = event.latLng.lng();
			const location = { lat, lng };

			// Update active point location
			setLocationPoints((prev) =>
				prev.map((point) =>
					point.id === activePointId ? { ...point, location } : point
				)
			);
			setErrors((prev) => ({ ...prev, [`${activePointId}-location`]: "" }));

			setIsGeocoding(true);

			try {
				const geocoder = getGeocoder();
				if (!geocoder) throw new Error("Geocoder not available");

				const response = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
						geocoder.geocode(
							{
							location,
								language: isArabic ? "ar" : "en",
							},
							(results, status) => {
								if (status === "OK" && results && results.length > 0) {
									resolve(results);
								} else {
									reject(new Error(`Geocoding failed: ${status}`));
								}
							}
						);
				});

				if (response && response.length > 0) {
					const parsedAddress = parseAddressComponents(response[0]);

					setLocationPoints((prev) =>
						prev.map((point) =>
							point.id === activePointId
								? {
										...point,
										streetName: parsedAddress.street,
										areaName: parsedAddress.area,
										city: parsedAddress.city,
										building: parsedAddress.building,
								  }
								: point
						)
					);
				}
			} catch (error) {
				console.error("Geocoding error:", error);
			} finally {
				setIsGeocoding(false);
			}
		},
		[isLoaded, activePointId, isArabic]
	);

	// Add new point
	const handleAddPoint = useCallback(
		(type: "pickup" | "dropoff") => {
			const pointsOfType = locationPoints.filter((p) => p.type === type);
			const newIndex = pointsOfType.length + 1;

			const newPoint: LocationPoint = {
				id: `${type}-${Date.now()}`,
				type,
				label:
					type === "pickup"
						? isArabic
							? `نقطة الالتقاط ${newIndex}`
							: `Pickup Point ${newIndex}`
						: isArabic
						? `نقطة التوصيل ${newIndex}`
						: `Dropoff Point ${newIndex}`,
				location: null,
				streetName: "",
				areaName: "",
				city: "",
				building: "",
				additionalDetails: "",
				buildingPhoto: null,
				recipientName: "",
				recipientPhone: "",
			};

			setLocationPoints((prev) => [...prev, newPoint]);
			setActivePointId(newPoint.id);
		},
		[locationPoints, isArabic]
	);

	// Remove point
	const handleRemovePoint = useCallback(
		(pointId: string) => {
			const point = locationPoints.find((p) => p.id === pointId);
			if (!point) return;

			// Don't allow removing if it's the last point of its type
			const pointsOfType = locationPoints.filter((p) => p.type === point.type);
			if (pointsOfType.length <= 1) return;

			setLocationPoints((prev) => prev.filter((p) => p.id !== pointId));

			if (activePointId === pointId) {
				const remaining = locationPoints.filter((p) => p.id !== pointId);
				if (remaining.length > 0) {
					setActivePointId(remaining[0].id);
				}
			}
		},
		[locationPoints, activePointId]
	);

	// Update point field
	const updatePointField = useCallback(
		(pointId: string, field: keyof LocationPoint, value: any) => {
			setLocationPoints((prev) =>
				prev.map((point) =>
					point.id === pointId ? { ...point, [field]: value } : point
				)
			);
		},
		[]
	);

	// Handle photo upload
	const handlePhotoUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>, pointId: string) => {
			const file = e.target.files?.[0];
			if (!file) return;

			if (file.size > 5 * 1024 * 1024) {
				alert(isArabic ? "حجم الملف يجب أن يكون أقل من 5 ميجابايت" : "File size must be less than 5MB");
				return;
			}

			if (!file.type.startsWith("image/")) {
				alert(isArabic ? "يرجى اختيار صورة فقط" : "Please select an image file only");
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				updatePointField(pointId, "buildingPhoto", reader.result as string);
			};
			reader.readAsDataURL(file);
		},
		[isArabic, updatePointField]
	);

	// Get completion percentage
	const completionPercentage = useMemo(() => {
		const requiredFields: boolean[] = [];
		
		// Location points validation
		locationPoints.forEach((point) => {
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
		requiredFields.push(!!(packageDescription && packageDescription.trim()));
		requiredFields.push(!!(packageWeight && packageWeight.trim()));

		// Vehicle-specific (truck requires truckType)
		if (transportType === "truck") {
			requiredFields.push(!!(truckType && truckType.trim()));
		}

		const completed = requiredFields.filter((field) => field === true).length;
		const total = requiredFields.length;
		
		return total > 0 ? Math.round((completed / total) * 100) : 0;
	}, [locationPoints, packageDescription, packageWeight, transportType, truckType]);

	// Show incomplete notification
	const showIncompleteNotification = useCallback(() => {
		setShowNotification(true);
		const timer = setTimeout(() => {
			setShowNotification(false);
		}, 5000);
		return () => clearTimeout(timer);
	}, []);

	// Handle submit
	const handleSubmit = useCallback(() => {
		// Check completion percentage first
		if (completionPercentage < 100) {
			showIncompleteNotification();
			// Also run validation to show field errors
			validateForm();
			return;
		}

		// If validation passes, proceed
		if (validateForm()) {
			setIsSubmitting(true);

			// Store data in sessionStorage for summary page
			const orderData = {
				transportType,
				orderType,
				locationPoints,
				packageDescription,
				packageWeight,
				packageDimensions,
				specialInstructions,
				packageImages,
				packageVideo,
				returnToPickup: !isMultiDirection ? returnToPickup : false, // Only for one-direction
				// Vehicle-specific data
				...(transportType === "truck"
					? { truckType, cargoType, isFragile, requiresRefrigeration, loadingEquipmentNeeded }
					: { packageType, isDocuments, isExpress }),
			};

			sessionStorage.setItem("pickAndOrderDetails", JSON.stringify(orderData));

			setTimeout(() => {
				router.push(`/pickandorder/${transportType}/order/summary?type=${orderType}`);
			}, 800);
		}
	}, [
		completionPercentage,
		showIncompleteNotification,
		validateForm,
		router,
		transportType,
		orderType,
		locationPoints,
		packageDescription,
		packageWeight,
		packageDimensions,
		specialInstructions,
		packageImages,
		packageVideo,
		truckType,
		cargoType,
		isFragile,
		requiresRefrigeration,
		loadingEquipmentNeeded,
		packageType,
		isDocuments,
		isExpress,
		returnToPickup,
		isMultiDirection,
	]);

	const VehicleIcon = isMotorbike ? Bike : Truck;

	const pickupPoints = locationPoints.filter((p) => p.type === "pickup");
	const dropoffPoints = locationPoints.filter((p) => p.type === "dropoff");

	return (
		<section
			dir={isArabic ? "rtl" : "ltr"}
			className="min-h-screen py-4 sm:py-6 lg:py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
		>
			{/* Notification Toast */}
			<AnimatePresence>
				{showNotification && (
					<motion.div
						initial={{ opacity: 0, y: -50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -20, scale: 0.95 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className={`fixed top-4 ${isArabic ? "left-4 right-auto" : "right-4 left-auto"} z-50 max-w-md w-full sm:w-auto`}
						dir={isArabic ? "rtl" : "ltr"}
					>
					<div className="bg-amber-500 dark:bg-amber-600 text-white rounded-xl shadow-2xl p-4 flex items-start gap-3 border border-amber-400 dark:border-amber-500">
						<div className="p-1.5 bg-white/20 rounded-lg">
							<AlertCircle className="w-5 h-5 flex-shrink-0" />
						</div>
						<div className="flex-1 min-w-0">
							<p className={`text-sm font-bold ${isArabic ? "text-right" : "text-left"} mb-1`}>
								{isArabic
									? `يرجى إكمال جميع الحقول المطلوبة (${completionPercentage}% مكتمل)`
									: `Please complete all required fields (${completionPercentage}% complete)`}
							</p>
							<p className={`text-xs opacity-95 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic
									? "يرجى مراجعة الحقول المميزة بالعلامة الحمراء (*)"
									: "Please review fields marked with red asterisk (*)"}
							</p>
						</div>
						<button
							onClick={() => setShowNotification(false)}
							className="flex-shrink-0 hover:bg-white/20 p-1 rounded-lg transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
				{/* Mobile Header - Compact */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-4 sm:mb-6"
				>
					{/* Title Card - Mobile Optimized */}
					<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 sm:gap-3 mb-2">
									<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#31A342] to-[#2a8f38] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
										<VehicleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
									</div>
									<div className="flex-1 min-w-0">
										<h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
											{isArabic ? "تفاصيل الطلب" : "Order Details"}
										</h1>
										<div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
											<span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-[#31A342]/10 dark:bg-[#31A342]/20 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold text-[#31A342] dark:text-[#4ade80]">
												<Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
												{isMultiDirection
													? isArabic
														? "متعدد"
														: "Multi"
													: isArabic
													? "اتجاه واحد"
													: "One-Way"}
											</span>
											<span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
												<VehicleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
												{isMotorbike
													? isArabic
														? "دراجة"
														: "Bike"
													: isArabic
													? "شاحنة"
													: "Truck"}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Progress Ring - Smaller on Mobile */}
							<div className="flex-shrink-0">
								<div className="relative w-16 h-16 sm:w-20 sm:h-20">
									<svg className="w-full h-full transform -rotate-90">
										<circle
											cx="50%"
											cy="50%"
											r="28"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
											className="text-gray-200 dark:text-gray-700"
										/>
										<circle
											cx="50%"
											cy="50%"
											r="28"
											stroke="currentColor"
											strokeWidth="4"
											fill="none"
											strokeDasharray={`${2 * Math.PI * 28}`}
											strokeDashoffset={`${2 * Math.PI * 28 * (1 - completionPercentage / 100)}`}
											className="text-[#31A342] transition-all duration-500"
											strokeLinecap="round"
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="text-center">
											<div className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100">
												{completionPercentage}%
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Location Points Grid - Mobile Optimized */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-4 sm:mb-6 space-y-3 sm:space-y-4"
				>
					{/* Pickup Points */}
					<div>
						<div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
							<h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
								<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#31A342]" />
								{isArabic ? (isMultiDirection ? "نقاط الالتقاط" : "نقطة الالتقاط") : (isMultiDirection ? "Pickup Points" : "Pickup Point")}
							</h3>
							{/* Only show Add button for multi-direction */}
							{isMultiDirection && (
								<button
									onClick={() => handleAddPoint("pickup")}
									className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#31A342] hover:bg-[#2a8f38] dark:bg-[#4ade80] dark:hover:bg-[#22c55e] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg dark:shadow-lg dark:hover:shadow-xl transition-all flex items-center gap-1 sm:gap-2"
								>
									<Plus className="w-3 h-3 sm:w-4 sm:h-4" />
									<span className="hidden xs:inline">{isArabic ? "إضافة" : "Add"}</span>
								</button>
							)}
						</div>
						<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
							{pickupPoints.map((point, index) => (
								<LocationPointCard
									key={point.id}
									point={point}
									index={index}
									isActive={activePointId === point.id}
									onClick={() => setActivePointId(point.id)}
									onRemove={() => handleRemovePoint(point.id)}
									isArabic={isArabic}
									canRemove={isMultiDirection && pickupPoints.length > 1}
								/>
							))}
						</div>
					</div>

					{/* Dropoff Points */}
					<div>
						<div className="flex items-center justify-between mb-2 sm:mb-3 px-1">
							<h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
								<Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-[#FA9D2B]" />
								{isArabic ? (isMultiDirection ? "نقاط التوصيل" : "نقطة التوصيل") : (isMultiDirection ? "Dropoff Points" : "Dropoff Point")}
							</h3>
							{/* Only show Add button for multi-direction */}
							{isMultiDirection && (
								<button
									onClick={() => handleAddPoint("dropoff")}
									className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#FA9D2B] hover:bg-[#E88D26] dark:bg-[#fb923c] dark:hover:bg-[#f97316] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg dark:shadow-lg dark:hover:shadow-xl transition-all flex items-center gap-1 sm:gap-2"
								>
									<Plus className="w-3 h-3 sm:w-4 sm:h-4" />
									<span className="hidden xs:inline">{isArabic ? "إضافة" : "Add"}</span>
								</button>
							)}
						</div>
						<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
							{dropoffPoints.map((point, index) => (
								<LocationPointCard
									key={point.id}
									point={point}
									index={index}
									isActive={activePointId === point.id}
									onClick={() => setActivePointId(point.id)}
									onRemove={() => handleRemovePoint(point.id)}
									isArabic={isArabic}
									canRemove={isMultiDirection && dropoffPoints.length > 1}
								/>
							))}
						</div>
						</div>
					</motion.div>

				{/* Main Content - Mobile First Layout */}
				<div className="space-y-4 sm:space-y-6">
					{/* Map Section - Full Width on Mobile */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-md border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between mb-3 sm:mb-4">
								<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
									<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#31A342]" />
									{activePoint?.label || (isArabic ? "حدد الموقع" : "Select Location")}
									{isGeocoding && <Loader2 className="w-4 h-4 text-[#31A342] animate-spin" />}
								</h3>
							{activePoint?.location && (
								<span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-green-50 dark:bg-green-900/30 rounded-lg text-xs font-semibold text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
									<CheckCircle2 className="w-3 h-3" />
									<span className="hidden xs:inline">{isArabic ? "تم" : "Done"}</span>
								</span>
							)}
							</div>

							<MobileMapSection
								isLoaded={isLoaded}
								loadError={loadError}
								mapCenter={mapCenter}
								defaultCenter={defaultCenter}
								handleMapClick={handleMapClick}
								isGeocoding={isGeocoding}
								mapRef={mapRef}
								locationSelected={!!activePoint?.location}
								isArabic={isArabic}
								allPoints={locationPoints}
							/>

							{errors[`${activePointId}-location`] && (
								<p className="text-red-500 dark:text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-1 font-semibold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg border border-red-200 dark:border-red-800">
									<AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
									{errors[`${activePointId}-location`]}
								</p>
							)}
						</div>
					</motion.div>

					{/* Address Details Display */}
					{activePoint?.location && (
								<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-200 dark:border-green-800"
						>
							<div className="flex items-start gap-3">
								<div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
									<Building2 className="w-5 h-5 text-white" />
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
										{isArabic ? "العنوان المحدد" : "Selected Address"}
									</h3>
									<div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
										{activePoint.streetName && (
											<p className="break-words">
												<span className="font-semibold">{isArabic ? "الشارع:" : "Street:"}</span> {activePoint.streetName}
											</p>
										)}
										{activePoint.areaName && (
											<p><span className="font-semibold">{isArabic ? "المنطقة:" : "Area:"}</span> {activePoint.areaName}</p>
										)}
										<div className="flex flex-wrap gap-2 sm:gap-4">
											{activePoint.city && (
												<p><span className="font-semibold">{isArabic ? "المدينة:" : "City:"}</span> {activePoint.city}</p>
											)}
											{activePoint.building && (
												<p><span className="font-semibold">{isArabic ? "المبنى:" : "Building:"}</span> {activePoint.building}</p>
											)}
										</div>
									</div>
										</div>
									</div>
								</motion.div>
							)}

					{/* Point Details Form */}
								<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-gray-700">
							{/* Sender/Recipient Info */}
							{activePoint?.type === "pickup" ? (
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800 mb-4">
									<div className="flex items-start gap-3">
										<div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
											<User className="w-5 h-5 text-white" />
										</div>
										<div className="flex-1">
											<h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
												{isArabic ? "معلومات المرسل" : "Sender Information"}
											</h4>
											<div className="space-y-1.5">
												<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
													<User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
													<span className="font-semibold truncate">{currentUser.name}</span>
												</div>
												<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
													<Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
													<span className="font-mono">{currentUser.phone}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="mb-4">
									<h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
										<User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400" />
										{isArabic ? "معلومات المستلم" : "Recipient Information"}
									</h4>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
										<div>
											<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
												{isArabic ? "اسم المستلم" : "Name"}
												<span className="text-red-500 ml-1">*</span>
											</label>
											<input
												type="text"
												value={activePoint?.recipientName || ""}
												onChange={(e) => updatePointField(activePointId!, "recipientName", e.target.value)}
												onBlur={() => setTouched((prev) => ({ ...prev, [`${activePointId}-name`]: true }))}
												placeholder={isArabic ? "أدخل الاسم" : "Enter name"}
												className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 ${
													touched[`${activePointId}-name`] && errors[`${activePointId}-name`]
														? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
														: "border-gray-200 dark:border-gray-700 focus:border-[#31A342] dark:focus:border-[#4ade80]"
												} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none transition-colors`}
											/>
											{touched[`${activePointId}-name`] && errors[`${activePointId}-name`] && (
												<p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
													<AlertCircle className="w-3 h-3" />
													{errors[`${activePointId}-name`]}
												</p>
											)}
										</div>
										<div>
											<PhoneInputField
												label={isArabic ? "رقم الهاتف" : "Phone"}
												value={activePoint?.recipientPhone || ""}
												onChange={(phone) => {
													updatePointField(activePointId!, "recipientPhone", phone);
													setTouched((prev) => ({ ...prev, [`${activePointId}-phone`]: true }));
												}}
												isArabic={isArabic}
												required={true}
												name={`${activePointId}-phone`}
												error={touched[`${activePointId}-phone`] && errors[`${activePointId}-phone`] ? errors[`${activePointId}-phone`] : undefined}
												disabled={false}
											/>
										</div>
									</div>
								</div>
							)}

							{/* Additional Details */}
							<div className="space-y-3 sm:space-y-4">
								<div>
									<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
										{isArabic ? "تفاصيل إضافية (رقم الشقة، المدخل، إلخ)" : "Additional Details (Apt #, Entrance, etc.)"}
										<span className="text-red-500 ml-1">*</span>
									</label>
									<textarea
										value={activePoint?.additionalDetails || ""}
										onChange={(e) => updatePointField(activePointId!, "additionalDetails", e.target.value)}
										onBlur={() => setTouched((prev) => ({ ...prev, [`${activePointId}-details`]: true }))}
										rows={3}
										placeholder={isArabic ? "مثال: الشقة 12، الطابق الثالث" : "Example: Apt 12, 3rd floor"}
										className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 ${
											touched[`${activePointId}-details`] && errors[`${activePointId}-details`]
												? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
												: "border-gray-200 dark:border-gray-700 focus:border-[#31A342] dark:focus:border-[#4ade80]"
										} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none transition-colors`}
									/>
									{touched[`${activePointId}-details`] && errors[`${activePointId}-details`] && (
										<p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
											<AlertCircle className="w-3 h-3" />
											{errors[`${activePointId}-details`]}
										</p>
									)}
								</div>

								{/* Building Photo */}
								<div>
									<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
										{isArabic ? "صورة المبنى (اختياري)" : "Building Photo (Optional)"}
									</label>
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handlePhotoUpload(e, activePointId!)}
										className="hidden"
										id={`photo-${activePointId}`}
									/>
									{!activePoint?.buildingPhoto ? (
										<label
											htmlFor={`photo-${activePointId}`}
											className="block w-full px-3 py-4 sm:px-4 sm:py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:border-[#31A342] dark:hover:border-[#4ade80] transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-[#31A342]/5 dark:hover:bg-[#31A342]/10"
										>
											<div className="flex flex-col items-center gap-2">
												<Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
												<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">
													{isArabic ? "انقر لرفع صورة" : "Click to upload photo"}
												</span>
												<span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
													{isArabic ? "PNG, JPG حتى 5MB" : "PNG, JPG up to 5MB"}
												</span>
											</div>
										</label>
									) : (
										<div className="relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
											<Image
												src={activePoint.buildingPhoto}
												alt="Building"
												width={400}
												height={300}
												className="w-full h-32 sm:h-48 object-cover"
											/>
											<button
												onClick={() => updatePointField(activePointId!, "buildingPhoto", null)}
												className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg"
											>
												<X className="w-3 h-3 sm:w-4 sm:h-4" />
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					</motion.div>

					{/* Package Details */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<PackageDetailsSection
							isArabic={isArabic}
							packageDescription={packageDescription}
							setPackageDescription={setPackageDescription}
							packageWeight={packageWeight}
							setPackageWeight={setPackageWeight}
							packageDimensions={packageDimensions}
							setPackageDimensions={setPackageDimensions}
							specialInstructions={specialInstructions}
							setSpecialInstructions={setSpecialInstructions}
							images={packageImages}
							setImages={setPackageImages}
							video={packageVideo}
							setVideo={setPackageVideo}
							errors={errors}
							touched={touched}
							setTouched={setTouched}
						/>
					</motion.div>

					{/* Vehicle-Specific Fields */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						<VehicleSpecificFields
							transportType={isMotorbike ? "motorbike" : "truck"}
							isArabic={isArabic}
							truckType={truckType}
							setTruckType={setTruckType}
							cargoType={cargoType}
							setCargoType={setCargoType}
							isFragile={isFragile}
							setIsFragile={setIsFragile}
							requiresRefrigeration={requiresRefrigeration}
							setRequiresRefrigeration={setRequiresRefrigeration}
							loadingEquipmentNeeded={loadingEquipmentNeeded}
							setLoadingEquipmentNeeded={setLoadingEquipmentNeeded}
							packageType={packageType}
							setPackageType={setPackageType}
							isDocuments={isDocuments}
							setIsDocuments={setIsDocuments}
							isExpress={isExpress}
							setIsExpress={setIsExpress}
						/>
					</motion.div>

					{/* Return to Pickup Option - Only for one-direction orders */}
					{!isMultiDirection && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.55 }}
							className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
						>
							<div className="flex items-start gap-3">
								<input
									type="checkbox"
									id="returnToPickup"
									checked={returnToPickup}
									onChange={(e) => setReturnToPickup(e.target.checked)}
									className="mt-1 w-5 h-5 text-[#31A342] bg-gray-100 border-gray-300 rounded focus:ring-[#31A342] focus:ring-2 cursor-pointer"
								/>
								<label htmlFor="returnToPickup" className="flex-1 cursor-pointer">
									<div className="flex items-center gap-2 mb-1">
										<Navigation className="w-5 h-5 text-[#31A342]" />
										<span className="text-base font-semibold text-gray-900 dark:text-gray-100">
											{isArabic ? "العودة إلى نقطة الالتقاط" : "Return to Pickup Location"}
										</span>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{isArabic
											? "هل تريد أن يعود السائق إلى نقطة الالتقاط بعد التوصيل؟"
											: "Do you want the driver to return to the pickup location after delivery?"}
									</p>
								</label>
							</div>
						</motion.div>
					)}

					{/* Submit Button - Sticky on Mobile */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className="sticky bottom-4 sm:bottom-6 z-10"
					>
						<button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[#31A342] to-[#2a8f38] hover:from-[#2a8f38] hover:to-[#258533] disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 text-white text-sm sm:text-base font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
									<span>{isArabic ? "جاري المعالجة..." : "Processing..."}</span>
								</>
							) : (
								<>
									<span>{isArabic ? "متابعة إلى الملخص" : "Continue to Summary"}</span>
									<ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isArabic ? "rotate-180" : ""}`} />
								</>
							)}
						</button>
					</motion.div>
				</div>
			</div>
		</section>
	);
}


