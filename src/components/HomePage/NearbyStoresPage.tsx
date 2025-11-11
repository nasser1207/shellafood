// NearbyStoresPage.tsx
"use client";


import { NearbyStore } from "@/lib/types/api";
import { useEffect, useState } from "react";


interface Store {
	id: string;
	name: string;
	image: string | null;
	type?: string | null;
	rating?: number | string | null;
	location?: string | null;
	distance?: number;
	logo?: string | null;
	hasProducts?: boolean;
}

interface NearbyStoresPageProps {
	onStoreClick?: (storeName: string) => void;
	selectedLocation?: any;
	isFullPage?: boolean;
	getNearbyStoresAction: (args: {
		lat: number;
		lng: number;
		limit?: number;
		maxDistance?: number;
	}) => Promise<
		| {
				stores: NearbyStore[];
				userLocation: { lat: number; lng: number };
				maxDistance: number;
				total: number;
				success?: true;
		  }
		| { error: string }
	>;
}

export default function NearbyStoresPage({
	onStoreClick,
	selectedLocation,
	isFullPage = false,
	getNearbyStoresAction,
}: NearbyStoresPageProps) {
	// مشتركة
	const [stores, setStores] = useState<Store[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

  // حالة الصفحة الكاملة
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [sortBy, setSortBy] = useState("rating");
  const [fullPageStores, setFullPageStores] = useState<Store[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  // الحصول على موقع المستخدم (مستخدم في كلا الوضعين)
  useEffect(() => {
    // استخدام الموقع المختار أولاً، ثم الموقع الحالي للمستخدم
    if (!isFullPage && selectedLocation && selectedLocation.address) {
      const coords = selectedLocation.address
        .split(",")
        .map((coord: string) => parseFloat(coord.trim()));
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        setUserLocation({ lat: coords[0], lng: coords[1] });
        return;
      }
    }

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (err) => {
            console.warn("فشل في الحصول على الموقع:", err);
            // استخدام موقع افتراضي (الرياض) إذا فشل الحصول على الموقع
            setUserLocation({ lat: 24.7136, lng: 46.6753 });
          },
        );
      } else {
        // استخدام موقع افتراضي إذا لم يكن المتصفح يدعم الموقع
        setUserLocation({ lat: 24.7136, lng: 46.6753 });
      }
    };

    getUserLocation();
  }, [selectedLocation, isFullPage]);

  // وضع السلايدر: استخدام Server Action بدل API
  useEffect(() => {
    if (isFullPage) return;
    const fetchNearbyStores = async () => {
      if (!userLocation) return;
      try {
        const result = await getNearbyStoresAction({
          lat: userLocation.lat,
          lng: userLocation.lng,
          limit: 10,
          maxDistance: 10,
        });
        if ((result as any).stores) {
          setStores(((result as any).stores || []) as Store[]);
        } else if ((result as any).error) {
          console.error("فشل في جلب المتاجر القريبة:", (result as any).error);
        }
      } catch (err) {
        console.error("خطأ في جلب المتاجر القريبة:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNearbyStores();
  }, [userLocation, isFullPage, getNearbyStoresAction]);

  // وضع الصفحة الكاملة: جلب عبر Server Action
  useEffect(() => {
    if (!isFullPage) return;
    const fetchAllNearby = async () => {
      if (!userLocation) return;
      setPageLoading(true);
      setError(null);
      try {
        const result = await getNearbyStoresAction({
          lat: userLocation.lat,
          lng: userLocation.lng,
          limit: 200,
          maxDistance: 15,
        });
        if ((result as any).stores) {
          setFullPageStores(((result as any).stores || []) as Store[]);
        } else if ((result as any).error) {
          setError((result as any).error);
        }
      } catch (err) {
        setError(err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchAllNearby();
  }, [isFullPage, userLocation, getNearbyStoresAction]);

	const getStoreInfo = (store: Store) => {
		const distances = [
			"0.3 كم",
			"0.5 كم",
			"0.8 كم",
			"1.2 كم",
			"1.5 كم",
			"2.0 كم",
		];
		const deliveryTimes = [
			"10-20 دقيقة",
			"15-25 دقيقة",
			"20-30 دقيقة",
			"25-35 دقيقة",
			"30-40 دقيقة",
			"35-45 دقيقة",
		];
		const randomDistance =
			distances[Math.floor(Math.random() * distances.length)];
		const randomDeliveryTime =
			deliveryTimes[Math.floor(Math.random() * deliveryTimes.length)];
		return {
			distance: randomDistance,
			deliveryTime: randomDeliveryTime,
			description: `${store.name} - ${store.type || "متجر"} عالي الجودة`,
			isOpen: Math.random() > 0.1,
		};
	};

	const filteredStores = fullPageStores.filter((store: Store) => {
		const info = getStoreInfo(store);
		const matchesSearch =
			store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			info.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			selectedCategory === "الكل" || store.type === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const sortedStores = [...filteredStores].sort((a: Store, b: Store) => {
		const aInfo = getStoreInfo(a);
		const bInfo = getStoreInfo(b);
		switch (sortBy) {
			case "rating":
				return Number(b.rating || 0) - Number(a.rating || 0);
			case "distance":
				return parseFloat(aInfo.distance) - parseFloat(bInfo.distance);
			case "deliveryTime":
				return parseInt(aInfo.deliveryTime) - parseInt(bInfo.deliveryTime);
			default:
				return 0;
		}
	});

  const categories = [
    "الكل",
    ...new Set(fullPageStores.map((s: Store) => s.type).filter(Boolean)),
  ] as string[];
	const handleScrollRight = () => {
		document
			.getElementById("nearby-stores-scroll-container")
			?.scrollBy({ left: 200, behavior: "smooth" });
	};

	const handleScrollLeft = () => {
		document
			.getElementById("nearby-stores-scroll-container")
			?.scrollBy({ left: -200, behavior: "smooth" });
	};

	// وضع الصفحة الكاملة: تحميل
	if (isFullPage) {
		const handleBreadcrumbClick = (index: number) => {
			if (index === 0) {
				window.location.href = "/home";
			}
		};

		if (pageLoading) {
			return (
				<>
				
					<div className="py-12 text-center">
						<div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-[#10b981] dark:border-green-400"></div>
						<p className="text-gray-600 dark:text-gray-400">جاري تحميل المتاجر...</p>
					</div>
				</>
			);
		}
		if (error) {
			
		
		}

		return (
			<div></div>
		);
	}

	// وضع السلايدر: تحميل
	if (isLoading) {
		return (
			<div className="relative flex items-center p-4 md:p-8" dir="rtl">
				<div className="scrollbar-hide flex gap-5 space-x-reverse overflow-x-auto px-4 pb-2">
					{[1, 2, 3, 4, 5, 6].map((item) => (
						<div
							key={item}
							className="flex w-[109px] flex-shrink-0 flex-col items-center text-center"
						>
							<div className="h-[85px] w-[85px] animate-pulse rounded-lg bg-gray-300 dark:bg-gray-700"></div>
							<div className="mt-2 h-3 w-16 animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// إذا لم توجد متاجر في السلايدر
	if (stores.length === 0) {
		return (
			<div className="flex items-center justify-center py-8">
				<p className="text-gray-500 dark:text-gray-400">لا توجد متاجر قريبة متاحة حالياً</p>
			</div>
		);
	}

	return (
		<div className="relative flex items-center p-4 md:p-8" dir="rtl">
			{/* سهم التنقل الأيسر */}
			<button
				className="absolute -left-4 z-10 hidden rounded-full bg-white dark:bg-gray-800 p-2 shadow-md dark:shadow-lg md:block transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
				onClick={handleScrollLeft}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-600 dark:text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			{/* حاوية المتاجر */}
			<div
				id="nearby-stores-scroll-container"
				className="scrollbar-hide flex gap-5 space-x-reverse overflow-x-auto px-4 pb-2"
			>
				{stores.map((store, index) => (
					<button
						key={index}
						onClick={() => onStoreClick && onStoreClick(store.name)}
						className="flex w-[109px] flex-shrink-0 cursor-pointer flex-col items-center text-center"
					>
						<div className="flex h-[85px] w-[85px] items-center justify-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 shadow-md dark:shadow-lg">
							<img
								src={store.image || ""}
								alt={store.name}
								className="h-full w-full object-cover"
								onError={(e) => {
									try {
										const img = e.currentTarget as HTMLImageElement;
										img.onerror = null;
										img.src =
											"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='14'>لا توجد صورة</text></svg>";
										console.warn(
											"Store image failed:",
											store.name,
											store.image,
										);
									} catch {}
								}}
							/>
						</div>
						<p className="mt-2 text-xs text-gray-700 dark:text-gray-300">{store.name}</p>
						{store.distance && (
							<p className="text-xs font-medium text-green-600 dark:text-green-400">
								{store.distance} كم
							</p>
						)}
					</button>
				))}
			</div>

			{/* سهم التنقل الأيمن */}
			<button
				className="absolute -right-4 z-10 hidden rounded-full bg-white dark:bg-gray-800 p-2 shadow-md dark:shadow-lg md:block transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
				onClick={handleScrollRight}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-600 dark:text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	);
}
