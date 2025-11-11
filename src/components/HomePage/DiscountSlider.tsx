"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
interface Discount {
	id: string;
	title: string;
	description: string;
	time: string;
	image: string;
	category: string;
	storeName: string;
	storeNameAr?: string;
	categoryAr?: string;
	discountPercentage: number;
	originalPrice: number;
	discountedPrice: number;
	validUntil: string;
	timeAr?: string;
	titleAr?: string;
	descriptionAr?: string;
}
interface DiscountSliderProps {
	onDiscountClick?: (discountTitle: string) => void;
	isFullPage?: boolean;
	discounts: Discount[];
}

/**
 * Discount Slider Component
 * Displays discounts using mock data with clean, professional design
 */
function DiscountSlider({
	onDiscountClick,
	isFullPage = false,
	discounts,
}: DiscountSliderProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();

	// Get all discounts

	// Full page state
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("الكل");
	const [sortBy, setSortBy] = useState<"discountPercentage" | "validUntil" | "title">("discountPercentage");

	// Get unique categories for filter
	const categories = useMemo(() => {
		const uniqueCategories = new Set(
			discounts.map((discount) => (isArabic ? discount.categoryAr : discount.category) || "")
		);
		return ["الكل", ...Array.from(uniqueCategories).filter(Boolean)];
	}, [discounts, isArabic]);

	// Filter and sort for full page
	const displayedDiscounts = useMemo(() => {
		let result = [...discounts];

		// Search filter
		if (searchTerm.trim()) {
			const searchLower = searchTerm.toLowerCase();
			result = result.filter((discount) => {
				const title = (isArabic ? discount.titleAr : discount.title) || discount.title;
				const description = (isArabic ? discount.descriptionAr : discount.description) || discount.description || "";
				const storeName = (isArabic ? discount.storeNameAr : discount.storeName) || discount.storeName || "";
				return (
					title.toLowerCase().includes(searchLower) ||
					description.toLowerCase().includes(searchLower) ||
					storeName.toLowerCase().includes(searchLower)
				);
			});
		}

		// Category filter
		if (selectedCategory !== "الكل") {
			result = result.filter((discount) => {
				const category = (isArabic ? discount.categoryAr : discount.category) || discount.category;
				return category === selectedCategory;
			});
		}

		// Sort
		result = [...result].sort((a, b) => {
			switch (sortBy) {
				case "discountPercentage":
					return (b.discountPercentage || 0) - (a.discountPercentage || 0);
				case "validUntil":
					const dateA = a.validUntil ? new Date(a.validUntil).getTime() : 0;
					const dateB = b.validUntil ? new Date(b.validUntil).getTime() : 0;
					return dateA - dateB;
				case "title":
					const titleA = (isArabic ? a.titleAr : a.title) || a.title;
					const titleB = (isArabic ? b.titleAr : b.title) || b.title;
					return titleA.localeCompare(titleB);
				default:
					return 0;
			}
		});

		return result;
	}, [discounts, searchTerm, selectedCategory, sortBy, isArabic]);

	// Handlers
	const handleScrollRight = useCallback(() => {
		document
			.getElementById("discounts-scroll-container")
			?.scrollBy({ left: isArabic ? -300 : 300, behavior: "smooth" });
	}, [isArabic]);

	const handleScrollLeft = useCallback(() => {
		document
			.getElementById("discounts-scroll-container")
			?.scrollBy({ left: isArabic ? 300 : -300, behavior: "smooth" });
	}, [isArabic]);

	const handleDiscountClick = useCallback((discount: Discount) => {
		if (onDiscountClick) {
			const title = (isArabic ? discount.titleAr : discount.title) || discount.title;
			onDiscountClick(title);
			return;
		}

		// Navigate to store page
		const storeName = (isArabic ? discount.storeNameAr : discount.storeName) || discount.storeName || discount.title;
		router.push(`/store?store=${encodeURIComponent(storeName)}&source=discounts`);
	}, [onDiscountClick, isArabic, router]);

	const handleBreadcrumbClick = useCallback(() => {
		router.push("/discounts");
	}, [router]);
	// Helper functions
	const getDaysRemaining = useCallback((validUntil?: string) => {
		if (!validUntil) return 0;
		const today = new Date();
		const validDate = new Date(validUntil);
		const diffTime = validDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	}, []);

	// Loading state (mocked - always false)
	const isLoading = false;

	// Slider view (not full page)
	if (!isFullPage) {
		if (isLoading) {
			return (
				<div className="relative flex items-center">
					<div className={`scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-2 ${isArabic ? "flex-row-reverse" : ""}`}>
						{Array.from({ length: 3 }, (_, i) => (
							<div
								key={i}
								className="flex w-80 flex-shrink-0 flex-col overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm md:w-96"
							>
								<div className="relative h-48 animate-pulse bg-gray-300 dark:bg-gray-700"></div>
								<div className="p-4">
									<div className={`mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-700 ${isArabic ? "ml-auto" : ""}`}></div>
									<div className="h-4 w-full animate-pulse rounded bg-gray-300 dark:bg-gray-700"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			);
		}

		if (discounts.length === 0) {
			return (
				<div className="flex items-center justify-center py-8">
					<p className="text-gray-500 dark:text-gray-400">
						{isArabic ? "لا توجد خصومات متاحة حالياً" : "No discounts available at the moment"}
					</p>
				</div>
			);
		}

		return (
			<div className="relative flex items-center">
				{/* Left Scroll Button */}
				<button
					className={`absolute z-10 hidden rounded-full bg-white dark:bg-gray-800 p-2 shadow-md dark:shadow-lg md:block transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${isArabic ? "right-0" : "left-0"}`}
					onClick={handleScrollLeft}
					aria-label={isArabic ? "تمرير لليسار" : "Scroll Left"}
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
							d={isArabic ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
						/>
					</svg>
				</button>

				{/* Discounts Scroll Container */}
				<div
					id="discounts-scroll-container"
					className={`scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-2 ${isArabic ? "flex-row-reverse" : ""}`}
				>
					{discounts.map((discount) => {
						const title = (isArabic ? discount.titleAr : discount.title) || discount.title;
						const description = (isArabic ? discount.descriptionAr : discount.description) || discount.description || "";
						const time = (isArabic ? discount.timeAr : discount.time) || discount.time || "";
						
						return (
							<button
								key={discount.id}
								onClick={() => handleDiscountClick(discount)}
								className="flex w-80 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md dark:shadow-lg transition-all duration-200 hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-1 md:w-96"
							>
								<div className="relative h-48 bg-gray-200 dark:bg-gray-700">
									<img
										src={discount.image}
										alt={title}
										className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
										loading="lazy"
										onError={(e) => {
											const img = e.currentTarget as HTMLImageElement;
											img.src = "https://images.unsplash.com/photo-1556910103-2d2c6dc4cc88?w=800&h=600&fit=crop";
										}}
									/>
									{discount.discountPercentage && (
										<div className={`absolute top-3 ${isArabic ? "right-3" : "left-3"} rounded-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg`}>
											-{discount.discountPercentage}%
										</div>
									)}
									{time && (
										<div className={`absolute top-3 ${isArabic ? "left-3" : "right-3"} rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200 shadow`}>
											{time}
										</div>
									)}
								</div>
								<div className={`p-4 ${isArabic ? "text-right" : "text-left"}`}>
									<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
										{title}
									</h3>
									{description && (
										<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
											{description}
										</p>
									)}
									{discount.storeName && (
										<p className={`mt-2 text-xs text-gray-500 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
											{isArabic ? discount.storeNameAr : discount.storeName}
										</p>
									)}
								</div>
							</button>
						);
					})}
				</div>

				{/* Right Scroll Button */}
				<button
					className={`absolute z-10 hidden rounded-full bg-white dark:bg-gray-800 p-2 shadow-md dark:shadow-lg md:block transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${isArabic ? "left-0" : "right-0"}`}
					onClick={handleScrollRight}
					aria-label={isArabic ? "تمرير لليمين" : "Scroll Right"}
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
							d={isArabic ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
						/>
					</svg>
				</button>
			</div>
		);
	}

	// Full page view
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isArabic ? "rtl" : "ltr"}>
			<div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				
				<div className={`mb-8 ${isArabic ? "text-right" : "text-center"}`}>
					<h1 className={`mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-center"}`}>
						{isArabic ? "أقوى الخصومات" : "Best Discounts"}
					</h1>
					<p className={`mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400 ${isArabic ? "text-right" : "text-center"}`}>
						{isArabic
							? "اكتشف أقوى الخصومات والعروض الحصرية من أفضل المتاجر والمطاعم ووفر المال مع عروض شلة المميزة"
							: "Discover the best discounts and exclusive offers from the best stores and restaurants and save money with Shilla's special offers"}
					</p>
				</div>

				{/* Search and Filter Bar */}
				<div className="mb-8 space-y-4">
					<div className="mx-auto max-w-md">
						<div className="relative">
							<input
								type="text"
								placeholder={isArabic ? "ابحث عن خصم..." : "Search for a discount..."}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={`w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 ${isArabic ? "pr-12 text-right" : "pl-12 text-left"} focus:border-transparent focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400`}
							/>
							<div className={`absolute top-1/2 -translate-y-1/2 transform ${isArabic ? "right-3" : "left-3"}`}>
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

					<div className="flex flex-wrap justify-center gap-4">
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>

						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as "discountPercentage" | "validUntil" | "title")}
							className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
						>
							<option value="discountPercentage">
								{isArabic ? "أكبر خصم" : "Highest Discount"}
							</option>
							<option value="validUntil">
								{isArabic ? "ينتهي قريباً" : "Ending Soon"}
							</option>
							<option value="title">
								{isArabic ? "اسم المتجر" : "Store Name"}
							</option>
						</select>
					</div>
				</div>

				{/* Discounts Grid */}
				{displayedDiscounts.length === 0 ? (
					<div className="py-12 text-center">
						<div className="mb-4 text-6xl">🎯</div>
						<h3 className={`mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-center"}`}>
							{isArabic ? "لم نجد أي خصومات" : "No discounts found"}
						</h3>
						<p className="text-gray-500 dark:text-gray-400">
							{isArabic ? "جرب البحث بكلمات مختلفة أو غير الفلتر" : "Try searching with different words or change the filter"}
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{displayedDiscounts.map((discount) => {
							const title = (isArabic ? discount.titleAr : discount.title) || discount.title;
							const description = (isArabic ? discount.descriptionAr : discount.description) || discount.description || "";
							const storeName = (isArabic ? discount.storeNameAr : discount.storeName) || discount.storeName || "";
							const daysRemaining = getDaysRemaining(discount.validUntil);
							
							return (
								<div
									key={discount.id}
									onClick={() => handleDiscountClick(discount)}
									className={`relative transform cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg dark:hover:shadow-xl ${isArabic ? "text-right" : "text-left"}`}
								>
									{discount.discountPercentage && (
										<div className={`absolute top-4 ${isArabic ? "right-4" : "left-4"} rounded-full bg-red-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg`}>
											-{discount.discountPercentage}%
										</div>
									)}
									<div className="relative mb-4">
										<img
											src={discount.image}
											alt={title}
											className="h-32 w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
											loading="lazy"
											onError={(e) => {
												const img = e.currentTarget as HTMLImageElement;
												img.src = "https://images.unsplash.com/photo-1556910103-2d2c6dc4cc88?w=800&h=600&fit=crop";
											}}
										/>
										{discount.validUntil && daysRemaining > 0 && (
											<div className={`absolute ${isArabic ? "right-2" : "left-2"} bottom-2 rounded bg-black/70 backdrop-blur-sm px-2 py-1 text-xs text-white`}>
												{isArabic ? `${daysRemaining} أيام متبقية` : `${daysRemaining} days remaining`}
											</div>
										)}
									</div>
									<div>
										<h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
											{title}
										</h3>
										{description && (
											<p className="mb-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
												{description}
											</p>
										)}
										{storeName && (
											<div className={`mb-3 text-sm text-gray-500 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
												🏪 {storeName}
											</div>
										)}
										{discount.originalPrice && discount.discountedPrice && (
											<div className={`mb-3 flex items-center justify-between ${isArabic ? "flex-row-reverse" : ""}`}>
												<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
													<span className="text-lg font-bold text-green-600 dark:text-green-400">
														{discount.discountedPrice} {isArabic ? "ريال" : "SAR"}
													</span>
													<span className="text-sm text-gray-400 dark:text-gray-500 line-through">
														{discount.originalPrice} {isArabic ? "ريال" : "SAR"}
													</span>
												</div>
												<div className="text-sm text-gray-500 dark:text-gray-400">
													{isArabic ? `وفرت ${discount.originalPrice - discount.discountedPrice} ريال` : `Save ${discount.originalPrice - discount.discountedPrice} SAR`}
												</div>
											</div>
										)}
										{discount.validUntil && (
											<div className={`text-center text-xs text-gray-500 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
												{isArabic ? "صالح حتى: " : "Valid until: "}
												{new Date(discount.validUntil).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default memo(DiscountSlider);
