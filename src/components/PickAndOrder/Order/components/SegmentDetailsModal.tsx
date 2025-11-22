"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import type { RouteSegment } from "../types/routeSegment";
import { SegmentDetailsForm } from "./SegmentDetailsForm";

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
	const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState("");
	const [activeFormTab, setActiveFormTab] = useState<"pickup" | "dropoff" | "package">("pickup");

	const isCompleted = completionPercentage === 100;

	// Validate specific section
	const validateSection = useCallback((tab: "pickup" | "dropoff" | "package"): { [key: string]: string } => {
		const sectionErrors: { [key: string]: string } = {};

		if (tab === "pickup") {
			if (!segment.pickupPoint.location) {
				sectionErrors[`${segment.id}-pickup-location`] = isArabic ? "حدد موقع الالتقاط" : "Select pickup location";
			}
			if (!segment.pickupPoint.additionalDetails?.trim()) {
				sectionErrors[`${segment.id}-pickup-details`] = isArabic ? "أدخل تفاصيل الموقع" : "Enter location details";
			}
		} else if (tab === "dropoff") {
			if (!segment.dropoffPoint.location) {
				sectionErrors[`${segment.id}-dropoff-location`] = isArabic ? "حدد موقع التوصيل" : "Select dropoff location";
			}
			if (!segment.dropoffPoint.contactName?.trim()) {
				sectionErrors[`${segment.id}-dropoff-name`] = isArabic ? "أدخل اسم المستلم" : "Enter recipient name";
			}
			if (!segment.dropoffPoint.contactPhone?.trim()) {
				sectionErrors[`${segment.id}-dropoff-phone`] = isArabic ? "أدخل رقم الهاتف" : "Enter phone number";
			}
			if (!segment.dropoffPoint.additionalDetails?.trim()) {
				sectionErrors[`${segment.id}-dropoff-details`] = isArabic ? "أدخل تفاصيل الموقع" : "Enter location details";
			}
		} else if (tab === "package") {
			if (!segment.packageDetails.description?.trim()) {
				sectionErrors[`${segment.id}-package-description`] = isArabic ? "صف الطرد" : "Describe package";
			}
			if (!segment.packageDetails.weight?.trim()) {
				sectionErrors[`${segment.id}-package-weight`] = isArabic ? "أدخل الوزن" : "Enter weight";
			}
		}

		return sectionErrors;
	}, [segment, isArabic]);

	// Clear errors automatically when fields are filled
	React.useEffect(() => {
		// Get current section errors
		const sectionErrors = validateSection(activeFormTab);
		const currentSectionErrorKeys = Object.keys(sectionErrors);
		
		// Update local errors - remove resolved errors, keep unresolved ones
		setLocalErrors((prev) => {
			const newErrors = { ...prev };
			let hasChanges = false;
			
			// Remove errors for current section that are now resolved
			Object.keys(newErrors).forEach((key) => {
				const isCurrentSectionError = 
					(activeFormTab === "pickup" && key.includes("pickup")) ||
					(activeFormTab === "dropoff" && key.includes("dropoff")) ||
					(activeFormTab === "package" && key.includes("package"));
				
				if (isCurrentSectionError) {
					// If this error is no longer in sectionErrors, it's been resolved
					if (!sectionErrors[key]) {
						delete newErrors[key];
						hasChanges = true;
					}
				}
			});
			
			// Add any new errors for current section (only if they were set by validation)
			currentSectionErrorKeys.forEach((key) => {
				// Only add if it was previously set (to avoid adding errors before user clicks Next)
				if (prev[key] && !newErrors[key]) {
					newErrors[key] = sectionErrors[key];
					hasChanges = true;
				}
			});
			
			return hasChanges ? newErrors : prev;
		});
		
		// Hide notification if all current section errors are resolved
		if (currentSectionErrorKeys.length === 0 && showNotification) {
			// Check if notification is for current section
			const isCurrentSectionNotification = 
				(activeFormTab === "pickup" && (notificationMessage.includes(isArabic ? "الالتقاط" : "Pickup") || notificationMessage.includes(isArabic ? "الالتقاط" : "pickup"))) ||
				(activeFormTab === "dropoff" && (notificationMessage.includes(isArabic ? "التوصيل" : "Dropoff") || notificationMessage.includes(isArabic ? "التوصيل" : "dropoff"))) ||
				(activeFormTab === "package" && (notificationMessage.includes(isArabic ? "الطرد" : "Package") || notificationMessage.includes(isArabic ? "الطرد" : "package")));
			
			if (isCurrentSectionNotification) {
				setShowNotification(false);
			}
		}
	}, [
		segment.pickupPoint.location,
		segment.pickupPoint.additionalDetails,
		segment.dropoffPoint.location,
		segment.dropoffPoint.contactName,
		segment.dropoffPoint.contactPhone,
		segment.dropoffPoint.additionalDetails,
		segment.packageDetails.description,
		segment.packageDetails.weight,
		activeFormTab,
		validateSection,
		showNotification,
		notificationMessage,
		isArabic
	]);

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
				setNotificationMessage(isArabic ? "يرجى إكمال جميع الحقول المطلوبة" : "Please complete all required fields");
				setShowNotification(true);
				setTimeout(() => setShowNotification(false), 5000);
				return;
			}
		}

		// If validation passes, close the modal
		onClose();
	}, [segment, validateSegment, onClose, setTouched, isArabic]);

	// Handle next section navigation with validation
	const handleNextSection = useCallback(() => {
		// Validate current section before moving to next
		const sectionErrors = validateSection(activeFormTab);
		
		if (Object.keys(sectionErrors).length > 0) {
			// Update errors and mark fields as touched
			setLocalErrors((prev) => ({ ...prev, ...sectionErrors }));
			const allTouched: { [key: string]: boolean } = {};
			Object.keys(sectionErrors).forEach((key) => {
				allTouched[key] = true;
			});
			setTouched((prev) => ({ ...prev, ...allTouched }));
			
			// Show section-specific notification
			let message = "";
			if (activeFormTab === "pickup") {
				message = isArabic ? "يرجى إكمال جميع الحقول المطلوبة في قسم الالتقاط" : "Please complete all required fields in the Pickup section";
			} else if (activeFormTab === "dropoff") {
				message = isArabic ? "يرجى إكمال جميع الحقول المطلوبة في قسم التوصيل" : "Please complete all required fields in the Dropoff section";
			} else if (activeFormTab === "package") {
				message = isArabic ? "يرجى إكمال جميع الحقول المطلوبة في قسم الطرد" : "Please complete all required fields in the Package section";
			}
			
			setNotificationMessage(message);
			setShowNotification(true);
			setTimeout(() => setShowNotification(false), 5000);
			
			// Scroll to first error
			const firstErrorKey = Object.keys(sectionErrors)[0];
			const errorElement = document.querySelector(`[data-field="${firstErrorKey}"]`);
			if (errorElement) {
				errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			
			return;
		}

		// If validation passes, move to next section
		if (activeFormTab === "pickup") {
			setActiveFormTab("dropoff");
		} else if (activeFormTab === "dropoff") {
			setActiveFormTab("package");
		} else if (activeFormTab === "package" && isCompleted) {
			handleComplete();
		}
	}, [activeFormTab, isCompleted, handleComplete, validateSection, setTouched, isArabic]);

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
					<div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 md:p-4 lg:p-6" dir={isArabic ? "rtl" : "ltr"}>
						<motion.div
							initial={{ opacity: 0, scale: 0.96, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.96, y: 10 }}
							transition={{ duration: 0.15, ease: "easeOut" }}
							onClick={(e) => e.stopPropagation()}
							className="relative w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[95vh] sm:max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800 rounded-none sm:rounded-xl md:rounded-2xl shadow-2xl flex flex-col"
						>
							{/* Header */}
							<div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 gap-2 sm:gap-3 md:gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
								<div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
									<div
										className={`
											relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-white text-xs sm:text-sm md:text-base flex-shrink-0
											shadow-lg transition-all duration-300 ring-2 ring-offset-1 sm:ring-offset-2 ring-offset-white dark:ring-offset-gray-800
											${isCompleted
												? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 ring-green-300 dark:ring-green-800"
												: "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 ring-blue-300 dark:ring-blue-800"
											}
										`}
									>
										{isCompleted ? (
											<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
										) : (
											<span className="text-sm sm:text-base md:text-lg">{index + 1}</span>
										)}
									</div>
									<div className="min-w-0 flex-1">
										<h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate mb-0.5 sm:mb-1">
											{isArabic ? `تفاصيل المسار ${index + 1}` : `Segment ${index + 1} Details`}
										</h2>
										<p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
											{isArabic 
												? isCompleted 
													? "✓ جميع التفاصيل مكتملة" 
													: "أكمل جميع التفاصيل المطلوبة"
												: isCompleted
												? "✓ All details completed"
												: "Complete all required details"
											}
										</p>
									</div>
								</div>
								<button
									onClick={onClose}
									className="p-2 sm:p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg sm:rounded-xl transition-all touch-manipulation flex-shrink-0 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center shadow-sm hover:shadow-md"
									aria-label={isArabic ? "إغلاق" : "Close"}
								>
									<X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
								</button>
							</div>

							{/* Notification */}
							<AnimatePresence>
								{showNotification && (
									<motion.div
										initial={{ opacity: 0, y: -20, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: -20, scale: 0.95 }}
										transition={{ type: "spring", damping: 25, stiffness: 300 }}
										className="absolute top-20 sm:top-24 left-1/2 transform -translate-x-1/2 z-[100] w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] max-w-lg mx-auto"
									>
										<div className="bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xl flex items-start gap-3 sm:gap-4 backdrop-blur-sm">
											<div className="flex-shrink-0">
												<div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 dark:bg-red-900/40 rounded-full flex items-center justify-center">
													<AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
												</div>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs sm:text-sm md:text-base font-bold text-red-900 dark:text-red-200 mb-1">
													{isArabic ? "تفاصيل غير مكتملة" : "Incomplete Details"}
												</p>
												<p className="text-[10px] sm:text-xs md:text-sm text-red-700 dark:text-red-300 leading-relaxed">
													{notificationMessage || (isArabic
														? "يرجى إكمال جميع الحقول المطلوبة قبل المتابعة"
														: "Please complete all required fields before proceeding")}
												</p>
											</div>
											<button
												onClick={() => setShowNotification(false)}
												className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 flex-shrink-0 p-1.5 touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
												aria-label={isArabic ? "إغلاق" : "Close"}
											>
												<X className="w-4 h-4 sm:w-5 sm:h-5" />
											</button>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Content */}
							<div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-6">
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
									isLoaded={isLoaded}
									loadError={loadError}
									defaultCenter={defaultCenter}
								/>
							</div>

						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};

