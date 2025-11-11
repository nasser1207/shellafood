"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, memo } from "react";
import { FaTimes, FaMapMarkerAlt, FaDirections, FaCopy } from "react-icons/fa";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MAP_CONFIG } from "@/lib/maps/utils";

interface Address {
	id: string;
	type: string;
	title: string;
	address: string;
	details: string;
	phone: string;
	isDefault: boolean;
	coordinates: { lat: number; lng: number };
}

interface MapModalProps {
	isOpen: boolean;
	onClose: () => void;
	address: Address | null;
}

// Use shared configuration (cost optimization)
const mapContainerStyle = MAP_CONFIG.containerStyle;
const mapOptions = { ...MAP_CONFIG.mapOptions, zoom: 15 }; // Higher zoom for address display
const libraries = MAP_CONFIG.libraries;

// Memoize map component to prevent unnecessary re-renders (cost optimization)
const MemoizedGoogleMap = memo(GoogleMap);

function MapModal({ isOpen, onClose, address }: MapModalProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	// Load Google Maps API (uses singleton pattern to prevent multiple loads)
	const { isLoaded, loadError } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: libraries
	});

	// Memoize center to prevent unnecessary map re-renders
	const center = useMemo(() => {
		return address ? {
			lat: address.coordinates.lat,
			lng: address.coordinates.lng
		} : MAP_CONFIG.defaultCenter;
	}, [address?.coordinates?.lat, address?.coordinates?.lng]);

	const handleGetDirections = () => {
		if (address) {
			const url = `https://www.google.com/maps/dir/?api=1&destination=${address.coordinates.lat},${address.coordinates.lng}`;
			window.open(url, '_blank');
		}
	};

	const handleCopyAddress = () => {
		if (address) {
			const fullAddress = `${address.address}, ${address.details}`;
			navigator.clipboard.writeText(fullAddress);
			// You could add a toast notification here
			alert(isArabic ? "تم نسخ العنوان" : "Address copied to clipboard");
		}
	};

	if (!isOpen || !address) return null;

	return (
		<div 
			className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 modal-overlay" 
			dir={direction}
			onClick={onClose}
		>
			<div 
				className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-6xl sm:max-h-[90vh] overflow-hidden modal-content"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Mobile Drag Handle */}
				<div className="sm:hidden w-full pt-3 pb-2 flex justify-center">
					<div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
				</div>

				{/* Modal Header - Sticky on mobile */}
				<div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-20">
					<div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
						<div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
							<FaMapMarkerAlt className="text-white text-base sm:text-lg" />
						</div>
						<div className="flex-1 min-w-0">
							<h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">
								{isArabic ? "عرض على الخريطة" : "View on Map"}
							</h2>
							<p className="text-gray-600 text-xs sm:text-sm truncate">{address.title}</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 sm:p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all touch-manipulation flex-shrink-0"
						aria-label={isArabic ? "إغلاق" : "Close"}
					>
						<FaTimes className="text-lg sm:text-xl" />
					</button>
				</div>

				{/* Modal Body - Mobile Optimized */}
				<div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] sm:h-auto sm:max-h-[calc(90vh-80px)]">
					{/* Map Container - Full height on mobile */}
					<div className="flex-1 h-[60vh] sm:h-64 lg:h-96 bg-gray-100 relative min-h-[300px] sm:min-h-[400px]">
						{loadError && (
							<div className="absolute inset-0 flex items-center justify-center bg-red-50">
								<div className="text-center p-4">
									<p className="text-red-600 text-sm font-medium mb-2">
										{isArabic ? "فشل تحميل الخريطة" : "Failed to load map"}
									</p>
									<p className="text-red-500 text-xs">
										{loadError.message}
									</p>
								</div>
							</div>
						)}
						{!isLoaded && !loadError && (
							<div className="absolute inset-0 flex items-center justify-center bg-gray-50">
								<div className="text-center">
									<div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
									<p className="text-gray-600 text-sm">
										{isArabic ? "جاري تحميل الخريطة..." : "Loading map..."}
									</p>
								</div>
							</div>
						)}
						{isLoaded && isOpen && address && (
							<MemoizedGoogleMap
								mapContainerStyle={mapContainerStyle}
								center={center}
								zoom={mapOptions.zoom}
								options={mapOptions}
							>
								<Marker
									position={{
										lat: address.coordinates.lat,
										lng: address.coordinates.lng
									}}
									title={address.title}
									animation={window.google?.maps?.Animation ? window.google.maps.Animation.DROP : undefined}
								/>
							</MemoizedGoogleMap>
						)}
					</div>

					{/* Address Details - Optimized for Mobile */}
					<div className="w-full lg:w-96 xl:w-[420px] p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white overflow-y-auto">
						<div className="space-y-4 sm:space-y-5">
							{/* Address Info */}
							<div>
								<h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
									{isArabic ? "تفاصيل العنوان" : "Address Details"}
								</h3>
								<div className="space-y-3 sm:space-y-4">
									<div className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
										<p className="text-xs sm:text-sm font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
											{isArabic ? "العنوان" : "ADDRESS"}
										</p>
										<p className="text-sm sm:text-base text-gray-900 leading-relaxed">{address.address}</p>
									</div>
									{address.details && (
										<div className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
											<p className="text-xs sm:text-sm font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
												{isArabic ? "التفاصيل الإضافية" : "ADDITIONAL DETAILS"}
											</p>
											<p className="text-sm sm:text-base text-gray-900 leading-relaxed">{address.details}</p>
										</div>
									)}
									<div className="p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
										<p className="text-xs sm:text-sm font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
											{isArabic ? "رقم الهاتف" : "PHONE NUMBER"}
										</p>
										<p className="text-sm sm:text-base text-gray-900 font-medium">{address.phone}</p>
									</div>
								</div>
							</div>

							{/* Action Buttons - Mobile Optimized */}
							<div className="space-y-3 pt-2">
								<button
									onClick={handleGetDirections}
									className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl touch-manipulation"
								>
									<FaDirections className="text-base" />
									<span>{isArabic ? "الحصول على الاتجاهات" : "Get Directions"}</span>
								</button>
								<button
									onClick={handleCopyAddress}
									className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all font-semibold text-sm sm:text-base shadow-sm hover:shadow-md touch-manipulation"
								>
									<FaCopy className="text-base" />
									<span>{isArabic ? "نسخ العنوان" : "Copy Address"}</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Memoize component to prevent unnecessary re-renders
export default memo(MapModal);
