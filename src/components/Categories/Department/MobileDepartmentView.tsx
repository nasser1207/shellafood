"use client";

import { useMemo, useState, useCallback, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Search, X } from "lucide-react";
import { Product } from "@/components/Utils/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { navigateToProductFromContext } from "@/lib/utils/categories/navigation";
import MobileProductCard from "../shared/MobileProductCard";
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
	const [filterBy, setFilterBy] = useState<"all" | "inStock" | "offers">("all");
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
		// Apply search filter first
		let filtered = products;
		if (searchTerm) {
			filtered = filtered.filter((p) => {
				const name = isArabic && p.nameAr ? p.nameAr : p.name;
				return name.toLowerCase().includes(searchTerm.toLowerCase());
			});
		}

		// Apply other filters
		filtered = filtered.filter((p) => {
			if (filterBy === "all") return true;
			if (filterBy === "inStock") return p.inStock;
			if (filterBy === "offers") return p.originalPrice && p.originalPrice > (p.price || 0);
			return false;
		});

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
	}, [products, searchTerm, filterBy, sortBy, isArabic]);

	const filterButtons = useMemo(() => [
		{ key: "all" as const, label: isArabic ? "الكل" : "All" },
		{ key: "inStock" as const, label: isArabic ? "متوفر" : "In Stock" },
		{ key: "offers" as const, label: isArabic ? "العروض" : "Offers" },
	], [isArabic]);

	const sortOptions = useMemo(() => [
		{ value: "name" as const, label: isArabic ? "الاسم" : "Name" },
		{ value: "price" as const, label: isArabic ? "السعر" : "Price" },
		{ value: "rating" as const, label: isArabic ? "التقييم" : "Rating" },
	], [isArabic]);

	const departmentName = department
		? isArabic && department.nameAr
			? department.nameAr
			: department.name
		: departmentSlug;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Back button + Title */}
				<div className="mb-4 sm:mb-6 flex items-center gap-3">
					<button
						onClick={() => router.back()}
						className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-95 flex-shrink-0"
					>
						<ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 dark:text-white" />
					</button>
					<div className="flex-1 min-w-0">
						<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
							{departmentName}
						</h1>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
							{filteredAndSortedProducts.length} {isArabic ? "منتج" : "items"}
						</p>
					</div>
				</div>

				{/* Search Bar - Responsive */}
				<div className="mb-4 sm:mb-6">
					<div className="relative">
						<Search className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3 sm:right-4' : 'left-3 sm:left-4'} w-4 h-4 sm:w-5 sm:h-5 text-gray-400`} />
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder={isArabic ? 'ابحث عن منتجات...' : 'Search products...'}
							className={`w-full ${isArabic ? 'pr-10 sm:pr-11 pl-3 sm:pl-4' : 'pl-10 sm:pl-11 pr-3 sm:pr-4'} py-2.5 sm:py-3 text-sm sm:text-base bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm('')}
								className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3 sm:left-4' : 'right-3 sm:right-4'} w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}
							>
								<X className="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						)}
					</div>
				</div>

				{/* Filters and Sort - Responsive */}
				<div className={`mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 ${isArabic ? 'sm:justify-start' : 'sm:justify-end'}`}>
					{/* Filter Buttons - Responsive */}
					<div className="flex flex-wrap gap-2 sm:gap-2">
						{filterButtons.map((filter) => (
							<button
								key={filter.key}
								onClick={() => setFilterBy(filter.key)}
								className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
									filterBy === filter.key
										? 'bg-green-600 dark:bg-green-500 text-white shadow-md dark:shadow-green-900/50'
										: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
								}`}
							>
								{filter.label}
							</button>
						))}
					</div>

					{/* Sort Dropdown - Responsive */}
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as "name" | "price" | "rating")}
						className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto`}
						dir={direction}
					>
						{sortOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				{/* Products Grid - Responsive */}
				{filteredAndSortedProducts.length > 0 ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
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
					<div className="py-12 sm:py-16 text-center">
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
							{isArabic ? "لا توجد منتجات" : "No products found"}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default memo(MobileDepartmentView);

