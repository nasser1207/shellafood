"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { OrderData, TrackOrderPageProps } from "./types";
import { useOrderTracking } from "./hooks/useOrderTracking";
import { useOrderActions } from "./hooks/useOrderActions";

// Components
import ToastNotification from "./ToastNotification";
import ETABanner from "./components/ETABanner";
import OrderHeader from "./OrderHeader";
import TrackingTimeline from "./TrackingTimeline";
import OrderDetailsSection from "./components/OrderDetailsSection";
import LiveMapContainer from "./components/LiveMapContainer";
import ActionButtons from "./components/ActionButtons";
import CancelOrderModal from "./modals/CancelOrderModal";
import { RatingModal } from "@/components/ServeMe/Booking/modals";

// Constants
const defaultSteps = {
	product: [
		{ key: "confirmed", status: "confirmed" },
		{ key: "preparing", status: "preparing" },
		{ key: "on_the_way", status: "on_the_way" },
		{ key: "delivered", status: "delivered" },
	],
	service: [
		{ key: "confirmed", status: "confirmed" },
		{ key: "assigned", status: "assigned" },
		{ key: "on_the_way", status: "on_the_way" },
		{ key: "in_progress", status: "in_progress" },
		{ key: "completed", status: "completed" },
	],
};

export default function TrackOrderPage({ orderId, initialData }: TrackOrderPageProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	// Fetch order data if not provided
	useEffect(() => {
		if (initialData) return;

		const fetchOrderData = async () => {
			try {
				// TODO: Replace with actual API call
				// const response = await fetch(`/api/orders/${orderId}`);
				// const data = await response.json();
				
				// Mock data for now
				const mockData: OrderData = {
					order_id: orderId,
					type: orderId.includes("SRV") ? "service" : "product",
					status: "on_the_way",
					eta: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
					timeline: [
						{
							label: orderId.includes("SRV") ? "Booking Confirmed" : "Order Confirmed",
							labelAr: orderId.includes("SRV") ? "تم تأكيد الحجز" : "تم تأكيد الطلب",
							time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
						},
						{
							label: orderId.includes("SRV") ? "Technician Assigned" : "Preparing Order",
							labelAr: orderId.includes("SRV") ? "تم تعيين الفني" : "قيد التحضير",
							time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
							comment: orderId.includes("SRV")
								? "Ahmad Al Zahrani has been assigned"
								: "Your order is being prepared",
							commentAr: orderId.includes("SRV")
								? "تم تعيين أحمد الزهراني"
								: "جاري تحضير طلبك",
						},
						{
							label: orderId.includes("SRV")
								? "Technician on the Way"
								: "Out for Delivery",
							labelAr: orderId.includes("SRV") ? "الفني في الطريق" : "قيد التوصيل",
							time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
							comment: orderId.includes("SRV")
								? "Ahmad is on the way to your location"
								: "Rider picked up your order",
							commentAr: orderId.includes("SRV")
								? "أحمد في الطريق إلى موقعك"
								: "استلم السائق طلبك",
						},
					],
					driver_or_worker: {
						name: "Ahmad Al Zahrani",
						phone: "+966500000000",
						photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
						vehicle: orderId.includes("SRV") ? undefined : "Toyota Yaris",
					},
					map: {
						user_lat: 24.7136,
						user_lng: 46.6753,
						driver_lat: 24.7250,
						driver_lng: 46.6900,
					},
					items: orderId.includes("SRV")
						? undefined
						: [
								{
									name: "Chicken Meal",
									nameAr: "وجبة دجاج",
									quantity: 2,
									price: 25.0,
								},
								{
									name: "Burger",
									nameAr: "برجر",
									quantity: 1,
									price: 15.0,
								},
						  ],
					paymentMethod: "Card",
					address: "Riyadh, Al Olaya Street, Building 5, Apartment 201",
					totalAmount: 65.0,
					supportPhone: "+966500000001",
				};

				// This will be handled by the hook
				// setOrderData(mockData);
			} catch (error) {
				console.error("Error fetching order data:", error);
			}
		};

		fetchOrderData();
	}, [orderId, initialData]);

	// Use custom hooks
	const {
		orderData,
		setOrderData,
		isLoading,
		mapCenter,
		getETAMinutes,
		showNotification,
		currentNotification,
		handleClose,
	} = useOrderTracking(orderId, initialData, language);

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

	// Calculate current step index
	const getCurrentStepIndex = () => {
		if (!orderData) return 0;

		const statusMap: Record<string, number> = {
			pending: 0,
			confirmed: 0,
			preparing: 1,
			assigned: 1,
			on_the_way: 2,
			in_progress: orderData.type === "service" ? 3 : 2,
			delivered: 3,
			completed: orderData.type === "service" ? 4 : 3,
		};

		return statusMap[orderData.status] ?? 0;
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-green-600 mx-auto mb-4" />
					<p className="text-gray-700 text-lg">
						{isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..."}
					</p>
				</motion.div>
			</div>
		);
	}

	if (!orderData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50">
				<div className="text-center p-6 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
					<h2 className="text-2xl font-bold text-red-600 mb-4">
						{isArabic ? "خطأ في تحميل الطلب" : "Error Loading Order"}
					</h2>
					<p className="text-gray-700">
						{isArabic
							? "تعذر العثور على تفاصيل الطلب. يرجى المحاولة مرة أخرى."
							: "Could not find order details. Please try again."}
					</p>
				</div>
			</div>
		);
	}

	const currentStepIndex = getCurrentStepIndex();
	const etaMinutes = getETAMinutes();
	const isCompleted = orderData.status === "completed" || orderData.status === "delivered";
	const isActive = !isCompleted && orderData.status !== "cancelled" && orderData.status !== "failed";

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 via-[#F7F9FC] to-gray-50 ${isArabic ? "rtl" : "ltr"}`}
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
							onCall={() => handleCallDriver(orderData.driver_or_worker?.phone)}
							onChat={handleChat}
						/>

						{/* Action Buttons */}
						<ActionButtons
							language={language}
							status={orderData.status}
							type={orderData.type}
							isActive={isActive}
							isCompleted={isCompleted}
							supportPhone={orderData.supportPhone}
							onSupport={() => handleCallSupport(orderData.supportPhone)}
							onCancel={() => setShowCancelConfirm(true)}
							onRate={() => setShowRating(true)}
							onDownloadInvoice={handleDownloadInvoice}
							onReorder={handleReorder}
							onChat={handleChat}
							isDownloadingInvoice={isDownloadingInvoice}
						/>
					</div>
				</div>
			</div>

			{/* Cancel Order Modal */}
			<CancelOrderModal
				isOpen={showCancelConfirm}
				onClose={() => setShowCancelConfirm(false)}
				onConfirm={handleCancel}
				orderData={orderData}
				currentStepIndex={currentStepIndex}
				language={language}
				isLoading={isCancelling}
			/>

			{/* Rating Modal */}
			{showRating && (
				<RatingModal
					isOpen={showRating}
					onClose={() => setShowRating(false)}
					onSubmit={handleRatingSubmit}
					language={language}
					serviceName={orderData.type === "service" ? "Service" : "Order"}
				/>
			)}
		</div>
	);
}

