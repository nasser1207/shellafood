"use client";

import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { MapPin, ChevronDown, Plus, Map, Trash2 } from "lucide-react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { reverseGeocode, MAP_CONFIG, debounce } from "@/lib/maps/utils";

interface Address {
	id: string;
	address: string;
	createdAt: string;
	formattedAddress?: string;
	lat?: number;
	lng?: number;
}

interface DeliveryAddressSelectorProps {
	onAddressChange?: (address: Address | null) => void;
}

export default function DeliveryAddressSelector({ onAddressChange }: DeliveryAddressSelectorProps) {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [showMapModal, setShowMapModal] = useState(false);

	// تحميل مكتبة جوجل - فقط places (cost optimization)
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: MAP_CONFIG.libraries, // Only load what's needed
	});

	// جلب العناوين من API - محسّن لتقليل التكاليف
	useEffect(() => {
		let isMounted = true;
		let abortController = new AbortController();
		
		async function fetchAddresses() {
			try {
				const { getAddressesAction } = await import("@/app/actions/address");
				const result = await getAddressesAction();
				if (!result.success) {
					return;
				}
				const addressesData = result.data?.addresses || [];
				
				// تحسين: تحويل الإحداثيات فقط عند الحاجة (lazy geocoding)
				// بدلاً من تحويل جميع العناوين دفعة واحدة (cost optimization)
				const addressesWithFormatted = addressesData.map((address: Address) => {
					try {
						const [lat, lng] = address.address.split(",").map(Number);
						if (isNaN(lat) || isNaN(lng)) {
							// إذا لم تكن إحداثيات، نرجع العنوان كما هو
							return { ...address, formattedAddress: address.address };
						}
						
						// استخدام الإحداثيات مباشرة كعنوان مؤقت
						// سيتم تحويلها عند الحاجة (lazy loading)
						return { 
							...address, 
							formattedAddress: address.address, // مؤقت
							lat,
							lng
						};
					} catch (error) {
						return { ...address, formattedAddress: address.address };
					}
				});
				
				if (isMounted) {
					setAddresses(addressesWithFormatted);
					
					// تحويل أول عنوان فقط (cost optimization)
					if (addressesWithFormatted.length > 0 && isLoaded) {
						const firstAddress = addressesWithFormatted[0];
						if (firstAddress.lat && firstAddress.lng) {
							// Geocode first address only (async, non-blocking)
							reverseGeocode(firstAddress.lat, firstAddress.lng, 'ar')
								.then(({ address }) => {
									if (isMounted) {
										setAddresses(prev => 
											prev.map(addr => 
												addr.id === firstAddress.id 
													? { ...addr, formattedAddress: address }
													: addr
											)
										);
										const updated = { ...firstAddress, formattedAddress: address };
										setSelectedAddress(updated);
										onAddressChange?.(updated);
									}
								})
								.catch(() => {
									// Fallback to coordinates if geocoding fails
									if (isMounted) {
										setSelectedAddress(firstAddress);
										onAddressChange?.(firstAddress);
									}
								});
						} else {
							setSelectedAddress(firstAddress);
							onAddressChange?.(firstAddress);
						}
					}
				}
			} catch (err: any) {
				if (err.name !== 'AbortError') {
					console.error("Error fetching addresses:", err);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}
		
		// انتظار تحميل Google Maps API
		if (isLoaded) {
			fetchAddresses();
		} else {
			// Fetch addresses without geocoding if Maps not loaded
			fetchAddresses();
		}
		
		// Cleanup function
		return () => {
			isMounted = false;
			abortController.abort();
		};
	}, [isLoaded]);
	
	// Lazy geocode address when selected (cost optimization)
	const handleAddressSelectWithGeocode = useCallback(async (address: Address) => {
		setSelectedAddress(address);
		setIsOpen(false);
		
		// Only geocode if not already formatted and has coordinates
		if (!address.formattedAddress && address.lat && address.lng && isLoaded) {
			try {
				const { address: formatted } = await reverseGeocode(address.lat, address.lng, 'ar');
				const updated = { ...address, formattedAddress: formatted };
				setAddresses(prev => 
					prev.map(addr => addr.id === address.id ? updated : addr)
				);
				setSelectedAddress(updated);
				onAddressChange?.(updated);
			} catch {
				// Fallback
				onAddressChange?.(address);
			}
		} else {
			onAddressChange?.(address);
		}
	}, [isLoaded, onAddressChange]);


	const handleDeleteAddress = async (addressId: string, event: React.MouseEvent) => {
		event.stopPropagation(); // منع فتح القائمة المنسدلة
		
		try {
			const { deleteAddressAction } = await import("@/app/actions/address");
			const result = await deleteAddressAction(addressId);

			if (result.success) {
				// إزالة العنوان من القائمة
				setAddresses(prev => prev.filter(addr => addr.id !== addressId));
				
				// إذا كان العنوان المحذوف هو المحدد حالياً، نختار عنوان آخر
				if (selectedAddress?.id === addressId) {
					const remainingAddresses = addresses.filter(addr => addr.id !== addressId);
					if (remainingAddresses.length > 0) {
						setSelectedAddress(remainingAddresses[0]);
						onAddressChange?.(remainingAddresses[0]);
					} else {
						setSelectedAddress(null);
						onAddressChange?.(null);
					}
				}
			} else {
				console.error('فشل في حذف العنوان');
			}
		} catch (error) {
			console.error('خطأ في حذف العنوان:', error);
		}
	};

	const handleMapLocationSelect = useCallback(async (lat: number, lng: number, formattedAddress: string) => {
		try {
			// حفظ العنوان الجديد في قاعدة البيانات
			const { addAddressAction } = await import("@/app/actions/address");
			const addressString = `${lat},${lng}`;
			const result = await addAddressAction({ address: addressString });

			if (result.success && result.data) {
				const newAddress: Address = {
					id: result.data.addressId,
					address: `${lat},${lng}`,
					formattedAddress,
					lat,
					lng,
					createdAt: new Date().toISOString()
				};
				
				// إضافة العنوان الجديد إلى قائمة العناوين
				setAddresses(prev => [newAddress, ...prev]);
				setSelectedAddress(newAddress);
				setIsOpen(false);
				setShowMapModal(false);
				onAddressChange?.(newAddress);
			} else {
				console.error('فشل في حفظ العنوان الجديد');
				// في حالة الفشل، نستخدم العنوان كعنوان مؤقت
				const tempAddress: Address = {
					id: `temp_${Date.now()}`,
					address: `${lat},${lng}`,
					formattedAddress,
					lat,
					lng,
					createdAt: new Date().toISOString()
				};
				
				setSelectedAddress(tempAddress);
				setIsOpen(false);
				setShowMapModal(false);
				onAddressChange?.(tempAddress);
			}
		} catch (error) {
			console.error('خطأ في حفظ العنوان:', error);
			// في حالة الفشل، نستخدم العنوان كعنوان مؤقت
			const tempAddress: Address = {
				id: `temp_${Date.now()}`,
				address: `${lat},${lng}`,
				formattedAddress,
				lat,
				lng,
				createdAt: new Date().toISOString()
			};
			
			setSelectedAddress(tempAddress);
			setIsOpen(false);
			setShowMapModal(false);
			onAddressChange?.(tempAddress);
		}
	}, [onAddressChange]);

	if (loading) {
		return (
			<div className="mb-4 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
				<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
					<div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400"></div>
					<span className="text-xs">جارٍ تحميل العناوين...</span>
				</div>
			</div>
		);
	}

	if (addresses.length === 0) {
		return (
			<div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
				<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
					<MapPin className="h-3 w-3" />
					<span className="text-xs">لا توجد عناوين محفوظة</span>
				</div>
			</div>
		);
	}

	return (
		<>
		<div className="mb-4">
			<div className="relative">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="flex w-full items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-right shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
					<div className="flex-1">
						<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
							<MapPin className="h-3 w-3" />
							<span>عنوان التوصيل</span>
						</div>
						<div className="mt-1 text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
							{selectedAddress?.formattedAddress || selectedAddress?.address || "اختر عنوان"}
						</div>
					</div>
				</button>

				{isOpen && (
					<div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
						{/* زر اختيار موقع جديد */}
						<button
							onClick={() => setShowMapModal(true)}
							className="w-full p-3 text-right transition-colors hover:bg-green-50 dark:hover:bg-green-900/20 border-b border-gray-100 dark:border-gray-700"
						>
							<div className="flex items-center gap-2">
								<Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
								<div className="flex-1">
									<div className="text-xs font-medium text-green-600 dark:text-green-400">
										اختيار موقع جديد من الخريطة
									</div>
									<div className="text-xs text-gray-500 dark:text-gray-400">
										اضغط لتحديد موقعك على الخريطة
									</div>
								</div>
								<Map className="h-4 w-4 text-green-600 dark:text-green-400" />
							</div>
						</button>
						
						{/* العناوين المحفوظة */}
						{addresses.map((address) => (
							<div
								key={address.id}
								className={`relative w-full p-3 text-right transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
									selectedAddress?.id === address.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
								}`}
							>
								<button
									onClick={() => handleAddressSelectWithGeocode(address)}
									className="w-full flex items-start gap-2"
								>
									<MapPin className="mt-0.5 h-3 w-3 text-gray-400 dark:text-gray-500" />
									<div className="flex-1">
										<div className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
											{address.formattedAddress || address.address}
										</div>
										<div className="text-xs text-gray-500 dark:text-gray-400">
											{new Date(address.createdAt).toLocaleDateString('ar-SA')}
										</div>
									</div>
								</button>
								{/* زر الحذف */}
								{!address.id.startsWith('temp_') && (
									<button
										onClick={(e) => handleDeleteAddress(address.id, e)}
										className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
										title="حذف العنوان"
									>
										<Trash2 className="h-3 w-3" />
									</button>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
		{/* مودال الخريطة */}
		{showMapModal && (
			<MapLocationModal
				isOpen={showMapModal}
				onClose={() => setShowMapModal(false)}
				onLocationSelect={handleMapLocationSelect}
				isLoaded={isLoaded}
			/>
		)}
	</>
	);
}

// مكون مودال الخريطة
interface MapLocationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onLocationSelect: (lat: number, lng: number, formattedAddress: string) => void;
	isLoaded: boolean;
}

// Memoize map components to prevent unnecessary re-renders
const MemoizedGoogleMap = memo(GoogleMap);
const MemoizedMarker = memo(Marker);

function MapLocationModal({ isOpen, onClose, onLocationSelect, isLoaded }: MapLocationModalProps) {
	const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
	const [formattedAddress, setFormattedAddress] = useState<string>("");
	const [isGeocoding, setIsGeocoding] = useState(false);

	useEffect(() => {
		if (isOpen && isLoaded) {
			// تحديد موقع افتراضي (الرياض)
			const defaultLocation = MAP_CONFIG.defaultCenter;
			setSelectedLocation(defaultLocation);
			setFormattedAddress(""); // Reset
		}
	}, [isOpen, isLoaded]);

	// Geocoding handler with proper rounding for cache optimization
	const handleReverseGeocode = useCallback(async (lat: number, lng: number) => {
		if (!isLoaded) return;
		
		// Round to 4 decimal places to increase cache hits (~11 meters precision)
		const roundedLat = parseFloat(lat.toFixed(4));
		const roundedLng = parseFloat(lng.toFixed(4));
		
		setIsGeocoding(true);
		try {
			const { address } = await reverseGeocode(roundedLat, roundedLng, 'ar');
			setFormattedAddress(address);
		} catch (error) {
			console.error("Geocoding error:", error);
			setFormattedAddress(`${roundedLat.toFixed(6)}, ${roundedLng.toFixed(6)}`);
		} finally {
			setIsGeocoding(false);
		}
	}, [isLoaded]);

	// Debounced geocoding to reduce API calls (500ms delay for cost optimization)
	const debouncedGeocode = useMemo(
		() => debounce(handleReverseGeocode, 500),
		[handleReverseGeocode]
	);

	// Map click handler with debouncing
	const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
		if (!event.latLng || !isLoaded) return;
		
		const lat = event.latLng.lat();
		const lng = event.latLng.lng();
		
		// Round coordinates for better cache hits
		const roundedLat = parseFloat(lat.toFixed(4));
		const roundedLng = parseFloat(lng.toFixed(4));
		
		setSelectedLocation({ lat: roundedLat, lng: roundedLng });
		
		// Use debounced geocoding
		debouncedGeocode(roundedLat, roundedLng);
	}, [isLoaded, debouncedGeocode]);

	const handleConfirm = () => {
		if (selectedLocation) {
			onLocationSelect(selectedLocation.lat, selectedLocation.lng, formattedAddress);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">اختيار موقعك</h3>
					<button
						onClick={onClose}
						className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Map Container */}
				<div className="h-96 relative">
					{isLoaded && isOpen ? (
						<MemoizedGoogleMap
							mapContainerStyle={MAP_CONFIG.containerStyle}
							center={selectedLocation || MAP_CONFIG.defaultCenter}
							zoom={MAP_CONFIG.defaultZoom}
							onClick={handleMapClick}
							options={{
								...MAP_CONFIG.mapOptions,
								streetViewControl: false,
								mapTypeControl: false,
								fullscreenControl: false,
							}}
						>
							{selectedLocation && (
								<MemoizedMarker
									position={selectedLocation}
									icon={{
										url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
											<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
												<circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="white" stroke-width="3"/>
												<circle cx="16" cy="16" r="6" fill="white"/>
											</svg>
										`),
										scaledSize: new google.maps.Size(32, 32),
									}}
								/>
							)}
						</MemoizedGoogleMap>
					) : (
						<div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
								<p className="text-gray-600 dark:text-gray-400">جارٍ تحميل الخريطة...</p>
							</div>
						</div>
					)}
				</div>

				{/* Address Display */}
				{selectedLocation && (
					<div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
						<div className="flex items-center gap-2 mb-2">
							<MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
							<span className="text-sm font-medium text-gray-700 dark:text-gray-300">الموقع المحدد:</span>
						</div>
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{formattedAddress}</p>
						<div className="flex gap-2">
							<button
								onClick={handleConfirm}
								className="flex-1 bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
							>
								تأكيد الموقع
							</button>
							<button
								onClick={onClose}
								className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
							>
								إلغاء
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
