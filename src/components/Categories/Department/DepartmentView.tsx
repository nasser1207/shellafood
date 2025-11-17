"use client";

import { useMemo, useState, useCallback, memo } from "react";
import ProductCard, { Product } from "@/components/Utils/ProductCard";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import { useParams, useRouter } from "next/navigation";
import { navigateToProductFromContext } from "@/lib/utils/categories/navigation";
import PageHeader from "../shared/PageHeader";
import EmptyState from "../shared/EmptyState";
import MobileDepartmentView from "./MobileDepartmentView";
import { useMobile } from "@/hooks/useMobile";
import { Search, X } from "lucide-react";

interface DepartmentViewProps {
products: Product[];
}

/**
 * Department View Component
 * Displays products in a specific department with filters, sorting, and bilingual support
 * Route: /categories/[category]/[store]/[department]
 */
function DepartmentView({ products }: DepartmentViewProps) {
	// Call all hooks first (hooks rules - must be called in same order)
	const isMobile = useMobile(768);
	const { isArabic, direction } = useLanguageDirection();
	const router = useRouter();
	const params = useParams();

	const categorySlug = useMemo(() => {
		if (params?.category) {
			return Array.isArray(params.category) ? params.category[0] : params.category;
		}
		return '';
	}, [params?.category]);

	const storeSlug = useMemo(() => {
		if (params?.store) {
			return Array.isArray(params.store) ? params.store[0] : params.store;
		}
		return '';
	}, [params?.store]);

	const departmentSlug = useMemo(() => {
		if (params?.department) {
			return Array.isArray(params.department) ? params.department[0] : params.department;
		}
		return '';
	}, [params?.department]);

	const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
	const [filterBy, setFilterBy] = useState<'all' | 'inStock' | 'offers'>('all');
	const [searchTerm, setSearchTerm] = useState('');

	const filterAndSortProducts = (products: Product[], filterBy: 'all' | 'inStock' | 'offers', sortBy: 'name' | 'price' | 'rating', searchTerm: string, isArabic: boolean) => {
		// Apply search filter first
		let filtered = products;
		if (searchTerm) {
			filtered = filtered.filter((product) => {
				const name = isArabic && product.nameAr ? product.nameAr : product.name;
				return name.toLowerCase().includes(searchTerm.toLowerCase());
			});
		}

		// Apply other filters
		filtered = filtered.filter((product) => {
			if (filterBy === 'all') return true;
			if (filterBy === 'inStock') return product.inStock;
			if (filterBy === 'offers') return product.originalPrice && product.originalPrice && product.originalPrice > (product.price || 0);
			return false;
		});

		// Apply sorting
		return filtered.sort((a, b) => {
			if (sortBy === 'name') {
				const nameA = (isArabic && a.nameAr ? a.nameAr : a.name).toLowerCase();
				const nameB = (isArabic && b.nameAr ? b.nameAr : b.name).toLowerCase();
				return nameA.localeCompare(nameB);
			}
			if (sortBy === 'price') return (a.price || 0) - (b.price || 0);
			if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
			return 0;
		});
	};
	
	const filteredAndSortedProducts = useMemo(
		() => filterAndSortProducts(products, filterBy, sortBy, searchTerm, isArabic),
		[products, sortBy, filterBy, searchTerm, isArabic]
	);

	const filterButtons = useMemo(() => [
		{ key: 'all' as const, label: isArabic ? 'الكل' : 'All' },
		{ key: 'inStock' as const, label: isArabic ? 'متوفر' : 'In Stock' },
		{ key: 'offers' as const, label: isArabic ? 'العروض' : 'Offers' },
	], [isArabic]);

	const sortOptions = useMemo(() => [
		{ value: 'name' as const, label: isArabic ? 'الاسم' : 'Name' },
		{ value: 'price' as const, label: isArabic ? 'السعر' : 'Price' },
		{ value: 'rating' as const, label: isArabic ? 'التقييم' : 'Rating' },
	], [isArabic]);

	const handleProductClick = useCallback((productId: string) => {
		const product = products.find(p => p.id === productId);
		if (product) {
			navigateToProductFromContext(router, product, categorySlug, storeSlug, departmentSlug);
		}
	}, [router, products, categorySlug, storeSlug, departmentSlug]);

	const handleAddToCart = (_productId: string) => {
		// TODO: Implement add to cart logic
	};

	// Use mobile view on mobile devices (after all hooks are called)
	if (isMobile) {
		return <MobileDepartmentView products={products} />;
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				<PageHeader
					title={isArabic ? 'الأقسام' : 'Departments'}
					description={isArabic ? 'تصفح جميع المنتجات في هذا القسم' : 'Browse all products in this department'}
				/>

				{/* Search Bar - Responsive */}
				<div className="mb-4 sm:mb-6">
					<div className="relative">
						<Search className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder={isArabic ? 'ابحث عن منتجات...' : 'Search products...'}
							className={`w-full ${isArabic ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
						/>
						{searchTerm && (
							<button
								onClick={() => setSearchTerm('')}
								className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? 'left-3' : 'right-3'} w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
							>
								<X className="w-5 h-5" />
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
						onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
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

				{filteredAndSortedProducts.length > 0 ? (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
						{filteredAndSortedProducts.map((product: Product) => (
							<ProductCard
								key={product.id}
								product={product}
								onClick={handleProductClick}
								onAddToCart={handleAddToCart}
								showRating={true}
								showStock={true}
							/>
						))}
					</div>
				) : (
					<EmptyState
						icon="📦"
						title={isArabic ? 'لا توجد منتجات متاحة' : 'No products available'}
						description={isArabic ? 'يرجى التحقق مرة أخرى لاحقاً' : 'Please check back later'}
					/>
				)}
			</div>
		</div>
	);
}

export default memo(DepartmentView);
