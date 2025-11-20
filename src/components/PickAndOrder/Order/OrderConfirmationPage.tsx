"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Calendar, ArrowLeft, Receipt, MapPin, FileText, Phone, UserCircle, Package, Truck, Bike, Info, Weight, Ruler, Image as ImageIcon, Video, AlertTriangle, Box, Navigation } from "lucide-react";
import Image from "next/image";
import { calculatePricing, formatPrice } from "./utils/pricing";

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

interface OrderConfirmationPageProps {
	transportType: string;
	orderType?: string;
}

export default function OrderConfirmationPage({ transportType, orderType }: OrderConfirmationPageProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const isMotorbike = transportType === "motorbike";
	const isTruck = transportType === "truck" || transportType === "track";
	const isMultiDirection = orderType === "multi-direction";

	const [orderData, setOrderData] = useState<OrderData | null>(null);
	const [routeSegments, setRouteSegments] = useState<any[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Generate order ID (in real app, this would come from API)
	const orderId = useMemo(() => {
		return `ORD-${Date.now().toString().slice(-8)}`;
	}, []);

	// Load order data from sessionStorage and store for my-orders page - supports both old and new formats
	useEffect(() => {
		// Dynamic import to use data converter
		import("./utils/dataConverter").then(({ loadAndConvertOrderData, getRouteSegments, isNewFormat }) => {
			// Check if data is in new format (routeSegments)
			if (isNewFormat()) {
				const segments = getRouteSegments();
				if (segments) {
					setRouteSegments(segments);
				}
			}
			const data = loadAndConvertOrderData();
			if (data) {
				setOrderData(data);

				// Check if driver was selected (from URL or sessionStorage)
				const urlParams = new URLSearchParams(window.location.search);
				const driverId = urlParams.get("driverId");

				// Get driver data if available
				let driverData = null;
				if (driverId) {
					const storedDriverData = sessionStorage.getItem(`driver_${driverId}`);
					if (storedDriverData) {
						try {
							driverData = JSON.parse(storedDriverData);
						} catch (error) {
							console.error("Error parsing driver data:", error);
						}
					}
				}

				// Store order data with orderId for my-orders page
				const orderDataForStorage = {
					orderId,
					orderData: data, // Use converted data
					transportType,
					orderType: orderType || "one-way",
					createdAt: new Date().toISOString(),
					driverId: driverId || null,
					driverData: driverData, // Include full driver data for my-orders display
				};

				sessionStorage.setItem(`pickAndOrder_${orderId}`, JSON.stringify(orderDataForStorage));
			}
			setIsLoading(false);
		}).catch((error) => {
			console.error("Error loading order data:", error);
			setIsLoading(false);
		});
	}, [orderId, transportType, orderType]);

	// Base price based on transport type
	const basePrice = useMemo(() => {
		return isMotorbike ? 50 : 150;
	}, [isMotorbike]);

	// Memoized pricing breakdown
	const pricing = useMemo(() => {
		return calculatePricing(basePrice);
	}, [basePrice]);

	// Memoized formatted date
	const formattedDate = useMemo(() => {
		return new Date().toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}, [isArabic]);

	// Get pickup and dropoff points
	const pickupPoints = useMemo(() => {
		return orderData?.locationPoints.filter(p => p.type === "pickup") || [];
	}, [orderData]);

	const dropoffPoints = useMemo(() => {
		return orderData?.locationPoints.filter(p => p.type === "dropoff") || [];
	}, [orderData]);

	// Helper function to get truck type name
	const getTruckTypeName = (type: string) => {
		const types: { [key: string]: { ar: string; en: string } } = {
			"small": { ar: "صغيرة (حتى 1.5 طن)", en: "Small (up to 1.5 ton)" },
			"medium": { ar: "متوسطة (1.5 - 3 طن)", en: "Medium (1.5 - 3 ton)" },
			"large": { ar: "كبيرة (3 - 5 طن)", en: "Large (3 - 5 ton)" },
			"extra-large": { ar: "كبيرة جداً (5+ طن)", en: "Extra Large (5+ ton)" },
		};
		return types[type] ? (isArabic ? types[type].ar : types[type].en) : type;
	};

	// Handlers
	const handleBackToHome = () => {
		router.push("/pickandorder");
	};

	const handleTrackOrder = () => {
		// Navigate to track order page for this specific order
		router.push(`/my-orders/${orderId}/track`);
	};

	const handleViewMyOrders = () => {
		// Navigate to my-orders page with delivery tab active
		router.push("/my-orders?tab=delivery");
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<div dir={isArabic ? "rtl" : "ltr"} className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-gray-800/50 to-white dark:to-gray-900 py-8 md:py-12 lg:py-16">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="max-w-2xl mx-auto px-4 sm:px-6"
			>
				{/* Success Animation */}
				<motion.div variants={itemVariants} className="flex justify-center mb-8">
					<div className="relative">
						<div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-lg">
							<CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" strokeWidth={2.5} />
						</div>
						<div className="absolute inset-0 bg-green-200 dark:bg-green-700 rounded-full animate-ping opacity-20"></div>
					</div>
				</motion.div>

				{/* Unified Confirmation Card */}
				<motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
					{/* Header Section */}
					<div className="bg-gradient-to-r from-green-50 dark:from-green-900/20 to-emerald-50 dark:to-emerald-900/20 px-6 sm:px-8 py-6 border-b border-gray-200 dark:border-gray-700">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
							{isArabic ? "تم تأكيد الطلب ✅" : "Order Confirmed ✅"}
						</h1>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center">
							{isArabic
								? "شكراً لك! تم تأكيد طلبك بنجاح."
								: "Thank you! Your order has been confirmed successfully."}
						</p>
					</div>

					{/* Content Section */}
					{isLoading ? (
						<div className="p-6 sm:p-8 flex items-center justify-center py-12">
							<div className="text-center">
								<div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
								<p className="text-gray-600 dark:text-gray-400">{isArabic ? "جاري تحميل البيانات..." : "Loading data..."}</p>
							</div>
						</div>
					) : orderData ? (
						<div className="p-6 sm:p-8 space-y-6">
							{/* Order Details */}
							<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
								<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
									<Receipt className="w-5 h-5 text-green-600 dark:text-green-400" />
									{isArabic ? "تفاصيل الطلب" : "Order Details"}
								</h2>
								<div className="space-y-3">
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "رقم الطلب:" : "Order ID:"}</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">{orderId}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "نوع النقل:" : "Transport Type:"}</span>
										<span className={`font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
											{isMotorbike ? (
												<>
													<Bike className="w-5 h-5 text-[#FA9D2B]" />
													{isArabic ? "دراجة نارية" : "Motorbike"}
												</>
											) : (
												<>
													<Truck className="w-5 h-5 text-[#31A342]" />
													{isArabic ? "شاحنة" : "Truck"}
												</>
											)}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "نوع الطلب:" : "Order Type:"}</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">
											{isMultiDirection ? (isArabic ? "متعدد الاتجاهات" : "Multi-Direction") : (isArabic ? "ذهاب فقط" : "One-Way")}
										</span>
									</div>
									{!isMultiDirection && orderData && (orderData as any).returnToPickup && (
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
												<Navigation className="w-4 h-4" />
												{isArabic ? "العودة إلى نقطة الالتقاط:" : "Return to Pickup:"}
											</span>
											<span className="font-semibold text-green-600 dark:text-green-400">
												{isArabic ? "نعم" : "Yes"}
											</span>
										</div>
									)}
									<div className="flex justify-between items-center">
										<span className={`text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2`}>
											<Calendar className="w-4 h-4" />
											{isArabic ? "التاريخ:" : "Date:"}
										</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">
											{formattedDate}
										</span>
									</div>
								</div>
							</section>

							{/* Pickup Points */}
							{pickupPoints.length > 0 && (
								<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
									<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
										<MapPin className="w-5 h-5 text-[#31A342]" />
										{isArabic ? (pickupPoints.length > 1 ? "عنوان الالتقاط" : "عنوان الالتقاط") : (pickupPoints.length > 1 ? "Pickup Addresses" : "Pickup Address")}
									</h2>
									<div className="space-y-4">
										{pickupPoints.map((point, index) => (
											<div key={point.id} className={`bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800 ${isArabic ? "text-right" : "text-left"}`}>
												<div className="flex items-start gap-3 mb-3">
													<div className="w-8 h-8 bg-[#31A342] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
														{index + 1}
													</div>
													<div className="flex-1">
														<p className="text-sm font-semibold text-[#31A342] mb-1">{point.label}</p>
														<p className="text-base text-gray-900 dark:text-gray-100 font-medium mb-1">
															{point.streetName}, {point.areaName}
														</p>
														<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
															{point.city} {point.building && `- ${point.building}`}
														</p>
														{point.additionalDetails && (
															<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
																{point.additionalDetails}
															</p>
														)}
														{point.recipientName && (
															<div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
																<p className="text-sm text-gray-700 dark:text-gray-300">
																	{isArabic ? "المستلم:" : "Recipient:"} <span className="font-semibold">{point.recipientName}</span>
																</p>
																{point.recipientPhone && (
																	<p className="text-sm text-gray-700 dark:text-gray-300">
																		{isArabic ? "الهاتف:" : "Phone:"} <span className="font-semibold">{point.recipientPhone}</span>
																	</p>
																)}
															</div>
														)}
														{point.buildingPhoto && (
															<div className="mt-2">
																<Image
																	src={point.buildingPhoto}
																	alt="Building"
																	width={200}
																	height={150}
																	className="rounded-lg object-cover"
																/>
															</div>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</section>
							)}

							{/* Dropoff Points */}
							{dropoffPoints.length > 0 && (
								<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
									<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
										<MapPin className="w-5 h-5 text-[#FA9D2B]" />
										{isArabic ? (dropoffPoints.length > 1 ? "عناوين التوصيل" : "عنوان التوصيل") : (dropoffPoints.length > 1 ? "Delivery Addresses" : "Delivery Address")}
									</h2>
									<div className="space-y-4">
										{dropoffPoints.map((point, index) => (
											<div key={point.id} className={`bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border border-orange-200 dark:border-orange-800 ${isArabic ? "text-right" : "text-left"}`}>
												<div className="flex items-start gap-3 mb-3">
													<div className="w-8 h-8 bg-[#FA9D2B] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
														{index + 1}
													</div>
													<div className="flex-1">
														<p className="text-sm font-semibold text-[#FA9D2B] mb-1">{point.label}</p>
														<p className="text-base text-gray-900 dark:text-gray-100 font-medium mb-1">
															{point.streetName}, {point.areaName}
														</p>
														<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
															{point.city} {point.building && `- ${point.building}`}
														</p>
														{point.additionalDetails && (
															<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
																{point.additionalDetails}
															</p>
														)}
														{point.recipientName && (
															<div className="mt-2 pt-2 border-t border-orange-200 dark:border-orange-800">
																<p className="text-sm text-gray-700 dark:text-gray-300">
																	{isArabic ? "المستلم:" : "Recipient:"} <span className="font-semibold">{point.recipientName}</span>
																</p>
																{point.recipientPhone && (
																	<p className="text-sm text-gray-700 dark:text-gray-300">
																		{isArabic ? "الهاتف:" : "Phone:"} <span className="font-semibold">{point.recipientPhone}</span>
																	</p>
																)}
															</div>
														)}
														{point.buildingPhoto && (
															<div className="mt-2">
																<Image
																	src={point.buildingPhoto}
																	alt="Building"
																	width={200}
																	height={150}
																	className="rounded-lg object-cover"
																/>
															</div>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</section>
							)}

						{/* Package Details - Multiple Segments */}
						{routeSegments && routeSegments.length > 0 ? (
							<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
								<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
									<Package className="w-5 h-5 text-green-600 dark:text-green-400" />
									{isArabic ? (routeSegments.length > 1 ? "تفاصيل الطرود" : "تفاصيل الطرد") : (routeSegments.length > 1 ? "Package Details" : "Package Details")}
								</h2>
								<div className="space-y-4">
									{routeSegments.map((segment, segmentIndex) => (
										<div key={segment.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700">
											{/* Segment Header */}
											<div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
												<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#31A342] to-[#2a8f38] flex items-center justify-center shadow-md">
													<span className="text-white font-black text-sm">{segmentIndex + 1}</span>
												</div>
												<h3 className="text-sm font-black text-gray-900 dark:text-white">
													{isArabic ? `الطرد ${segmentIndex + 1}` : `Package ${segmentIndex + 1}`}
												</h3>
											</div>

											<div className="space-y-3">
												{segment.packageDetails.description && (
													<div className={`${isArabic ? "text-right" : "text-left"}`}>
														<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{isArabic ? "الوصف:" : "Description:"}</p>
														<p className="text-base text-gray-900 dark:text-gray-100">{segment.packageDetails.description}</p>
													</div>
												)}
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
													{segment.packageDetails.weight && (
														<div className="bg-white dark:bg-gray-800 rounded-lg p-3">
															<div className="flex items-center gap-2 mb-1">
																<Weight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
																<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "الوزن:" : "Weight:"}</span>
															</div>
															<p className="text-base font-semibold text-gray-900 dark:text-gray-100">{segment.packageDetails.weight}</p>
														</div>
													)}
													{segment.packageDetails.dimensions && (
														<div className="bg-white dark:bg-gray-800 rounded-lg p-3">
															<div className="flex items-center gap-2 mb-1">
																<Ruler className="w-4 h-4 text-gray-500 dark:text-gray-400" />
																<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "الأبعاد:" : "Dimensions:"}</span>
															</div>
															<p className="text-base font-semibold text-gray-900 dark:text-gray-100">{segment.packageDetails.dimensions}</p>
														</div>
													)}
												</div>
												{segment.packageDetails.specialInstructions && (
													<div className={`bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 ${isArabic ? "text-right" : "text-left"}`}>
														<p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">{isArabic ? "تعليمات خاصة:" : "Special Instructions:"}</p>
														<p className="text-sm text-blue-800 dark:text-blue-200">{segment.packageDetails.specialInstructions}</p>
													</div>
												)}
												{segment.packageDetails.images && segment.packageDetails.images.length > 0 && (
													<div>
														<p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
															{isArabic ? "صور الطرد:" : "Package Images:"} ({segment.packageDetails.images.length})
														</p>
														<div className="grid grid-cols-3 gap-2">
															{segment.packageDetails.images.map((image: string, imgIndex: number) => (
																<Image
																	key={imgIndex}
																	src={image}
																	alt={`Package ${segmentIndex + 1} image ${imgIndex + 1}`}
																	width={100}
																	height={100}
																	className="rounded-lg object-cover"
																/>
															))}
														</div>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</section>
						) : (orderData.packageDescription || orderData.packageWeight || orderData.packageDimensions || orderData.specialInstructions) ? (
							<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
								<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
									<Package className="w-5 h-5 text-green-600 dark:text-green-400" />
									{isArabic ? "تفاصيل الطرد" : "Package Details"}
								</h2>
								<div className="space-y-3">
									{orderData.packageDescription && (
										<div className={`${isArabic ? "text-right" : "text-left"}`}>
											<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{isArabic ? "الوصف:" : "Description:"}</p>
											<p className="text-base text-gray-900 dark:text-gray-100">{orderData.packageDescription}</p>
										</div>
									)}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										{orderData.packageWeight && (
											<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
												<div className="flex items-center gap-2 mb-1">
													<Weight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
													<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "الوزن:" : "Weight:"}</span>
												</div>
												<p className="text-base font-semibold text-gray-900 dark:text-gray-100">{orderData.packageWeight}</p>
											</div>
										)}
										{orderData.packageDimensions && (
											<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
												<div className="flex items-center gap-2 mb-1">
													<Ruler className="w-4 h-4 text-gray-500 dark:text-gray-400" />
													<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "الأبعاد:" : "Dimensions:"}</span>
												</div>
												<p className="text-base font-semibold text-gray-900 dark:text-gray-100">{orderData.packageDimensions}</p>
											</div>
										)}
									</div>
									{orderData.specialInstructions && (
										<div className={`bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 ${isArabic ? "text-right" : "text-left"}`}>
											<p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">{isArabic ? "تعليمات خاصة:" : "Special Instructions:"}</p>
											<p className="text-sm text-blue-800 dark:text-blue-200">{orderData.specialInstructions}</p>
										</div>
									)}
								</div>
							</section>
						) : null}

						{/* Package Images */}
						{orderData.packageImages && orderData.packageImages.length > 0 && (
							<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
								<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
									<ImageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
									{isArabic ? "صور الطرد" : "Package Images"}
								</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
									{orderData.packageImages.map((image, index) => (
										<div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
											<Image
												src={image}
												alt={`Package image ${index + 1}`}
												fill
												className="object-cover"
											/>
										</div>
									))}
								</div>
							</section>
						)}

						{/* Package Video */}
						{orderData.packageVideo && (
							<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
								<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
									<Video className="w-5 h-5 text-green-600 dark:text-green-400" />
									{isArabic ? "فيديو الطرد" : "Package Video"}
								</h2>
								<div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
									<video src={orderData.packageVideo} controls className="w-full h-full object-cover" />
								</div>
							</section>
						)}

						{/* Vehicle-Specific Details */}
						{isTruck && (orderData.truckType || orderData.cargoType || orderData.isFragile || orderData.requiresRefrigeration || orderData.loadingEquipmentNeeded) && (
							<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
								<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
									<Truck className="w-5 h-5 text-[#31A342]" />
									{isArabic ? "تفاصيل الشاحنة" : "Truck Details"}
								</h2>
								<div className="space-y-3">
									{orderData.truckType && (
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "نوع الشاحنة:" : "Truck Type:"}</span>
											<span className="font-semibold text-gray-900 dark:text-gray-100">{getTruckTypeName(orderData.truckType)}</span>
										</div>
									)}
									{orderData.cargoType && (
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "نوع البضاعة:" : "Cargo Type:"}</span>
											<span className="font-semibold text-gray-900 dark:text-gray-100">{orderData.cargoType}</span>
										</div>
									)}
									<div className="flex flex-wrap gap-2">
										{orderData.isFragile && (
											<span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-semibold">
												<AlertTriangle className="w-4 h-4" />
												{isArabic ? "قابل للكسر" : "Fragile"}
											</span>
										)}
										{orderData.requiresRefrigeration && (
											<span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-semibold">
												<Box className="w-4 h-4" />
												{isArabic ? "يحتاج تبريد" : "Requires Refrigeration"}
											</span>
										)}
										{orderData.loadingEquipmentNeeded && (
											<span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-semibold">
												<Truck className="w-4 h-4" />
												{isArabic ? "يحتاج معدات تحميل" : "Loading Equipment Needed"}
											</span>
										)}
									</div>
								</div>
							</section>
						)}

						{isMotorbike && (orderData.packageType || orderData.isDocuments || orderData.isExpress) && (
							<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
								<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2`}>
									<Bike className="w-5 h-5 text-[#FA9D2B]" />
									{isArabic ? "تفاصيل الدراجة النارية" : "Motorbike Details"}
								</h2>
								<div className="space-y-3">
									{orderData.packageType && (
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "نوع الطرد:" : "Package Type:"}</span>
											<span className="font-semibold text-gray-900 dark:text-gray-100">{orderData.packageType}</span>
										</div>
									)}
									<div className="flex flex-wrap gap-2">
										{orderData.isDocuments && (
											<span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-semibold">
												<FileText className="w-4 h-4" />
												{isArabic ? "مستندات" : "Documents"}
											</span>
										)}
										{orderData.isExpress && (
											<span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-semibold">
												<Package className="w-4 h-4" />
												{isArabic ? "سريع" : "Express"}
											</span>
										)}
									</div>
								</div>
							</section>
						)}

						{/* Pricing Breakdown Section */}
						<section className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-700">
							<h2 className={`text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3`}>
								<Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
								{isArabic ? "تفاصيل التسعير" : "Pricing Breakdown"}
							</h2>
							<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
								{/* Base Delivery Price */}
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-600 dark:text-gray-400">
										{isArabic ? "سعر التوصيل الأساسي:" : "Base Delivery Price:"}
									</span>
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(pricing.basePrice, isArabic)}
									</span>
								</div>

								{/* Platform Fee */}
								<div className="flex items-center justify-between">
									<div className={`flex items-center gap-2`}>
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{isArabic ? "رسوم المنصة:" : "Platform Fee:"}
										</span>
										<div className="group relative">
											<Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
											<div className={`absolute ${isArabic ? "left-0" : "right-0"} bottom-full mb-2 w-48 sm:w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 ${isArabic ? "text-right" : "text-left"}`}>
												{isArabic 
													? "رسوم الخدمة لتشغيل المنصة والصيانة والتطوير"
													: "Service fee for platform operation, maintenance & development"}
											</div>
										</div>
									</div>
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(pricing.platformFee, isArabic)}
									</span>
								</div>

								{/* Subtotal */}
								<div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
									<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
										{isArabic ? "المجموع الفرعي:" : "Subtotal:"}
									</span>
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(pricing.subtotal, isArabic)}
									</span>
								</div>

								{/* VAT */}
								<div className="flex items-center justify-between">
									<div className={`flex items-center gap-2`}>
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{isArabic ? "ضريبة القيمة المضافة (15%):" : "VAT (15%):"}
										</span>
										<div className="group relative">
											<Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
											<div className={`absolute ${isArabic ? "left-0" : "right-0"} bottom-full mb-2 w-48 sm:w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white dark:text-gray-100 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 ${isArabic ? "text-right" : "text-left"}`}>
												{isArabic 
													? "ضريبة القيمة المضافة المطبقة وفقاً للوائح المملكة العربية السعودية"
													: "Value Added Tax applied according to Saudi Arabia regulations"}
											</div>
										</div>
									</div>
									<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
										{formatPrice(pricing.vat, isArabic)}
									</span>
								</div>

								{/* Total */}
								<div className="flex items-center justify-between pt-3 border-t-2 border-green-200 dark:border-green-800">
									<span className="text-lg font-bold text-gray-900 dark:text-gray-100">
										{isArabic ? "المجموع الكلي:" : "Total Amount:"}
									</span>
									<span className="text-xl font-bold text-green-600 dark:text-green-400">
										{formatPrice(pricing.total, isArabic)}
									</span>
								</div>
							</div>

							{/* Trust Message */}
							<div className={`mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 ${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-xs text-green-800 dark:text-green-300 leading-relaxed">
									{isArabic
										? "نحن ملتزمون بالشفافية الكاملة في التسعير. جميع الرسوم معروضة بوضوح."
										: "We are committed to full pricing transparency. All fees are clearly displayed."}
								</p>
							</div>
						</section>

						{/* Track Order Button */}
						<section className="space-y-4">
							<button
								onClick={handleTrackOrder}
								className={`w-full bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 text-white py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2`}
							>
								<Package className="w-5 h-5" />
								<span>{isArabic ? "تتبع الطلب" : "Track Order"}</span>
							</button>
						</section>
						</div>
					) : (
						<div className="p-6 sm:p-8 text-center py-12">
							<p className="text-gray-600 dark:text-gray-400">{isArabic ? "لا توجد بيانات طلب" : "No order data found"}</p>
						</div>
					)}

					{/* Footer Actions */}
					<div className="bg-gray-50 dark:bg-gray-800 px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
						{/* View My Orders Button */}
						<button
							onClick={handleViewMyOrders}
							className={`w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${isArabic ? "flex-row-reverse" : ""}`}
						>
							<Package className="w-5 h-5" />
							<span>{isArabic ? "عرض طلباتي" : "View My Orders"}</span>
						</button>

						{/* Back Button */}
						<button
							onClick={handleBackToHome}
							className={`w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 ${isArabic ? "flex-row-reverse" : ""}`}
						>
							<ArrowLeft className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
							<span>{isArabic ? "العودة لجلب وتوصيل" : "Back to Pick & Order"}</span>
						</button>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}

