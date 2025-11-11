"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { User, Phone, MessageCircle, Navigation } from "lucide-react";
import Image from "next/image";
import { MAP_CONFIG } from "@/lib/maps/utils";

interface LiveMapProps {
	language: "en" | "ar";
	userLocation: { lat: number; lng: number };
	driverLocation?: { lat: number; lng: number };
	driverName?: string;
	driverPhone?: string;
	driverPhoto?: string;
	vehicleInfo?: string;
	eta?: number; // in minutes
	onCall?: () => void;
	onChat?: () => void;
}

export default function LiveMap({
	language,
	userLocation,
	driverLocation,
	driverName,
	driverPhone,
	driverPhoto,
	vehicleInfo,
	eta,
	onCall,
	onChat,
}: LiveMapProps) {
	const isArabic = language === "ar";
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [mapCenter, setMapCenter] = useState(userLocation);

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: MAP_CONFIG.libraries,
	});

	// Update map center when driver location changes
	useEffect(() => {
		if (driverLocation) {
			// Center map between user and driver
			setMapCenter({
				lat: (userLocation.lat + driverLocation.lat) / 2,
				lng: (userLocation.lng + driverLocation.lng) / 2,
			});
		} else {
			setMapCenter(userLocation);
		}
	}, [driverLocation, userLocation]);

	// Simulate real-time updates
	useEffect(() => {
		if (!driverLocation) return;

		const interval = setInterval(() => {
			setIsRefreshing(true);
			// In real app, this would fetch new location from API
			setTimeout(() => setIsRefreshing(false), 1000);
		}, 10000); // Update every 10 seconds

		return () => clearInterval(interval);
	}, [driverLocation]);

	if (!isLoaded) {
		return (
			<div className="bg-white dark:bg-[#1B1D22] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
				<div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
					<div className="text-center">
						<div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{isArabic ? "جاري تحميل الخريطة..." : "Loading map..."}
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white dark:bg-[#1B1D22] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
			{/* Header */}
			<div className={`p-4 border-b border-gray-200 dark:border-gray-800 ${isArabic ? "text-right" : "text-left"}`}>
				<div className={`flex items-center justify-between ${isArabic ? "flex-row-reverse" : ""}`}>
					<h3 className="text-lg font-bold text-gray-900 dark:text-white">
						{isArabic ? "الموقع المباشر" : "Live Tracking"}
					</h3>
					{isRefreshing && (
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
							className="w-5 h-5 border-2 border-[#10b981] border-t-transparent rounded-full"
						/>
					)}
				</div>
			</div>

			{/* Map */}
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
					{/* User Location Marker */}
					<Marker
						position={userLocation}
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

					{/* Driver/Technician Location Marker */}
					{driverLocation && (
						<>
							<Marker
								position={driverLocation}
								icon={{
									path: google.maps.SymbolPath.CIRCLE,
									scale: 10,
									fillColor: "#f59e0b",
									fillOpacity: 1,
									strokeColor: "#ffffff",
									strokeWeight: 3,
								}}
								title={driverName || (isArabic ? "الفني" : "Driver")}
								animation={google.maps.Animation.BOUNCE}
							/>
						</>
					)}
				</GoogleMap>

				{/* ETA Overlay */}
				{eta && eta > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-10"
					>
						<div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""} ${
							eta <= 5 ? "ring-2 ring-yellow-400 ring-opacity-50" : ""
						}`}>
							<Navigation className={`w-4 h-4 ${eta <= 5 ? "text-yellow-500" : "text-[#10b981]"}`} />
							<span className={`text-sm font-semibold ${eta <= 5 ? "text-yellow-700 dark:text-yellow-400" : "text-gray-900 dark:text-white"}`}>
								{isArabic ? `الوصول خلال ${eta} ${eta === 1 ? "دقيقة" : "دقائق"}` : `Arriving in ${eta} ${eta === 1 ? "min" : "mins"}`}
							</span>
							{eta <= 5 && (
								<span className="text-xs opacity-75">
									{isArabic ? "قريب!" : "Nearby!"}
								</span>
							)}
						</div>
					</motion.div>
				)}
			</div>

			{/* Driver/Technician Info */}
			{driverName && (
				<div className={`p-4 border-t border-gray-200 dark:border-gray-800 ${isArabic ? "text-right" : "text-left"}`}>
					<div className={`flex items-center gap-3 mb-3 ${isArabic ? "flex-row-reverse" : ""}`}>
						{driverPhoto ? (
							<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0">
								<Image
									src={driverPhoto}
									alt={driverName}
									fill
									className="object-cover"
									sizes="48px"
								/>
							</div>
						) : (
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/30 flex items-center justify-center flex-shrink-0">
								<User className="w-6 h-6 text-[#10b981]" />
							</div>
						)}
						<div className="flex-1 min-w-0">
							<h4 className="font-semibold text-gray-900 dark:text-white truncate">
								{driverName}
							</h4>
							{vehicleInfo && (
								<p className="text-xs text-gray-600 dark:text-gray-400">
									{vehicleInfo}
								</p>
							)}
						</div>
					</div>

					{/* Action Buttons */}
					{(driverPhone || onCall || onChat) && (
						<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
							{driverPhone && (
								<a
									href={`tel:${driverPhone}`}
									className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<Phone className="w-4 h-4" />
									<span>{isArabic ? "اتصال" : "Call"}</span>
								</a>
							)}
							{onChat && (
								<button
									onClick={onChat}
									className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
								>
									<MessageCircle className="w-4 h-4" />
									<span>{isArabic ? "محادثة" : "Chat"}</span>
								</button>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

