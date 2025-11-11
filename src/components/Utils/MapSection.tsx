import React, { useRef } from "react";
import { Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";

interface MapSectionProps {
	title: string;
	location: string;
	onLocationChange: (location: string) => void;
	isLoaded: boolean;
	loadError?: Error;
	isArabic: boolean;
	t: (key: string) => string;
	defaultCenter: { lat: number; lng: number };
}

/**
 * Reusable Map Section Component
 * Google Maps integration with autocomplete search
 * Supports RTL/LTR and responsive design
 */
export const MapSection: React.FC<MapSectionProps> = ({
	title,
	location,
	onLocationChange,
	isLoaded,
	loadError,
	isArabic,
	t,
	defaultCenter,
}) => {
	const autocompleteRef = useRef<any>(null);

	const handlePlaceChanged = () => {
		const place = autocompleteRef.current?.getPlace();
		if (place?.geometry?.location) {
			const lat = place.geometry.location.lat();
			const lng = place.geometry.location.lng();
			onLocationChange(`${lat},${lng}`);
		}
	};

	const handleGetCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					onLocationChange(`${pos.coords.latitude},${pos.coords.longitude}`);
				},
				() => {
					alert(t('kaidhaForm.locationError'));
				}
			);
		} else {
			alert(t('kaidhaForm.locationNotSupported'));
		}
	};

	return (
		<div className="mt-8 sm:mt-10 md:mt-12">
			<div className="mb-4 sm:mb-6">
				<h2 className={`text-lg sm:text-xl md:text-2xl font-bold text-green-600 dark:text-green-400 ${isArabic ? "text-right" : "text-left"}`}>
					{title}
				</h2>
				<div className={`mt-2 h-1 w-16 sm:w-20 bg-gradient-to-r ${isArabic ? 'from-green-600 dark:from-green-500 to-green-500 dark:to-green-400' : 'from-green-500 dark:from-green-400 to-green-600 dark:to-green-500'} rounded-full`} />
			</div>
			
			<div className="relative h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-lg">
				{loadError ? (
					<div className="flex h-full items-center justify-center bg-red-50 dark:bg-red-900/20 p-4 sm:p-6">
						<div className="text-center max-w-md">
							<svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-red-500 dark:text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<h3 className="text-base sm:text-lg font-semibold text-red-900 dark:text-red-300 mb-2">
								{isArabic ? "خطأ في تحميل الخريطة" : "Map Loading Error"}
							</h3>
							<p className="text-xs sm:text-sm text-red-700 dark:text-red-400">
								{isArabic 
									? "يرجى التأكد من إضافة مفتاح Google Maps API في ملف .env"
									: "Please ensure Google Maps API key is added in .env file"
								}
							</p>
							<p className="text-xs text-red-600 dark:text-red-500 mt-2">
								NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
							</p>
						</div>
					</div>
				) : isLoaded && typeof window !== 'undefined' && typeof google !== 'undefined' ? (
					<>
						{/* Search Box - Responsive */}
						<div className={`absolute top-3 sm:top-4 left-1/2 z-20 w-[90%] sm:w-[85%] md:w-[80%] lg:max-w-md -translate-x-1/2 ${isArabic ? 'text-right' : 'text-left'}`}>
							<Autocomplete
								onLoad={(ac) => (autocompleteRef.current = ac)}
								onPlaceChanged={handlePlaceChanged}
							>
								<input
									type="text"
									placeholder={t('kaidhaForm.searchLocation')}
									className={`w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 dark:text-gray-200 shadow-xl transition-all focus:border-[#31A342] dark:focus:border-green-400 focus:ring-2 focus:ring-[#31A342]/20 dark:focus:ring-green-400/20 focus:outline-none ${isArabic ? 'text-right' : 'text-left'}`}
								/>
							</Autocomplete>
						</div>

						{/* Current Location Button - Responsive */}
						<button
							type="button"
							onClick={handleGetCurrentLocation}
							className={`absolute top-16 sm:top-20 z-20 rounded-lg bg-[#31A342] px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-xl transition-all hover:bg-[#2a8f39] focus:outline-none focus:ring-2 focus:ring-[#31A342] focus:ring-offset-2 ${
								isArabic ? 'right-3 sm:right-4' : 'left-3 sm:left-4'
							}`}
						>
							<span className={`flex items-center ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
								<svg className={`h-4 w-4 sm:h-5 sm:w-5 ${isArabic ? 'ml-1 sm:ml-2' : 'mr-1 sm:mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								<span className="hidden sm:inline">{t('kaidhaForm.myLocation')}</span>
							</span>
						</button>

						{/* Google Map */}
						<GoogleMap
							mapContainerStyle={{ width: "100%", height: "100%" }}
							center={
								location
									? {
											lat: parseFloat(location.split(",")[0]),
											lng: parseFloat(location.split(",")[1]),
										}
									: defaultCenter
							}
							zoom={13}
							options={{
								zoomControl: true,
								streetViewControl: false,
								mapTypeControl: true,
								fullscreenControl: true,
								clickableIcons: false,
							}}
							onClick={(e) => {
								if (e.latLng) {
									onLocationChange(`${e.latLng.lat()},${e.latLng.lng()}`);
								}
							}}
						>
							{location && (
								<Marker
									position={{
										lat: parseFloat(location.split(",")[0]),
										lng: parseFloat(location.split(",")[1]),
									}}
									animation={typeof google !== 'undefined' ? google.maps.Animation.DROP : undefined}
								/>
							)}
						</GoogleMap>

						{/* Location Info Badge - Responsive */}
						{location && (
							<div className={`absolute bottom-3 sm:bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg ${isArabic ? 'text-right' : 'text-left'}`}>
								<p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
									📍 {t('kaidhaForm.locationSelected')}
								</p>
							</div>
						)}
					</>
				) : (
					<div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 dark:from-gray-800 to-gray-100 dark:to-gray-900">
						<div className="text-center">
							<div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-[#31A342] dark:border-green-400 border-t-transparent"></div>
							<p className="mt-4 text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">{t('kaidhaForm.loadingMap')}</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

