"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	Loader2,
	ChevronRight,
	ChevronLeft,
	Plus,
	Truck,
	Bike,
	Check,
	Navigation,
	Info,
	X,
	AlertCircle,
} from "lucide-react";
import { useJsApiLoader } from "@react-google-maps/api";
import { MAP_CONFIG } from "@/lib/maps/utils";
import {
	SegmentCard,
	VehicleSpecificFields,
	SegmentDetailsModal,
} from "./components";
import type {
	RouteSegment,
	ValidationErrors,
	VehicleOptions,
	MotorbikeOptions,
} from "./types/routeSegment";

interface OrderDetailsPageMultiDirectionProps {
	transportType: string;
	orderType: string;
}

type Step = "plan-route" | "vehicle-options";

export default function OrderDetailsPageMultiDirection({
	transportType,
	orderType,
}: OrderDetailsPageMultiDirectionProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMultiDirection = orderType === "multi-direction";
	const isMotorbike = transportType === "motorbike";

	// Current user - try to get from localStorage or use default
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

	// Step management
	const [currentStep, setCurrentStep] = useState<Step>("plan-route");

	// Route segments - Initialize with sender info
	const [routeSegments, setRouteSegments] = useState<RouteSegment[]>(() => {
		const initialSegment = createEmptySegment(0, isArabic);
		// Auto-populate sender's info for the first pickup point
		return [{
			...initialSegment,
			pickupPoint: {
				...initialSegment.pickupPoint,
				contactName: currentUser.name,
				contactPhone: currentUser.phone,
			},
		}];
	});

	// Vehicle options
	const [vehicleOptions, setVehicleOptions] = useState<VehicleOptions>({
		truckType: "",
		cargoType: "",
		isFragile: false,
		requiresRefrigeration: false,
		loadingEquipmentNeeded: false,
		deliveryPreference: "standard",
		additionalEquipment: {
			loadingRamp: false,
			straps: false,
			movingBlankets: false,
		},
	});

	const [motorbikeOptions, setMotorbikeOptions] = useState<MotorbikeOptions>({
		packageType: "",
		isDocuments: false,
		isExpress: false,
	});

	// Return to pickup option (for one-direction orders only)
	const [returnToPickup, setReturnToPickup] = useState(false);

	// UI state
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
	const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);
	const [showReturnNotification, setShowReturnNotification] = useState(false);
	const [showIncompleteNotification, setShowIncompleteNotification] = useState(false);

	// Load Google Maps for modal
	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: MAP_CONFIG.libraries,
	});

	const defaultCenter = useMemo(() => MAP_CONFIG.defaultCenter, []);

	// Load existing data from sessionStorage if available (when editing)
	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				const savedData = sessionStorage.getItem("pickAndOrderDetails");
				if (savedData) {
					const parsedData = JSON.parse(savedData);
					
					// Check if this is multi-direction data with routeSegments
					if (parsedData.routeSegments && Array.isArray(parsedData.routeSegments)) {
						// Auto-populate sender's phone for pickup points if missing
						const segmentsWithSenderPhone = parsedData.routeSegments.map((segment: RouteSegment) => ({
							...segment,
							pickupPoint: {
								...segment.pickupPoint,
								// If contactPhone is empty, use currentUser's phone (sender's phone)
								contactPhone: segment.pickupPoint.contactPhone || currentUser.phone,
								// If contactName is empty, use currentUser's name (sender's name)
								contactName: segment.pickupPoint.contactName || currentUser.name,
							},
						}));
						
						setRouteSegments(segmentsWithSenderPhone);
						
						// Restore vehicle options
						if (isMotorbike && parsedData.vehicleOptions) {
							setMotorbikeOptions(parsedData.vehicleOptions);
						} else if (!isMotorbike && parsedData.vehicleOptions) {
							setVehicleOptions(parsedData.vehicleOptions);
						}
						
						// Restore return to pickup option (for one-direction only)
						if (!isMultiDirection && parsedData.returnToPickup !== undefined) {
							setReturnToPickup(parsedData.returnToPickup);
						}
						
						console.log("Restored order data from sessionStorage with sender info:", segmentsWithSenderPhone);
					}
				}
			} catch (error) {
				console.error("Error loading saved order data:", error);
			}
		}
	}, [isMotorbike, isMultiDirection, currentUser]);

	// Segment completion calculation
	const getSegmentCompletion = useCallback((segment: RouteSegment): number => {
		const requiredFields = [
			!!segment.pickupPoint.location,
			!!segment.pickupPoint.additionalDetails.trim(),
			!!segment.dropoffPoint.location,
			!!segment.dropoffPoint.contactName.trim(),
			!!segment.dropoffPoint.contactPhone.trim(),
			!!segment.dropoffPoint.additionalDetails.trim(),
			!!segment.packageDetails.description.trim(),
			!!segment.packageDetails.weight.trim(),
		];

		const completed = requiredFields.filter(Boolean).length;
		return Math.round((completed / requiredFields.length) * 100);
	}, []);

	// Overall completion
	const overallCompletion = useMemo(() => {
		if (routeSegments.length === 0) return 0;
		const totalCompletion = routeSegments.reduce((sum, segment) => sum + getSegmentCompletion(segment), 0);
		return Math.round(totalCompletion / routeSegments.length);
	}, [routeSegments, getSegmentCompletion]);

	// Add new segment
	const handleAddSegment = useCallback(() => {
		const newSegment = createEmptySegment(routeSegments.length, isArabic);
		// Auto-populate sender's info for the new pickup point
		const segmentWithSenderInfo = {
			...newSegment,
			pickupPoint: {
				...newSegment.pickupPoint,
				contactName: currentUser.name,
				contactPhone: currentUser.phone,
			},
		};
		setRouteSegments((prev) => [...prev, segmentWithSenderInfo]);
	}, [routeSegments.length, isArabic, currentUser]);

	// Remove segment
	const handleRemoveSegment = useCallback(
		(index: number) => {
			if (routeSegments.length <= 1) return;
			setRouteSegments((prev) => prev.filter((_, i) => i !== index));
		},
		[routeSegments.length]
	);

	// Update segment
	const handleUpdateSegment = useCallback(
		(updates: Partial<RouteSegment>, segmentIndex: number) => {
			setRouteSegments((prev) =>
				prev.map((segment, index) =>
					index === segmentIndex ? { ...segment, ...updates } : segment
				)
			);
		},
		[]
	);

	// Update phone number for pickup or dropoff point
	const handleUpdatePhone = useCallback(
		(segmentIndex: number, pointType: "pickup" | "dropoff", phone: string) => {
			setRouteSegments((prev) =>
				prev.map((segment, index) => {
					if (index === segmentIndex) {
						if (pointType === "pickup") {
							return {
								...segment,
								pickupPoint: {
									...segment.pickupPoint,
									contactPhone: phone,
								},
							};
						} else {
							return {
								...segment,
								dropoffPoint: {
									...segment.dropoffPoint,
									contactPhone: phone,
								},
							};
						}
					}
					return segment;
				})
			);
		},
		[]
	);

	// Validation
	const validateSegment = useCallback(
		(segment: RouteSegment): ValidationErrors => {
			const segmentErrors: ValidationErrors = {};

			// Pickup validation
			if (!segment.pickupPoint.location) {
				segmentErrors[`${segment.id}-pickup-location`] = isArabic ? "حدد موقع الالتقاط" : "Select pickup location";
			}
			if (!segment.pickupPoint.additionalDetails.trim()) {
				segmentErrors[`${segment.id}-pickup-details`] = isArabic ? "أدخل تفاصيل الموقع" : "Enter location details";
			}

			// Dropoff validation
			if (!segment.dropoffPoint.location) {
				segmentErrors[`${segment.id}-dropoff-location`] = isArabic ? "حدد موقع التوصيل" : "Select dropoff location";
			}
			if (!segment.dropoffPoint.contactName.trim()) {
				segmentErrors[`${segment.id}-dropoff-name`] = isArabic ? "أدخل اسم المستلم" : "Enter recipient name";
			}
			if (!segment.dropoffPoint.contactPhone.trim()) {
				segmentErrors[`${segment.id}-dropoff-phone`] = isArabic ? "أدخل رقم الهاتف" : "Enter phone";
			}
			if (!segment.dropoffPoint.additionalDetails.trim()) {
				segmentErrors[`${segment.id}-dropoff-details`] = isArabic ? "أدخل تفاصيل الموقع" : "Enter location details";
			}

			// Package validation
			if (!segment.packageDetails.description.trim()) {
				segmentErrors[`${segment.id}-package-description`] = isArabic ? "صف الطرد" : "Describe package";
			}
			if (!segment.packageDetails.weight.trim()) {
				segmentErrors[`${segment.id}-package-weight`] = isArabic ? "أدخل الوزن" : "Enter weight";
			}

			return segmentErrors;
		},
		[isArabic]
	);

	// Check if vehicle options are complete
	const isVehicleOptionsComplete = useMemo(() => {
		if (isMotorbike) {
			// For motorbike, packageType is required
			return !!motorbikeOptions.packageType;
		} else {
			// For truck, truckType is required
			return !!vehicleOptions.truckType;
		}
	}, [isMotorbike, vehicleOptions.truckType, motorbikeOptions.packageType]);

	const validateAllSegments = useCallback((): boolean => {
		let allErrors: ValidationErrors = {};

		routeSegments.forEach((segment) => {
			const segmentErrors = validateSegment(segment);
			allErrors = { ...allErrors, ...segmentErrors };
		});

		// Vehicle validation
		if (transportType === "truck" && !vehicleOptions.truckType) {
			allErrors.truckType = isArabic ? "اختر نوع الشاحنة" : "Select truck type";
		}
		if (transportType === "motorbike" && !motorbikeOptions.packageType) {
			allErrors.packageType = isArabic ? "اختر نوع الطرد" : "Select package type";
		}

		setErrors(allErrors);
		return Object.keys(allErrors).length === 0;
	}, [routeSegments, transportType, vehicleOptions.truckType, motorbikeOptions.packageType, validateSegment, isArabic]);

	// Final submit - defined before goToNextStep to avoid hoisting issues
	const handleFinalSubmit = useCallback(() => {
		if (!validateAllSegments()) {
			return;
		}

		setIsSubmitting(true);

		// Store multi-direction order data
		const orderData = {
			transportType,
			orderType,
			routeSegments,
			vehicleOptions: isMotorbike ? motorbikeOptions : vehicleOptions,
			returnToPickup: !isMultiDirection ? returnToPickup : false, // Only for one-direction
			createdAt: new Date().toISOString(),
		};

		sessionStorage.setItem("pickAndOrderDetails", JSON.stringify(orderData));

		setTimeout(() => {
			router.push(`/pickandorder/${transportType}/order/summary?type=${orderType}`);
		}, 800);
	}, [validateAllSegments, transportType, orderType, routeSegments, vehicleOptions, motorbikeOptions, isMotorbike, returnToPickup, isMultiDirection, router]);

	// Navigation
	const goToNextStep = useCallback(() => {
		if (currentStep === "plan-route") {
			// For multi-direction orders, check if all segments are complete before proceeding
			if (isMultiDirection && overallCompletion < 100) {
				setShowIncompleteNotification(true);
				setTimeout(() => setShowIncompleteNotification(false), 5000);
				return;
			}
			setCurrentStep("vehicle-options");
		} else if (currentStep === "vehicle-options") {
			// Check if all segments are complete before submitting
			if (overallCompletion < 100) {
				setShowIncompleteNotification(true);
				setTimeout(() => setShowIncompleteNotification(false), 5000);
				return;
			}
			handleFinalSubmit();
		}
	}, [currentStep, handleFinalSubmit, overallCompletion, isMultiDirection]);

	const goToPreviousStep = useCallback(() => {
		if (currentStep === "vehicle-options") {
			setCurrentStep("plan-route");
		}
	}, [currentStep]);

	const VehicleIcon = isMotorbike ? Bike : Truck;

	return (
		<section
			dir={isArabic ? "rtl" : "ltr"}
			className="min-h-screen py-4 sm:py-6 lg:py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800"
		>
			{/* Return to Pickup Notification */}
			<AnimatePresence>
				{showReturnNotification && (
					<motion.div
						initial={{ opacity: 0, y: -50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -20, scale: 0.95 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className={`fixed top-2 sm:top-4 ${isArabic ? "left-2 right-2 sm:left-4 sm:right-auto" : "right-2 left-2 sm:right-4 sm:left-auto"} z-50 w-[calc(100%-1rem)] sm:w-auto sm:max-w-md`}
						dir={isArabic ? "rtl" : "ltr"}
					>
						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 flex items-start gap-2 sm:gap-3 backdrop-blur-sm">
							<div className="p-1.5 sm:p-2 bg-blue-500 dark:bg-blue-600 rounded-lg sm:rounded-xl flex-shrink-0">
								<Info className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="text-sm sm:text-base md:text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">
									{isArabic ? "تم تفعيل العودة" : "Return Trip Activated"}
								</h3>
								<p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
									{isArabic
										? "سيقوم السائق بالعودة إلى نقطة الالتقاط بعد إتمام التوصيل. سيتم احتساب تكلفة إضافية للرحلة ذهاباً وإياباً."
										: "The driver will return to the pickup location after delivery. An additional fee will be charged for the round trip."}
								</p>
							</div>
							<button
								onClick={() => setShowReturnNotification(false)}
								className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
								aria-label={isArabic ? "إغلاق" : "Close"}
							>
								<X className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-300" />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Incomplete Order Notification */}
			<AnimatePresence>
				{showIncompleteNotification && (
					<motion.div
						initial={{ opacity: 0, y: -50, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -20, scale: 0.95 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className={`fixed top-2 sm:top-4 ${isArabic ? "left-2 right-2 sm:left-4 sm:right-auto" : "right-2 left-2 sm:right-4 sm:left-auto"} z-50 w-[calc(100%-1rem)] sm:w-auto sm:max-w-md`}
						dir={isArabic ? "rtl" : "ltr"}
					>
						<div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-200 dark:border-amber-700 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-5 flex items-start gap-2 sm:gap-3 backdrop-blur-sm">
							<div className="p-1.5 sm:p-2 bg-amber-500 dark:bg-amber-600 rounded-lg sm:rounded-xl flex-shrink-0">
								<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="text-sm sm:text-base md:text-lg font-bold text-amber-900 dark:text-amber-100 mb-1">
									{isArabic ? "الطلب غير مكتمل" : "Order Incomplete"}
								</h3>
								<p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
									{isArabic
										? isMultiDirection
											? `يرجى إكمال جميع المسارات قبل المتابعة. الطلب مكتمل بنسبة ${overallCompletion}% فقط.`
											: `يرجى إكمال جميع التفاصيل المطلوبة. الطلب مكتمل بنسبة ${overallCompletion}% فقط.`
										: isMultiDirection
											? `Please complete all tracks before proceeding. Order is only ${overallCompletion}% complete.`
											: `Please complete all required details. Order is only ${overallCompletion}% complete.`}
								</p>
							</div>
							<button
								onClick={() => setShowIncompleteNotification(false)}
								className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-lg transition-colors touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
								aria-label={isArabic ? "إغلاق" : "Close"}
							>
								<X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 dark:text-amber-300" />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
				{/* Header */}
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-6">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200/80 dark:border-gray-700 backdrop-blur-sm">
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
							<div className="flex-1 w-full sm:w-auto">
								<div className="flex items-center gap-2 sm:gap-3 mb-2">
									<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#31A342] to-[#2a8f38] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
										<VehicleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
									</div>
									<div className="min-w-0 flex-1">
										<h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
											{currentStep === "plan-route" && (isArabic ? "خطط مسارك" : "Plan Your Route")}
											{currentStep === "vehicle-options" && (isArabic ? "خيارات المركبة" : "Vehicle Options")}
										</h1>
										<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
											{currentStep === "plan-route" && (isArabic ? "حدد نقاط الالتقاط والتوصيل" : "Select pickup and dropoff points")}
											{currentStep === "vehicle-options" && (isArabic ? "اختر تفضيلات المركبة" : "Choose vehicle preferences")}
										</p>
									</div>
								</div>
							</div>
							<div className="flex-shrink-0 self-center sm:self-auto">
								<div className="w-16 h-16 sm:w-20 sm:h-20 relative">
									<svg className="w-full h-full transform -rotate-90">
										<circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="3" fill="none" className="text-gray-200 dark:text-gray-700" />
										<circle
											cx="50%"
											cy="50%"
											r="45%"
											stroke="currentColor"
											strokeWidth="3"
											fill="none"
											strokeDasharray={`${2 * Math.PI * 0.45}`}
											strokeDashoffset={`${2 * Math.PI * 0.45 * (1 - overallCompletion / 100)}`}
											className="text-[#31A342] dark:text-green-500 transition-all duration-500"
											strokeLinecap="round"
										/>
									</svg>
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="text-center">
											<div className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">{overallCompletion}%</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Step Content */}
				<AnimatePresence mode="wait">
					{currentStep === "plan-route" && (
						<motion.div key="plan-route" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
							{/* Segments */}
							<div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
									<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
										{isArabic ? "المسارات" : "Route Segments"}
									</h3>
									{isMultiDirection && (
										<button
											onClick={handleAddSegment}
											className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#31A342] hover:bg-[#2a8f38] active:bg-[#258533] dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors touch-manipulation shadow-md hover:shadow-lg min-h-[44px] text-sm sm:text-base"
											aria-label={isArabic ? "إضافة مسار" : "Add Segment"}
										>
											<Plus className="w-4 h-4" />
											<span>{isArabic ? "إضافة مسار" : "Add Segment"}</span>
										</button>
									)}
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
									{routeSegments.map((segment, index) => (
										<SegmentCard
											key={segment.id}
											segment={segment}
											index={index}
											isActive={selectedSegmentIndex === index}
											onClick={() => setSelectedSegmentIndex(index)}
											onEdit={() => setSelectedSegmentIndex(index)}
											onRemove={() => handleRemoveSegment(index)}
											canRemove={isMultiDirection && routeSegments.length > 1}
											isArabic={isArabic}
											completionPercentage={getSegmentCompletion(segment)}
											onUpdatePhone={(pointType, phone) => handleUpdatePhone(index, pointType, phone)}
										/>
									))}
								</div>
							</div>

							{/* Continue Button - Go directly to vehicle/package options */}
							<button
								onClick={goToNextStep}
								disabled={routeSegments.every((s) => !s.pickupPoint.location && !s.dropoffPoint.location)}
								className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[#31A342] to-[#2a8f38] hover:from-[#2a8f38] hover:to-[#258533] active:from-[#258533] active:to-[#1f7a2a] dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 touch-manipulation min-h-[48px] text-sm sm:text-base"
								aria-label={isMotorbike 
									? (isArabic ? "متابعة لخيارات الطرد" : "Continue to Package Options")
									: (isArabic ? "متابعة لخيارات المركبة" : "Continue to Vehicle Options")
								}
							>
								<span>
									{isMotorbike 
										? (isArabic ? "متابعة لخيارات الطرد" : "Continue to Package Options")
										: (isArabic ? "متابعة لخيارات المركبة" : "Continue to Vehicle Options")
									}
								</span>
								<ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isArabic ? "rotate-180" : ""}`} />
							</button>
						</motion.div>
					)}


					{currentStep === "vehicle-options" && (
						<motion.div key="vehicle-options" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
							<VehicleSpecificFields
								transportType={isMotorbike ? "motorbike" : "truck"}
								isArabic={isArabic}
								truckType={vehicleOptions.truckType}
								setTruckType={(value) => setVehicleOptions({ ...vehicleOptions, truckType: value })}
								cargoType={vehicleOptions.cargoType || ""}
								setCargoType={(value) => setVehicleOptions({ ...vehicleOptions, cargoType: value })}
								isFragile={vehicleOptions.isFragile || false}
								setIsFragile={(value) => setVehicleOptions({ ...vehicleOptions, isFragile: value })}
								requiresRefrigeration={vehicleOptions.requiresRefrigeration || false}
								setRequiresRefrigeration={(value) => setVehicleOptions({ ...vehicleOptions, requiresRefrigeration: value })}
								loadingEquipmentNeeded={vehicleOptions.loadingEquipmentNeeded}
								setLoadingEquipmentNeeded={(value) =>
									setVehicleOptions({ ...vehicleOptions, loadingEquipmentNeeded: value })
								}
								packageType={motorbikeOptions.packageType}
								setPackageType={(value) => setMotorbikeOptions({ ...motorbikeOptions, packageType: value })}
								isDocuments={motorbikeOptions.isDocuments}
								setIsDocuments={(value) => setMotorbikeOptions({ ...motorbikeOptions, isDocuments: value })}
								isExpress={motorbikeOptions.isExpress}
								setIsExpress={(value) => setMotorbikeOptions({ ...motorbikeOptions, isExpress: value })}
							/>

							{/* Return to Pickup Option - Only for one-direction orders */}
							{!isMultiDirection && (
								<div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
									<div className="flex items-start gap-2 sm:gap-3">
										<input
											type="checkbox"
											id="returnToPickup"
											checked={returnToPickup}
											onChange={(e) => {
												setReturnToPickup(e.target.checked);
												if (e.target.checked) {
													setShowReturnNotification(true);
													setTimeout(() => setShowReturnNotification(false), 5000);
												}
											}}
											className="mt-1 w-5 h-5 sm:w-6 sm:h-6 text-[#31A342] dark:text-green-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-[#31A342] dark:focus:ring-green-500 focus:ring-2 cursor-pointer touch-manipulation flex-shrink-0"
										/>
										<label htmlFor="returnToPickup" className="flex-1 cursor-pointer min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-[#31A342] dark:text-green-500 flex-shrink-0" />
												<span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
													{isArabic ? "العودة إلى نقطة الالتقاط" : "Return to Pickup Location"}
												</span>
											</div>
											<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
												{isArabic
													? "هل تريد أن يعود السائق إلى نقطة الالتقاط بعد التوصيل؟"
													: "Do you want the driver to return to the pickup location after delivery?"}
											</p>
										</label>
									</div>
								</div>
							)}

							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
								<button
									onClick={goToPreviousStep}
									className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 text-gray-900 dark:text-gray-100 font-bold rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation shadow-md hover:shadow-lg min-h-[48px] text-sm sm:text-base"
									aria-label={isArabic ? "السابق" : "Previous"}
								>
									<ChevronLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${isArabic ? "rotate-180" : ""}`} />
									<span>{isArabic ? "السابق" : "Previous"}</span>
								</button>
								<button
									onClick={goToNextStep}
									disabled={isSubmitting || !isVehicleOptionsComplete}
									className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation shadow-lg min-h-[48px] text-sm sm:text-base ${
										isSubmitting || !isVehicleOptionsComplete
											? "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60"
											: "bg-gradient-to-r from-[#31A342] to-[#2a8f38] hover:from-[#2a8f38] hover:to-[#258533] active:from-[#258533] active:to-[#1f7a2a] dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white hover:shadow-xl"
									}`}
									aria-label={isArabic ? "تأكيد وإرسال" : "Confirm & Submit"}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
											<span>{isArabic ? "جاري الإرسال..." : "Submitting..."}</span>
										</>
									) : (
										<>
											<span>{isArabic ? "تأكيد وإرسال" : "Confirm & Submit"}</span>
											<Check className="w-4 h-4 sm:w-5 sm:h-5" />
										</>
									)}
								</button>
							</div>
						</motion.div>
					)}

				</AnimatePresence>
			</div>

			{/* Segment Details Modal */}
			{selectedSegmentIndex !== null && routeSegments[selectedSegmentIndex] && (
				<SegmentDetailsModal
					isOpen={selectedSegmentIndex !== null}
					onClose={() => {
						setSelectedSegmentIndex(null);
					}}
					segment={routeSegments[selectedSegmentIndex]}
					index={selectedSegmentIndex}
					onUpdate={(updates) => handleUpdateSegment(updates, selectedSegmentIndex)}
					errors={errors}
					touched={touched}
					setTouched={setTouched}
					isArabic={isArabic}
					currentUser={currentUser}
					completionPercentage={getSegmentCompletion(routeSegments[selectedSegmentIndex])}
					isLoaded={isLoaded}
					loadError={loadError}
					defaultCenter={defaultCenter}
					validateSegment={validateSegment}
					allSegmentsComplete={routeSegments.every((seg) => getSegmentCompletion(seg) === 100)}
				/>
			)}
		</section>
	);
}

// Helper function to create empty segment
function createEmptySegment(index: number, isArabic: boolean): RouteSegment {
	const id = `segment-${Date.now()}-${index}`;
	return {
		id,
		pickupPoint: {
			id: `pickup-${id}`,
			type: "pickup",
			label: isArabic ? `نقطة الالتقاط ${index + 1}` : `Pickup Point ${index + 1}`,
			location: null,
			streetName: "",
			areaName: "",
			city: "",
			building: "",
			additionalDetails: "",
			buildingPhoto: null,
			contactName: "",
			contactPhone: "",
		},
		dropoffPoint: {
			id: `dropoff-${id}`,
			type: "dropoff",
			label: isArabic ? `نقطة التوصيل ${index + 1}` : `Dropoff Point ${index + 1}`,
			location: null,
			streetName: "",
			areaName: "",
			city: "",
			building: "",
			additionalDetails: "",
			buildingPhoto: null,
			contactName: "",
			contactPhone: "",
		},
		packageDetails: {
			description: "",
			weight: "",
			dimensions: "",
			specialInstructions: "",
			images: [],
			video: null,
			isFragile: false,
			requiresRefrigeration: false,
		},
		status: "pending",
	};
}

