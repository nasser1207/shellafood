'use client';

import React, { useState, useEffect } from 'react';
import { useStoreFavorites } from "@/hooks/useFavorites";
import FavoriteButton from "@/components/ui/FavoriteButton";
import Breadcrumb from "@/components/HomePage/Breadcrumb";
import { useSearchParams } from "next/navigation";

interface Store {
	id: string;
	name: string;
	type: string;
	rating?: string;
	image?: string;
    logo?: string | null;
	location?: string;
	hasProducts?: boolean;
	hasCategories?: boolean;
}

interface CategoryStoresPageProps {
	categoryName?: string;
	onStoreClick?: (storeName: string) => void;
	isFullPage?: boolean; // جديد: لتحديد ما إذا كانت صفحة كاملة أم مكون
}

// مكون بطاقة المتجر مع زر المفضلة
function StoreCard({ 
	store, 
	onStoreClick 
}: { 
	store: Store; 
	onStoreClick: (storeName: string) => void;
}) {
	const { isFavorite, isLoading: favoriteLoading, toggleFavorite } = useStoreFavorites(store.id);

	const handleLocationClick = (location: string) => {
		// تحويل الإحداثيات من النص إلى أرقام
		const coords = location.split(',').map(coord => parseFloat(coord.trim()));
		if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
			const [lat, lng] = coords;
			// فتح خرائط جوجل في تبويب جديد
			const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
			window.open(googleMapsUrl, '_blank');
		} else {
			// إذا لم تكن الإحداثيات صحيحة، فتح خرائط جوجل بالبحث عن اسم المتجر
			const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(store.name)}`;
			window.open(searchUrl, '_blank');
		}
	};

	return (
		<div
			onClick={() => store.hasProducts === true ? onStoreClick(store.name) : null}
			className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-200 relative ${
				store.hasProducts === true ? 'cursor-pointer hover:shadow-lg' : 'cursor-default opacity-75'
			}`}
		>
            <div className="relative h-48 bg-gray-200">
				{store.image ? (
					<img
						src={store.image}
						alt={store.name}
						className="w-full h-full object-cover"
						onError={(e) => {
							try {
								const img = e.currentTarget as HTMLImageElement;
								img.onerror = null;
								img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='28'>لا توجد صورة</text></svg>";
								console.warn("Store image failed:", store.name, store.image);
							} catch {}
						}}
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
						<svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
					</div>
				)}
				
				{/* زر المفضلة */}
				<FavoriteButton
					isFavorite={isFavorite}
					isLoading={favoriteLoading}
					onToggle={toggleFavorite}
					size="md"
					className="absolute top-4 left-4"
				/>

				{/* زر عرض الموقع */}
				{store.location && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							handleLocationClick(store.location!);
						}}
						className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:shadow-lg"
						title="عرض الموقع"
					>
						<svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</button>
				)}

                {/* شعار المتجر 96x96 تحت زر المفضلة */}
                {store.logo && (
                    <div className="absolute top-16 left-4 w-24 h-24 rounded bg-white/80 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                        <img
                            src={store.logo}
                            alt={`${store.name} logo`}
                            width={96}
                            height={96}
                            className="w-24 h-24 object-contain"
                        />
                    </div>
                )}
			</div>
			<div className="p-4 text-right">
				<h3 className="text-lg font-semibold text-gray-900 mb-1">{store.name}</h3>
				<p className="text-sm text-gray-600 mb-2">{store.type}</p>
				{store.rating && (
					<div className="flex items-center justify-end">
						<span className="text-sm text-gray-500 mr-1">{store.rating}</span>
						<svg className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
						</svg>
					</div>
				)}
				{/* رسالة "سيتم الإضافة قريباً" للمطاعم بدون منتجات */}
				{store.hasProducts === false && (
					<div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-md">
						<p className="text-xs text-orange-700 text-center font-medium">
							سيتم الإضافة قريباً
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default function CategoryStoresPage({ 
	categoryName: propCategoryName, 
	onStoreClick: propOnStoreClick, 
	isFullPage = false 
}: CategoryStoresPageProps) {
	const [stores, setStores] = useState<Store[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [nextOffset, setNextOffset] = useState(0);
	const pageSize = 20;

	// استخدام URL parameters للصفحة الكاملة
	const searchParams = useSearchParams();
	const urlCategoryName = searchParams.get("category") || "";
	
    // تحديد البيانات المستخدمة مع fallback عندما لا توجد قيمة في URL
    const categoryName = isFullPage ? (urlCategoryName || propCategoryName) : propCategoryName;
    const onStoreClick = isFullPage ? undefined : propOnStoreClick;

	// دالة التعامل مع النقر على المتجر للصفحة الكاملة
	const handleStoreClick = (storeName: string) => {
		if (isFullPage) {
			window.location.href = `/store?store=${encodeURIComponent(storeName)}&category=${encodeURIComponent(categoryName || "")}`;
		} else if (propOnStoreClick) {
			propOnStoreClick(storeName);
		}
	};

	// دالة التعامل مع النقر على Breadcrumb
	const handleBreadcrumbClick = (index: number) => {
		if (index === 0) {
			window.location.href = "/HomePage";
		} else {
			window.location.href = "/categories";
		}
	};

	useEffect(() => {
		const fetchCategoryStores = async () => {
			setIsLoading(true);
			try {
				const { getStoresByCategoryAction } = await import("@/app/actions/categories/categories.action");
				const result = await getStoresByCategoryAction(categoryName || "");
				if (result.success && result.stores) {
					setStores(result.stores || []);
				} else {
					console.error('فشل في جلب متاجر القسم:', result.error);
				}	
			} catch (error) {
				console.error('خطأ في جلب متاجر القسم:', error);
			} finally {
				setIsLoading(false);
			}
		};

        if (categoryName && categoryName.trim() !== "") {
            fetchCategoryStores();
        } else {
            // لا توجد قيمة صالحة للقسم، أوقف حالة التحميل لتجنب شاشة التحميل اللانهائية
            setIsLoading(false);
        }
	}, [categoryName, isFullPage]);

	const handleLoadMore = async () => {
		if (!hasMore || isLoadingMore || !categoryName) return;
		setIsLoadingMore(true);
		try {
			const { getStoresByCategoryAction } = await import("@/app/actions/categories/categories.action");
			const result = await getStoresByCategoryAction(categoryName || "");
			if (result.success && result.stores) {
				setStores(prev => [...prev, ...(result.stores || [])]);
			}
		} catch (error) {
			console.error('خطأ في جلب المزيد من المتاجر:', error);
		} finally {
			setIsLoadingMore(false);
		}
	};

	// عرض حالة التحميل
	if (isLoading) {
		if (isFullPage) {
			return (
				<>
					<div className="mb-4">
						<Breadcrumb
							path={["الرئيسية", categoryName || "القسم"]}
							onBreadcrumbClick={handleBreadcrumbClick}
						/>
					</div>
					<div className="p-4 md:p-8" dir="rtl">
						<div className="h-8 w-48 animate-pulse bg-gray-300 rounded mb-6"></div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[1, 2, 3, 4, 5, 6].map((item) => (
								<div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
									<div className="h-48 animate-pulse bg-gray-300"></div>
									<div className="p-4">
										<div className="h-6 w-3/4 animate-pulse bg-gray-300 rounded mb-2"></div>
										<div className="h-4 w-1/2 animate-pulse bg-gray-300 rounded mb-2"></div>
										<div className="h-4 w-1/3 animate-pulse bg-gray-300 rounded"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			);
		} else {
			return (
				<div className="p-4 md:p-8" dir="rtl">
					<div className="h-8 w-48 animate-pulse bg-gray-300 rounded mb-6"></div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[1, 2, 3, 4, 5, 6].map((item) => (
							<div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
								<div className="h-48 animate-pulse bg-gray-300"></div>
								<div className="p-4">
									<div className="h-6 w-3/4 animate-pulse bg-gray-300 rounded mb-2"></div>
									<div className="h-4 w-1/2 animate-pulse bg-gray-300 rounded mb-2"></div>
									<div className="h-4 w-1/3 animate-pulse bg-gray-300 rounded"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			);
		}
	}

	// إذا لم توجد متاجر
	if (stores.length === 0) {
		if (isFullPage) {
			return (
				<>
					<div className="mb-4">
						<Breadcrumb
							path={["الرئيسية", categoryName || "القسم"]}
							onBreadcrumbClick={handleBreadcrumbClick}
						/>
					</div>
					<div className="p-4 md:p-8" dir="rtl">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">{categoryName}</h2>
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
								</svg>
								<p className="text-gray-500 text-lg">لا توجد متاجر متاحة في {categoryName}</p>
								<p className="text-gray-400 text-sm mt-2">جرب تصفح أقسام أخرى</p>
							</div>
						</div>
					</div>
				</>
			);
		} else {
			return (
				<div className="p-4 md:p-8" dir="rtl">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">{categoryName}</h2>
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
							<p className="text-gray-500 text-lg">لا توجد متاجر متاحة في {categoryName}</p>
							<p className="text-gray-400 text-sm mt-2">جرب تصفح أقسام أخرى</p>
						</div>
					</div>
				</div>
			);
		}
	}

	// عرض الصفحة الكاملة
	if (isFullPage) {
		return (
			<>
				<div className="mb-4">
					<Breadcrumb
						path={["الرئيسية", categoryName || "القسم"]}
						onBreadcrumbClick={handleBreadcrumbClick}
					/>
				</div>
				<div className="p-4 md:p-8" dir="rtl">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">{categoryName}</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{stores.map((store) => (
							<StoreCard
								key={store.id}
								store={store}
								onStoreClick={handleStoreClick}
							/>
						))}
					</div>
					{/* زر عرض المزيد */}
					{hasMore && (
						<div className="mt-8 flex justify-center">
							<button
								onClick={handleLoadMore}
								disabled={isLoadingMore}
								className={`px-6 py-2 rounded-md text-white transition-colors ${isLoadingMore ? 'bg-gray-400' : 'bg-[#0EA5E9] hover:bg-[#0284C7]'}`}
							>
								{isLoadingMore ? '...جاري التحميل' : 'عرض المزيد'}
							</button>
						</div>
					)}
				</div>
			</>
		);
	}

	// عرض المكون (الوضع الافتراضي)
	return (
		<div className="p-4 md:p-8" dir="rtl">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">{categoryName}</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{stores.map((store) => (
					<StoreCard
						key={store.id}
						store={store}
						onStoreClick={onStoreClick || (() => {})}
					/>
				))}
			</div>
			{/* زر عرض المزيد */}
			{hasMore && (
				<div className="mt-8 flex justify-center">
					<button
						onClick={handleLoadMore}
						disabled={isLoadingMore}
						className={`px-6 py-2 rounded-md text-white transition-colors ${isLoadingMore ? 'bg-gray-400' : 'bg-[#0EA5E9] hover:bg-[#0284C7]'}`}
					>
						{isLoadingMore ? '...جاري التحميل' : 'عرض المزيد'}
					</button>
				</div>
			)}
		</div>
	);
}
