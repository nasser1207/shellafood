"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import { Store } from "@/components/Utils/StoreCard";
import { motion } from "framer-motion";
import { SlidersHorizontal, MapPin, Grid2x2, Grid3x3 } from "lucide-react";
import StoreCard from "@/components/Utils/StoreCard";
import FiltersSidebar from "@/components/Categories/shared/FiltersSidebar";
import Breadcrumbs from "@/components/Categories/shared/Breadcrumbs";
import EmptyState from "@/components/Categories/shared/EmptyState";
import InfiniteScrollTrigger from "@/components/Categories/shared/InfiniteScrollTrigger";
import { useFilters } from "@/hooks/useFilters";
import { staggerContainer } from "@/lib/utils/categories/animations";
import { TEST_CATEGORIES } from "@/lib/data/categories/testData";

interface NearbyStoresPageProps {
	stores: Store[];
}

type MobileViewMode = "single" | "double";

function NearbyStoresPage({ stores }: NearbyStoresPageProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const direction = isArabic ? "rtl" : "ltr";
	const [showFilters, setShowFilters] = useState(false);
	const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>("single");
	const { filters, updateFilter, clearFilters, hasActiveFilters } = useFilters();

	const breadcrumbItems = useMemo(
		() => [
			{ label: isArabic ? "الرئيسية" : "Home", href: "/home" },
			{ label: isArabic ? "المتاجر القريبة" : "Nearby Stores" },
		],
		[isArabic]
	);

	const router = useRouter();
	
	const handleStoreClick = useCallback(
		(store: Store) => {
			if (store.categoryId && store.slug) {
				const category = TEST_CATEGORIES.find(c => c.id === store.categoryId);
				if (category) {
					router.push(`/categories/${category.slug}/${store.slug}`);
				}
			}
		},
		[router]
	);

	// Filter and sort stores
	const filteredAndSortedStores = useMemo(() => {
		let result = [...stores];

		// Apply filters
		if (filters.rating.length > 0) {
			result = result.filter((store) => {
				const rating = parseFloat(store.rating || "0");
				return filters.rating.some((r) => rating >= r);
			});
		}

		if (filters.features.openNow) {
			result = result.filter((store) => store.isOpen === true);
		}

		if (filters.features.freeDelivery) {
			result = result.filter(
				(store) =>
					store.fee === "0" ||
					store.fee?.toLowerCase().includes("free") ||
					store.feeAr?.toLowerCase().includes("مجاني")
			);
		}

		if (filters.features.offers) {
			// Mock: Check if store has offers (in real app, check store.hasOffers or store.offers)
			// Using store ID hash to determine offers (consistent mock behavior)
			result = result.filter((store) => {
				const hash = store.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
				return hash % 3 === 0; // ~33% of stores have offers
			});
		}

		if (filters.features.previouslyOrdered) {
			// Mock: Check if user has ordered from this store before
			// In real app, check user's order history
			// For now, use a mock list based on store ID hash
			result = result.filter((store) => {
				const hash = store.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
				return hash % 4 === 0; // ~25% of stores are previously ordered
			});
		}

		// Apply sorting - default to rating (highest first)
		result.sort((a, b) => {
			return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
		});

		return result;
	}, [stores, filters]);

	const content = {
		ar: {
			title: "المتاجر القريبة",
			subtitle: "اكتشف أفضل المتاجر القريبة منك",
			description: `${filteredAndSortedStores.length} متجر متاح`,
			filters: "الفلاتر",
			noStores: "لا توجد متاجر قريبة متاحة",
			noStoresDesc: "يرجى التحقق من موقعك أو المحاولة مرة أخرى لاحقاً",
		},
		en: {
			title: "Nearby Stores",
			subtitle: "Discover the best stores near you",
			description: `${filteredAndSortedStores.length} stores available`,
			filters: "Filters",
			noStores: "No nearby stores available",
			noStoresDesc: "Please check your location or try again later",
		},
	};

	const t = content[language];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Breadcrumbs */}
				<Breadcrumbs items={breadcrumbItems} className="mb-6" />

				{/* Page Header */}
				<div className="mb-6 sm:mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
						<div className="flex items-start sm:items-center gap-3 sm:gap-4">
							<div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex-shrink-0">
								<MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
							</div>
							<div className="flex-1 min-w-0">
								<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-1 sm:mb-2">
									{t.title}
								</h1>
								<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
									{t.subtitle}
								</p>
								<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
									{t.description}
								</p>
							</div>
						</div>
					</div>

					{/* Filter Bar - Simplified */}
					<div className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
						<div className="flex items-center gap-2 sm:gap-3">
							{/* Mobile Filter Button */}
							<button
								onClick={() => setShowFilters(!showFilters)}
								className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm sm:text-base font-semibold"
							>
								<SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
								<span className="hidden sm:inline">{t.filters}</span>
								{hasActiveFilters && (
									<span className="w-2 h-2 rounded-full bg-green-600" />
								)}
							</button>

							{/* Mobile View Toggle - Only visible on mobile */}
							<div className="sm:hidden flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
								<button
									onClick={() => setMobileViewMode("single")}
									className={`p-1.5 rounded transition-colors ${
										mobileViewMode === "single"
											? "bg-green-600 text-white"
											: "text-gray-600 dark:text-gray-400"
									}`}
									aria-label={isArabic ? "عرض واحد" : "Single view"}
								>
									<Grid3x3 className="w-4 h-4" />
								</button>
								<button
									onClick={() => setMobileViewMode("double")}
									className={`p-1.5 rounded transition-colors ${
										mobileViewMode === "double"
											? "bg-green-600 text-white"
											: "text-gray-600 dark:text-gray-400"
									}`}
									aria-label={isArabic ? "عرض مزدوج" : "Double view"}
								>
									<Grid2x2 className="w-4 h-4" />
								</button>
							</div>
						</div>

						<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
							{filteredAndSortedStores.length} {isArabic ? "نتيجة" : "results"}
						</div>
					</div>
				</div>

				<div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
					{/* Filters Sidebar */}
					<div className={`${showFilters ? "block" : "hidden"} lg:block`}>
						<FiltersSidebar
							filters={filters}
							onFilterChange={updateFilter}
							onClearAll={clearFilters}
						/>
					</div>

					{/* Stores Grid - Always 2 columns */}
					<div>
						{filteredAndSortedStores.length > 0 ? (
							<>
								<motion.div
									variants={staggerContainer}
									initial="initial"
									animate="animate"
									className={`grid ${
										mobileViewMode === "double" ? "grid-cols-2" : "grid-cols-1"
									} sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6`}
								>
									{filteredAndSortedStores.map((store) => (
										<StoreCard
											key={store.id}
											store={store}
											onClick={handleStoreClick}
										/>
									))}
								</motion.div>

								{/* Infinite Scroll Trigger */}
								<InfiniteScrollTrigger
									hasMore={false}
									isLoading={false}
									onLoadMore={() => {}}
								/>
							</>
						) : (
							<EmptyState
								icon="🏪"
								title={t.noStores}
								description={t.noStoresDesc}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default NearbyStoresPage;

