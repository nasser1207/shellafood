"use client";

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, MapPin, Loader2, AlertCircle, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { MAP_CONFIG } from "@/lib/maps/utils";
import { getGeocoder } from "@/lib/maps/utils";
import { parseAddressComponents } from "../utils/addressParser";
import type { RouteSegment } from "../types/routeSegment";
import { SegmentDetailsForm } from "./SegmentDetailsForm";
import MobileMapSection from "./MobileMapSection";

interface SegmentDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	segment: RouteSegment;
	index: number;
	onUpdate: (updates: Partial<RouteSegment>) => void;
	errors: { [key: string]: string };
	touched: { [key: string]: boolean };
	setTouched: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
	isArabic: boolean;
	currentUser: { name: string; phone: string };
	completionPercentage?: number;
	isLoaded: boolean;
	loadError: any;
	defaultCenter: { lat: number; lng: number };
	validateSegment?: (segment: RouteSegment) => { [key: string]: string };
	allSegmentsComplete?: boolean;
}

export const SegmentDetailsModal: React.FC<SegmentDetailsModalProps> = ({
	isOpen,
	onClose,
	segment,
	index,
	onUpdate,
	errors,
	touched,
	setTouched,
	isArabic,
	currentUser,
	completionPercentage = 0,
	isLoaded,
	loadError,
	defaultCenter,
	validateSegment,
	allSegmentsComplete = false,
}) => {
	const [activePointType, setActivePointType] = useState<"pickup" | "dropoff">("pickup");
	const [isGeocoding, setIsGeocoding] = useState(false);
	const mapRef = useRef<google.maps.Map | null>(null);
	const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});
	const [showNotification, setShowNotification] = useState(false);
	const [activeFormTab, setActiveFormTab] = useState<"pickup" | "dropoff" | "package">("pickup");

	// Update map center when location changes
	useEffect(() => {
		if (mapRef.current && isLoaded) {
			const point = activePointType === "pickup" ? segment.pickupPoint : segment.dropoffPoint;
			if (point.location) {
				mapRef.current.setCenter(point.location);
				mapRef.current.setZoom(15);
			}
		}
	}, [segment.pickupPoint.location, segment.dropoffPoint.location, activePointType, isLoaded]);

	// Get current active point location - update when segment or activePointType changes
	const mapCenter = useMemo(() => {
		const point = activePointType === "pickup" ? segment.pickupPoint : segment.dropoffPoint;
		if (point.location) {
			return point.location;
		}
		// If current point has no location, try the other point
		const otherPoint = activePointType === "pickup" ? segment.dropoffPoint : segment.pickupPoint;
		return otherPoint.location || defaultCenter;
	}, [segment.pickupPoint.location, segment.dropoffPoint.location, activePointType, defaultCenter]);

	// All points for map markers
	const allMapMarkers = useMemo(() => {
		const markers: Array<{
			id: string;
			location: { lat: number; lng: number } | null;
			type: "pickup" | "dropoff";
			label: string;
		}> = [];

		if (segment.pickupPoint.location) {
			markers.push({
				id: segment.pickupPoint.id,
				location: segment.pickupPoint.location,
				type: "pickup",
				label: segment.pickupPoint.label,
			});
		}
		if (segment.dropoffPoint.location) {
			markers.push({
				id: segment.dropoffPoint.id,
				location: segment.dropoffPoint.location,
				type: "dropoff",
				label: segment.dropoffPoint.label,
			});
		}

		return markers;
	}, [segment]);

	// Handle map click
	const handleMapClick = useCallback(
		async (event: google.maps.MapMouseEvent) => {
			if (!event.latLng || !isLoaded) return;

			const lat = event.latLng.lat();
			const lng = event.latLng.lng();
			const location = { lat, lng };

			setIsGeocoding(true);

			try {
				const geocoder = getGeocoder();
				if (!geocoder) throw new Error("Geocoder not available");

				const response = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
					geocoder.geocode({ location, language: isArabic ? "ar" : "en" }, (results, status) => {
						if (status === "OK" && results && results.length > 0) {
							resolve(results);
						} else {
							reject(new Error(`Geocoding failed: ${status}`));
						}
					});
				});

				if (response && response.length > 0) {
					const parsedAddress = parseAddressComponents(response[0]);
					
					// Update the active point (pickup or dropoff) with location and address
					const updatedPoint =
						activePointType === "pickup"
							? {
									...segment.pickupPoint,
									location,
									streetName: parsedAddress.street,
									areaName: parsedAddress.area,
									city: parsedAddress.city,
									building: parsedAddress.building,
							  }
							: {
									...segment.dropoffPoint,
									location,
									streetName: parsedAddress.street,
									areaName: parsedAddress.area,
									city: parsedAddress.city,
									building: parsedAddress.building,
							  };

					onUpdate({
						[activePointType === "pickup" ? "pickupPoint" : "dropoffPoint"]: updatedPoint,
					});

					// Clear any location errors for this point
					setLocalErrors((prev) => {
						const newErrors = { ...prev };
						delete newErrors[`${segment.id}-${activePointType}-location`];
						return newErrors;
					});
				}
			} catch (error) {
				console.error("Geocoding error:", error);
			} finally {
				setIsGeocoding(false);
			}
		},
		[isLoaded, segment, activePointType, onUpdate, isArabic]
	);

	const hasPickup = !!segment.pickupPoint.location;
	const hasDropoff = !!segment.dropoffPoint.location;
	const hasPackage = !!segment.packageDetails.description;
	const isCompleted = completionPercentage === 100;
	const locationSelected =
		activePointType === "pickup" ? hasPickup : hasDropoff;

	// Handle complete button click
	const handleComplete = useCallback(() => {
		if (validateSegment) {
			const segmentErrors = validateSegment(segment);
			if (Object.keys(segmentErrors).length > 0) {
				setLocalErrors(segmentErrors);
				// Mark all fields as touched to show errors
				const allTouched: { [key: string]: boolean } = {};
				Object.keys(segmentErrors).forEach((key) => {
					allTouched[key] = true;
				});
				setTouched((prev) => ({ ...prev, ...allTouched }));
				// Show notification for incomplete details
				setShowNotification(true);
				setTimeout(() => setShowNotification(false), 5000);
				return;
			}
		}

		// If validation passes, close the modal
		onClose();
	}, [segment, validateSegment, onClose, setTouched]);

	// Handle next section navigation
	const handleNextSection = useCallback(() => {
		if (activeFormTab === "pickup") {
			setActiveFormTab("dropoff");
		} else if (activeFormTab === "dropoff") {
			setActiveFormTab("package");
		} else if (activeFormTab === "package" && isCompleted) {
			handleComplete();
		}
	}, [activeFormTab, isCompleted, handleComplete]);

	// Handle previous section navigation
	const handlePreviousSection = useCallback(() => {
		if (activeFormTab === "package") {
			setActiveFormTab("dropoff");
		} else if (activeFormTab === "dropoff") {
			setActiveFormTab("pickup");
		}
	}, [activeFormTab]);


	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6" dir={isArabic ? "rtl" : "ltr"}>
						<motion.div
							initial={{ opacity: 0, scale: 0.96, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.96, y: 10 }}
							transition={{ duration: 0.15, ease: "easeOut" }}
							onClick={(e) => e.stopPropagation()}
							className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col"
						>
							{/* Header */}
							<div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 gap-2 sm:gap-3">
								<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
									<div
										className={`
											relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-white text-xs sm:text-sm flex-shrink-0
											shadow-lg transition-all duration-300
											${isCompleted
												? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700"
												: "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"
											}
										`}
									>
										{isCompleted ? (
											<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
										) : (
											<span className="text-sm sm:text-base">{index + 1}</span>
										)}
									</div>
									<div className="min-w-0 flex-1">
										<h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
											{isArabic ? `تفاصيل المسار ${index + 1}` : `Segment ${index + 1} Details`}
										</h2>
										<p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
											{isArabic ? "عرض وتعديل تفاصيل المسار" : "View and edit segment details"}
										</p>
									</div>
								</div>
								<button
									onClick={onClose}
									className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors touch-manipulation flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
									aria-label={isArabic ? "إغلاق" : "Close"}
								>
									<X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
								</button>
							</div>

							{/* Notification */}
							<AnimatePresence>
								{showNotification && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-md mx-2 sm:mx-4"
									>
										<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg flex items-start gap-2 sm:gap-3">
											<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
											<div className="flex-1 min-w-0">
												<p className="text-xs sm:text-sm font-semibold text-red-900 dark:text-red-100">
													{isArabic ? "تفاصيل غير مكتملة" : "Incomplete Details"}
												</p>
												<p className="text-[10px] sm:text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed">
													{isArabic
														? "يرجى إكمال جميع الحقول المطلوبة قبل المتابعة"
														: "Please complete all required fields before proceeding"}
												</p>
											</div>
											<button
												onClick={() => setShowNotification(false)}
												className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 flex-shrink-0 p-1 touch-manipulation min-w-[28px] min-h-[28px] flex items-center justify-center"
												aria-label={isArabic ? "إغلاق" : "Close"}
											>
												<X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Content */}
							<div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
								{/* Map Section */}
								<div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
									<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
										<div className="flex items-center gap-2 min-w-0 flex-1">
											<MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#31A342] dark:text-green-500 flex-shrink-0" />
											<h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
												{activePointType === "pickup"
													? isArabic
														? "حدد موقع الالتقاط"
														: "Select Pickup Location"
													: isArabic
													? "حدد موقع التوصيل"
													: "Select Dropoff Location"}
											</h3>
											{isGeocoding && <Loader2 className="w-4 h-4 text-[#31A342] animate-spin" />}
										</div>
										<div className="flex gap-2 w-full sm:w-auto">
											<button
												onClick={() => setActivePointType("pickup")}
												className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[40px] sm:min-h-0 touch-manipulation ${
													activePointType === "pickup"
														? "bg-green-500 dark:bg-green-600 text-white"
														: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
												}`}
											>
												{isArabic ? "الالتقاط" : "Pickup"}
											</button>
											<button
												onClick={() => setActivePointType("dropoff")}
												className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[40px] sm:min-h-0 touch-manipulation ${
													activePointType === "dropoff"
														? "bg-orange-500 dark:bg-orange-600 text-white"
														: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
												}`}
											>
												{isArabic ? "التوصيل" : "Dropoff"}
											</button>
										</div>
									</div>

									<div className="h-[300px] sm:h-[350px] md:h-[400px] rounded-xl overflow-hidden">
										<MobileMapSection
											isLoaded={isLoaded}
											loadError={loadError}
											mapCenter={mapCenter}
											defaultCenter={defaultCenter}
											handleMapClick={handleMapClick}
											isGeocoding={isGeocoding}
											mapRef={mapRef}
											locationSelected={locationSelected}
											isArabic={isArabic}
											allPoints={allMapMarkers}
										/>
									</div>
								</div>

								{/* Segment Details Form */}
								<SegmentDetailsForm
									segment={segment}
									onUpdate={onUpdate}
									errors={{ ...errors, ...localErrors }}
									touched={touched}
									setTouched={setTouched}
									isArabic={isArabic}
									currentUser={currentUser}
									activeTab={activeFormTab}
									setActiveTab={setActiveFormTab}
									onNext={handleNextSection}
									onPrevious={handlePreviousSection}
									isCompleted={isCompleted}
								/>
							</div>

						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};

