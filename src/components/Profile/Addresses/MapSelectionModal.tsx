"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaTimes, FaMapMarkerAlt, FaSearch, FaCheck, FaSpinner } from "react-icons/fa";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { reverseGeocode, MAP_CONFIG, debounce, getRequestStats } from "@/lib/maps/utils";

interface MapSelectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectAddress: (address: {
		address: string;
		details: string;
		coordinates: { lat: number; lng: number };
	}) => void;
}

// Use shared configuration (cost optimization)
const mapContainerStyle = MAP_CONFIG.containerStyle;
const defaultCenter = MAP_CONFIG.defaultCenter;
const mapOptions = MAP_CONFIG.mapOptions;
const libraries = MAP_CONFIG.libraries;

// Memoize map component to prevent unnecessary re-renders
const MemoizedGoogleMap = memo(GoogleMap);
const MemoizedMarker = memo(Marker);

function MapSelectionModal({ isOpen, onClose, onSelectAddress }: MapSelectionModalProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [addressDetails, setAddressDetails] = useState({
		address: "",
		details: ""
	});
	const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
	const mapRef = useRef<google.maps.Map | null>(null);

	// Load Google Maps API (uses singleton pattern to prevent multiple loads)
	const { isLoaded, loadError } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: libraries
	});

	// No need to initialize geocoder - using shared utility

	// Reset state when modal closes
	useEffect(() => {
		if (!isOpen) {
			setSelectedLocation(null);
			setAddressDetails({ address: "", details: "" });
			setSearchQuery("");
		}
	}, [isOpen]);

	// Mock address suggestions - in real app, this would come from a geocoding service
	const mockAddresses = [
		{
			address: isArabic ? "شارع الملك فهد، حي النخيل، الرياض" : "King Fahd Street, Al-Nakheel District, Riyadh",
			details: isArabic ? "مبنى رقم 123، الطابق الثاني" : "Building 123, 2nd Floor",
			coordinates: { lat: 24.7136, lng: 46.6753 }
		},
		{
			address: isArabic ? "شارع العليا، حي العليا، الرياض" : "Al-Olaya Street, Al-Olaya District, Riyadh",
			details: isArabic ? "مبنى المكاتب التجارية" : "Commercial Office Building",
			coordinates: { lat: 24.6877, lng: 46.7219 }
		},
		{
			address: isArabic ? "شارع التحلية، حي التحلية، جدة" : "Al-Tahlia Street, Al-Tahlia District, Jeddah",
			details: isArabic ? "فيلا رقم 67" : "Villa 67",
			coordinates: { lat: 21.4858, lng: 39.1925 }
		}
	];

	const [filteredAddresses, setFilteredAddresses] = useState(mockAddresses);

	useEffect(() => {
		if (searchQuery) {
			const filtered = mockAddresses.filter(addr => 
				addr.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
				addr.details.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredAddresses(filtered);
		} else {
			setFilteredAddresses(mockAddresses);
		}
	}, [searchQuery, isArabic]);

	const handleSelectAddress = (address: typeof mockAddresses[0]) => {
		setSelectedLocation(address.coordinates);
		setAddressDetails({
			address: address.address,
			details: address.details
		});
	};

	const handleConfirmSelection = () => {
		if (selectedLocation && addressDetails.address) {
			onSelectAddress({
				address: addressDetails.address,
				details: addressDetails.details,
				coordinates: selectedLocation
			});
			onClose();
		}
	};

	// Reverse geocode using shared utility (includes caching - major cost savings)
	const handleReverseGeocode = useCallback(async (lat: number, lng: number) => {
		if (!isLoaded) return;

		setIsReverseGeocoding(true);
		try {
			const result = await reverseGeocode(lat, lng, isArabic ? 'ar' : 'en');
			setAddressDetails(result);
		} catch (error) {
			console.error('Reverse geocoding error:', error);
			setAddressDetails({
				address: isArabic ? "عنوان محدد على الخريطة" : "Address selected on map",
				details: isArabic ? "تم تحديد الموقع على الخريطة" : "Location selected on map"
			});
		} finally {
			setIsReverseGeocoding(false);
		}
	}, [isLoaded, isArabic]);

	// Debounced geocoding with increased delay for better cost optimization
	// 500ms delay reduces API calls while maintaining good UX
	const debouncedGeocode = useMemo(
		() => debounce(handleReverseGeocode, 500),
		[handleReverseGeocode]
	);

	const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
		if (!event.latLng || !isLoaded) return;
		
		const lat = event.latLng.lat();
		const lng = event.latLng.lng();
		
		// Round to 4 decimal places to increase cache hits (~11 meters precision)
		const roundedLat = parseFloat(lat.toFixed(4));
		const roundedLng = parseFloat(lng.toFixed(4));
		
		setSelectedLocation({ lat: roundedLat, lng: roundedLng });
		
		// Use debounced geocoding to reduce API calls
		// Cache will handle deduplication if same location clicked
		debouncedGeocode(roundedLat, roundedLng);
	}, [debouncedGeocode, isLoaded]);

	const onMapLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map;
	}, []);

	const onMapUnmount = useCallback(() => {
		mapRef.current = null;
	}, []);

	if (!isOpen) return null;

	return (
		<div 
			className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 modal-overlay" 
			dir={direction}
			onClick={onClose}
		>
			<div 
				className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-6xl w-full h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col modal-content"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Mobile Drag Handle */}
				<div className="sm:hidden w-full pt-3 pb-2 flex justify-center">
					<div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
				</div>

				{/* Modal Header - Sticky */}
				<div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-20 flex-shrink-0">
					<div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
						<div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
							<FaMapMarkerAlt className="text-white text-base sm:text-lg" />
						</div>
						<div className="flex-1 min-w-0">
							<h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">
								{isArabic ? "اختيار العنوان من الخريطة" : "Select Address from Map"}
							</h2>
							<p className="text-gray-600 text-xs sm:text-sm hidden sm:block truncate">
								{isArabic ? "ابحث عن عنوان أو انقر على الخريطة" : "Search for an address or click on the map"}
							</p>
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

				{/* Modal Body - Mobile Optimized Layout */}
				<div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
					{/* Mobile: Map First, Desktop: Sidebar First */}
					{/* Search and Address List - Hidden on mobile when map is shown */}
					<div className="hidden lg:flex lg:w-80 border-r border-gray-200 flex flex-col bg-white">
						{/* Search Bar */}
						<div className="p-4 border-b border-gray-200 bg-gray-50">
							<div className="relative">
								<FaSearch className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 text-sm ${isArabic ? 'right-3' : 'left-3'}`} />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder={isArabic ? "ابحث عن عنوان..." : "Search for address..."}
									className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all bg-white shadow-sm`}
									dir={direction}
								/>
							</div>
						</div>

						{/* Address List */}
						<div className="flex-1 overflow-y-auto p-4">
							<div className="space-y-3">
								{filteredAddresses.map((address, index) => (
									<button
										key={index}
										onClick={() => handleSelectAddress(address)}
										className={`w-full p-4 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
											selectedLocation?.lat === address.coordinates.lat && selectedLocation?.lng === address.coordinates.lng
												? 'border-green-500 bg-green-50 shadow-md scale-[1.02]'
												: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]'
										}`}
										dir={direction}
									>
										<div className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
											<div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
												selectedLocation?.lat === address.coordinates.lat && selectedLocation?.lng === address.coordinates.lng
													? 'bg-green-100'
													: 'bg-gray-100'
											}`}>
												<FaMapMarkerAlt className={`text-sm ${
													selectedLocation?.lat === address.coordinates.lat && selectedLocation?.lng === address.coordinates.lng
														? 'text-green-600'
														: 'text-gray-500'
												}`} />
											</div>
											<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
												<p className="text-sm font-semibold text-gray-900 mb-1 leading-relaxed">
													{address.address}
												</p>
												<p className="text-xs text-gray-600">
													{address.details}
												</p>
											</div>
										</div>
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Map Area - Full Screen on Mobile */}
					<div className="flex-1 relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-0 order-first lg:order-last">
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
						{isLoaded && isOpen && (
							<MemoizedGoogleMap
								mapContainerStyle={mapContainerStyle}
								center={defaultCenter}
								zoom={mapOptions.zoom}
								options={mapOptions}
								onLoad={onMapLoad}
								onUnmount={onMapUnmount}
								onClick={handleMapClick}
							>
								{selectedLocation && (
									<MemoizedMarker
										position={{
											lat: selectedLocation.lat,
											lng: selectedLocation.lng
										}}
										title={isArabic ? "الموقع المحدد" : "Selected Location"}
										animation={window.google?.maps?.Animation ? window.google.maps.Animation.DROP : undefined}
									/>
								)}
							</MemoizedGoogleMap>
						)}

						{/* Selected Location Indicator - Mobile Optimized */}
						{selectedLocation && (
							<div className={`absolute top-3 sm:top-4 ${isArabic ? 'left-3 sm:left-4' : 'right-3 sm:right-4'} bg-white/95 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 shadow-xl border border-gray-200 z-10`}>
								<div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
									<div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
										<FaMapMarkerAlt className="text-white text-xs" />
									</div>
									<span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
										{isArabic ? "موقع محدد" : "Location Selected"}
									</span>
								</div>
							</div>
						)}

						{/* Mobile Search Bar - Overlay on Map */}
						<div className="lg:hidden absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md">
							<div className="relative">
								<FaSearch className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 text-sm ${isArabic ? 'right-3' : 'left-3'}`} />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder={isArabic ? "ابحث عن عنوان..." : "Search for address..."}
									className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border-2 border-white/90 bg-white/95 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-all shadow-xl`}
									dir={direction}
								/>
							</div>
						</div>

						{/* Mobile Address Suggestions - Slide Up from Bottom */}
						{searchQuery && filteredAddresses.length > 0 && (
							<div className="lg:hidden absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[40vh] overflow-y-auto z-20 animate-in slide-in-from-bottom duration-300">
								<div className="p-4 space-y-2 border-b border-gray-200 sticky top-0 bg-white">
									<h4 className="text-sm font-semibold text-gray-900">
										{isArabic ? "النتائج" : "Results"}
									</h4>
								</div>
								<div className="p-4 space-y-2">
									{filteredAddresses.map((address, index) => (
										<button
											key={index}
											onClick={() => {
												handleSelectAddress(address);
												setSearchQuery("");
											}}
											className={`w-full p-4 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
												selectedLocation?.lat === address.coordinates.lat && selectedLocation?.lng === address.coordinates.lng
													? 'border-green-500 bg-green-50'
													: 'border-gray-200 hover:border-gray-300 active:scale-[0.98]'
											}`}
											dir={direction}
										>
											<div className={`flex items-start gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
												<div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
													<FaMapMarkerAlt className="text-gray-500 text-sm" />
												</div>
												<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
													<p className="text-sm font-semibold text-gray-900 mb-1">
														{address.address}
													</p>
													<p className="text-xs text-gray-600">
														{address.details}
													</p>
												</div>
											</div>
										</button>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Selected Address Preview - Sticky Footer */}
				{selectedLocation && (
					<div className="p-4 sm:p-6 border-t border-gray-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 sticky bottom-0 z-20 flex-shrink-0 shadow-lg">
						<div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
							<div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
								<h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">
									{isArabic ? "العنوان المحدد" : "Selected Address"}
								</h4>
								{isReverseGeocoding ? (
									<div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : 'flex-row'}`}>
										<FaSpinner className="animate-spin text-green-600 text-base" />
										<p className="text-sm text-gray-600 font-medium">
											{isArabic ? "جاري جلب العنوان..." : "Fetching address..."}
										</p>
									</div>
								) : (
									<div className="space-y-1">
										<p className="text-sm sm:text-base text-gray-900 font-medium leading-relaxed">{addressDetails.address}</p>
										{addressDetails.details && (
											<p className="text-xs sm:text-sm text-gray-600">{addressDetails.details}</p>
										)}
									</div>
								)}
							</div>
							<button
								onClick={handleConfirmSelection}
								disabled={isReverseGeocoding || !addressDetails.address}
								className="flex items-center justify-center gap-2.5 px-6 py-4 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl touch-manipulation w-full sm:w-auto min-w-[140px]"
							>
								<FaCheck className="text-base" />
								<span>{isArabic ? "تأكيد" : "Confirm"}</span>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

// Memoize component to prevent unnecessary re-renders
export default memo(MapSelectionModal);
