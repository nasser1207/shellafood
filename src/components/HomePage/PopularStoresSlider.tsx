"use client";


import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useMemo, useCallback, memo } from "react";
import StoreCard, { Store } from "../Utils/StoreCard";

interface PopularStoresSliderProps {
	stores: Store[];
	categoryName?: string; // e.g., "سوبر ماركت" or "Supermarket"
	isFullPage?: boolean;
}

/**
 * Popular Stores Slider Component
 * Displays popular stores using mock data with clean, professional design
 */
function PopularStoresSlider({	
	stores,
	categoryName,
	isFullPage = false,
}: PopularStoresSliderProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	// Filter and sort stores
	const filteredStores = useMemo(() => {
		if (!categoryName) return stores;
		

	}, [categoryName, isArabic]);

	const sortedStores = useMemo(() => {
		return [...stores].sort((a, b) => {
			const ratingA = parseFloat(a.rating || "0");
			const ratingB = parseFloat(b.rating || "0");
			return ratingB - ratingA;
		});
	}, [stores]);

	// Full page state
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("الكل");
	const [sortBy, setSortBy] = useState<"rating" | "reviews">("rating");

	// Get unique categories for filter
	const categories = useMemo(() => {
		const uniqueCategories = new Set(
			stores.map((store) => (isArabic ? store.typeAr : store.type) || "")
		);
		return ["الكل", ...Array.from(uniqueCategories).filter(Boolean)];
	}, [stores, isArabic]);

	// Filter and sort for full page
	const displayedStores = useMemo(() => {
		let result = [...stores];

		// Search filter
		if (searchTerm.trim()) {
			const searchLower = searchTerm.toLowerCase();
			result = result.filter((store) => {
				const name = (isArabic ? store.nameAr : store.name) || store.name;
				const type = (isArabic ? store.typeAr : store.type) || store.type;
				return (
					name.toLowerCase().includes(searchLower) ||
					type.toLowerCase().includes(searchLower)
				);
			});
		}

		// Category filter
		if (selectedCategory !== "الكل") {
			result = result.filter((store) => {
				const type = (isArabic ? store.typeAr : store.type) || store.type;
				return type === selectedCategory;
			});
		}

		// Sort
		if (sortBy === "reviews") {
			result = [...result].sort((a, b) => {
				return (b.reviewsCount || 0) - (a.reviewsCount || 0);
			});
		}

		return result;
	}, [sortedStores, searchTerm, selectedCategory, sortBy, isArabic]);

	const handleBreadcrumbClick = useCallback((index: number) => {
		if (index === 0) {
			window.location.href = "/home";
		}
	}, []);


	const handleScrollLeft = useCallback(() => {
		const container = document.getElementById("popular-stores-scroll-container");
		container?.scrollBy({ left: -300, behavior: "smooth" });
	}, []);

	const handleScrollRight = useCallback(() => {
		const container = document.getElementById("popular-stores-scroll-container");
		container?.scrollBy({ left: 300, behavior: "smooth" });
	}, []);

	// Full page view
	if (isFullPage) {
		return (
			<>
				
				{/* Search and Filters */}
				<div className="mb-8 space-y-4">
					{/* Search Bar */}
					<div className="mx-auto max-w-md">
						<div className="relative">
							<input
								type="text"
								placeholder={isArabic ? "ابحث عن محل..." : "Search stores..."}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 ${
									isArabic ? "pr-12 text-right" : "pl-12 text-left"
								} focus:border-transparent focus:ring-2 focus:ring-[#10b981] dark:focus:ring-green-400`}
								dir={isArabic ? "rtl" : "ltr"}
							/>
							<div className={`absolute top-1/2 ${
								isArabic ? "left-3" : "right-3"
							} -translate-y-1/2 transform`}>
								<svg
									className="h-5 w-5 text-gray-400 dark:text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* Filters */}
					<div className={`flex flex-wrap justify-center gap-4 `}>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#10b981] dark:focus:ring-green-400"
							dir={isArabic ? "rtl" : "ltr"}
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>

						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as "rating" | "reviews")}
							className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#10b981] dark:focus:ring-green-400"
							dir={isArabic ? "rtl" : "ltr"}
						>
							<option value="rating">
								{isArabic ? "الأعلى تقييماً" : "Highest Rated"}
							</option>
							<option value="reviews">
								{isArabic ? "الأكثر تقييماً" : "Most Reviews"}
							</option>
						</select>
					</div>
				</div>

				{/* Stores Grid */}
				{displayedStores.length > 0 ? (
					<div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{displayedStores.map((store) => (
							<StoreCard
								key={store.id}
								store={store}
								className="w-80 flex-shrink-0 md:w-96"
								onClick={handleStoreClick}
							/>
						))}
					</div>
				) : (
					<div className="py-12 text-center">
						<div className="mb-4 text-6xl">🏆</div>
						<h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
							{isArabic ? "لم نجد أي محلات" : "No Stores Found"}
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							{isArabic
								? "جرب البحث بكلمات مختلفة أو غير الفلتر"
								: "Try searching with different words or change the filter"}
						</p>
					</div>
				)}
			</>
		);
	}

	// Slider view (homepage)
	if (sortedStores.length === 0) {
		return (
			<div className="flex items-center justify-center py-8">
				<p className="text-gray-500 dark:text-gray-400">
					{isArabic ? "لا توجد متاجر شهيرة متاحة حالياً" : "No popular stores available"}
				</p>
			</div>
		);
	}

	return (
		<div className="relative flex items-center">
			{/* Left Arrow */}
			<button
				className="absolute -left-4 z-10 hidden rounded-full bg-white dark:bg-gray-800 p-2 shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-shadow hover:bg-gray-50 dark:hover:bg-gray-700 md:block"
				onClick={handleScrollLeft}
				aria-label={isArabic ? "التمرير لليسار" : "Scroll left"}
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

			{/* Stores Container */}
			<div
				id="popular-stores-scroll-container"
				className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-2"
			>
				{sortedStores.slice(0, 10).map((store) => (
					<div key={store.id} className="w-80 flex-shrink-0 md:w-96">
						<StoreCard
							store={store}
							onClick={handleStoreClick}
						/>
					</div>
				))}
			</div>

			{/* Right Arrow */}
			<button
				className="absolute -right-4 z-10 hidden rounded-full bg-white dark:bg-gray-800 p-2 shadow-md dark:shadow-lg hover:shadow-lg dark:hover:shadow-xl transition-shadow hover:bg-gray-50 dark:hover:bg-gray-700 md:block"
				onClick={handleScrollRight}
				aria-label={isArabic ? "التمرير لليمين" : "Scroll right"}
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

export default memo(PopularStoresSlider);
