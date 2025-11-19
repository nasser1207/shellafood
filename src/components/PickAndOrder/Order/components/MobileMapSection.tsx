"use client";

import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Loader2, AlertCircle, Map as MapIcon } from "lucide-react";
import { MAP_CONFIG } from "@/lib/maps/utils";

interface MobileMapSectionProps {
	isLoaded: boolean;
	loadError: any;
	mapCenter: { lat: number; lng: number };
	defaultCenter: { lat: number; lng: number };
	handleMapClick: (event: google.maps.MapMouseEvent) => void;
	isGeocoding: boolean;
	mapRef: React.MutableRefObject<google.maps.Map | null>;
	locationSelected: boolean;
	isArabic: boolean;
	allPoints?: Array<{
		id: string;
		location: { lat: number; lng: number } | null;
		type: "pickup" | "dropoff";
		label: string;
	}>;
}

export default function MobileMapSection({
	isLoaded,
	loadError,
	mapCenter,
	defaultCenter,
	handleMapClick,
	isGeocoding,
	mapRef,
	locationSelected,
	isArabic,
	allPoints = [],
}: MobileMapSectionProps) {
	return (
		<div className="w-full h-[60vh] sm:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-lg relative">
			{loadError ? (
				<div className="w-full h-full flex items-center justify-center">
					<div className="text-center px-4">
						<AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3" />
						<p className="text-sm sm:text-base text-red-600">
							{isArabic ? "خطأ في تحميل الخريطة" : "Error loading map"}
						</p>
					</div>
				</div>
			) : !isLoaded ? (
				<div className="w-full h-full flex items-center justify-center">
					<div className="text-center">
						<Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#31A342] animate-spin mx-auto mb-3" />
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
							{isArabic ? "جاري تحميل الخريطة..." : "Loading map..."}
						</p>
					</div>
				</div>
			) : (
				<GoogleMap
					mapContainerStyle={{ width: "100%", height: "100%" }}
					center={mapCenter}
					zoom={mapCenter !== defaultCenter ? 15 : MAP_CONFIG.defaultZoom}
					options={{
						...MAP_CONFIG.mapOptions,
						clickableIcons: false,
						zoomControl: true,
						mapTypeControl: false,
						streetViewControl: false,
						fullscreenControl: false,
					}}
					onClick={handleMapClick}
					onLoad={(map) => {
						mapRef.current = map;
					}}
					onUnmount={() => {
						mapRef.current = null;
					}}
				>
					{/* Show all points on map */}
					{allPoints.map((point, idx) => {
						if (!point.location) return null;
						
						const isPickup = point.type === "pickup";
						const color = isPickup ? "#31A342" : "#FA9D2B";
						
						return (
							<Marker
								key={point.id}
								position={point.location}
								animation={
									window.google?.maps?.Animation
										? window.google.maps.Animation.DROP
										: undefined
								}
								icon={{
									url:
										"data:image/svg+xml;charset=UTF-8," +
										encodeURIComponent(`
											<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
												<circle cx="24" cy="24" r="18" fill="${color}" stroke="#ffffff" stroke-width="4"/>
												<text x="24" y="30" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${idx + 1}</text>
											</svg>
										`),
									scaledSize: new window.google.maps.Size(48, 48),
									anchor: new window.google.maps.Point(24, 24),
								}}
								label={{
									text: point.label,
									color: "#ffffff",
									fontSize: "0px", // Hidden on mobile
								}}
							/>
						);
					})}

					{/* Current selected marker */}
					{locationSelected && window.google?.maps && (
						<Marker
							position={mapCenter}
							animation={window.google.maps.Animation.BOUNCE}
							icon={{
								url:
									"data:image/svg+xml;charset=UTF-8," +
									encodeURIComponent(`
										<svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
											<circle cx="28" cy="28" r="22" fill="#31A342" stroke="#ffffff" stroke-width="5"/>
											<circle cx="28" cy="28" r="8" fill="#ffffff"/>
										</svg>
									`),
								scaledSize: new window.google.maps.Size(56, 56),
								anchor: new window.google.maps.Point(28, 28),
							}}
						/>
					)}
				</GoogleMap>
			)}

			{/* Geocoding Indicator */}
			{isGeocoding && (
				<div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#31A342] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10">
					<Loader2 className="w-4 h-4 animate-spin" />
					<span className="text-sm font-semibold">
						{isArabic ? "جاري تحديد العنوان..." : "Getting address..."}
					</span>
				</div>
			)}

			{/* Click instruction overlay */}
			{isLoaded && !locationSelected && (
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 animate-pulse z-10 max-w-[90%]">
					<MapIcon className="w-4 h-4 flex-shrink-0" />
					<span>{isArabic ? "انقر على الخريطة" : "Tap on map"}</span>
				</div>
			)}
		</div>
	);
}

