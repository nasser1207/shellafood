"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef, memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, MapPin, CheckCircle, Loader2, Expand, Truck, Bike, Eye, MessageCircle } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MAP_CONFIG } from "@/lib/maps/utils";

interface ChooseDriverPageProps {
	transportType: string;
	orderType: string;
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
	location: string;
	lat: number;
	lng: number;
	distance?: number;
	estimatedTime?: number;
	vehicleType: "truck" | "motorbike";
	vehicleModel: string;
	licensePlate: string;
	phone?: string;
}

// Cache for Distance Matrix API results
const distanceCache = new Map<string, { distance: number; time: number }>();

const getCacheKey = (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): string => {
	return `${origin.lat.toFixed(4)}_${origin.lng.toFixed(4)}_${destination.lat.toFixed(4)}_${destination.lng.toFixed(4)}`;
};

// Memoized Driver Card Component
const DriverCard = memo<{
	driver: Driver;
	isSelected: boolean;
	onSelect: (id: string) => void;
	onChoose: (id: string) => void;
	onViewDetails: (driver: Driver) => void;
	onChat: (driverId: string) => void;
	isArabic: boolean;
	isTruck: boolean;
}>(({ driver, isSelected, onSelect, onChoose, onViewDetails, onChat, isArabic, isTruck }) => {
	const handleChooseClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		onChoose(driver.id);
	}, [driver.id, onChoose]);

	const handleViewDetailsClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		onViewDetails(driver);
	}, [driver, onViewDetails]);

	const handleChatClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		onChat(driver.id);
	}, [driver.id, onChat]);

	// Theme colors based on vehicle type
	const primaryColor = isTruck ? "#31A342" : "#FA9D2B";
	const bgGradient = isTruck 
		? "from-green-50 to-white dark:from-green-900/10 dark:to-gray-800" 
		: "from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800";
	const borderColor = isSelected 
		? (isTruck ? "border-[#31A342] dark:border-green-500" : "border-[#FA9D2B] dark:border-orange-500")
		: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600";

	return (
		<div
			className={`bg-gradient-to-br ${bgGradient} border-2 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-200 ${borderColor} ${
				isSelected ? "shadow-xl scale-[1.02] ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900" + (isTruck ? " ring-green-500/50" : " ring-orange-500/50") : "hover:shadow-lg"
			}`}
			onClick={() => onSelect(driver.id)}
		>
			{/* Mobile Layout */}
			<div className="flex flex-col sm:hidden gap-4">
				{/* Header Row - Avatar + Basic Info */}
				<div className="flex items-start gap-3">
					{/* Driver Avatar */}
					<div className="relative flex-shrink-0">
						<Image
							src={driver.avatar}
							alt={driver.name}
							width={80}
							height={80}
							className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg"
							loading="lazy"
							priority={false}
						/>
						{isSelected && (
							<div className={`absolute -top-1 ${isArabic ? "-left-1" : "-right-1"} w-7 h-7 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-md`}
								style={{ backgroundColor: primaryColor }}
							>
								<CheckCircle className="w-5 h-5 text-white" />
							</div>
						)}
						<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md">
							{isTruck ? (
								<Truck className="w-4 h-4" style={{ color: primaryColor }} />
							) : (
								<Bike className="w-4 h-4" style={{ color: primaryColor }} />
							)}
						</div>
					</div>

					{/* Name + Badge */}
					<div className="flex-1 min-w-0">
						<h3 className={`font-bold text-gray-900 dark:text-gray-100 text-base mb-1 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? driver.nameAr : driver.name}
						</h3>
						<div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
							isTruck 
								? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
								: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
						}`}>
							{isTruck ? <Truck className="w-3 h-3" /> : <Bike className="w-3 h-3" />}
							<span>{isArabic ? (isTruck ? "شاحنة" : "دراجة نارية") : (isTruck ? "Truck" : "Motorbike")}</span>
						</div>
					</div>
				</div>

				{/* Rating + Experience */}
				<div className={`flex items-center justify-between `}>
					<div className={`flex items-center gap-1 `}>
						<div className="flex items-center gap-0.5">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`w-3.5 h-3.5 ${
										i < Math.floor(driver.rating)
											? "text-yellow-400 fill-yellow-400"
											: "text-gray-300 dark:text-gray-600"
									}`}
								/>
							))}
						</div>
						<span className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">
							{driver.rating} <span className="text-gray-400">({driver.reviewsCount})</span>
						</span>
					</div>
					<span className="text-xs font-medium px-2 py-1 bg-white dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
						{driver.experience}
					</span>
				</div>

				{/* Vehicle Info Card */}
				<div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
						{isArabic ? "معلومات المركبة" : "Vehicle Details"}
					</p>
					<p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5">
						{driver.vehicleModel}
					</p>
					<div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
						<span>{driver.licensePlate}</span>
					</div>
				</div>

				{/* Price + Distance */}
				<div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
					<div>
						<p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
							{isArabic ? "السعر" : "Price"}
						</p>
						<p className="text-lg font-bold" style={{ color: primaryColor }}>
							{driver.pricePerKm} <span className="text-sm">{isArabic ? "ر.س/كم" : "SAR/km"}</span>
						</p>
					</div>
					{driver.distance !== undefined && (
						<div className={`text-right ${isArabic ? "text-left" : ""}`}>
							<p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
								{isArabic ? "المسافة" : "Distance"}
							</p>
							<p className="text-sm font-bold text-gray-900 dark:text-gray-100">
								{driver.distance.toFixed(1)} {isArabic ? "كم" : "km"}
							</p>
							{driver.estimatedTime !== undefined && (
								<p className="text-xs text-gray-500 dark:text-gray-400">
									~{driver.estimatedTime} {isArabic ? "دقيقة" : "min"}
								</p>
							)}
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex gap-2">
					<button
						onClick={handleViewDetailsClick}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-white dark:hover:bg-gray-700 transition-all text-sm"
					>
						<Eye className="w-4 h-4" />
						<span>{isArabic ? "التفاصيل" : "Details"}</span>
					</button>
					<button
						onClick={handleChatClick}
						className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-all text-sm"
					>
						<MessageCircle className="w-4 h-4" />
					</button>
					<button
						onClick={handleChooseClick}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm"
						style={{ backgroundColor: primaryColor }}
					>
						<CheckCircle className="w-4 h-4" />
						<span>{isArabic ? "اختيار" : "Choose"}</span>
					</button>
				</div>
			</div>

			{/* Desktop Layout */}
			<div className="hidden sm:flex items-start gap-4">
				{/* Driver Avatar */}
				<div className="relative flex-shrink-0">
					<Image
						src={driver.avatar}
						alt={driver.name}
						width={90}
						height={90}
						className="w-20 lg:w-24 h-20 lg:h-24 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg"
						loading="lazy"
						priority={false}
					/>
					{isSelected && (
						<div className={`absolute -top-1 ${isArabic ? "-left-1" : "-right-1"} w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-md`}
							style={{ backgroundColor: primaryColor }}
						>
							<CheckCircle className="w-6 h-6 text-white" />
						</div>
					)}
					<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
						{isTruck ? (
							<Truck className="w-5 h-5" style={{ color: primaryColor }} />
						) : (
							<Bike className="w-5 h-5" style={{ color: primaryColor }} />
						)}
					</div>
				</div>

				{/* Driver Info */}
				<div className="flex-1 min-w-0">
					<div className={`flex items-start justify-between mb-3 `}>
						<div className={`${isArabic ? "text-right" : "text-left"}`}>
							<h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg lg:text-xl mb-1">
								{isArabic ? driver.nameAr : driver.name}
							</h3>
							<div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
								isTruck 
									? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
									: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
							}`}>
								{isTruck ? <Truck className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
								<span>{driver.experience} {isArabic ? "خبرة" : "experience"}</span>
							</div>
						</div>
					</div>

					{/* Rating */}
					<div className={`flex items-center gap-1 mb-3 `}>
						<div className="flex items-center gap-0.5">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`w-4 h-4 ${
										i < Math.floor(driver.rating)
											? "text-yellow-400 fill-yellow-400"
											: "text-gray-300 dark:text-gray-600"
									}`}
								/>
							))}
						</div>
						<span className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
							{driver.rating} <span className="text-gray-400 font-normal">({driver.reviewsCount} {isArabic ? "تقييم" : "reviews"})</span>
						</span>
					</div>

					{/* Vehicle Info */}
					<div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
						<p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
							{isArabic ? "معلومات المركبة" : "Vehicle Details"}
						</p>
						<p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5">
							{driver.vehicleModel}
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							{isArabic ? "لوحة:" : "Plate:"} {driver.licensePlate}
						</p>
					</div>

					{/* Bottom Section */}
					<div className="flex items-end justify-between gap-4">
						{/* Price & Distance */}
						<div className={`${isArabic ? "text-right" : "text-left"}`}>
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
								{isArabic ? "السعر" : "Price"}
							</p>
							<p className="text-xl lg:text-2xl font-bold mb-2" style={{ color: primaryColor }}>
								{driver.pricePerKm} <span className="text-sm">{isArabic ? "ر.س/كم" : "SAR/km"}</span>
							</p>
							{driver.distance !== undefined && (
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<span className="font-semibold">{driver.distance.toFixed(1)} {isArabic ? "كم" : "km"}</span>
									{driver.estimatedTime !== undefined && (
										<>
											<span>•</span>
											<span>{driver.estimatedTime} {isArabic ? "دقيقة" : "min"}</span>
										</>
									)}
								</div>
							)}
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-2">
							<button
								onClick={handleViewDetailsClick}
								className="p-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all"
								title={isArabic ? "عرض التفاصيل" : "View Details"}
							>
								<Eye className="w-5 h-5" />
							</button>
							<button
								onClick={handleChatClick}
								className="p-3 border-2 border-blue-500 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all"
								title={isArabic ? "محادثة" : "Chat"}
							>
								<MessageCircle className="w-5 h-5" />
							</button>
							<button
								onClick={handleChooseClick}
								className="px-6 py-3 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
								style={{ backgroundColor: primaryColor }}
							>
								<CheckCircle className="w-5 h-5" />
								<span>{isArabic ? "اختيار" : "Choose"}</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

DriverCard.displayName = "DriverCard";

export default function ChooseDriverPage({ transportType, orderType }: ChooseDriverPageProps) {
	const { language } = useLanguage();
	const router = useRouter();
	const isArabic = language === "ar";
	// Handle both "track" and "truck" for truck transport type
	const isMotorbike = transportType === "motorbike";
	const isTruck = transportType === "truck" || transportType === "track";
	
	const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
	const [activeFilter, setActiveFilter] = useState("all");
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
	const [drivers, setDrivers] = useState<Driver[]>([]);
	const [pickupLocation, setPickupLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [searchRadius, setSearchRadius] = useState(5);
	const [isExpanding, setIsExpanding] = useState(false);
	
	const mapRef = useRef<google.maps.Map | null>(null);

	// Load Google Maps
	const { isLoaded, loadError } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
		libraries: MAP_CONFIG.libraries
	});

	// Get pickup location (would come from order data in real app)
	useEffect(() => {
		// Mock pickup location
		setPickupLocation({ lat: 24.7136, lng: 46.6753 });
	}, []);

	// Calculate distance using Haversine formula
	const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
		const R = 6371;
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}, []);

	const calculateEstimatedTime = useCallback((distance: number): number => {
		const averageSpeed = 50;
		const timeInHours = distance / averageSpeed;
		return Math.ceil(timeInHours * 60);
	}, []);

	// Mock function to fetch drivers
	const fetchDrivers = useCallback(async (radius: number) => {
		setIsLoadingDrivers(true);
		
		const referenceLocation = pickupLocation || { lat: 24.7136, lng: 46.6753 };
		await new Promise((resolve) => setTimeout(resolve, 1500));

		const generateDriverPosition = (distanceKm: number, angleDegrees: number) => {
			const distanceInDegrees = distanceKm / 111;
			const angleInRadians = (angleDegrees * Math.PI) / 180;
			return {
				lat: referenceLocation.lat + distanceInDegrees * Math.cos(angleInRadians),
				lng: referenceLocation.lng + distanceInDegrees * Math.sin(angleInRadians) / Math.cos(referenceLocation.lat * Math.PI / 180),
			};
		};

		const allDriversRaw: Omit<Driver, 'distance' | 'estimatedTime'>[] = [
			{
				id: "1",
				name: "Ahmed Mohammed",
				nameAr: "أحمد محمد",
				avatar: "/driver1.jpg",
				rating: 4.9,
				reviewsCount: 234,
				pricePerKm: isMotorbike ? 2.5 : 5.0,
				experience: isArabic ? "8 سنوات" : "8 years",
				location: isArabic ? "الرياض" : "Riyadh",
				vehicleType: isMotorbike ? "motorbike" : "truck",
				vehicleModel: isMotorbike ? "Honda CB500X 2023" : "Isuzu D-Max 2022",
				licensePlate: "ABC 1234",
				phone: "+966 55 123 4567",
				...generateDriverPosition(1.5, 0),
			},
			{
				id: "2",
				name: "Mohammed Ali",
				nameAr: "محمد علي",
				avatar: "/driver2.jpg",
				rating: 4.8,
				reviewsCount: 189,
				pricePerKm: isMotorbike ? 2.3 : 4.8,
				experience: isArabic ? "6 سنوات" : "6 years",
				location: isArabic ? "الرياض" : "Riyadh",
				vehicleType: isMotorbike ? "motorbike" : "truck",
				vehicleModel: isMotorbike ? "Yamaha MT-07 2022" : "Toyota Hilux 2021",
				licensePlate: "XYZ 5678",
				phone: "+966 50 234 5678",
				...generateDriverPosition(2.8, 45),
			},
			{
				id: "3",
				name: "Khalid Al-Saad",
				nameAr: "خالد السعد",
				avatar: "/driver1.jpg",
				rating: 4.7,
				reviewsCount: 312,
				pricePerKm: isMotorbike ? 2.2 : 4.5,
				experience: isArabic ? "10 سنوات" : "10 years",
				location: isArabic ? "الرياض" : "Riyadh",
				vehicleType: isMotorbike ? "motorbike" : "truck",
				vehicleModel: isMotorbike ? "Kawasaki Ninja 400" : "Ford Ranger 2023",
				licensePlate: "DEF 9012",
				phone: "+966 55 345 6789",
				...generateDriverPosition(1.2, 90),
			},
			{
				id: "4",
				name: "Abdullah Al-Otaibi",
				nameAr: "عبدالله العتيبي",
				avatar: "/driver2.jpg",
				rating: 4.9,
				reviewsCount: 278,
				pricePerKm: isMotorbike ? 2.6 : 5.2,
				experience: isArabic ? "7 سنوات" : "7 years",
				location: isArabic ? "الرياض" : "Riyadh",
				vehicleType: isMotorbike ? "motorbike" : "truck",
				vehicleModel: isMotorbike ? "Suzuki V-Strom 650" : "Mitsubishi L200",
				licensePlate: "GHI 3456",
				phone: "+966 50 456 7890",
				...generateDriverPosition(3.5, 135),
			},
			{
				id: "5",
				name: "Fahad Al-Mutairi",
				nameAr: "فهد المطيري",
				avatar: "/driver1.jpg",
				rating: 4.6,
				reviewsCount: 198,
				pricePerKm: isMotorbike ? 2.4 : 4.9,
				experience: isArabic ? "5 سنوات" : "5 years",
				location: isArabic ? "الرياض" : "Riyadh",
				vehicleType: isMotorbike ? "motorbike" : "truck",
				vehicleModel: isMotorbike ? "BMW F 750 GS" : "Nissan Navara 2022",
				licensePlate: "JKL 7890",
				phone: "+966 55 567 8901",
				...generateDriverPosition(4.8, 180),
			},
		];

		const driversWithDistanceAndTime: Driver[] = allDriversRaw.map((driver) => {
			const distance = calculateDistance(
				referenceLocation.lat,
				referenceLocation.lng,
				driver.lat,
				driver.lng
			);
			return {
				...driver,
				distance: Math.round(distance * 10) / 10,
				estimatedTime: calculateEstimatedTime(distance),
			};
		});

		const filteredDrivers = driversWithDistanceAndTime.filter((driver) => 
			driver.distance !== undefined && driver.distance <= radius
		);

		filteredDrivers.sort((a, b) => (a.distance || 0) - (b.distance || 0));

		setDrivers(filteredDrivers);
		setIsLoadingDrivers(false);
	}, [pickupLocation, isMotorbike, isArabic, calculateDistance, calculateEstimatedTime]);

	useEffect(() => {
		if (pickupLocation) {
			fetchDrivers(searchRadius);
		}
	}, [fetchDrivers, searchRadius, pickupLocation]);

	const handleExpandSearch = useCallback(async () => {
		if (isExpanding) return;
		setIsExpanding(true);
		const newRadius = searchRadius + 5;
		try {
			await fetchDrivers(newRadius);
			setSearchRadius(newRadius);
		} finally {
			setIsExpanding(false);
		}
	}, [isExpanding, searchRadius, fetchDrivers]);

	const handleDriverSelect = useCallback((driverId: string) => {
		setSelectedDriver(driverId);
	}, []);

	const handleChooseDriver = useCallback((driverId: string) => {
		setSelectedDriver(driverId);
		setShowConfirmModal(true);
	}, []);

	const handleConfirmDriver = useCallback(() => {
		if (selectedDriver) {
			setShowConfirmModal(false);
			router.push(`/pickandorder/${transportType}/order/payment?type=${orderType}&driverId=${selectedDriver}`);
		}
	}, [selectedDriver, router, transportType, orderType]);

	const handleViewDriverDetails = useCallback((driver: Driver) => {
		// Store driver data in sessionStorage for the profile page
		sessionStorage.setItem(`driver_${driver.id}`, JSON.stringify({
			id: driver.id,
			name: driver.name,
			nameAr: driver.nameAr,
			avatar: driver.avatar,
			rating: driver.rating,
			reviewsCount: driver.reviewsCount,
			pricePerKm: driver.pricePerKm,
			experience: driver.experience,
			vehicleType: driver.vehicleType,
			vehicleModel: driver.vehicleModel,
			licensePlate: driver.licensePlate,
			phone: driver.phone || "+966500000000",
			location: driver.location,
			lat: driver.lat,
			lng: driver.lng,
			distance: driver.distance,
			estimatedTime: driver.estimatedTime,
		}));
		
		// Navigate to driver profile page instead of modal
		const returnUrl = encodeURIComponent(`/pickandorder/${transportType}/order/choose-driver?type=${orderType}`);
		router.push(`/driver/${driver.id}?returnUrl=${returnUrl}&transportType=${transportType}&orderType=${orderType}`);
	}, [router, transportType, orderType]);

	const handleChatWithDriver = useCallback((driverId: string) => {
		// Navigate to chat page
		router.push(`/driver/${driverId}/chat`);
	}, [router]);


	const mapCenter = useMemo(() => {
		if (pickupLocation) return pickupLocation;
		if (drivers.length === 0) return MAP_CONFIG.defaultCenter;
		const avgLat = drivers.reduce((sum, w) => sum + w.lat, 0) / drivers.length;
		const avgLng = drivers.reduce((sum, w) => sum + w.lng, 0) / drivers.length;
		return { lat: avgLat, lng: avgLng };
	}, [drivers, pickupLocation]);

	const selectedDriverData = useMemo(() => {
		return drivers.find((d) => d.id === selectedDriver);
	}, [selectedDriver, drivers]);

	const onLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map;
	}, []);

	const onUnmount = useCallback(() => {
		mapRef.current = null;
	}, []);

	const filteredAndSortedDrivers = useMemo(() => {
		// Filter by vehicle type first
		const targetVehicleType = isMotorbike ? "motorbike" : "truck";
		let filtered = drivers.filter(driver => driver.vehicleType === targetVehicleType);
		
		// Debug logging
		console.log('Transport Type:', transportType);
		console.log('Is Motorbike:', isMotorbike);
		console.log('Target Vehicle Type:', targetVehicleType);
		console.log('Total Drivers:', drivers.length);
		console.log('Drivers Vehicle Types:', drivers.map(d => ({ id: d.id, type: d.vehicleType })));
		console.log('Filtered Drivers:', filtered.length);
		
		// Then apply sorting based on active filter
		switch (activeFilter) {
			case "price":
				filtered.sort((a, b) => a.pricePerKm - b.pricePerKm);
				break;
			case "rating":
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			case "closest":
				filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
				break;
			default:
				break;
		}
		
		return filtered;
	}, [drivers, activeFilter, isMotorbike, transportType]);

	const filterButtons = useMemo(() => [
		{ key: "all", label: isArabic ? "الكل" : "All" },
		{ key: "price", label: isArabic ? "السعر" : "Price" },	
		{ key: "rating", label: isArabic ? "الأعلى تقييماً" : "Highest Rated" },
		{ key: "closest", label: isArabic ? "الأقرب" : "Closest" }
	], [isArabic]);

	const getDriverMarkerIcon = useCallback((driver: Driver, isSelected: boolean) => {
		if (!isLoaded || !window.google?.maps) return undefined;
		return {
			url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
				<svg width="${isSelected ? 40 : 32}" height="${isSelected ? 40 : 32}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="16" cy="16" r="14" fill="${isSelected ? '#31A342' : '#FA9D2B'}" stroke="white" stroke-width="3"/>
					<text x="16" y="20" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${driver.pricePerKm}</text>
				</svg>
			`),
			scaledSize: new google.maps.Size(isSelected ? 40 : 32, isSelected ? 40 : 32),
			anchor: new google.maps.Point(isSelected ? 20 : 16, isSelected ? 20 : 16)
		};
	}, [isLoaded]);

	return (
		<div className={`min-h-screen bg-white dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			<div className="p-4 lg:p-8">
				{/* Mobile Map - Full Width at Top */}
				<div className="block lg:hidden mb-6">
					<div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
						{loadError ? (
							<div className="h-[250px] bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
								<div className="text-center">
									<MapPin className="w-12 h-12 text-red-400 mx-auto mb-3" />
									<p className="text-sm text-red-600">{isArabic ? "خطأ في تحميل الخريطة" : "Error loading map"}</p>
								</div>
							</div>
						) : !isLoaded ? (
							<div className="h-[250px] bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
								<div className="text-center">
									<Loader2 className="w-10 h-10 text-[#31A342] animate-spin mx-auto mb-3" />
									<p className="text-sm text-gray-600 dark:text-gray-400">{isArabic ? "جاري تحميل الخريطة..." : "Loading map..."}</p>
								</div>
							</div>
						) : (
							<GoogleMap
								mapContainerStyle={{ width: "100%", height: "250px" }}
								center={mapCenter}
								zoom={13}
								onLoad={onLoad}
								onUnmount={onUnmount}
								options={{
									streetViewControl: false,
									mapTypeControl: false,
									fullscreenControl: false,
									zoomControl: true,
								}}
							>
								{/* Pickup Location Marker */}
								{pickupLocation && (
									<Marker
										position={pickupLocation}
										title={isArabic ? "موقع الالتقاط" : "Pickup Location"}
										icon={{
											url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
												<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
													<circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
												</svg>
											`),
											scaledSize: new google.maps.Size(40, 40),
											anchor: new google.maps.Point(20, 20)
										}}
									/>
								)}
								
								{/* Driver Markers */}
								{filteredAndSortedDrivers.map((driver) => (
									<Marker
										key={driver.id}
										position={{ lat: driver.lat, lng: driver.lng }}
										title={driver.name}
										onClick={() => {
											setSelectedDriver(driver.id);
											setShowConfirmModal(true);
										}}
										icon={getDriverMarkerIcon(driver, selectedDriver === driver.id)}
									/>
								))}
							</GoogleMap>
						)}
					</div>
				</div>

				{/* Header */}
				<div className="mb-4 sm:mb-6">
					<div className="flex items-center gap-3 mb-3">
						<div className={`p-2.5 sm:p-3 rounded-xl ${
							isMotorbike 
								? "bg-orange-100 dark:bg-orange-900/30" 
								: "bg-green-100 dark:bg-green-900/30"
						}`}>
							{isMotorbike ? (
								<Bike className="w-6 h-6 sm:w-7 sm:h-7 text-[#FA9D2B]" />
							) : (
								<Truck className="w-6 h-6 sm:w-7 sm:h-7 text-[#31A342]" />
							)}
						</div>
						<div className={`flex-1 ${isArabic ? "text-right" : "text-left"}`}>
							<h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-0.5">
								{isArabic ? "اختر السائق" : "Choose Driver"}
							</h2>
							<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
								{isArabic 
									? (isMotorbike ? "اختر سائق الدراجة النارية الأنسب" : "اختر سائق الشاحنة الأنسب")
									: (isMotorbike ? "Select the best motorbike driver" : "Select the best truck driver")
								}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content - Two Section Layout */}
			<div className="flex flex-col lg:flex-row h-[calc(100vh-300px)] lg:h-[calc(100vh-200px)]">
				{/* Left Section - Drivers List */}
				<div className="flex-1 overflow-y-auto lg:max-h-full">
					<div className="px-4 pb-4 lg:px-8 lg:pb-8">

					{/* Filter Buttons */}
					<div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4 sm:mb-6">
						{filterButtons.map((filter) => (
							<button
								key={filter.key}
								onClick={() => setActiveFilter(filter.key)}
								className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
									activeFilter === filter.key
										? `text-white shadow-lg ${isMotorbike ? "bg-[#FA9D2B]" : "bg-[#31A342]"}`
										: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
								}`}
							>
								{filter.label}
							</button>
						))}
					</div>

					{/* Expand Search Button */}
					{!isLoadingDrivers && (
						<button
							onClick={handleExpandSearch}
							disabled={isExpanding}
							className={`w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 sm:mb-6 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
								isArabic ? "flex-row-reverse" : ""
							} ${isMotorbike ? "bg-[#FA9D2B] hover:bg-[#E88D26]" : "bg-[#31A342] hover:bg-[#2a8f3a]"}`}
						>
							{isExpanding ? (
								<>
									<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
									<span>{isArabic ? "جاري توسيع البحث..." : "Expanding search..."}</span>
								</>
							) : (
								<>
									<Expand className="w-4 h-4 sm:w-5 sm:h-5" />
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
					{isLoadingDrivers && (
						<div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-3 sm:space-y-4">
							<Loader2 className={`w-10 h-10 sm:w-12 sm:h-12 animate-spin ${isMotorbike ? "text-[#FA9D2B]" : "text-[#31A342]"}`} />
							<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium text-center px-4">
								{isArabic ? "جاري البحث عن أقرب السائقين..." : "Searching for closest drivers..."}
							</p>
						</div>
					)}

						{/* Drivers List */}
						{!isLoadingDrivers && (
							<div className="space-y-4">
								{drivers.length === 0 ? (
									<div className="text-center py-16">
										<MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
										<p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
											{isArabic ? "لا يوجد سائقين في هذا النطاق" : "No drivers found in this range"}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{isArabic ? "حاول توسيع نطاق البحث" : "Try expanding your search range"}
										</p>
									</div>
							) : (
								filteredAndSortedDrivers.map((driver) => (
									<DriverCard
										key={driver.id}
										driver={driver}
										isSelected={selectedDriver === driver.id}
										onSelect={handleDriverSelect}
										onChoose={handleChooseDriver}
										onViewDetails={handleViewDriverDetails}
										onChat={handleChatWithDriver}
										isArabic={isArabic}
										isTruck={!isMotorbike}
									/>
								))
							)}
							</div>
						)}
					</div>
				</div>

				{/* Right Section - Map (Desktop Only) */}
				<div className="w-full hidden lg:block lg:w-1/2 lg:border-l border-gray-200 dark:border-gray-700 h-full">
					{loadError ? (
						<div className="h-full bg-gray-100 flex items-center justify-center">
							<div className="text-center">
								<MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
								<p className="text-red-600">{isArabic ? "خطأ في تحميل الخريطة" : "Error loading map"}</p>
							</div>
						</div>
					) : !isLoaded ? (
						<div className="h-full bg-gray-100 flex items-center justify-center">
							<div className="text-center">
								<Loader2 className="h-16 w-16 text-[#31A342] animate-spin mx-auto mb-4" />
								<p className="text-gray-600 dark:text-gray-400">{isArabic ? "جاري تحميل الخريطة..." : "Loading map..."}</p>
							</div>
						</div>
					) : (
						<GoogleMap
							mapContainerStyle={{ width: "100%", height: "100%" }}
							center={mapCenter}
							zoom={MAP_CONFIG.defaultZoom}
							onLoad={onLoad}
							onUnmount={onUnmount}
							options={{
								streetViewControl: false,
								mapTypeControl: false,
								fullscreenControl: false,
								zoomControl: true,
							}}
						>
							{/* Pickup Location Marker */}
							{pickupLocation && (
								<Marker
									position={pickupLocation}
									title={isArabic ? "موقع الالتقاط" : "Pickup Location"}
									icon={{
										url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
											<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
												<circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
											</svg>
										`),
										scaledSize: new google.maps.Size(40, 40),
										anchor: new google.maps.Point(20, 20)
									}}
								/>
							)}
							
							{/* Driver Markers */}
							{filteredAndSortedDrivers.map((driver) => (
								<Marker
									key={driver.id}
									position={{ lat: driver.lat, lng: driver.lng }}
									title={driver.name}
									onClick={() => setSelectedDriver(driver.id)}
									icon={getDriverMarkerIcon(driver, selectedDriver === driver.id)}
								/>
							))}
						</GoogleMap>
					)}
				</div>
			</div>

		{/* Confirmation Modal */}
		{showConfirmModal && selectedDriverData && (
			<div 
				className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
				onClick={() => setShowConfirmModal(false)}
			>
				<div 
					className={`bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-8 max-h-[90vh] overflow-y-auto ${
						isArabic ? "text-right" : "text-left"
					}`}
					onClick={(e) => e.stopPropagation()}
					dir={isArabic ? "rtl" : "ltr"}
				>
					{/* Header with Vehicle Type Badge */}
					<div className="flex items-center justify-between mb-5 sm:mb-6">
						<h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
							{isArabic ? "تأكيد اختيار السائق" : "Confirm Driver Selection"}
						</h3>
						<div className={`p-2 rounded-lg ${
							isMotorbike 
								? "bg-orange-100 dark:bg-orange-900/30" 
								: "bg-green-100 dark:bg-green-900/30"
						}`}>
							{isMotorbike ? (
								<Bike className="w-5 h-5 sm:w-6 sm:h-6 text-[#FA9D2B]" />
							) : (
								<Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#31A342]" />
							)}
						</div>
					</div>

					{/* Driver Info Card */}
					<div className={`p-4 sm:p-5 rounded-2xl mb-5 sm:mb-6 bg-gradient-to-br ${
						isMotorbike 
							? "from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800 border-2 border-orange-100 dark:border-orange-900/30" 
							: "from-green-50 to-white dark:from-green-900/10 dark:to-gray-800 border-2 border-green-100 dark:border-green-900/30"
					}`}>
						<div className="flex items-start gap-3 sm:gap-4 mb-4">
							<Image
								src={selectedDriverData.avatar}
								alt={selectedDriverData.name}
								width={80}
								height={80}
								className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg flex-shrink-0"
							/>
							<div className="flex-1 min-w-0">
								<h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2">
									{isArabic ? selectedDriverData.nameAr : selectedDriverData.name}
								</h4>
								<div className="flex items-center gap-1 mb-2">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
												i < Math.floor(selectedDriverData.rating)
													? "text-yellow-400 fill-yellow-400"
													: "text-gray-300 dark:text-gray-600"
											}`}
										/>
									))}
									<span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
										{selectedDriverData.rating} <span className="text-gray-400 font-normal">({selectedDriverData.reviewsCount})</span>
									</span>
								</div>
								<div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
									isMotorbike 
										? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" 
										: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
								}`}>
									{isMotorbike ? <Bike className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
									<span>{selectedDriverData.experience}</span>
								</div>
							</div>
						</div>
						
						{/* Vehicle Details */}
						<div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-3">
							<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
								{isArabic ? "معلومات المركبة" : "Vehicle Details"}
							</p>
							<p className="text-sm font-bold text-gray-900 dark:text-gray-100">
								{selectedDriverData.vehicleModel}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
								{selectedDriverData.licensePlate}
							</p>
						</div>

						{/* Price */}
						<div className={`inline-flex items-baseline gap-2 px-4 py-2.5 rounded-xl ${
							isMotorbike 
								? "bg-orange-100 dark:bg-orange-900/30" 
								: "bg-green-100 dark:bg-green-900/30"
						}`}>
							<span className={`text-xl sm:text-2xl font-bold ${
								isMotorbike ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"
							}`}>
								{selectedDriverData.pricePerKm}
							</span>
							<span className={`text-sm font-medium ${
								isMotorbike ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"
							}`}>
								{isArabic ? "ر.س/كم" : "SAR/km"}
							</span>
						</div>
					</div>

					{/* Info Notice */}
					<div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl mb-5 sm:mb-6">
						<p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
							{isArabic
								? "سيتم تحويلك إلى صفحة الدفع لإتمام الطلب"
								: "You will be redirected to the payment page to complete your order"}
						</p>
					</div>

					{/* Action Buttons */}
					<div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${isArabic ? "sm:flex-row-reverse" : ""}`}>
						<button
							onClick={() => setShowConfirmModal(false)}
							className="w-full sm:flex-1 px-5 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm sm:text-base"
						>
							{isArabic ? "إلغاء" : "Cancel"}
						</button>
						<button
							onClick={handleConfirmDriver}
							className={`w-full sm:flex-1 px-5 sm:px-6 py-3 sm:py-3.5 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
								isMotorbike ? "bg-[#FA9D2B] hover:bg-[#E88D26]" : "bg-[#31A342] hover:bg-[#2a8f3a]"
							}`}
						>
							<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
							{isArabic ? "تأكيد الطلب" : "Confirm Order"}
						</button>
					</div>
				</div>
			</div>
		)}
		</div>
	);
}

