"use client";

import { useMemo, useState, useCallback, useEffect, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Search, SlidersHorizontal, Package, Tag, Truck, Star, CheckCircle } from "lucide-react";
import { Product } from "@/components/Utils/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { navigateToProductFromContext } from "@/lib/utils/categories/navigation";
import MobileProductCard from "../shared/MobileProductCard";
import BottomSheet from "../shared/BottomSheet";
import FilterChip from "../shared/FilterChip";
import { getDepartmentBySlug } from "@/lib/data/categories/testData";

interface MobileDepartmentViewProps {
	products: Product[];
}

function MobileDepartmentView({ products }: MobileDepartmentViewProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const direction = isArabic ? "rtl" : "ltr";
	const router = useRouter();
	const params = useParams();

	const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
	const [filters, setFilters] = useState({
		inStock: false,
		hasOffers: false,
		freeDelivery: false,
		topRated: false,
	});
	const [showFilters, setShowFilters] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const categorySlug = useMemo(() => {
		if (params?.category) {
			return Array.isArray(params.category) ? params.category[0] : params.category;
		}
		return "";
	}, [params?.category]);

	const storeSlug = useMemo(() => {
		if (params?.store) {
			return Array.isArray(params.store) ? params.store[0] : params.store;
		}
		return "";
	}, [params?.store]);

	const departmentSlug = useMemo(() => {
		if (params?.department) {
			return Array.isArray(params.department) ? params.department[0] : params.department;
		}
		return "";
	}, [params?.department]);

	const department = useMemo(() => {
		if (departmentSlug) {
			return getDepartmentBySlug(departmentSlug);
		}
		return null;
	}, [departmentSlug]);

	const handleProductClick = useCallback(
		(productId: string) => {
			const product = products.find((p) => p.id === productId);
			if (product) {
				navigateToProductFromContext(router, product, categorySlug, storeSlug, departmentSlug);
			}
		},
		[router, products, categorySlug, storeSlug, departmentSlug]
	);

	const filteredAndSortedProducts = useMemo(() => {
		let filtered = products;

		// Apply search filter
		if (searchTerm) {
			filtered = filtered.filter((p) => {
				const name = isArabic && p.nameAr ? p.nameAr : p.name;
				return name.toLowerCase().includes(searchTerm.toLowerCase());
			});
		}

		// Apply filters
		if (filters.inStock) {
			filtered = filtered.filter((p) => p.inStock);
		}
		if (filters.hasOffers) {
			filtered = filtered.filter((p) => p.badge || (p.originalPrice && p.originalPrice > (p.price || 0)));
		}
		if (filters.topRated) {
			filtered = filtered.filter((p) => p.rating && p.rating >= 4.5);
		}

		// Apply sorting
		const sorted = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case "price":
					return (a.price || 0) - (b.price || 0);
				case "rating":
					return (b.rating || 0) - (a.rating || 0);
				case "name":
				default:
					const nameA = (isArabic && a.nameAr ? a.nameAr : a.name).toLowerCase();
					const nameB = (isArabic && b.nameAr ? b.nameAr : b.name).toLowerCase();
					return nameA.localeCompare(nameB);
			}
		});

		return sorted;
	}, [products, searchTerm, filters, sortBy, isArabic]);

	const toggleFilter = useCallback((key: keyof typeof filters) => {
		setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
	}, []);

	const departmentName = department
		? isArabic && department.nameAr
			? department.nameAr
			: department.name
		: departmentSlug;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			{/* Mobile Header - Sticky */}
			<div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
				{/* Back button + Title */}
				<div className="px-4 py-4 flex items-center gap-3">
					<button
						onClick={() => router.back()}
						className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-95"
					>
						<ArrowLeft className="w-5 h-5 text-gray-900 dark:text-white" />
					</button>
					<div className="flex-1 min-w-0">
						<h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
							{departmentName}
						</h1>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{filteredAndSortedProducts.length} {isArabic ? "منتج" : "items"}
						</p>
					</div>
					<button
						onClick={() => setShowSearch(true)}
						className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-95"
					>
						<Search className="w-5 h-5 text-gray-900 dark:text-white" />
					</button>
				</div>

				{/* Filters bar - horizontal scroll */}
				<div className="px-4 pb-3 overflow-x-auto scrollbar-hide momentum-scroll">
					<div className={`flex gap-2 `}>
						<FilterChip
							icon={SlidersHorizontal}
							label={isArabic ? "جميع الفلاتر" : "All Filters"}
							active={Object.values(filters).some((v) => v)}
							onClick={() => setShowFilters(true)}
						/>
						<FilterChip
							label={isArabic ? "متوفر" : "In Stock"}
							active={filters.inStock}
							onClick={() => toggleFilter("inStock")}
						/>
						<FilterChip
							label={isArabic ? "عروض" : "Offers"}
							active={filters.hasOffers}
							onClick={() => toggleFilter("hasOffers")}
						/>
						<FilterChip
							label={isArabic ? "الأعلى تقييماً" : "Top Rated"}
							active={filters.topRated}
							onClick={() => toggleFilter("topRated")}
						/>
						{/* Sort dropdown */}
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value as "name" | "price" | "rating")}
							className={`px-4 py-2 rounded-full font-semibold text-sm border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 ${
								isArabic ? "text-right" : "text-left"
							}`}
						>
							<option value="name">{isArabic ? "الاسم" : "Name"}</option>
							<option value="price">{isArabic ? "السعر" : "Price"}</option>
							<option value="rating">{isArabic ? "التقييم" : "Rating"}</option>
						</select>
					</div>
				</div>
			</div>

			{/* Products Grid - 2 columns on mobile */}
			<div className="px-4 py-4 pb-24">
				{filteredAndSortedProducts.length > 0 ? (
					<div className="grid grid-cols-2 gap-3">
						{filteredAndSortedProducts.map((product, index) => (
							<MobileProductCard
								key={product.id}
								product={product}
								index={index}
								onClick={handleProductClick}
							/>
						))}
					</div>
				) : (
					<div className="py-12 text-center">
						<p className="text-gray-600 dark:text-gray-400">
							{isArabic ? "لا توجد منتجات" : "No products found"}
						</p>
					</div>
				)}
			</div>

			{/* Search Modal */}
			<BottomSheet
				isOpen={showSearch}
				onClose={() => setShowSearch(false)}
				title={isArabic ? "البحث" : "Search"}
			>
				<div className="space-y-4">
					<div className="relative">
						<Search
							className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-3" : "left-3"} w-5 h-5 text-gray-400`}
						/>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder={isArabic ? "ابحث عن منتجات..." : "Search products..."}
							className={`w-full ${isArabic ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white`}
							autoFocus
						/>
					</div>
				</div>
			</BottomSheet>

			{/* Filters Modal */}
			<BottomSheet
				isOpen={showFilters}
				onClose={() => setShowFilters(false)}
				title={isArabic ? "الفلاتر" : "Filters"}
			>
				<div className="space-y-6 pb-6">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-bold text-gray-900 dark:text-white">
							{isArabic ? "الفلاتر" : "Filters"}
						</h2>
						<button
							onClick={() => setFilters({ inStock: false, hasOffers: false, freeDelivery: false, topRated: false })}
							className="text-sm text-green-600 font-semibold"
						>
							{isArabic ? "مسح الكل" : "Clear All"}
						</button>
					</div>

					{/* Quick Filters */}
					<div className="space-y-2">
						<button
							onClick={() => toggleFilter("inStock")}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
								filters.inStock
									? "border-green-500 bg-green-50 dark:bg-green-900/20"
									: "border-gray-200 dark:border-gray-700"
							}`}
						>
							<Package
								className={`w-5 h-5 ${filters.inStock ? "text-green-600" : "text-gray-400"}`}
							/>
							<span className="flex-1 text-left font-semibold text-gray-900 dark:text-white">
								{isArabic ? "متوفر فقط" : "In Stock Only"}
							</span>
							{filters.inStock && (
								<CheckCircle className="w-5 h-5 text-green-600" />
							)}
						</button>

						<button
							onClick={() => toggleFilter("hasOffers")}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
								filters.hasOffers
									? "border-green-500 bg-green-50 dark:bg-green-900/20"
									: "border-gray-200 dark:border-gray-700"
							}`}
						>
							<Tag
								className={`w-5 h-5 ${filters.hasOffers ? "text-green-600" : "text-gray-400"}`}
							/>
							<span className="flex-1 text-left font-semibold text-gray-900 dark:text-white">
								{isArabic ? "لديه عروض" : "Has Offers"}
							</span>
							{filters.hasOffers && (
								<CheckCircle className="w-5 h-5 text-green-600" />
							)}
						</button>

						<button
							onClick={() => toggleFilter("topRated")}
							className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
								filters.topRated
									? "border-green-500 bg-green-50 dark:bg-green-900/20"
									: "border-gray-200 dark:border-gray-700"
							}`}
						>
							<Star
								className={`w-5 h-5 ${filters.topRated ? "text-green-600 fill-green-600" : "text-gray-400"}`}
							/>
							<span className="flex-1 text-left font-semibold text-gray-900 dark:text-white">
								{isArabic ? "الأعلى تقييماً (4.5+)" : "Top Rated (4.5+)"}
							</span>
							{filters.topRated && (
								<CheckCircle className="w-5 h-5 text-green-600" />
							)}
						</button>
					</div>
				</div>
                        </BottomSheet>
                </div>
        );
}

export default memo(MobileDepartmentView);

