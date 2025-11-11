"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooking } from "@/contexts/BookingContext";
import { IndividualServiceData } from "@/lib/data/services";
import { Star, MapPin, ArrowLeft, CheckCircle, MessageCircle, Package, X, Loader2, Expand, Navigation } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MAP_CONFIG } from "@/lib/maps/utils";
import StepperNavigation from "@/components/ServeMe/Booking/StepperNavigation";

interface ChooseWorkerProps {
	serviceData: IndividualServiceData;
	serviceSlug: string;
	serviceTypeSlug: string;
	redirectPath?: string; // Optional redirect path after choosing worker
}

/**
 * Choose Worker Component
 * Two-section layout with workers list on left and map on right
 */
// Use shared configuration (cost optimization)
const mapContainerStyle = MAP_CONFIG.containerStyle;
const defaultCenter = MAP_CONFIG.defaultCenter;
const libraries = MAP_CONFIG.libraries;

interface Worker {
	id: string;
	name: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	price: number;
	experience: string;
	location: string;
	lat: number;
	lng: number;
	distance?: number; // Distance in km
	estimatedTime?: number; // Estimated travel time in minutes
}

// Cache for Distance Matrix API results (memory cache)
const distanceCache = new Map<string, { distance: number; time: number }>();

// Generate cache key from origin and destination
const getCacheKey = (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): string => {
	return `${origin.lat.toFixed(4)}_${origin.lng.toFixed(4)}_${destination.lat.toFixed(4)}_${destination.lng.toFixed(4)}`;
};

// Memoized Worker Card Component to prevent unnecessary re-renders
const WorkerCard = memo<{
	worker: Worker;
	isSelected: boolean;
	onSelect: (id: string) => void;
	onChoose: (id: string) => void;
	serviceSlug: string;
	serviceTypeSlug: string;
	isArabic: boolean;
	router: ReturnType<typeof useRouter>;
}>(({ worker, isSelected, onSelect, onChoose, serviceSlug, serviceTypeSlug, isArabic, router }) => {
	const handleChooseClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		onChoose(worker.id);
	}, [worker.id, onChoose]);

	return (
		<div
			className={`bg-white dark:bg-gray-800 border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
				isSelected
					? "border-[#31A342] dark:border-green-500 shadow-md"
					: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
			}`}
			onClick={() => onSelect(worker.id)}
		>
			<div className="flex items-center gap-4">
				{/* Worker Avatar */}
				<div className="relative flex-shrink-0">
					<Image
						src={worker.avatar}
						alt={worker.name}
						width={60}
						height={60}
						className="w-15 h-15 rounded-full object-cover"
						loading="lazy"
						priority={false}
					/>
					{isSelected && (
						<div className="absolute -top-1 -right-1 w-6 h-6 bg-[#31A342] rounded-full flex items-center justify-center">
							<CheckCircle className="w-4 h-4 text-white" />
						</div>
					)}
				</div>

				{/* Worker Info */}
				<div className="flex-1 min-w-0">
					<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
						<div className={`${isArabic ? "text-right" : "text-left"}`}>
							<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
								{worker.name}
							</h3>
							<p className="text-[#FA9D2B] text-sm font-medium">
								{isArabic ? "خبرة" : "Experience"} {worker.experience}
							</p>
						</div>

						{/* Rating */}
						<div className={`flex items-center gap-1 ${isArabic ? "flex-row-reverse" : ""}`}>
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-4 h-4 ${
											i < Math.floor(worker.rating)
												? "text-yellow-400 fill-yellow-400"
												: "text-gray-300 dark:text-gray-600"
										}`}
									/>
								))}
							</div>
							<span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
								{worker.rating}
							</span>
						</div>
					</div>

					{/* Bottom Section */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
						{/* Price, Distance, and Time */}
						<div className={`${isArabic ? "text-right" : "text-left"}`}>
							<p className="text-sm text-[#31A342] font-bold">
								{isArabic ? "يبدأ سعر الخدمة من" : "Service starts from"} {worker.price} {isArabic ? "ريال" : "SAR"}
							</p>
							{worker.distance !== undefined && (
								<div className="flex items-center gap-2 mt-1">
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{worker.distance.toFixed(1)} {isArabic ? "كم" : "km"}
									</p>
									{worker.estimatedTime !== undefined && (
										<>
											<span className="text-xs text-gray-400">•</span>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{worker.estimatedTime} {isArabic ? "دقيقة" : "min"}
											</p>
										</>
									)}
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex gap-2">
							<Link
								href={`/worker/${worker.id}`}
								prefetch={true}
								onMouseEnter={() => router.prefetch(`/worker/${worker.id}`)}
								className="px-3 py-2 border border-[#FA9D2B] text-[#FA9D2B] rounded-lg text-sm font-medium hover:bg-[#FA9D2B] hover:text-white transition-colors duration-200"
							>
								{isArabic ? "التفاصيل" : "Details"}
							</Link>
							<button
								onClick={handleChooseClick}
								className="px-3 py-2 bg-[#31A342] text-white rounded-lg text-sm font-medium hover:bg-[#2a8f3a] transition-colors duration-200"
							>
								{isArabic ? "اختيار" : "Choose"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

WorkerCard.displayName = "WorkerCard";

const ChooseWorker: React.FC<ChooseWorkerProps> = ({ serviceData, serviceSlug, serviceTypeSlug, redirectPath }) => {
	const { language, t } = useLanguage();
	const router = useRouter();
	const { bookingData, updateBooking } = useBooking();
	const isArabic = language === "ar";
	const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
	const [activeFilter, setActiveFilter] = useState("all");
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [confirmedWorker, setConfirmedWorker] = useState<string | null>(null);
	const [isLoadingWorkers, setIsLoadingWorkers] = useState(true);
	const [workers, setWorkers] = useState<Worker[]>([]);
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [serviceLocation, setServiceLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [searchRadius, setSearchRadius] = useState(5); // Default 5km radius
	const [isExpanding, setIsExpanding] = useState(false);
	
	// Refs for debouncing and caching
	const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const mapRef = useRef<google.maps.Map | null>(null);

	// Handle body overflow when modal is open
	useEffect(() => {
		if (showConfirmModal) {
			// Prevent background scrolling when modal is open
			document.body.style.overflow = 'hidden';
		} else {
			// Restore scrolling when modal is closed
			document.body.style.overflow = '';
		}

		return () => {
			// Always restore scrolling on cleanup
			document.body.style.overflow = '';
		};
	}, [showConfirmModal]);

	const title = isArabic ? serviceData.titleAr : serviceData.titleEn;
	const description = isArabic ? serviceData.descriptionAr : serviceData.descriptionEn;

	// Load Google Maps (singleton pattern - cost optimization)
	const { isLoaded, loadError } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
		libraries: libraries
	});

	// Get service location from booking context (address where service will be performed)
	useEffect(() => {
		if (bookingData?.address?.coordinates) {
			setServiceLocation({
				lat: bookingData.address.coordinates.lat,
				lng: bookingData.address.coordinates.lng,
			});
		}
	}, [bookingData]);

	// Get user's current location as fallback
	useEffect(() => {
		if (!serviceLocation) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						setUserLocation({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						});
					},
					(error) => {
						console.warn("Could not get user location:", error);
						// Use default location (Riyadh) if geolocation fails
						setUserLocation({ lat: 24.7136, lng: 46.6753 });
					},
					{
						enableHighAccuracy: true,
						timeout: 5000,
						maximumAge: 0,
					}
				);
			} else {
				// Use default location if geolocation is not supported
				setUserLocation({ lat: 24.7136, lng: 46.6753 });
			}
		}
	}, [serviceLocation]);

	// Calculate distance between two coordinates using Haversine formula
	const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
		const R = 6371; // Earth's radius in kilometers
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distance in kilometers
	}, []);

	// Calculate estimated travel time based on distance (assuming average city speed of 50 km/h)
	const calculateEstimatedTime = useCallback((distance: number): number => {
		const averageSpeed = 50; // km/h for city driving
		const timeInHours = distance / averageSpeed;
		return Math.ceil(timeInHours * 60); // Convert to minutes and round up
	}, []);

	// Batch calculate distances and times for multiple workers using Distance Matrix API with caching
	const calculateDistancesAndTimes = useCallback(async (
		origin: { lat: number; lng: number },
		destinations: Array<{ lat: number; lng: number }>
	): Promise<Array<{ distance: number; time: number }>> => {
		// Check cache first
		const cachedResults: Array<{ distance: number; time: number } | null> = destinations.map(dest => {
			const cacheKey = getCacheKey(origin, dest);
			return distanceCache.get(cacheKey) || null;
		});

		// Find destinations that need calculation (not in cache)
		const destinationsToCalculate: Array<{ lat: number; lng: number; index: number }> = [];
		cachedResults.forEach((cached, index) => {
			if (!cached) {
				destinationsToCalculate.push({ ...destinations[index], index });
			}
		});

		// If all are cached, return cached results
		if (destinationsToCalculate.length === 0) {
			return cachedResults as Array<{ distance: number; time: number }>;
		}

		// Try to use Google Maps Distance Matrix API if available (batch processing)
		if (isLoaded && window.google && window.google.maps && destinationsToCalculate.length > 0) {
			try {
				const service = new google.maps.DistanceMatrixService();
				const result = await new Promise<google.maps.DistanceMatrixResponse>((resolve, reject) => {
					service.getDistanceMatrix(
						{
							origins: [{ lat: origin.lat, lng: origin.lng }],
							destinations: destinationsToCalculate.map(d => ({ lat: d.lat, lng: d.lng })),
							travelMode: google.maps.TravelMode.DRIVING,
							unitSystem: google.maps.UnitSystem.METRIC,
						},
						(response, status) => {
							if (status === google.maps.DistanceMatrixStatus.OK && response) {
								resolve(response);
							} else {
								reject(new Error(`Distance Matrix API error: ${status}`));
							}
						}
					);
				});

				if (result.rows[0]?.elements) {
					// Process API results and cache them
					result.rows[0].elements.forEach((element, apiIndex) => {
						const destIndex = destinationsToCalculate[apiIndex].index;
						if (element.status === google.maps.DistanceMatrixElementStatus.OK) {
							const distanceValue = element.distance.value / 1000; // Convert meters to km
							const durationValue = element.duration.value / 60; // Convert seconds to minutes
							const result = {
								distance: Math.round(distanceValue * 10) / 10,
								time: Math.ceil(durationValue),
							};
							// Cache the result
							const cacheKey = getCacheKey(origin, destinations[destIndex]);
							distanceCache.set(cacheKey, result);
							cachedResults[destIndex] = result;
						} else {
							// Fallback to haversine if API fails for this destination
							const distance = calculateDistance(
								origin.lat, origin.lng,
								destinations[destIndex].lat, destinations[destIndex].lng
							);
							const result = {
								distance: Math.round(distance * 10) / 10,
								time: calculateEstimatedTime(distance),
							};
							// Cache the fallback result
							const cacheKey = getCacheKey(origin, destinations[destIndex]);
							distanceCache.set(cacheKey, result);
							cachedResults[destIndex] = result;
						}
					});
				}
			} catch (error) {
				console.warn("Failed to use Distance Matrix API, using haversine:", error);
				// Calculate using haversine for uncached destinations
				destinationsToCalculate.forEach((dest) => {
					const distance = calculateDistance(origin.lat, origin.lng, dest.lat, dest.lng);
					const result = {
						distance: Math.round(distance * 10) / 10,
						time: calculateEstimatedTime(distance),
					};
					const cacheKey = getCacheKey(origin, dest);
					distanceCache.set(cacheKey, result);
					cachedResults[dest.index] = result;
				});
			}
		} else {
			// Fallback to haversine distance + estimated time for uncached destinations
			destinationsToCalculate.forEach((dest) => {
				const distance = calculateDistance(origin.lat, origin.lng, dest.lat, dest.lng);
				const result = {
					distance: Math.round(distance * 10) / 10,
					time: calculateEstimatedTime(distance),
				};
				const cacheKey = getCacheKey(origin, dest);
				distanceCache.set(cacheKey, result);
				cachedResults[dest.index] = result;
			});
		}

		return cachedResults as Array<{ distance: number; time: number }>;
	}, [isLoaded, calculateDistance, calculateEstimatedTime]);

	// Mock function to fetch workers based on search radius
	const fetchWorkers = useCallback(async (radius: number) => {
		setIsLoadingWorkers(true);
		
		// Get the reference location (service location or user location)
		const referenceLocation = serviceLocation || userLocation || { lat: 24.7136, lng: 46.6753 };

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// Generate worker positions relative to service location
		// Workers are positioned around the service location at various distances
		const generateWorkerPosition = (distanceKm: number, angleDegrees: number) => {
			// Convert distance to degrees (approximate: 1 degree ≈ 111 km)
			const distanceInDegrees = distanceKm / 111;
			// Convert angle to radians
			const angleInRadians = (angleDegrees * Math.PI) / 180;
			return {
				lat: referenceLocation.lat + distanceInDegrees * Math.cos(angleInRadians),
				lng: referenceLocation.lng + distanceInDegrees * Math.sin(angleInRadians) / Math.cos(referenceLocation.lat * Math.PI / 180),
			};
		};

		// Mock workers data - positioned relative to service location
		const allWorkersRaw: Omit<Worker, 'distance' | 'estimatedTime'>[] = [
			{
				id: "1",
				name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
				avatar: "/worker1.jpg",
				rating: 4.5,
				reviewsCount: 127,
				price: 250,
				experience: isArabic ? "8 سنوات" : "8 years",
				location: isArabic ? "الرياض" : "Riyadh",
				...generateWorkerPosition(1.5, 0),
			},
			{
				id: "2",
				name: isArabic ? "فاطمة علي" : "Fatima Ali",
				avatar: "/worker2.jpg",
				rating: 4.8,
				reviewsCount: 89,
				price: 280,
				experience: isArabic ? "6 سنوات" : "6 years",
				location: isArabic ? "الرياض" : "Riyadh",
				...generateWorkerPosition(2.8, 45),
			},
			{
				id: "3",
				name: isArabic ? "خالد السعد" : "Khalid Al-Saad",
				avatar: "/worker1.jpg",
				rating: 4.3,
				reviewsCount: 156,
				price: 220,
				experience: isArabic ? "10 سنوات" : "10 years",
				location: isArabic ? "الرياض" : "Riyadh",
				...generateWorkerPosition(1.2, 90),
			},
			{
				id: "4",
				name: isArabic ? "نورا أحمد" : "Nora Ahmed",
				avatar: "/worker2.jpg",
				rating: 4.9,
				reviewsCount: 203,
				price: 300,
				experience: isArabic ? "5 سنوات" : "5 years",
				location: isArabic ? "الرياض" : "Riyadh",
				...generateWorkerPosition(3.5, 135),
			},
			{
				id: "5",
				name: isArabic ? "محمد العتيبي" : "Mohammed Al-Otaibi",
				avatar: "/worker1.jpg",
				rating: 4.6,
				reviewsCount: 98,
				price: 260,
				experience: isArabic ? "7 سنوات" : "7 years",
				location: isArabic ? "الرياض" : "Riyadh",
				...generateWorkerPosition(4.8, 180),
			},
			{
				id: "6",
				name: isArabic ? "سارة الخالدي" : "Sara Al-Khalidi",
				avatar: "/worker2.jpg",
				rating: 4.7,
				reviewsCount: 145,
				price: 240,
				experience: isArabic ? "9 سنوات" : "9 years",
				location: isArabic ? "الرياض" : "Riyadh",
				...generateWorkerPosition(5.5, 225),
			},
			// Additional workers for expanded search
			{
				id: "7",
				name: isArabic ? "عبدالله النجار" : "Abdullah Al-Najjar",
				avatar: "/worker1.jpg",
				rating: 4.4,
				reviewsCount: 112,
				price: 270,
				experience: isArabic ? "11 سنوات" : "11 years",
				location: isArabic ? "الرياض" : "Riyadh",
				...generateWorkerPosition(6.8, 270),
			},
			{
				id: "8",
				name: isArabic ? "ريم الحسين" : "Reem Al-Hussein",
				avatar: "/worker2.jpg",
				rating: 4.6,
				reviewsCount: 134,
				price: 290,
				experience: isArabic ? "6 سنوات" : "6 years",
				location: isArabic ? "الرياض" : "Riyadh",
				...generateWorkerPosition(7.5, 315),
			},
		];

		// Calculate real distances and times for all workers (batch processing)
		const destinations = allWorkersRaw.map(worker => ({ lat: worker.lat, lng: worker.lng }));
		const distancesAndTimes = await calculateDistancesAndTimes(referenceLocation, destinations);
		
		// Combine worker data with calculated distances and times
		const workersWithDistanceAndTime: Worker[] = allWorkersRaw.map((worker, index) => ({
			...worker,
			distance: distancesAndTimes[index].distance,
			estimatedTime: distancesAndTimes[index].time,
		}));

		// Filter workers based on search radius
		const filteredWorkers = workersWithDistanceAndTime.filter((worker) => 
			worker.distance !== undefined && worker.distance <= radius
		);

		// Sort by distance (closest first)
		filteredWorkers.sort((a, b) => (a.distance || 0) - (b.distance || 0));

		setWorkers(filteredWorkers);
		setIsLoadingWorkers(false);
	}, [isArabic, serviceLocation, userLocation, calculateDistancesAndTimes]);

	// Initial fetch on mount
	useEffect(() => {
		fetchWorkers(searchRadius);
	}, [fetchWorkers, searchRadius]);

	// Handle expand search with debouncing
	const handleExpandSearch = useCallback(async () => {
		if (isExpanding) return; // Prevent multiple simultaneous calls
		
		// Clear any pending timeout
		if (expandTimeoutRef.current) {
			clearTimeout(expandTimeoutRef.current);
		}

		setIsExpanding(true);
		const newRadius = searchRadius + 5; // Expand by 5km
		
		try {
			await fetchWorkers(newRadius);
			setSearchRadius(newRadius);
		} finally {
			setIsExpanding(false);
		}
	}, [isExpanding, searchRadius, fetchWorkers]);

	const handleWorkerSelect = useCallback((workerId: string) => {
		setSelectedWorker(workerId);
	}, []);

	const handleChooseWorker = useCallback((workerId: string) => {
		setSelectedWorker(workerId);
		setShowConfirmModal(true);
	}, []);

	const handleConfirmWorker = useCallback(() => {
		if (selectedWorker) {
			const worker = workers.find((w) => w.id === selectedWorker);
			if (worker) {
				updateBooking({
					worker: {
						id: worker.id,
						name: worker.name,
						avatar: worker.avatar,
						rating: worker.rating,
						phone: "+966500000000", // Mock phone
					},
					unitPrice: worker.price, // Update unit price when worker is selected
				});
				setConfirmedWorker(selectedWorker);
				setShowConfirmModal(false);
				// Redirect to payment page after confirmation
				const paymentPath = `/serve-me/${serviceSlug}/${serviceTypeSlug}/book/payment`;
				router.prefetch(paymentPath);
				router.push(paymentPath);
			}
		}
	}, [selectedWorker, workers, updateBooking, serviceSlug, serviceTypeSlug, router]);

	const handleMessageWorker = (workerId: string) => {
		const chatPath = `/worker/${workerId}/chat`;
		router.prefetch(chatPath);
		router.push(chatPath);
	};

	const handleTrackOrder = () => {
		if (bookingData?.bookingId) {
			const trackPath = `/my-orders/${bookingData.bookingId}/track`;
			router.prefetch(trackPath);
			router.push(trackPath);
		}
	};

	// Calculate map center - prioritize service location, then user location
	const mapCenter = useMemo(() => {
		if (serviceLocation) {
			return serviceLocation;
		}
		if (userLocation) {
			return userLocation;
		}
		if (workers.length === 0) return defaultCenter;
		const avgLat = workers.reduce((sum, w) => sum + w.lat, 0) / workers.length;
		const avgLng = workers.reduce((sum, w) => sum + w.lng, 0) / workers.length;
		return { lat: avgLat, lng: avgLng };
	}, [workers, userLocation, serviceLocation]);

	const selectedWorkerData = useMemo(() => {
		return workers.find((w) => w.id === selectedWorker);
	}, [selectedWorker, workers]);


	// Map callback - fit bounds to show all workers, service location, and user location
	const onLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map;
		const bounds = new google.maps.LatLngBounds();
		
		// Add service location to bounds if available (priority)
		if (serviceLocation) {
			bounds.extend(new google.maps.LatLng(serviceLocation.lat, serviceLocation.lng));
		}
		
		// Add user location to bounds if available (fallback)
		if (userLocation && !serviceLocation) {
			bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng));
		}
		
		// Add all workers to bounds
		if (workers.length > 0) {
			workers.forEach((worker) => {
				bounds.extend(new google.maps.LatLng(worker.lat, worker.lng));
			});
		}
		
		if (bounds.getNorthEast().lat() !== bounds.getSouthWest().lat() || 
			bounds.getNorthEast().lng() !== bounds.getSouthWest().lng()) {
			map.fitBounds(bounds);
			// Prevent zooming too close
			const listener = google.maps.event.addListener(map, "bounds_changed", () => {
				if (map.getZoom()! > 15) {
					map.setZoom(15);
				}
				google.maps.event.removeListener(listener);
			});
		}
	}, [workers, userLocation, serviceLocation]);

	const onUnmount = useCallback(() => {
		mapRef.current = null;
		// Clear timeout on unmount
		if (expandTimeoutRef.current) {
			clearTimeout(expandTimeoutRef.current);
		}
	}, []);

	// Memoize filtered and sorted workers
	const filteredAndSortedWorkers = useMemo(() => {
		let filtered = [...workers];
		
		switch (activeFilter) {
			case "price":
				filtered.sort((a, b) => a.price - b.price);
				break;
			case "rating":
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			case "closest":
				filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
				break;
			default: // "all"
				// Already sorted by distance from fetch
				break;
		}
		
		return filtered;
	}, [workers, activeFilter]);

	// Memoize filter buttons configuration
	const filterButtons = useMemo(() => [
		{ key: "all", label: isArabic ? "الكل" : "All" },
		{ key: "price", label: isArabic ? "السعر" : "Price" },	
		{ key: "rating", label: isArabic ? "الأعلى تقييمآ" : "Highest Rated" },
		{ key: "closest", label: isArabic ? "الأقرب" : "Closest" }
	], [isArabic]);

	// Memoize marker icons factory functions (create icons when Google Maps is loaded)
	const getServiceLocationIcon = useCallback(() => {
		if (!isLoaded || !window.google?.maps) return undefined;
		return {
			url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
				<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
					<circle cx="20" cy="20" r="8" fill="white"/>
					<path d="M20 10 L20 30 M10 20 L30 20" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
				</svg>
			`),
			scaledSize: new google.maps.Size(40, 40),
			anchor: new google.maps.Point(20, 20)
		};
	}, [isLoaded]);

	const getUserLocationIcon = useCallback(() => {
		if (!isLoaded || !window.google?.maps) return undefined;
		return {
			url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="white" stroke-width="3"/>
					<circle cx="16" cy="16" r="6" fill="white"/>
				</svg>
			`),
			scaledSize: new google.maps.Size(32, 32),
			anchor: new google.maps.Point(16, 16)
		};
	}, [isLoaded]);

	// Memoize worker marker icons factory
	const getWorkerMarkerIcon = useCallback((worker: Worker, isSelected: boolean) => {
		if (!isLoaded || !window.google?.maps) return undefined;
		if (isSelected) {
			return {
				url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
					<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="20" cy="20" r="18" fill="#31A342" stroke="white" stroke-width="4"/>
						<text x="20" y="26" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${worker.price}</text>
					</svg>
				`),
				scaledSize: new google.maps.Size(40, 40),
				anchor: new google.maps.Point(20, 20)
			};
		}
		return {
			url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="16" cy="16" r="14" fill="#FA9D2B" stroke="white" stroke-width="3"/>
					<text x="16" y="20" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${worker.price}</text>
				</svg>
			`),
			scaledSize: new google.maps.Size(32, 32),
			anchor: new google.maps.Point(16, 16)
		};
	}, [isLoaded]);

	return (
		<div className={`min-h-screen bg-white dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			{/* Stepper Navigation - Only show in booking flow */}
			{redirectPath && <StepperNavigation service={serviceSlug} serviceType={serviceTypeSlug} />}

			{/* Main Content - Two Section Layout */}
			<div className={`flex flex-col lg:flex-row ${redirectPath ? 'h-[calc(100vh-120px)]' : 'h-[calc(100vh-80px)]'}`}>
				{/* Left Section - Workers List */}
				<div className="flex-1 overflow-y-auto lg:max-h-full">
					<div className="p-4 lg:p-6">
						{/* Service Providers Header */}
						<h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "مقدمي الخدمة" : "Service Providers"}
						</h2>

						{/* Filter Buttons */}
						<div className="flex flex-wrap gap-2 mb-6">
							{filterButtons.map((filter) => (
								<button
									key={filter.key}
									onClick={() => setActiveFilter(filter.key)}
									className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
										activeFilter === filter.key
											? "bg-[#31A342] text-white"
											: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
									}`}
								
								>
									{filter.label}
								</button>
							))}
						</div>

						{/* Expand Search Button */}
						{!isLoadingWorkers && (
							<button
								onClick={handleExpandSearch}
								disabled={isExpanding}
								className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-4 bg-[#31A342] dark:bg-green-600 hover:bg-[#2a8f3a] dark:hover:bg-green-700 active:bg-[#2a8f3a] dark:active:bg-green-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
									isArabic ? "flex-row-reverse" : ""
								}`}
							>
								{isExpanding ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										<span>{isArabic ? "جاري توسيع البحث..." : "Expanding search..."}</span>
									</>
								) : (
									<>
										<Expand className="w-5 h-5" />
										<span>
											{isArabic 
												? `توسيع البحث (${searchRadius} كم)` 
												: `Expand Search (${searchRadius} km)`}
										</span>
									</>
								)}
							</button>
						)}

						{/* Loading State */}
						{isLoadingWorkers && (
							<div className="flex flex-col items-center justify-center py-12 space-y-4">
								<Loader2 className="w-12 h-12 text-[#31A342] animate-spin" />
								<p className="text-gray-600 dark:text-gray-400 font-medium">
									{isArabic ? "جاري البحث عن أقرب العمال..." : "Searching for closest workers..."}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{isArabic 
										? `البحث ضمن نطاق ${searchRadius} كم` 
										: `Searching within ${searchRadius} km radius`}
								</p>
							</div>
						)}

						{/* Workers List */}
						{!isLoadingWorkers && (
							<div className="space-y-4">
								{workers.length === 0 ? (
									<div className="text-center py-12">
										<MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
										<p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
											{isArabic ? "لا يوجد عمال في هذا النطاق" : "No workers found in this range"}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{isArabic 
												? "حاول توسيع نطاق البحث" 
												: "Try expanding your search range"}
										</p>
									</div>
								) : (
									filteredAndSortedWorkers.map((worker) => (
										<WorkerCard
											key={worker.id}
											worker={worker}
											isSelected={selectedWorker === worker.id}
											onSelect={handleWorkerSelect}
											onChoose={handleChooseWorker}
											serviceSlug={serviceSlug}
											serviceTypeSlug={serviceTypeSlug}
											isArabic={isArabic}
											router={router}
										/>
									))
								)}
							</div>
						)}
					</div>
				</div>

				{/* Right Section - Map */}
				<div className="w-full hidden md:block lg:w-1/2 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 h-64 lg:h-full">
					{loadError ? (
						<div className="h-full bg-gray-100 flex items-center justify-center">
							<div className="text-center">
								<MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
								<h3 className={`text-lg font-semibold text-red-600 mb-2 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "خطأ في تحميل الخريطة" : "Error loading map"}
								</h3>
								<p className={`text-red-500 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "تعذر تحميل الخريطة" : "Unable to load map"}
								</p>
							</div>
						</div>
					) : !isLoaded ? (
						<div className="h-full bg-gray-100 flex items-center justify-center">
							<div className="text-center">
								<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#31A342] mx-auto mb-4"></div>
								<h3 className={`text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "جاري تحميل الخريطة..." : "Loading map..."}
								</h3>
							</div>
						</div>
					) : (
						<GoogleMap
							mapContainerStyle={mapContainerStyle}
							center={mapCenter}
							zoom={MAP_CONFIG.defaultZoom}
							onLoad={onLoad}
							onUnmount={onUnmount}
							options={{
								streetViewControl: false,
								mapTypeControl: false,
								fullscreenControl: false,
								zoomControl: true,
								gestureHandling: 'greedy',
								disableDefaultUI: false,
							}}
						>
							{/* Service Location Marker (Where service will be performed) */}
							{serviceLocation && (
								<Marker
									position={{ lat: serviceLocation.lat, lng: serviceLocation.lng }}
									title={isArabic ? "موقع الخدمة" : "Service Location"}
									icon={getServiceLocationIcon()}
								/>
							)}

							{/* User Location Marker (Fallback - only show if no service location) */}
							{userLocation && !serviceLocation && (
								<Marker
									position={{ lat: userLocation.lat, lng: userLocation.lng }}
									title={isArabic ? "موقعك" : "Your Location"}
									icon={getUserLocationIcon()}
								/>
							)}
							
							{/* Worker Markers */}
							{filteredAndSortedWorkers.map((worker) => (
								<Marker
									key={worker.id}
									position={{ lat: worker.lat, lng: worker.lng }}
									title={worker.name}
									onClick={() => setSelectedWorker(worker.id)}
									icon={getWorkerMarkerIcon(worker, selectedWorker === worker.id)}
								/>
							))}
						</GoogleMap>
					)}
				</div>
			</div>

			{/* Enhanced Confirmation Modal */}
			{showConfirmModal && selectedWorkerData && (
				<div 
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
					onClick={() => setShowConfirmModal(false)}
					role="dialog"
					aria-modal="true"
					aria-labelledby="confirm-modal-title"
				>
					<div 
						className={`bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-[slideUp_0.3s_ease-out] ${
							isArabic ? "text-right" : "text-left"
						}`}
						onClick={(e) => e.stopPropagation()}
						dir={isArabic ? "rtl" : "ltr"}
					>
						{/* Header */}
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
									<CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
								</div>
								<h3 
									id="confirm-modal-title"
									className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100"
								>
									{isArabic ? "تأكيد اختيار العامل" : "Confirm Worker Selection"}
								</h3>
							</div>
							<button
								onClick={() => setShowConfirmModal(false)}
								className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
								aria-label={isArabic ? "إغلاق" : "Close"}
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="space-y-6">
							{/* Worker Info Card - Enhanced */}
							<div className="relative p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-green-200 dark:border-green-800">
								<div className="flex items-start gap-4">
									{/* Worker Avatar with Badge */}
									<div className="relative flex-shrink-0">
										<Image
											src={selectedWorkerData.avatar}
											alt={selectedWorkerData.name}
											width={80}
											height={80}
											className="w-20 h-20 rounded-full object-cover ring-4 ring-green-200 dark:ring-green-800"
										/>
										<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
											<CheckCircle className="w-4 h-4 text-white" />
										</div>
									</div>

									{/* Worker Details */}
									<div className="flex-1 min-w-0">
										<h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
											{selectedWorkerData.name}
										</h4>
										
										{/* Rating */}
										<div className={`flex items-center gap-2 mb-2 ${isArabic ? "flex-row-reverse" : ""}`}>
											<div className="flex items-center gap-1">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className={`w-4 h-4 ${
															i < Math.floor(selectedWorkerData.rating)
																? "text-yellow-400 fill-yellow-400"
																: "text-gray-300 dark:text-gray-600"
														}`}
													/>
												))}
											</div>
											<span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
												{selectedWorkerData.rating}
											</span>
											<span className="text-xs text-gray-500 dark:text-gray-400">
												({selectedWorkerData.reviewsCount} {isArabic ? "تقييم" : "reviews"})
											</span>
										</div>

										{/* Experience */}
										<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
											{isArabic ? "خبرة" : "Experience"}: {selectedWorkerData.experience}
										</p>

										{/* Price - Highlighted */}
										<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
											<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
												{isArabic ? "يبدأ من" : "Starts from"}
											</span>
											<span className="text-xl font-bold text-green-600 dark:text-green-400">
												{selectedWorkerData.price} {isArabic ? "ريال" : "SAR"}
											</span>
										</div>
									</div>
								</div>
							</div>

							{/* Confirmation Message - Enhanced */}
							<div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
								<p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
									{isArabic
										? "هل أنت متأكد من اختيار هذا العامل لإتمام الخدمة؟ سيتم تحويلك إلى صفحة الدفع لإتمام الطلب."
										: "Are you sure you want to select this worker to complete the service? You will be redirected to the payment page to complete your order."}
								</p>
							</div>

							{/* Action Buttons - Enhanced */}
							<div className={`flex gap-3 pt-2 ${isArabic ? "flex-row-reverse" : ""}`}>
								<button
									onClick={() => setShowConfirmModal(false)}
									className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
								>
									{isArabic ? "إلغاء" : "Cancel"}
								</button>
								<button
									onClick={handleConfirmWorker}
									className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
								>
									<CheckCircle className="w-5 h-5" />
									{isArabic ? "تأكيد والمتابعة" : "Confirm & Continue"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChooseWorker;
