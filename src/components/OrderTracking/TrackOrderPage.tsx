"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";
import { TrackOrderPageProps, ORDER_TYPE } from "./types";
import { useOrderTracking } from "./hooks/useOrderTracking";
import { useOrderActions } from "./hooks/useOrderActions";

// Utils
import { generateMockOrderData } from "./utils/mockData";
import { getServiceInfo, hasChatAvailable, buildWorkerDetailsRoute } from "./utils/routeHelpers";
import { calculateCurrentStepIndex, isOrderCompleted, isOrderActive } from "./utils/orderStatus";

// Components - Lazy load modals for better performance
const CancelOrderModal = dynamic(() => import("./modals/CancelOrderModal"), {
	loading: () => null,
});
const RatingModal = dynamic(
	() => import("@/components/ServeMe/Booking/modals").then((mod) => ({ default: mod.RatingModal })),
	{
		loading: () => null,
	}
);

// Static imports for above-the-fold content
import ToastNotification from "./ToastNotification";
import ETABanner from "./components/ETABanner";
import OrderHeader from "./OrderHeader";
import TrackingTimeline from "./TrackingTimeline";
import OrderDetailsSection from "./components/OrderDetailsSection";
import LiveMapContainer from "./components/LiveMapContainer";
import ActionButtons from "./components/ActionButtons";

export default function TrackOrderPage({ orderId, initialData }: TrackOrderPageProps) {
	const { language } = useLanguage();
	const router = useRouter();
	const isArabic = language === "ar";

	// Use custom hooks
	const {
		orderData,
		setOrderData,
		isLoading,
		setIsLoading,
		mapCenter,
		getETAMinutes,
		showNotification,
		currentNotification,
		handleClose,
	} = useOrderTracking(orderId, initialData, language);

	// Update orderData when initialData changes
	useEffect(() => {
		if (initialData && !orderData) {
			setOrderData(initialData);
			setIsLoading(false);
		}
	}, [initialData, orderData, setOrderData, setIsLoading]);

	// Fetch order data if not provided
	useEffect(() => {
		if (initialData || orderData) return;

		const fetchOrderData = async () => {
			try {
				setIsLoading(true);
				
				// Check sessionStorage for Pick and Order data
				if (typeof window !== "undefined") {
					const storedData = sessionStorage.getItem(`pickAndOrder_${orderId}`);
					if (storedData) {
						try {
							const parsed = JSON.parse(storedData);
							const { orderData: pickAndOrderData, transportType, orderType, createdAt, driverData } = parsed;
							
							// Convert Pick and Order data to OrderData format
							const pickupPoints = pickAndOrderData.locationPoints.filter((p: any) => p.type === "pickup");
							const dropoffPoints = pickAndOrderData.locationPoints.filter((p: any) => p.type === "dropoff");
							
							const firstPickup = pickupPoints[0] || {};
							const firstDropoff = dropoffPoints[0] || {};
							
							// Determine status based on order age
							const orderCreatedAt = new Date(createdAt);
							const hoursSinceCreation = (Date.now() - orderCreatedAt.getTime()) / (1000 * 60 * 60);
							let status = "pending";
							if (hoursSinceCreation > 24) {
								status = "completed";
							} else if (hoursSinceCreation > 2) {
								status = "in_transit";
							} else if (hoursSinceCreation > 0.5) {
								status = "picked_up";
							} else if (driverData) {
								status = "assigned";
							}
							
							// Use stored pricing data or calculate as fallback
							let basePrice = 0;
							let platformFee = 0;
							let vat = 0;
							let totalAmount = 0;
							
							if (parsed.pricing) {
								// Use stored pricing breakdown
								basePrice = parsed.pricing.basePrice || 0;
								platformFee = parsed.pricing.platformFee || 0;
								vat = parsed.pricing.vat || 0;
								totalAmount = parsed.pricing.total || 0;
							} else {
								// Fallback: Calculate pricing (legacy orders)
								const distance = 12.5; // Mock distance in km
								const isMotorbike = transportType === "motorbike";
								const baseFee = isMotorbike ? 2.5 : 5.0;
								const deliveryFee = Math.round((baseFee * distance) * 100) / 100;
								basePrice = deliveryFee;
								platformFee = Math.round(basePrice * 0.1 * 100) / 100;
								const subtotal = basePrice + platformFee;
								vat = Math.round(subtotal * 0.15 * 100) / 100;
								totalAmount = Math.round((subtotal + vat) * 100) / 100;
							}

							const trackingData: any = {
								id: orderId,
								order_number: orderId,
								type: ORDER_TYPE.PRODUCT,
								status,
								created_at: createdAt,
								estimated_time: orderType === "one-way" ? "30-45 min" : "1-2 hours",
								totalAmount,
								basePrice,
								platformFee,
								vat,
								paymentMethod: "Card",
								address: `${firstDropoff.streetName}, ${firstDropoff.areaName}, ${firstDropoff.city}`,
								timeline: [
									{
										status: "pending",
										label: isArabic ? "قيد الانتظار" : "Pending",
										timestamp: createdAt,
										completed: true,
									},
									{
										status: "assigned",
										label: isArabic ? "تم التعيين" : "Assigned",
										timestamp: driverData ? new Date(Date.parse(createdAt) + 5 * 60 * 1000).toISOString() : null,
										completed: driverData ? true : false,
									},
									{
										status: "picked_up",
										label: isArabic ? "تم الاستلام" : "Picked Up",
										timestamp: hoursSinceCreation > 0.5 ? new Date(Date.parse(createdAt) + 30 * 60 * 1000).toISOString() : null,
										completed: hoursSinceCreation > 0.5,
									},
									{
										status: "in_transit",
										label: isArabic ? "في الطريق" : "In Transit",
										timestamp: hoursSinceCreation > 2 ? new Date(Date.parse(createdAt) + 2 * 60 * 60 * 1000).toISOString() : null,
										completed: hoursSinceCreation > 2,
									},
									{
										status: "completed",
										label: isArabic ? "تم التوصيل" : "Delivered",
										timestamp: hoursSinceCreation > 24 ? new Date(Date.parse(createdAt) + 24 * 60 * 60 * 1000).toISOString() : null,
										completed: hoursSinceCreation > 24,
									},
								],
								order_details: {
									transportType,
									orderType,
									pickupLocation: `${firstPickup.streetName}, ${firstPickup.areaName}, ${firstPickup.city}`,
									dropoffLocation: `${firstDropoff.streetName}, ${firstDropoff.areaName}, ${firstDropoff.city}`,
									packageDescription: pickAndOrderData.packageDescription,
									packageWeight: pickAndOrderData.packageWeight,
									packageDimensions: pickAndOrderData.packageDimensions,
									specialInstructions: pickAndOrderData.specialInstructions,
									senderName: firstPickup.recipientName,
									senderPhone: firstPickup.recipientPhone,
									receiverName: firstDropoff.recipientName,
									receiverPhone: firstDropoff.recipientPhone,
								},
								driver_or_worker: driverData ? {
									id: driverData.id || parsed.driverId,
									name: driverData.name || driverData.nameAr,
									nameAr: driverData.nameAr || driverData.name,
									photo: driverData.avatar,
									phone: driverData.phone,
									rating: driverData.rating,
									completed_trips: driverData.completedTrips || driverData.experience,
									vehicle: driverData.vehicleModel || (transportType === "motorbike" ? "Motorbike" : "Truck"),
								} : undefined,
								map: {
									user_lat: firstDropoff.lat || 24.7136,
									user_lng: firstDropoff.lng || 46.6753,
									driver_lat: driverData ? 24.7236 : undefined,
									driver_lng: driverData ? 46.6853 : undefined,
								},
								eta: hoursSinceCreation < 24 ? new Date(Date.parse(createdAt) + 3 * 60 * 60 * 1000).toISOString() : null,
							};
							
							setOrderData(trackingData);
							setIsLoading(false);
							return;
						} catch (error) {
							console.error("Error parsing Pick and Order data:", error);
						}
					}
				}
				
				// Fallback to mock data
				const mockData = generateMockOrderData(orderId);
				setOrderData(mockData);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching order data:", error);
				setIsLoading(false);
			}
		};

		fetchOrderData();
	}, [orderId, initialData, orderData, setOrderData, setIsLoading, isArabic]);

	const {
		showRating,
		setShowRating,
		showCancelConfirm,
		setShowCancelConfirm,
		isCancelling,
		isDownloadingInvoice,
		handleRatingSubmit,
		handleCancel,
		handleDownloadInvoice,
		handleReorder,
		handleCallSupport,
		handleCallDriver,
		handleChat,
	} = useOrderActions({
		orderId,
		orderData,
		language,
		onOrderUpdate: setOrderData,
		showNotification,
	});

	// Memoized computed values for performance
	const currentStepIndex = useMemo(() => calculateCurrentStepIndex(orderData), [orderData]);
	const etaMinutes = useMemo(() => getETAMinutes(), [getETAMinutes]);
	const isCompleted = useMemo(
		() => orderData?.status ? isOrderCompleted(orderData.status) : false,
		[orderData?.status]
	);
	const isActive = useMemo(
		() => orderData?.status ? isOrderActive(orderData.status) : false,
		[orderData?.status]
	);

	// Memoized service info extraction
	const serviceInfo = useMemo(() => (orderData ? getServiceInfo(orderData) : null), [orderData]);

	// Memoized callbacks for route navigation
	const handleViewDetails = useCallback(() => {
		if (!orderData) return;

		const driverId = orderData.driver_or_worker?.id;
		if (driverId) {
			// Check if driver data exists in sessionStorage (Pick and Order driver)
			const storedDriverData = typeof window !== "undefined" 
				? sessionStorage.getItem(`driver_${driverId}`)
				: null;
			
			if (storedDriverData) {
				// Route: /driver/[driverId] for Pick and Order drivers
				const detailsPath = `/driver/${driverId}`;
				router.push(detailsPath);
			} else if (serviceInfo?.workerId) {
				// Route: /worker/[workerId] for Serve Me workers
				const detailsPath = buildWorkerDetailsRoute(serviceInfo.workerId, orderData.type);
				router.push(detailsPath);
			} else {
				showNotification({
					message: isArabic
						? "تفاصيل السائق غير متوفرة"
						: "Driver details not available",
					messageAr: "تفاصيل السائق غير متوفرة",
					type: "info",
					duration: 3000,
				});
			}
		} else {
			showNotification({
				message: isArabic
					? "تفاصيل السائق غير متوفرة"
					: "Driver details not available",
				messageAr: "تفاصيل السائق غير متوفرة",
				type: "info",
				duration: 3000,
			});
		}
	}, [serviceInfo, orderData, router, showNotification, isArabic]);

	const handleChatClick = useCallback(() => {
		if (!orderData) return;
		
		const driverId = orderData.driver_or_worker?.id;
		if (driverId) {
			// Check if driver data exists in sessionStorage (Pick and Order driver)
			const storedDriverData = typeof window !== "undefined" 
				? sessionStorage.getItem(`driver_${driverId}`)
				: null;
			
			if (storedDriverData) {
				// Route: /driver/[driverId]/chat for Pick and Order drivers
				router.push(`/driver/${driverId}/chat`);
				return;
			}
		}
		
		// Fallback to Serve Me worker chat
		if (serviceInfo) {
			const { service, serviceType, workerId } = serviceInfo;
			handleChat(service, serviceType, workerId);
		}
	}, [serviceInfo, orderData, handleChat, router]);

	// Memoized callbacks for action buttons
	const handleCallDriverClick = useCallback(
		() => orderData && handleCallDriver(orderData.driver_or_worker?.phone),
		[handleCallDriver, orderData]
	);

	const handleSupportClick = useCallback(
		() => orderData && handleCallSupport(orderData.supportPhone),
		[handleCallSupport, orderData]
	);

	const handleCancelClick = useCallback(() => setShowCancelConfirm(true), [setShowCancelConfirm]);
	const handleRateClick = useCallback(() => setShowRating(true), [setShowRating]);
	const handleCloseCancelModal = useCallback(() => setShowCancelConfirm(false), [setShowCancelConfirm]);
	const handleCloseRatingModal = useCallback(() => setShowRating(false), [setShowRating]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-green-600 dark:border-green-500 mx-auto mb-4" />
					<p className="text-gray-700 dark:text-gray-300 text-lg">
						{isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..."}
					</p>
				</motion.div>
			</div>
		);
	}

	if (!orderData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md mx-auto border border-gray-200 dark:border-gray-700">
					<h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
						{isArabic ? "خطأ في تحميل الطلب" : "Error Loading Order"}
					</h2>
					<p className="text-gray-700 dark:text-gray-300">
						{isArabic
							? "تعذر العثور على تفاصيل الطلب. يرجى المحاولة مرة أخرى."
							: "Could not find order details. Please try again."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* Toast Notifications */}
			<ToastNotification
				notification={currentNotification}
				language={language}
				onClose={handleClose}
			/>

			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-20 sm:pb-8">
				{/* ETA Banner */}
				<ETABanner
					etaMinutes={etaMinutes}
					driverOrWorker={orderData.driver_or_worker}
					language={language}
					onViewDetails={handleViewDetails}
					orderType={orderData.type}
				/>

				{/* Order Header */}
				<OrderHeader
					language={language}
					orderId={orderData.order_id}
					type={orderData.type}
					status={orderData.status}
					eta={orderData.eta}
					scheduledTime={orderData.scheduledTime}
				/>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
					{/* Left Column - Timeline & Details */}
					<div className="lg:col-span-2 space-y-6">
						{/* Tracking Timeline */}
						<TrackingTimeline
							language={language}
							type={orderData.type}
							status={orderData.status}
							timeline={orderData.timeline}
							currentStepIndex={currentStepIndex}
						/>

						{/* Order Details Section */}
						<OrderDetailsSection orderData={orderData} language={language} />
					</div>

					{/* Right Column - Map & Actions */}
					<div className="lg:col-span-1 space-y-6">
						{/* Live Map */}
						<LiveMapContainer
							mapData={orderData.map}
							mapCenter={mapCenter}
							driverOrWorker={orderData.driver_or_worker}
							etaMinutes={etaMinutes}
							language={language}
							onCall={handleCallDriverClick}
							onChat={handleChatClick}
							onViewDetails={handleViewDetails}
							orderType={orderData.type}
							orderStatus={orderData.status}
						/>

						{/* Action Buttons */}
						<ActionButtons
							language={language}
							status={orderData.status}
							type={orderData.type}
							isActive={isActive}
							isCompleted={isCompleted}
							supportPhone={orderData.supportPhone}
							onSupport={handleSupportClick}
							onCancel={handleCancelClick}
							onRate={handleRateClick}
							onDownloadInvoice={handleDownloadInvoice}
							onReorder={handleReorder}
							onChat={handleChatClick}
							isDownloadingInvoice={isDownloadingInvoice}
							hasChatAvailable={hasChatAvailable(orderData)}
						/>
					</div>
				</div>
			</div>

			{/* Cancel Order Modal */}
			{showCancelConfirm && (
				<CancelOrderModal
					isOpen={showCancelConfirm}
					onClose={handleCloseCancelModal}
					onConfirm={handleCancel}
					orderData={orderData}
					currentStepIndex={currentStepIndex}
					language={language}
					isLoading={isCancelling}
				/>
			)}

			{/* Rating Modal */}
			{showRating && (
				<RatingModal
					isOpen={showRating}
					onClose={handleCloseRatingModal}
					onSubmit={handleRatingSubmit}
					language={language}
					serviceName={
						orderData.type === ORDER_TYPE.SERVICE
							? isArabic
								? "الخدمة"
								: "Service"
							: isArabic
								? "المتجر"
								: "Store"
					}
				/>
			)}
		</div>
	);
}

