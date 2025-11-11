"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";
import { TrackOrderPageProps } from "./types";
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
				// TODO: Replace with actual API call
				// const response = await fetch(`/api/orders/${orderId}`);
				// const data = await response.json();
				
				// Mock data for now
				const mockData = generateMockOrderData(orderId);
				setOrderData(mockData);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching order data:", error);
				setIsLoading(false);
			}
		};

		fetchOrderData();
	}, [orderId, initialData, orderData, setOrderData, setIsLoading]);

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
		if (!serviceInfo) return;

		const { service, serviceType, workerId } = serviceInfo;
		if (service && serviceType && workerId) {
			const detailsPath = buildWorkerDetailsRoute(service, serviceType, workerId);
			router.push(detailsPath);
		} else {
			showNotification({
				message: isArabic
					? "تفاصيل الفني غير متوفرة لطلب المنتجات"
					: "Worker details not available for product orders",
				messageAr: "تفاصيل الفني غير متوفرة لطلب المنتجات",
				type: "info",
				duration: 3000,
			});
		}
	}, [serviceInfo, router, showNotification, isArabic]);

	const handleChatClick = useCallback(() => {
		if (!serviceInfo) return;
		const { service, serviceType, workerId } = serviceInfo;
		handleChat(service, serviceType, workerId);
	}, [serviceInfo, handleChat]);

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
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
					serviceName={orderData.type === "service" ? "Service" : "Order"}
				/>
			)}
		</div>
	);
}

