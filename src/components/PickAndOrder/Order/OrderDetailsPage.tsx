"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, MapPin, User, Phone, Loader2 } from "lucide-react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { MAP_CONFIG } from "@/lib/maps/utils";
import { getGeocoder } from "@/lib/maps/utils";
import { parseAddressComponents, ParsedAddress } from "./utils/addressParser";

interface OrderDetailsPageProps {
	transportType: string;
	orderType: string;
}

export default function OrderDetailsPage({ transportType, orderType }: OrderDetailsPageProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [activeTab, setActiveTab] = useState<"sender" | "receiver">("sender");

	// Form state
	const [senderName, setSenderName] = useState("");
	const [senderPhone, setSenderPhone] = useState("");
	const [streetName, setStreetName] = useState("");
	const [areaName, setAreaName] = useState("");
	const [city, setCity] = useState("");
	const [building, setBuilding] = useState("");

	// Map state
	const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [isGeocoding, setIsGeocoding] = useState(false);
	const mapRef = useRef<google.maps.Map | null>(null);

	// Load Google Maps API
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: MAP_CONFIG.libraries,
	});

	// Default center (Riyadh)
	const defaultCenter = useMemo(() => MAP_CONFIG.defaultCenter, []);

	// Handle map click and reverse geocode
	const handleMapClick = useCallback(
		async (event: google.maps.MapMouseEvent) => {
			if (!event.latLng || !isLoaded) return;

			const lat = event.latLng.lat();
			const lng = event.latLng.lng();

			// Round to 4 decimal places for cache efficiency
			const roundedLat = parseFloat(lat.toFixed(4));
			const roundedLng = parseFloat(lng.toFixed(4));

			setSelectedLocation({ lat: roundedLat, lng: roundedLng });
			setIsGeocoding(true);

			try {
				const geocoder = getGeocoder();
				if (!geocoder) {
					throw new Error("Geocoder not available");
				}

				const response = await new Promise<google.maps.GeocoderResult[]>(
					(resolve, reject) => {
						geocoder.geocode(
							{
								location: { lat: roundedLat, lng: roundedLng },
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
					}
				);

				if (response && response.length > 0) {
					const parsedAddress = parseAddressComponents(response[0]);

					// Auto-fill form fields
					setStreetName(parsedAddress.street);
					setAreaName(parsedAddress.area);
					setCity(parsedAddress.city);
					setBuilding(parsedAddress.building);
				}
			} catch (error) {
				console.error("Reverse geocoding error:", error);
			} finally {
				setIsGeocoding(false);
			}
		},
		[isLoaded, isArabic]
	);

	// Map load handler
	const onMapLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map;
	}, []);

	// Map unmount handler
	const onMapUnmount = useCallback(() => {
		mapRef.current = null;
	}, []);

	const handleContinue = () => {
		// Navigate to summary page
		router.push(`/pickandorder/${transportType}/order/summary`);
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
		<section dir={isArabic ? "rtl" : "ltr"} className="min-h-screen py-8 md:py-12 lg:py-16">
			<div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="space-y-6 lg:space-y-8"
				>
					{/* Tabs Header */}
					<motion.div variants={itemVariants} className="flex justify-center">
						<div className={`inline-flex rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 shadow-md `}>
							<button
								onClick={() => setActiveTab("sender")}
								className={`px-6 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
									activeTab === "sender"
										? "bg-[#31A342] text-white shadow-md"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
								}`}
							>
								{isArabic ? "معلومات المرسل" : "Sender Info"}
							</button>
							<button
								onClick={() => setActiveTab("receiver")}
								className={`px-6 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
									activeTab === "receiver"
										? "bg-[#31A342] text-white shadow-md"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
								}`}
							>
								{isArabic ? "معلومات المتلقي" : "Receiver Info"}
							</button>
						</div>
					</motion.div>

					{/* Two-Column Form Section */}
					<div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8`}>
						{/* Left Column - Service Details + Sender Info */}
						<motion.div variants={itemVariants} className="lg:order-2 order-1 space-y-6">
							{/* Service Details Card */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
									{isArabic ? "تفاصيل الخدمة المواد تُنقلها" : "Service Details - Items to Transport"}
								</h3>
								<button className="w-full mb-4 px-4 py-3 bg-[#31A342]/10 hover:bg-[#31A342]/20 text-[#31A342] font-semibold rounded-xl border-2 border-dashed border-[#31A342]/30 hover:border-[#31A342]/50 transition-all duration-200 flex items-center justify-center gap-2">
									<Plus className="h-5 w-5" />
									{isArabic ? "+ أضف جديد" : "+ Add New"}
								</button>
								<div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center">
									<p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
										{isArabic ? "اضغط لإضافة تفاصيل الخدمة" : "Click to add service details"}
									</p>
								</div>
							</div>

							{/* Sender Info Card */}
							{activeTab === "sender" && (
								<motion.div
									initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
									animate={{ opacity: 1, x: 0 }}
									className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
								>
									<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
										<User className="h-5 w-5 text-[#31A342]" />
										{isArabic ? "معلومات المرسل" : "Sender Information"}
									</h3>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
												{isArabic ? "اسم المرسل" : "Sender Name"}
											</label>
											<input
												type="text"
												value={senderName}
												onChange={(e) => setSenderName(e.target.value)}
												className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#31A342] transition-colors duration-200"
												placeholder={isArabic ? "أدخل اسم المرسل" : "Enter sender name"}
											/>
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
												{isArabic ? "رقم التواصل" : "Phone Number"}
											</label>
											<input
												type="tel"
												value={senderPhone}
												onChange={(e) => setSenderPhone(e.target.value)}
												className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#31A342] transition-colors duration-200"
												placeholder={isArabic ? "أدخل رقم التواصل" : "Enter phone number"}
											/>
										</div>
									</div>
								</motion.div>
							)}

							{/* Receiver Info Card (when receiver tab is active) */}
							{activeTab === "receiver" && (
								<motion.div
									initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
									animate={{ opacity: 1, x: 0 }}
									className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700"
								>
									<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
										<User className="h-5 w-5 text-[#31A342]" />
										{isArabic ? "معلومات المتلقي" : "Receiver Information"}
									</h3>
									<div className="space-y-4">
										<div>
											<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
												{isArabic ? "اسم المتلقي" : "Receiver Name"}
											</label>
											<input
												type="text"
												className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#31A342] transition-colors duration-200"
												placeholder={isArabic ? "أدخل اسم المتلقي" : "Enter receiver name"}
											/>
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
												{isArabic ? "رقم التواصل" : "Phone Number"}
											</label>
											<input
												type="tel"
												className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#31A342] transition-colors duration-200"
												placeholder={isArabic ? "أدخل رقم التواصل" : "Enter phone number"}
											/>
										</div>
									</div>
								</motion.div>
							)}
						</motion.div>

						{/* Right Column - Map + Pickup Info */}
						<motion.div variants={itemVariants} className="space-y-6">
							{/* Map Card */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
									<MapPin className="h-5 w-5 text-[#31A342]" />
									{isArabic ? "موقع الالتقاط" : "Pickup Location"}
									{isGeocoding && (
										<Loader2 className="h-4 w-4 text-[#31A342] animate-spin ml-2" />
									)}
								</h3>
								<div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
									{!isLoaded ? (
										<div className="w-full h-full flex items-center justify-center">
											<div className="text-center">
												<Loader2 className="h-8 w-8 text-[#31A342] animate-spin mx-auto mb-2" />
												<p className="text-sm text-gray-600 dark:text-gray-400">
													{isArabic ? "جاري تحميل الخريطة..." : "Loading map..."}
												</p>
											</div>
										</div>
									) : (
										<GoogleMap
											mapContainerStyle={{
												width: "100%",
												height: "100%",
											}}
											center={selectedLocation || defaultCenter}
											zoom={selectedLocation ? 16 : MAP_CONFIG.defaultZoom}
											options={{
												...MAP_CONFIG.mapOptions,
												clickableIcons: false,
											}}
											onClick={handleMapClick}
											onLoad={onMapLoad}
											onUnmount={onMapUnmount}
										>
											{selectedLocation && window.google?.maps && (
												<Marker
													position={selectedLocation}
													animation={
														window.google.maps.Animation
															? window.google.maps.Animation.DROP
															: undefined
													}
													icon={{
														url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
															<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
																<circle cx="16" cy="16" r="12" fill="#31A342" stroke="#ffffff" stroke-width="3"/>
															</svg>
														`),
														scaledSize: new window.google.maps.Size(32, 32),
														anchor: new window.google.maps.Point(16, 16),
													}}
												/>
											)}
										</GoogleMap>
									)}
									{/* Click instruction overlay */}
									{isLoaded && !selectedLocation && (
										<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
											{isArabic
												? "انقر على الخريطة لتحديد الموقع"
												: "Click on the map to select location"}
										</div>
									)}
								</div>
							</div>

							{/* Pickup Address Fields */}
							<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
								<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
									{isArabic ? "عنوان الالتقاط" : "Pickup Address"}
								</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
											{isArabic ? "اسم الشارع" : "Street Name"}
										</label>
										<input
											type="text"
											value={streetName}
											onChange={(e) => setStreetName(e.target.value)}
											className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#31A342] transition-colors duration-200"
											placeholder={isArabic ? "أدخل اسم الشارع" : "Enter street name"}
										/>
									</div>
									<div>
										<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
											{isArabic ? "اسم المنطقة" : "Area Name"}
										</label>
										<input
											type="text"
											value={areaName}
											onChange={(e) => setAreaName(e.target.value)}
											className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#31A342] transition-colors duration-200"
											placeholder={isArabic ? "أدخل اسم المنطقة" : "Enter area name"}
										/>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
												{isArabic ? "المدينة" : "City"}
											</label>
											<input
												type="text"
												value={city}
												onChange={(e) => setCity(e.target.value)}
												className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#31A342] transition-colors duration-200"
												placeholder={isArabic ? "أدخل المدينة" : "Enter city"}
											/>
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
												{isArabic ? "المبنى" : "Building"}
											</label>
											<input
												type="text"
												value={building}
												onChange={(e) => setBuilding(e.target.value)}
												className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#31A342] transition-colors duration-200"
												placeholder={isArabic ? "أدخل المبنى" : "Enter building"}
											/>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Continue Button */}
					<motion.div variants={itemVariants} className="flex justify-center pt-4">
						<motion.button
							onClick={handleContinue}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full sm:w-auto min-w-[200px] px-8 py-4 bg-[#31A342] hover:bg-[#2a8f38] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#31A342]/50 text-base sm:text-lg"
						>
							{isArabic ? "يكمل" : "Continue"}
						</motion.button>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}

