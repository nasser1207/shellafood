"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
	ArrowLeft,
	Star,
	Phone,
	MessageCircle,
	Truck,
	Bike,
	Award,
	Calendar,
	CheckCircle,
	MapPin,
	Clock,
	Shield,
	ThumbsUp,
} from "lucide-react";

interface DriverProfilePageProps {
	driverId: string;
	returnUrl?: string;
	transportType?: string;
	orderType?: string;
}

interface Driver {
	id: string;
	name: string;
	nameAr: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	pricePerKm: number;
	experience: string;
	vehicleType: "truck" | "motorbike";
	vehicleModel: string;
	licensePlate: string;
	phone: string;
	completedOrders: number;
	joinDate: string;
	specialties: string[];
	bio?: string;
	bioAr?: string;
	verified: boolean;
	responseTime?: string;
	acceptanceRate?: number;
}

export default function DriverProfilePage({
	driverId,
	returnUrl,
	transportType,
	orderType,
}: DriverProfilePageProps) {
	const { language } = useLanguage();
	const router = useRouter();
	const isArabic = language === "ar";
	const [driver, setDriver] = useState<Driver | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch driver data
	useEffect(() => {
		const fetchDriverData = async () => {
			setIsLoading(true);
			try {
				// First, try to get driver data from sessionStorage (from ChooseDriverPage)
				const storedDriverData = sessionStorage.getItem(`driver_${driverId}`);
				
				if (storedDriverData) {
					try {
						const parsedDriver = JSON.parse(storedDriverData);
						
						// Map the stored driver data to the Driver interface
						const driverData: Driver = {
							id: parsedDriver.id || driverId,
							name: parsedDriver.name || "Driver",
							nameAr: parsedDriver.nameAr || "سائق",
							avatar: parsedDriver.avatar || "/driver1.jpg",
							rating: parsedDriver.rating || 4.5,
							reviewsCount: parsedDriver.reviewsCount || 0,
							pricePerKm: parsedDriver.pricePerKm || (transportType === "motorbike" ? 2.5 : 5.0),
							experience: parsedDriver.experience || (isArabic ? "5 سنوات" : "5 years"),
							vehicleType: parsedDriver.vehicleType || (transportType === "motorbike" ? "motorbike" : "truck"),
							vehicleModel: parsedDriver.vehicleModel || (transportType === "motorbike" ? "Honda CB500X 2023" : "Isuzu D-Max 2022"),
							licensePlate: parsedDriver.licensePlate || "ABC 1234",
							phone: parsedDriver.phone || "+966500000000",
							completedOrders: parsedDriver.reviewsCount || 0, // Use reviewsCount as completedOrders
							joinDate: "2016-03-15", // Default join date
							specialties: [
								isArabic ? "توصيل سريع" : "Fast Delivery",
								isArabic ? "خدمة ممتازة" : "Excellent Service",
								isArabic ? "تعامل احترافي" : "Professional",
								isArabic ? "متاح على مدار الساعة" : "24/7 Available",
							],
							bio: `Experienced delivery driver with ${parsedDriver.experience || "5 years"} of professional service. Specialized in fast and safe deliveries.`,
							bioAr: `سائق توصيل محترف مع ${parsedDriver.experience || "5 سنوات"} من الخبرة. متخصص في التوصيل السريع والآمن.`,
							verified: true,
							responseTime: isArabic ? "أقل من دقيقة" : "< 1 min",
							acceptanceRate: 98,
						};
						
						setDriver(driverData);
						setIsLoading(false);
						return;
					} catch (parseError) {
						console.error("Error parsing stored driver data:", parseError);
					}
				}

				// Fallback to mock data if not found in sessionStorage
				// TODO: Replace with actual API call
				// const response = await fetch(`/api/drivers/${driverId}`);
				// const data = await response.json();

				await new Promise((resolve) => setTimeout(resolve, 800));

				const mockDriver: Driver = {
					id: driverId,
					name: "Ahmed Mohammed",
					nameAr: "أحمد محمد",
					avatar: "/driver1.jpg",
					rating: 4.9,
					reviewsCount: 234,
					pricePerKm: transportType === "motorbike" ? 2.5 : 5.0,
					experience: isArabic ? "8 سنوات" : "8 years",
					vehicleType: transportType === "motorbike" ? "motorbike" : "truck",
					vehicleModel:
						transportType === "motorbike" ? "Honda CB500X 2023" : "Isuzu D-Max 2022",
					licensePlate: "ABC 1234",
					phone: "+966500000000",
					completedOrders: 1250,
					joinDate: "2016-03-15",
					specialties: [
						isArabic ? "توصيل سريع" : "Fast Delivery",
						isArabic ? "خدمة ممتازة" : "Excellent Service",
						isArabic ? "تعامل احترافي" : "Professional",
						isArabic ? "متاح على مدار الساعة" : "24/7 Available",
					],
					bio: "Experienced delivery driver with over 8 years of professional service. Specialized in fast and safe deliveries across Riyadh.",
					bioAr:
						"سائق توصيل محترف مع أكثر من 8 سنوات من الخبرة. متخصص في التوصيل السريع والآمن في جميع أنحاء الرياض.",
					verified: true,
					responseTime: isArabic ? "أقل من دقيقة" : "< 1 min",
					acceptanceRate: 98,
				};

				setDriver(mockDriver);
			} catch (error) {
				console.error("Error fetching driver:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDriverData();
	}, [driverId, transportType, isArabic]);

	const handleBack = useCallback(() => {
		if (returnUrl) {
			router.push(returnUrl);
		} else {
			router.back();
		}
	}, [router, returnUrl]);

	const handleChat = useCallback(() => {
		router.push(`/driver/${driverId}/chat`);
	}, [router, driverId]);

	const handleCall = useCallback(() => {
		if (driver?.phone) {
			window.location.href = `tel:${driver.phone}`;
		}
	}, [driver]);

	const handleSelectDriver = useCallback(() => {
		if (transportType && orderType) {
			router.push(
				`/pickandorder/${transportType}/order/payment?type=${orderType}&driverId=${driverId}`
			);
		}
	}, [router, transportType, orderType, driverId]);

	const VehicleIcon = useMemo(
		() => (driver?.vehicleType === "truck" ? Truck : Bike),
		[driver]
	);

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

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-[#31A342] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">
						{isArabic ? "جاري تحميل ملف السائق..." : "Loading driver profile..."}
					</p>
				</div>
			</div>
		);
	}

	if (!driver) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
						{isArabic ? "السائق غير موجود" : "Driver not found"}
					</p>
					<button
						onClick={handleBack}
						className="px-6 py-3 bg-[#31A342] hover:bg-[#2a8f38] text-white font-semibold rounded-lg transition-colors"
					>
						{isArabic ? "رجوع" : "Go Back"}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`min-h-screen ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12"
			>
				{/* Back Button */}
				<motion.button
					variants={itemVariants}
					onClick={handleBack}
					className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-6"
				>
					<ArrowLeft className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
					<span className="font-medium">{isArabic ? "رجوع" : "Back"}</span>
				</motion.button>

				{/* Hero Card */}
				<motion.div
					variants={itemVariants}
					className="bg-gradient-to-br from-[#31A342] to-[#2a8f38] rounded-2xl p-6 sm:p-8 lg:p-10 mb-6 shadow-xl"
				>
					<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
						{/* Avatar */}
						<div className="relative flex-shrink-0">
							<Image
								src={driver.avatar}
								alt={driver.name}
								width={140}
								height={140}
								className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-white/30"
							/>
							<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-2.5 shadow-lg">
								<VehicleIcon className="w-7 h-7 text-[#31A342]" />
							</div>
							{driver.verified && (
								<div className="absolute top-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center ring-4 ring-white/30">
									<Shield className="w-5 h-5 text-white" />
								</div>
							)}
						</div>

						{/* Info */}
						<div className="flex-1 text-center sm:text-left">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
								<div>
									<h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
										{isArabic ? driver.nameAr : driver.name}
									</h1>
									{driver.verified && (
										<div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
											<Shield className="w-4 h-4" />
											{isArabic ? "حساب موثق" : "Verified Driver"}
										</div>
									)}
								</div>
							</div>

							{/* Rating */}
							<div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-5 h-5 ${
												i < Math.floor(driver.rating)
													? "text-yellow-400 fill-yellow-400"
													: "text-white/30"
											}`}
										/>
									))}
								</div>
								<span className="text-white font-bold text-lg">
									{driver.rating}
								</span>
								<span className="text-white/80">
									({driver.reviewsCount} {isArabic ? "تقييم" : "reviews"})
								</span>
							</div>

							{/* Bio */}
							{driver.bio && (
								<p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
									{isArabic ? driver.bioAr : driver.bio}
								</p>
							)}

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row gap-3">
								<button
									onClick={handleCall}
									className="flex-1 sm:flex-initial px-6 py-3 bg-white hover:bg-gray-100 text-[#31A342] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
								>
									<Phone className="w-5 h-5" />
									{isArabic ? "اتصال" : "Call"}
								</button>
								<button
									onClick={handleChat}
									className="flex-1 sm:flex-initial px-6 py-3 bg-white hover:bg-gray-100 text-[#31A342] font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
								>
									<MessageCircle className="w-5 h-5" />
									{isArabic ? "محادثة" : "Chat"}
								</button>
								{transportType && orderType && (
									<button
										onClick={handleSelectDriver}
										className="flex-1 px-6 py-3 bg-[#FA9D2B] hover:bg-[#E88D26] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
									>
										<CheckCircle className="w-5 h-5" />
										{isArabic ? "اختيار السائق" : "Select Driver"}
									</button>
								)}
							</div>
						</div>
					</div>
				</motion.div>

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - Stats */}
					<motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
						{/* Quick Stats */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
								{isArabic ? "إحصائيات سريعة" : "Quick Stats"}
							</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
									<div className="flex items-center gap-3">
										<CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
										<span className="text-sm text-gray-700 dark:text-gray-300">
											{isArabic ? "الطلبات المكتملة" : "Completed"}
										</span>
									</div>
									<span className="text-lg font-bold text-gray-900 dark:text-gray-100">
										{driver.completedOrders}+
									</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
									<div className="flex items-center gap-3">
										<Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
										<span className="text-sm text-gray-700 dark:text-gray-300">
											{isArabic ? "الخبرة" : "Experience"}
										</span>
									</div>
									<span className="text-lg font-bold text-gray-900 dark:text-gray-100">
										{driver.experience}
									</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
									<div className="flex items-center gap-3">
										<Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
										<span className="text-sm text-gray-700 dark:text-gray-300">
											{isArabic ? "وقت الاستجابة" : "Response Time"}
										</span>
									</div>
									<span className="text-lg font-bold text-gray-900 dark:text-gray-100">
										{driver.responseTime}
									</span>
								</div>

								<div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
									<div className="flex items-center gap-3">
										<ThumbsUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
										<span className="text-sm text-gray-700 dark:text-gray-300">
											{isArabic ? "معدل القبول" : "Accept Rate"}
										</span>
									</div>
									<span className="text-lg font-bold text-gray-900 dark:text-gray-100">
										{driver.acceptanceRate}%
									</span>
								</div>
							</div>
						</div>

						{/* Pricing */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
								{isArabic ? "التسعير" : "Pricing"}
							</h3>
							<div className="p-6 bg-gradient-to-br from-[#31A342]/5 to-[#31A342]/10 dark:from-[#31A342]/10 dark:to-[#31A342]/20 rounded-xl border-2 border-[#31A342]/30 text-center">
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
									{isArabic ? "السعر لكل كيلومتر" : "Price per Kilometer"}
								</p>
								<p className="text-4xl font-black text-[#31A342]">
									{driver.pricePerKm}{" "}
									<span className="text-xl">{isArabic ? "ريال" : "SAR"}</span>
								</p>
							</div>
						</div>
					</motion.div>

					{/* Right Column - Details */}
					<motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
						{/* Vehicle Information */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
								<VehicleIcon className="w-5 h-5 text-[#31A342]" />
								{isArabic ? "معلومات المركبة" : "Vehicle Information"}
							</h3>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
								<div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
									<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
										{isArabic ? "نوع المركبة" : "Vehicle Type"}
									</p>
									<p className="font-semibold text-gray-900 dark:text-gray-100">
										{driver.vehicleType === "truck"
											? isArabic
												? "شاحنة"
												: "Truck"
											: isArabic
											? "دراجة نارية"
											: "Motorbike"}
									</p>
								</div>
								<div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
									<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
										{isArabic ? "الموديل" : "Model"}
									</p>
									<p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
										{driver.vehicleModel}
									</p>
								</div>
								<div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl col-span-2 sm:col-span-1">
									<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
										{isArabic ? "رقم اللوحة" : "License Plate"}
									</p>
									<p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
										{driver.licensePlate}
									</p>
								</div>
							</div>
						</div>

						{/* Specialties */}
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
							<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
								<Award className="w-5 h-5 text-[#31A342]" />
								{isArabic ? "التخصصات والمميزات" : "Specialties & Features"}
							</h3>
							<div className="flex flex-wrap gap-2">
								{driver.specialties.map((specialty, index) => (
									<span
										key={index}
										className="px-4 py-2 bg-gradient-to-r from-[#31A342]/10 to-[#31A342]/20 border border-[#31A342]/30 text-[#31A342] dark:text-green-400 rounded-lg text-sm font-medium"
									>
										{specialty}
									</span>
								))}
							</div>
						</div>

						{/* Trust Badge */}
						<div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
							<div className="flex items-start gap-4">
								<div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
									<Shield className="w-6 h-6 text-white" />
								</div>
								<div>
									<h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
										{isArabic ? "سائق موثوق ومعتمد" : "Verified & Trusted Driver"}
									</h4>
									<p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
										{isArabic
											? "جميع السائقين تم التحقق منهم وفحصهم من قبل شلة فود لضمان أعلى معايير الجودة والأمان. نضمن لك تجربة توصيل آمنة وموثوقة."
											: "All drivers are verified and screened by Shella Food to ensure the highest standards of quality and safety. We guarantee you a safe and reliable delivery experience."}
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}

