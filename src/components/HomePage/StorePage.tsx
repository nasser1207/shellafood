"use client";

import Breadcrumb from "@/components/HomePage/Breadcrumb";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { cacheKeys, useClientCache } from "@/hooks/useClientCache";
import { useStoreFavorites } from "@/hooks/useFavorites";
import { StoreCategoriesResult } from "@/lib/types/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Define the component's props - لم تعد بحاجة لـ storeName و onCategoryClick كـ props
interface StorePageProps {
	getStoreCategoriesAction: (
		storeName: string,
	) => Promise<StoreCategoriesResult>;
}

interface StoreDetails {
	id: string;
	name: string;
	type: string;
	rating: string;
	image: string;
}

interface StoreCategory {
	id: string;
	name: string;
	storecover: string | null;
	storelogo: string | null;
}

export default function StorePage({
	getStoreCategoriesAction,
}: StorePageProps) {
	// استخراج المعاملات من URL
	const searchParams = useSearchParams();
	const storeName = searchParams.get("store") || "";
	const categoryName = searchParams.get("category") || "";
	const source = searchParams.get("source") || "";

	const [productCategories, setProductCategories] = useState<string[]>([]);
	const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);
	const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null);

	const {
		isFavorite,
		isLoading: favoriteLoading,
		toggleFavorite,
	} = useStoreFavorites(storeDetails?.id || "");

	// دالة التعامل مع النقر على الفئة
	const handleCategoryClick = (categoryName: string) => {
		window.location.href = `/products?store=${encodeURIComponent(storeName)}&category=${encodeURIComponent(categoryName)}`;
	};

	// دالة التعامل مع النقر على Breadcrumb
	const handleBreadcrumbClick = (index: number) => {
		if (index === 0) {
			window.location.href = "/HomePage";
		} else if (source === "nearby") {
			window.location.href = "/nearby-stores";
		} else if (source === "discounts") {
			window.location.href = "/discounts";
		} else if (source === "popular") {
			window.location.href = "/popular-stores";
		} else if (categoryName) {
			window.location.href = `/category-stores?category=${encodeURIComponent(categoryName)}`;
		}
	};

	// التحقق من وجود اسم المتجر
	if (!storeName) {
		return <div className="text-center text-gray-600">المتجر غير محدد.</div>;
	}

	// استخدام التخزين المؤقت على مستوى العميل
	const {
		data: storeData,
		isLoading,
		error,
	} = useClientCache(
		cacheKeys.storeCategories(storeName),
		async () => {
			const { getStoreCategoriesAction } = await import("@/app/actions/stores");
			const result = await getStoreCategoriesAction(storeName);
			if (!result.success) {
				throw new Error(result.error || "فشل في جلب بيانات المتجر");
			}
			return result;
		},
		600, // 10 دقائق
	);

	// تحديث البيانات عند تغيير storeData
	useEffect(() => {
		if (storeData) {
			setProductCategories(storeData.categories || []);
			setStoreCategories(storeData.storeCategories || []);
			if (storeData.store) {
				setStoreDetails(storeData.store);
			}
		}
	}, [storeData]);

	// اختيار صور الغلاف واللوجو من أقسام المتجر (الأولى المتاحة)
	const coverUrl =
		storeCategories.find((c) => c.storecover)?.storecover ||
		storeDetails?.image ||
		null;
	const logoUrl = storeCategories.find((c) => c.storelogo)?.storelogo || null;

	return (
		<>
			{/* Breadcrumb Section */}
			<div className="mb-4">
				<Breadcrumb
					path={["الرئيسية", storeName]}
					onBreadcrumbClick={handleBreadcrumbClick}
				/>
			</div>

			{/* Store Content */}
			<div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
				{/* Store Header Section */}
				<div className="relative h-48 w-full overflow-hidden bg-gray-200 md:h-64 lg:h-80">
					{isLoading ? (
						<div className="h-full w-full animate-pulse bg-gray-300"></div>
					) : coverUrl ? (
						<img
							src={coverUrl}
							alt={storeDetails?.name || "cover"}
							className="h-full w-full object-cover"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
							<svg
								className="h-24 w-24 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
								/>
							</svg>
						</div>
					)}

					{/* زر المفضلة في الزاوية اليسرى العليا من الصورة */}
					{storeDetails?.id && !isLoading && (
						<FavoriteButton
							isFavorite={isFavorite}
							isLoading={favoriteLoading}
							onToggle={toggleFavorite}
							size="md"
							className="absolute top-4 left-4"
						/>
					)}
				</div>

				<div className="relative z-10 -mt-8 rounded-t-2xl bg-white p-4 shadow-lg md:p-8">
					<div className="flex items-start justify-between">
						<div className="relative text-right">
							{isLoading ? (
								<>
									<div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-300"></div>
									<div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-300"></div>
									<div className="mb-2 h-4 w-40 animate-pulse rounded bg-gray-300"></div>
									<div className="h-4 w-24 animate-pulse rounded bg-gray-300"></div>
								</>
							) : storeDetails ? (
								<>
									{/* اسم المتجر مع اللوجو بجانبه */}
									<div className="flex items-center justify-end gap-3">
										{logoUrl && (
											<img
												src={logoUrl}
												alt={storeDetails.name}
												width={96}
												height={96}
												className="h-24 w-24 rounded object-contain"
											/>
										)}
										<h1 className="text-2xl font-bold text-gray-900">
											{storeDetails.name}
										</h1>
									</div>
									<p className="mt-1 text-gray-600">{storeDetails.type}</p>
									<div className="mt-2 flex items-center justify-end text-sm text-gray-500">
										<span className="mr-2">متاح للتوصيل</span>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									</div>
									{storeDetails.rating && (
										<div className="mt-1 flex items-center justify-end text-sm text-gray-600">
											<span className="mr-1">{storeDetails.rating}</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="mr-1 h-4 w-4 text-yellow-400"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										</div>
									)}
								</>
							) : (
								<div className="text-center text-gray-500">
									<p>خطأ في تحميل تفاصيل المتجر</p>
								</div>
							)}
						</div>
						<div className="flex items-center justify-center rounded-lg bg-gray-200 p-2">
							{/* Shopping cart icon */}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-green-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.182 1.625.707 1.625H18.5a1 1 0 00.95-1.285L17.154 5H6.264"
								/>
							</svg>
						</div>
					</div>
				</div>

				<hr className="my-4 border-gray-200" />

				{/* Product Categories Section */}
				<div className="p-4 md:p-8">
					<h2 className="mb-4 text-xl font-bold text-gray-900">أقسام المتجر</h2>
					<div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
						{isLoading
							? // عرض skeleton أثناء التحميل بنفس التصميم
								Array.from({ length: 12 }).map((_, index) => (
									<div
										key={index}
										className="flex flex-col items-center rounded-lg bg-white p-2 text-center shadow-sm"
									>
										<div className="h-16 w-16 animate-pulse rounded-lg bg-gray-300"></div>
										<div className="mt-2 h-3 w-12 animate-pulse rounded bg-gray-300"></div>
									</div>
								))
							: storeCategories.map((category) => (
									<button
										key={category.id}
										onClick={() => handleCategoryClick(category.name)}
										className="relative flex flex-col items-center rounded-lg bg-white p-2 text-center shadow-sm transition-colors hover:bg-gray-100"
									>
										<p className="text-l mt-2 font-semibold text-gray-700">
											{category.name}
										</p>
									</button>
								))}
					</div>
				</div>
			</div>
		</>
	);
}
