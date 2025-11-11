"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import {
	CheckCircle,
	Circle,
	Clock,
	Package,
	Loader2,
	Truck,
	Wrench,
	User,
	Home,
	MapPin,
	CreditCard,
	Phone,
	MessageCircle,
	Navigation,
	X,
	Star,
	Download,
	RotateCcw,
	HelpCircle,
	Info,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { MAP_CONFIG } from "@/lib/maps/utils";
import StatusBadge from "./StatusBadge";
import { RatingModal } from "@/components/ServeMe/Booking/modals";
import ToastNotification, { useToastNotifications } from "./ToastNotification";
import {
	calculateETAFromCoordinates,
	formatETA,
	getETATimestamp,
} from "@/lib/utils/etaCalculation";
import {
	requestNotificationPermission,
	notifyOrderStatusChange,
	notifyTechnicianApproaching,
} from "@/lib/utils/browserNotifications";

interface TimelineStep {
	label: string;
	labelAr?: string;
	time: string;
	comment?: string;
	commentAr?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface OrderData {
	order_id: string;
	type: "product" | "service";
	status: string;
	eta?: string;
	scheduledTime?: string;
	timeline: TimelineStep[];
	driver_or_worker?: {
		name: string;
		phone?: string;
		photo?: string;
		vehicle?: string;
	};
	map: {
		user_lat: number;
		user_lng: number;
		driver_lat?: number;
		driver_lng?: number;
	};
	items?: Array<{
		name: string;
		nameAr?: string;
		quantity: number;
		price: number;
	}>;
	paymentMethod: string;
	address: string;
	totalAmount: number;
	supportPhone?: string;
}

interface TrackOrderPageProps {
	orderId: string;
	initialData?: OrderData;
}

const defaultSteps = {
	product: [
		{ key: "confirmed", labelEn: "Order Confirmed", labelAr: "تم تأكيد الطلب", icon: CheckCircle },
		{ key: "preparing", labelEn: "Preparing Order", labelAr: "قيد التحضير", icon: Package },
		{ key: "on_the_way", labelEn: "Out for Delivery", labelAr: "قيد التوصيل", icon: Truck },
		{ key: "delivered", labelEn: "Delivered", labelAr: "تم التوصيل", icon: Home },
	],
	service: [
		{ key: "confirmed", labelEn: "Booking Confirmed", labelAr: "تم تأكيد الحجز", icon: CheckCircle },
		{ key: "assigned", labelEn: "Technician Assigned", labelAr: "تم تعيين الفني", icon: User },
		{ key: "on_the_way", labelEn: "Technician on the Way", labelAr: "الفني في الطريق", icon: Truck },
		{ key: "in_progress", labelEn: "Work in Progress", labelAr: "قيد التنفيذ", icon: Wrench },
		{ key: "completed", labelEn: "Completed", labelAr: "مكتمل", icon: CheckCircle },
	],
};

export default function TrackOrderPage({ orderId, initialData }: TrackOrderPageProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [orderData, setOrderData] = useState<OrderData | null>(initialData || null);
	const [isLoading, setIsLoading] = useState(!initialData);
	const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
	const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
	const [showRating, setShowRating] = useState(false);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [openDetails, setOpenDetails] = useState({
		items: false,
		payment: false,
		address: false,
		support: false,
	});
	
	// Toast notifications
	const { showNotification, currentNotification, handleClose } = useToastNotifications(language);
	
	// Track previous values for change detection
	const [previousStatus, setPreviousStatus] = useState<string | null>(null);
	const [previousETAMinutes, setPreviousETAMinutes] = useState<number | null>(null);
	const [nearArrivalNotified, setNearArrivalNotified] = useState(false);

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: MAP_CONFIG.libraries,
	});

	// Request browser notification permission on mount
	useEffect(() => {
		if (typeof window !== "undefined") {
			requestNotificationPermission().then((permission) => {
				if (permission === "granted") {
					console.log("Notification permission granted");
				}
			});
		}
	}, []);

	// Fetch order data
	useEffect(() => {
		if (initialData) {
			setMapCenter({
				lat: initialData.map.user_lat,
				lng: initialData.map.user_lng,
			});
			return;
		}

		const fetchOrderData = async () => {
			setIsLoading(true);
			try {
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
					items:
						orderId.includes("SRV")
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

				setOrderData(mockData);
				setMapCenter({
					lat: mockData.map.user_lat,
					lng: mockData.map.user_lng,
				});
			} catch (error) {
				console.error("Error fetching order data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrderData();
	}, [orderId, initialData]);

	// Update map center when driver location changes
	useEffect(() => {
		if (orderData?.map.driver_lat && orderData?.map.driver_lng) {
			setMapCenter({
				lat: (orderData.map.user_lat + orderData.map.driver_lat) / 2,
				lng: (orderData.map.user_lng + orderData.map.driver_lng) / 2,
			});
		} else if (orderData) {
			setMapCenter({
				lat: orderData.map.user_lat,
				lng: orderData.map.user_lng,
			});
		}
	}, [orderData]);

	// Calculate ETA in minutes dynamically
	const getETAMinutes = React.useCallback((): number | null => {
		if (!orderData) return null;

		// If driver/technician location is available, calculate ETA dynamically
		if (
			orderData.map.driver_lat &&
			orderData.map.driver_lng &&
			(orderData.status === "on_the_way" || orderData.status === "in_progress")
		) {
			const etaMinutes = calculateETAFromCoordinates(
				orderData.map.driver_lat,
				orderData.map.driver_lng,
				orderData.map.user_lat,
				orderData.map.user_lng
			);
			return etaMinutes;
		}

		// Fallback to static ETA if available
		if (orderData.eta) {
			const etaDate = new Date(orderData.eta);
			const now = new Date();
			const diffMinutes = Math.ceil((etaDate.getTime() - now.getTime()) / (1000 * 60));
			return diffMinutes > 0 ? diffMinutes : null;
		}

		return null;
	}, [orderData]);

	// Monitor status changes and show notifications
	useEffect(() => {
		if (!orderData || !previousStatus) {
			if (orderData) {
				setPreviousStatus(orderData.status);
			}
			return;
		}

		// Check if status changed
		if (orderData.status !== previousStatus) {
			const statusMessages: Record<string, { en: string; ar: string }> = {
				confirmed: {
					en: "Order confirmed",
					ar: "تم تأكيد الطلب",
				},
				assigned: {
					en: "Technician assigned to your order",
					ar: "تم تعيين فني لطلبك",
				},
				preparing: {
					en: "Your order is being prepared",
					ar: "جاري تحضير طلبك",
				},
				on_the_way: {
					en: "Technician is on the way",
					ar: "الفني في الطريق إليك",
				},
				in_progress: {
					en: "Work in progress",
					ar: "قيد التنفيذ",
				},
				delivered: {
					en: "Order delivered successfully",
					ar: "تم التوصيل بنجاح",
				},
				completed: {
					en: "Service completed",
					ar: "تم إكمال الخدمة",
				},
			};

			const message = statusMessages[orderData.status];
			if (message) {
				// Show toast notification
				showNotification({
					message: message.en,
					messageAr: message.ar,
					type: ["completed", "delivered"].includes(orderData.status)
						? "success"
						: "info",
					duration: 5000,
				});

				// Show browser notification
				notifyOrderStatusChange(orderData.status, orderData.order_id, language);
			}

			setPreviousStatus(orderData.status);
		}
	}, [orderData, previousStatus, language, showNotification]);

	// Monitor ETA changes and near arrival
	useEffect(() => {
		if (!orderData) return;

		const currentETA = getETAMinutes();
		
		// Check for near arrival (within 5 minutes)
		if (
			currentETA !== null &&
			currentETA <= 5 &&
			currentETA > 0 &&
			!nearArrivalNotified &&
			orderData.status === "on_the_way" &&
			orderData.driver_or_worker?.name
		) {
			const technicianName = orderData.driver_or_worker.name;
			
			// Show toast notification
			showNotification({
				message: `Technician ${technicianName} is arriving in ${currentETA} ${currentETA === 1 ? "min" : "mins"}!`,
				messageAr: `الفني ${technicianName} سيصل خلال ${currentETA} ${currentETA === 1 ? "دقيقة" : "دقائق"}!`,
				type: "warning",
				duration: 8000,
			});

			// Show browser notification
			notifyTechnicianApproaching(currentETA, technicianName, language);
			
			setNearArrivalNotified(true);
		}

		// Reset near arrival notification if ETA increases (driver moved away)
		if (currentETA !== null && currentETA > 5) {
			setNearArrivalNotified(false);
		}

		// Track ETA changes for debugging
		if (currentETA !== previousETAMinutes) {
			setPreviousETAMinutes(currentETA);
		}
	}, [orderData, language, showNotification, nearArrivalNotified, previousETAMinutes, getETAMinutes]);

	// Simulate real-time updates with dynamic ETA calculation
	useEffect(() => {
		if (!orderData || orderData.status === "completed" || orderData.status === "delivered" || orderData.status === "cancelled") {
			return;
		}

		const interval = setInterval(() => {
			setOrderData((prev) => {
				if (!prev) return prev;
				
				// Simulate driver movement (in real app, this would come from API)
				const updatedMap = prev.map.driver_lat
					? {
							...prev.map,
							driver_lat: prev.map.driver_lat! + (Math.random() - 0.5) * 0.001,
							driver_lng: prev.map.driver_lng! + (Math.random() - 0.5) * 0.001,
					  }
					: prev.map;

				// Update ETA dynamically if driver location is available
				let updatedETA = prev.eta;
				if (
					updatedMap.driver_lat &&
					updatedMap.driver_lng &&
					(prev.status === "on_the_way" || prev.status === "in_progress")
				) {
					const etaMinutes = calculateETAFromCoordinates(
						updatedMap.driver_lat,
						updatedMap.driver_lng,
						updatedMap.user_lat,
						updatedMap.user_lng
					);
					updatedETA = getETATimestamp(etaMinutes);
				}

				return {
					...prev,
					map: updatedMap,
					eta: updatedETA,
				};
			});
		}, 10000); // Update every 10 seconds

		setRefreshInterval(interval);
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [orderData]);

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
					<p className="text-gray-700 text-lg">{isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..."}</p>
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
	const steps = defaultSteps[orderData.type];
	const isCompleted = orderData.status === "completed" || orderData.status === "delivered";
	const isActive = !isCompleted && orderData.status !== "cancelled" && orderData.status !== "failed";
	
	// Format ETA for display
	const formattedETA = etaMinutes !== null ? formatETA(etaMinutes, language) : null;

	const toggleDetail = (key: keyof typeof openDetails) => {
		setOpenDetails((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleRatingSubmit = async (rating: number, feedback: string) => {
		console.log("Rating submitted:", { orderId, rating, feedback });
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setShowRating(false);
	};

	const handleCancel = async () => {
		try {
			// Update order status to cancelled
			setOrderData((prev) => {
				if (!prev) return prev;
				
				// Add cancellation to timeline
				const cancellationTimelineStep: TimelineStep = {
					label: "Order Cancelled",
					labelAr: "تم إلغاء الطلب",
					time: new Date().toISOString(),
					comment: isArabic ? "تم إلغاء الطلب من قبل المستخدم" : "Order cancelled by user",
					commentAr: "تم إلغاء الطلب من قبل المستخدم",
				};

				return {
					...prev,
					status: "cancelled",
					timeline: [...prev.timeline, cancellationTimelineStep],
				};
			});

			// TODO: Make API call to cancel order
			// await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });

			setShowCancelConfirm(false);
			
			// Show success message (optional)
			console.log("Order cancelled successfully:", orderData.order_id);
		} catch (error) {
			console.error("Error cancelling order:", error);
			// TODO: Show error toast/notification
		}
	};

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
				{/* Floating ETA Banner */}
				{etaMinutes && etaMinutes > 0 && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-6"
					>
						<div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
							{/* Decorative Elements */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
							<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

							<div className="relative z-10 flex items-center justify-between">
								<div className={`flex items-center gap-4 ${isArabic ? "" : ""}`}>
									<motion.div
										animate={{ rotate: 360 }}
										transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
										className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
									>
										<Navigation className="w-8 h-8" />
									</motion.div>
									<div>
										<p className="text-sm opacity-90 mb-1">
											{isArabic ? "الوصول المتوقع" : "Estimated Arrival"}
										</p>
										<h2 className="text-3xl font-extrabold">
											{formattedETA || (isArabic ? "جاري الحساب..." : "Calculating...")}
										</h2>
										{etaMinutes !== null && etaMinutes <= 5 && (
											<p className="text-xs opacity-80 mt-1">
												{isArabic ? "الفني قريب!" : "Technician nearby!"}
											</p>
										)}
									</div>
								</div>
								{orderData.driver_or_worker?.name && (
									<div className={`flex items-center gap-3 ${isArabic ? "" : ""}`}>
										{orderData.driver_or_worker.photo ? (
											<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
												<Image
													src={orderData.driver_or_worker.photo}
													alt={orderData.driver_or_worker.name}
													fill
													className="object-cover"
													sizes="48px"
												/>
											</div>
										) : (
											<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
												<User className="w-6 h-6" />
											</div>
										)}
										<div className={`${isArabic ? "text-right" : "text-left"}`}>
											<p className="text-xs opacity-80">{isArabic ? "الفني" : "Driver"}</p>
											<p className="font-semibold">{orderData.driver_or_worker.name}</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				)}

				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-6"
				>
					<div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isArabic ? "sm:" : ""}`}>
						<div className={`flex items-start gap-4 ${isArabic ? "" : ""}`}>
							<div
								className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
									orderData.type === "service"
										? "bg-orange-100"
										: "bg-blue-100"
								}`}
							>
								{orderData.type === "service" ? (
									<Wrench className="w-7 h-7 text-orange-600" />
								) : (
									<Package className="w-7 h-7 text-blue-600" />
								)}
							</div>
							<div>
								<div className={`flex items-center gap-3 mb-2 flex-wrap ${isArabic ? "" : ""}`}>
									<h1 className={`text-2xl sm:text-3xl font-extrabold text-gray-900 ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic ? "تتبع الطلب" : "Track Order"}
									</h1>
									<StatusBadge status={orderData.status} language={language} />
								</div>
								<div className={`flex items-center gap-3 ${isArabic ? "" : ""}`}>
									<p className={`text-sm text-gray-600 ${isArabic ? "text-right" : "text-left"}`}>
										<span className="font-semibold">{isArabic ? "رقم الطلب:" : "Order #:"}</span> {orderData.order_id}
									</p>
									<span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
										{orderData.type === "service"
											? isArabic
												? "حجز خدمة"
												: "Service Request"
											: isArabic
												? "طلب منتج"
												: "Product Order"}
									</span>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
					{/* Left Column - Timeline & Details (66%) */}
					<div className="lg:col-span-2 space-y-6">
						{/* Tracking Timeline */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
						>
							<h2 className={`text-xl font-bold text-gray-900 mb-6 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "مسار الطلب" : "Order Timeline"}
							</h2>

							<div className={`relative ${isArabic ? "pr-8" : "pl-8"}`}>
								{/* Vertical Line */}
								<div
									className={`absolute top-0 bottom-0 w-0.5 ${
										isArabic ? "right-4" : "left-4"
									} bg-gray-200`}
								>
									<motion.div
										initial={{ height: 0 }}
										animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
										transition={{ duration: 0.8, ease: "easeOut" }}
										className="absolute top-0 left-0 right-0 bg-green-500 rounded-full"
									/>
								</div>

								{/* Steps */}
								<div className="space-y-8">
									{steps.map((stepTemplate, index) => {
										const timelineStep = orderData.timeline.find(
											(t) => t.label === stepTemplate.labelEn || t.label === stepTemplate.labelAr
										) || orderData.timeline[index];
										const isCompleted = index <= currentStepIndex;
										const isActive = index === currentStepIndex;
										const StepIcon = stepTemplate.icon || Clock;
										const label = isArabic
											? stepTemplate.labelAr || timelineStep?.label || stepTemplate.labelEn
											: timelineStep?.label || stepTemplate.labelEn;
										const comment = isArabic
											? timelineStep?.commentAr || timelineStep?.comment
											: timelineStep?.comment;

										return (
											<motion.div
												key={stepTemplate.key}
												initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: index * 0.1 }}
												className={`flex items-start gap-4 ${isArabic ? "" : ""}`}
											>
												{/* Icon */}
												<div
													className={`relative flex-shrink-0 ${isArabic ? "ml-4" : "mr-4"}`}
													style={{ marginTop: "-2px" }}
												>
													{isCompleted ? (
														<motion.div
															initial={{ scale: 0 }}
															animate={{ scale: 1 }}
															transition={{ type: "spring", delay: index * 0.1, bounce: 0.5 }}
															className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
																isActive
																	? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/50"
																	: "bg-green-500 border-green-500 text-white"
															}`}
														>
															{isActive ? (
																<StepIcon className="w-5 h-5" />
															) : (
																<CheckCircle className="w-5 h-5" />
															)}
														</motion.div>
													) : (
														<div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
															<Circle className="w-5 h-5 text-gray-400" fill="currentColor" />
														</div>
													)}
													{isActive && (
														<motion.div
															className="absolute inset-0 rounded-full bg-green-500 opacity-20"
															animate={{ scale: [1, 1.5, 1] }}
															transition={{ duration: 2, repeat: Infinity }}
														/>
													)}
												</div>

												{/* Content */}
												<div className={`flex-1 min-w-0 ${isArabic ? "text-right" : "text-left"}`}>
													<h3
														className={`font-semibold text-base mb-1 ${
															isCompleted ? "text-gray-900" : "text-gray-400"
														}`}
													>
														{label}
													</h3>
													{timelineStep?.time && (
														<p className="text-xs text-gray-500 mb-1">
															{new Date(timelineStep.time).toLocaleString(isArabic ? "ar-SA" : "en-US", {
																dateStyle: "short",
																timeStyle: "short",
															})}
														</p>
													)}
													{comment && (
														<motion.p
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															transition={{ delay: index * 0.1 + 0.2 }}
															className="text-sm text-gray-600 mt-1 italic"
														>
															{comment}
														</motion.p>
													)}
													{isActive && (
														<motion.p
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															className="text-xs text-green-600 mt-2 font-medium"
														>
															{isArabic ? "قيد التنفيذ..." : "In progress..."}
														</motion.p>
													)}
												</div>
											</motion.div>
										);
									})}
								</div>
							</div>
						</motion.div>

						{/* Order Details */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4"
						>
							<h2 className={`text-xl font-bold text-gray-900 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "تفاصيل الطلب" : "Order Details"}
							</h2>

							{/* Items Section */}
							{orderData.items && orderData.items.length > 0 && (
								<div className="border border-gray-200 rounded-xl overflow-hidden">
									<button
										onClick={() => toggleDetail("items")}
										className={`w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors ${isArabic ? "" : ""}`}
									>
										<div className={`flex items-center gap-3 ${isArabic ? "" : ""}`}>
											<Package className="w-5 h-5 text-green-600" />
											<span className="font-semibold text-gray-900">
												{isArabic ? "عناصر الطلب" : "Order Items"}
											</span>
										</div>
										{openDetails.items ? (
											<ChevronUp className="w-5 h-5 text-gray-500" />
										) : (
											<ChevronDown className="w-5 h-5 text-gray-500" />
										)}
									</button>
									<AnimatePresence>
										{openDetails.items && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.2 }}
												className="overflow-hidden"
											>
												<div className={`p-4 space-y-3 ${isArabic ? "text-right" : "text-left"}`}>
													{orderData.items.map((item, index) => (
														<div
															key={index}
															className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ${isArabic ? "" : ""}`}
														>
															<span className="text-sm text-gray-700">
																{isArabic ? item.nameAr || item.name : item.name} × {item.quantity}
															</span>
															<span className="text-sm font-semibold text-gray-900">
																{(item.price * item.quantity).toFixed(2)} {isArabic ? "ريال" : "SAR"}
															</span>
														</div>
													))}
													<div className={`pt-3 border-t border-gray-200 flex items-center justify-between ${isArabic ? "" : ""}`}>
														<span className="font-bold text-gray-900">{isArabic ? "المجموع:" : "Total:"}</span>
														<span className="text-lg font-extrabold text-green-600">
															{orderData.totalAmount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
														</span>
													</div>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							)}

							{/* Payment Section */}
							<div className="border border-gray-200 rounded-xl overflow-hidden">
								<button
									onClick={() => toggleDetail("payment")}
									className={`w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors ${isArabic ? "" : ""}`}
								>
									<div className={`flex items-center gap-3 ${isArabic ? "" : ""}`}>
										<CreditCard className="w-5 h-5 text-green-600" />
										<span className="font-semibold text-gray-900">{isArabic ? "الدفع" : "Payment"}</span>
									</div>
									{openDetails.payment ? (
										<ChevronUp className="w-5 h-5 text-gray-500" />
									) : (
										<ChevronDown className="w-5 h-5 text-gray-500" />
									)}
								</button>
								<AnimatePresence>
									{openDetails.payment && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.2 }}
											className="overflow-hidden"
										>
											<div className={`p-4 space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
												<p className="text-sm text-gray-600">{isArabic ? "طريقة الدفع:" : "Payment Method:"}</p>
												<p className="font-semibold text-gray-900">{orderData.paymentMethod}</p>
												<p className="text-sm text-gray-600 mt-3">{isArabic ? "المبلغ المدفوع:" : "Amount Paid:"}</p>
												<p className="text-lg font-bold text-green-600">
													{orderData.totalAmount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
												</p>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Address Section */}
							<div className="border border-gray-200 rounded-xl overflow-hidden">
								<button
									onClick={() => toggleDetail("address")}
									className={`w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors ${isArabic ? "" : ""}`}
								>
									<div className={`flex items-center gap-3 ${isArabic ? "" : ""}`}>
										<MapPin className="w-5 h-5 text-green-600" />
										<span className="font-semibold text-gray-900">
											{isArabic ? "عنوان التوصيل" : "Delivery Address"}
										</span>
									</div>
									{openDetails.address ? (
										<ChevronUp className="w-5 h-5 text-gray-500" />
									) : (
										<ChevronDown className="w-5 h-5 text-gray-500" />
									)}
								</button>
								<AnimatePresence>
									{openDetails.address && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.2 }}
											className="overflow-hidden"
										>
											<div className={`p-4 flex items-start gap-2 ${isArabic ? " text-right" : "text-left"}`}>
												<MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
												<p className="text-sm text-gray-700 leading-relaxed">{orderData.address}</p>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Support Section */}
							<div className="border border-gray-200 rounded-xl overflow-hidden">
								<button
									onClick={() => toggleDetail("support")}
									className={`w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors ${isArabic ? "" : ""}`}
								>
									<div className={`flex items-center gap-3 ${isArabic ? "" : ""}`}>
										<Info className="w-5 h-5 text-green-600" />
										<span className="font-semibold text-gray-900">{isArabic ? "الدعم" : "Support"}</span>
									</div>
									{openDetails.support ? (
										<ChevronUp className="w-5 h-5 text-gray-500" />
									) : (
										<ChevronDown className="w-5 h-5 text-gray-500" />
									)}
								</button>
								<AnimatePresence>
									{openDetails.support && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.2 }}
											className="overflow-hidden"
										>
											<div className={`p-4 space-y-3 ${isArabic ? "text-right" : "text-left"}`}>
												<p className="text-sm text-gray-600">{isArabic ? "تحتاج مساعدة؟" : "Need help?"}</p>
												{orderData.supportPhone && (
													<a
														href={`tel:${orderData.supportPhone}`}
														className={`inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors ${isArabic ? "" : ""}`}
													>
														<Phone className="w-4 h-4" />
														<span>{isArabic ? "اتصل بالدعم" : "Contact Support"}</span>
													</a>
												)}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					</div>

					{/* Right Column - Map & Actions (33%) */}
					<div className="lg:col-span-1 space-y-6">
						{/* Live Map */}
						{isLoaded && mapCenter && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
							>
								<div className={`p-4 border-b border-gray-200 ${isArabic ? "text-right" : "text-left"}`}>
									<h3 className="text-lg font-bold text-gray-900">
										{isArabic ? "الموقع المباشر" : "Live Tracking"}
									</h3>
								</div>
								<div className="relative h-64 sm:h-80">
									<GoogleMap
										mapContainerStyle={{ width: "100%", height: "100%" }}
										center={mapCenter}
										zoom={13}
										options={{
											...MAP_CONFIG.mapOptions,
											zoomControl: true,
											fullscreenControl: false,
											streetViewControl: false,
										}}
									>
										<Marker
											position={{ lat: orderData.map.user_lat, lng: orderData.map.user_lng }}
											icon={{
												path: google.maps.SymbolPath.CIRCLE,
												scale: 8,
												fillColor: "#10b981",
												fillOpacity: 1,
												strokeColor: "#ffffff",
												strokeWeight: 2,
											}}
											title={isArabic ? "موقعك" : "Your Location"}
										/>
										{orderData.map.driver_lat && orderData.map.driver_lng && (
											<Marker
												position={{ lat: orderData.map.driver_lat, lng: orderData.map.driver_lng }}
												icon={{
													path: google.maps.SymbolPath.CIRCLE,
													scale: 10,
													fillColor: "#f59e0b",
													fillOpacity: 1,
													strokeColor: "#ffffff",
													strokeWeight: 3,
												}}
												title={orderData.driver_or_worker?.name || (isArabic ? "الفني" : "Driver")}
												animation={google.maps.Animation.BOUNCE}
											/>
										)}
									</GoogleMap>
								</div>
								{orderData.driver_or_worker && (
									<div className={`p-4 border-t border-gray-200 ${isArabic ? "text-right" : "text-left"}`}>
										<div className={`flex items-center gap-3 mb-3 ${isArabic ? "" : ""}`}>
											{orderData.driver_or_worker.photo ? (
												<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
													<Image
														src={orderData.driver_or_worker.photo}
														alt={orderData.driver_or_worker.name}
														fill
														className="object-cover"
														sizes="48px"
													/>
												</div>
											) : (
												<div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
													<User className="w-6 h-6 text-green-600" />
												</div>
											)}
											<div className="flex-1 min-w-0">
												<h4 className="font-semibold text-gray-900 truncate">{orderData.driver_or_worker.name}</h4>
												{orderData.driver_or_worker.vehicle && (
													<p className="text-xs text-gray-600">{orderData.driver_or_worker.vehicle}</p>
												)}
											</div>
										</div>
										{(orderData.driver_or_worker.phone || true) && (
											<div className={`flex items-center gap-2 ${isArabic ? "" : ""}`}>
												{orderData.driver_or_worker.phone && (
													<a
														href={`tel:${orderData.driver_or_worker.phone}`}
														className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors ${isArabic ? "" : ""}`}
													>
														<Phone className="w-4 h-4" />
														<span>{isArabic ? "اتصال" : "Call"}</span>
													</a>
												)}
												<button
													onClick={() => console.log("Navigate to chat")}
													className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors ${isArabic ? "" : ""}`}
												>
													<MessageCircle className="w-4 h-4" />
													<span>{isArabic ? "محادثة" : "Chat"}</span>
												</button>
											</div>
										)}
									</div>
								)}
							</motion.div>
						)}

						{/* Desktop Actions */}
						<div className="hidden sm:block bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
							<h3 className={`text-lg font-bold text-gray-900 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "الإجراءات" : "Actions"}
							</h3>
							<div className={`flex flex-col gap-3 ${isArabic ? "sm:" : ""}`}>
								{isActive && (
									<>
										{orderData.supportPhone && (
											<motion.button
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												onClick={() => window.location.href = `tel:${orderData.supportPhone}`}
												className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors ${isArabic ? "" : ""}`}
											>
												<HelpCircle className="w-5 h-5" />
												<span>{isArabic ? "اتصل بالدعم" : "Contact Support"}</span>
											</motion.button>
										)}
										
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => setShowCancelConfirm(true)}
											className={`flex items-center justify-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors ${isArabic ? "" : ""}`}
										>
											<X className="w-5 h-5" />
											<span>{isArabic ? "إلغاء الطلب" : "Cancel Order"}</span>
										</motion.button>
									</>
								)}
								{isCompleted && (
									<>
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => setShowRating(true)}
											className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors ${isArabic ? "" : ""}`}
										>
											<Star className="w-5 h-5" />
											<span>{isArabic ? "قيم التجربة" : "Rate Experience"}</span>
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() => console.log("Download invoice for:", orderId)}
											className={`flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors ${isArabic ? "" : ""}`}
										>
											<Download className="w-5 h-5" />
											<span>{isArabic ? "تحميل الفاتورة" : "Download Invoice"}</span>
										</motion.button>
									</>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Mobile Actions - Sticky Bottom */}
				<div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 p-4">
					<div className={`flex items-center gap-2 ${isArabic ? "" : ""}`}>
						{isActive && (
							<>
								{orderData.supportPhone && (
									<button
										onClick={() => window.location.href = `tel:${orderData.supportPhone}`}
										className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors"
									>
										<HelpCircle className="w-4 h-4" />
										<span>{isArabic ? "الدعم" : "Support"}</span>
									</button>
								)}
							
								<button
									onClick={() => setShowCancelConfirm(true)}
									className="flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition-colors"
								>
									<X className="w-4 h-4" />
									<span className="hidden sm:inline">{isArabic ? "إلغاء" : "Cancel"}</span>
								</button>
							</>
						)}
						{isCompleted && (
							<>
								<button
									onClick={() => setShowRating(true)}
									className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors"
								>
									<Star className="w-4 h-4" />
									<span>{isArabic ? "قيم التجربة" : "Rate Experience"}</span>
								</button>
								{orderData.type === "product" && (
									<button
										onClick={() => window.location.href = "/"}
										className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
									>
										<RotateCcw className="w-4 h-4" />
										<span>{isArabic ? "إعادة طلب" : "Reorder"}</span>
									</button>
								)}
							</>
						)}
					</div>
				</div>
			</div>

			{/* Cancel Confirmation Modal */}
			<AnimatePresence>
				{showCancelConfirm && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className={`bg-white rounded-xl shadow-2xl max-w-md w-full p-6 ${isArabic ? "rtl" : "ltr"}`}
							dir={isArabic ? "rtl" : "ltr"}
						>
							<h3 className={`text-xl font-bold text-gray-900 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? "إلغاء الطلب" : "Cancel Order"}
							</h3>
							<p className={`text-gray-600 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic
									? "هل أنت متأكد من إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
									: "Are you sure you want to cancel this order? This action cannot be undone."}
							</p>
							
							{/* Fee Warning Message */}
							{(orderData.status === "assigned" || 
							  orderData.status === "on_the_way" || 
							  orderData.status === "in_progress" ||
							  (orderData.driver_or_worker && currentStepIndex > 0)) && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
								>
									<div className={`flex items-start gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
										<div className="flex-shrink-0 mt-0.5">
											<Info className="w-5 h-5 text-yellow-600" />
										</div>
										<p className={`text-sm text-yellow-800 leading-relaxed ${isArabic ? "text-right" : "text-left"}`}>
											{isArabic
												? "سيتم خصم رسوم صغيرة لصالح الفني (رسوم المعاينة) في حالة حدوث الإلغاء بعد إرسال الفني، وذلك لحماية الفنيين من إهدار الوقت والجهد."
												: "A small fee will be deducted in favor of the technician (inspection fee) if the cancellation occurs after the technician has been dispatched, to protect technicians from wasted time and effort."}
										</p>
									</div>
								</motion.div>
							)}

							<div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
								<button
									onClick={handleCancel}
									className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
								>
									{isArabic ? "نعم، إلغاء" : "Yes, Cancel"}
								</button>
								<button
									onClick={() => setShowCancelConfirm(false)}
									className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
								>
									{isArabic ? "إلغاء" : "No"}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

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
