"use client";

import React from "react";
import { motion } from "framer-motion";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { MAP_CONFIG } from "@/lib/maps/utils";
import { OrderMapData, OrderType, ORDER_TYPE } from "../types";
import DriverInfoCard from "./DriverInfoCard";
import { DriverOrWorker } from "../types";
import { getWorkerTypeLabel } from "../utils/orderStatus";
import { shouldShowMap } from "../utils/routeHelpers";

interface LiveMapContainerProps {
	mapData: OrderMapData;
	mapCenter: { lat: number; lng: number } | null;
	driverOrWorker?: DriverOrWorker;
	etaMinutes?: number | null;
	language: "en" | "ar";
	onCall?: () => void;
	onChat?: () => void;
	onViewDetails?: () => void;
	orderType: OrderType;
	orderStatus: string;
}

export default React.memo(function LiveMapContainer({
	mapData,
	mapCenter,
	driverOrWorker,
	etaMinutes,
	language,
	onCall,
	onChat,
	onViewDetails,
	orderType,
	orderStatus,
}: LiveMapContainerProps) {
	const isArabic = language === "ar";
	const workerTypeLabel = getWorkerTypeLabel(orderType, language);

	// Hide map if driver/worker not assigned or not on the way
	if (!shouldShowMap({ type: orderType, status: orderStatus, driver_or_worker: driverOrWorker, map: mapData })) {
		return null;
	}

	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: MAP_CONFIG.libraries,
	});

	if (!isLoaded || !mapCenter) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
			>
				<div className="h-64 sm:h-80 flex items-center justify-center">
					<div className="text-center">
						<div className="h-12 w-12 animate-spin rounded-full border-t-4 border-b-4 border-green-600 dark:border-green-500 mx-auto mb-3" />
						<p className="text-gray-600 dark:text-gray-400">
							{isArabic ? "جاري تحميل الخريطة..." : "Loading map..."}
						</p>
					</div>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
			className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
		>
			<div className={`p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
				<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
					{isArabic
						? orderType === ORDER_TYPE.SERVICE
							? "تتبع الفني المباشر"
							: "تتبع السائق المباشر"
						: orderType === ORDER_TYPE.SERVICE
							? "Live Technician Tracking"
							: "Live Driver Tracking"}
				</h3>
			</div>
			<div className="relative h-56 sm:h-64 md:h-80">
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
						position={{ lat: mapData.user_lat, lng: mapData.user_lng }}
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
					{mapData.driver_lat && mapData.driver_lng && (
						<Marker
							position={{ lat: mapData.driver_lat, lng: mapData.driver_lng }}
							icon={{
								path: google.maps.SymbolPath.CIRCLE,
								scale: 10,
								fillColor: "#f59e0b",
								fillOpacity: 1,
								strokeColor: "#ffffff",
								strokeWeight: 3,
							}}
							title={driverOrWorker?.name || workerTypeLabel}
							animation={google.maps.Animation.BOUNCE}
						/>
					)}
				</GoogleMap>
				
				{/* ETA Overlay */}
				{etaMinutes && etaMinutes > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="absolute top-2 left-2 right-2 sm:top-4 sm:left-auto sm:right-4 sm:w-auto z-10"
					>
						<div
							className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 ${
								isArabic ? "flex-row-reverse" : ""
							} ${etaMinutes <= 5 ? "ring-2 ring-yellow-400 dark:ring-yellow-500 ring-opacity-50" : ""}`}
						>
							<div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${etaMinutes <= 5 ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`} />
							<span
								className={`text-xs sm:text-sm font-semibold whitespace-nowrap ${
									etaMinutes <= 5 ? "text-yellow-700 dark:text-yellow-400" : "text-gray-900 dark:text-gray-100"
								}`}
							>
								{isArabic
									? `الوصول خلال ${etaMinutes} ${etaMinutes === 1 ? "دقيقة" : "دقائق"}`
									: `Arriving in ${etaMinutes} ${etaMinutes === 1 ? "min" : "mins"}`}
							</span>
						</div>
					</motion.div>
				)}
			</div>
			{driverOrWorker && (
				<DriverInfoCard
					driverOrWorker={driverOrWorker}
					language={language}
					onCall={onCall}
					onChat={onChat}
					onViewDetails={onViewDetails}
					orderType={orderType}
				/>
			)}
		</motion.div>
	);
});

