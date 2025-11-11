"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import ProductCard, { Product } from "@/components/Utils/ProductCard";
import { SectionHeader } from "@/components/Utils/SectionHeader";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useStoreFavorites } from "@/hooks/useFavorites";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import { Store } from "@/components/Utils/StoreCard";
import DepartmentCard, { Department } from "@/components/Utils/DepartmentCard";
import { navigateToProductFromContext } from "@/lib/utils/categories/navigation";

interface StoreViewProps {
	recommendedProducts?: Product[];
	popularProducts?: Product[];
	store: Store;
	departments?: Department[];
}

/**
 * Store View Component
 * Displays store details, categories, and products with bilingual support
 */
export default function StoreView({ recommendedProducts, popularProducts, store, departments}: StoreViewProps) {
	const { isArabic, direction } = useLanguageDirection();
	const router = useRouter();
	const params = useParams();
	
	const categorySlug = useMemo(() => {
		if (params?.category) {
			const slug = Array.isArray(params.category) ? params.category[0] : params.category;
			return slug || '';
		}
		return '';
	}, [params?.category]);

	const storeSlug = useMemo(() => {
		if (params?.store) {
			const slug = Array.isArray(params.store) ? params.store[0] : params.store;
			return slug || '';
		}
		return '';
	}, [params?.store]);

	const [activeFilter, setActiveFilter] = useState<string>('all');
	const { isFavorite: isStoreFavorite, isLoading: isStoreFavoriteLoading, toggleFavorite: toggleStoreFavorite } = useStoreFavorites(store.id, {
		name: store.name,
		nameAr: store.nameAr,
		image: store.image,
		logo: store.logo || undefined,
		type: store.type,
		typeAr: store.typeAr,
		rating: store.rating,
	});

	const handleAddToCart = (_productId: string) => {
		// TODO: Implement add to cart logic
	};

	const handleLocationClick = useCallback(() => {
		if (!store.location) return;
		
		const coords = store.location.split(',').map(c => parseFloat(c.trim()));
		if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
			const [lat, lng] = coords;
			window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
		} else {
			const storeName = isArabic && store.nameAr ? store.nameAr : store.name;
			window.open(`https://www.google.com/maps/search/${encodeURIComponent(storeName)}`, '_blank');
		}
	}, [store.location, store.name, store.nameAr, isArabic]);

	const handleProductClick = useCallback((productId: string) => {
		const product = recommendedProducts?.find(p => p.id === productId) || 
		                popularProducts?.find(p => p.id === productId);
		if (product) {
			const departmentSlug = departments?.find(d => d.name === product.department)?.slug || 
			                       (departments && departments.length > 0 ? departments[0].slug : 'food');
			navigateToProductFromContext(router, product, categorySlug, storeSlug, departmentSlug);
		}
	}, [router, recommendedProducts, popularProducts, categorySlug, storeSlug, departments]);

	const filteredProducts = useMemo(() => {
		if (!recommendedProducts || recommendedProducts.length === 0) {
			return [];
		}
		if (activeFilter === 'all') {
			return recommendedProducts;
		}
		return recommendedProducts.filter(p => p.badge || (p.originalPrice && p.originalPrice !== p.price));
	}, [recommendedProducts, activeFilter]);

	const filterButtons = useMemo(() => [
		{ key: 'all' as const, label: isArabic ? 'الكل' : 'All' },
		{ key: 'offers' as const, label: isArabic ? 'العروض' : 'Offers' },
	], [isArabic]);

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900" dir={direction}>
			{/* Store Header Hero */}
			<div className="relative h-48 sm:h-64 md:h-80 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
				{store.image && (
					<Image
						src={store.image}
						alt={store.name}
						fill
						className="object-cover"
						loading="eager"
						priority
						sizes="100vw"
					/>
				)}
				{/* Gradient Overlay for better visibility */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
				
				{/* Heart Icon - Responsive positioning */}
				<div className={`absolute ${isArabic ? 'right-3 sm:right-4 md:right-6' : 'left-3 sm:left-4 md:left-6'} top-3 sm:top-4 md:top-6 z-10`}>
					<FavoriteButton
						isFavorite={isStoreFavorite}
						isLoading={isStoreFavoriteLoading}
						onToggle={toggleStoreFavorite}
						size="md"
						className="shadow-xl backdrop-blur-md bg-white/90 dark:bg-gray-800/90 hover:scale-110 transition-transform"
					/>
				</div>

				{/* Location Icon - Responsive positioning */}
				{store.location && (
					<button
						onClick={handleLocationClick}
						className={`absolute ${isArabic ? 'left-3 sm:left-4 md:left-6' : 'right-3 sm:right-4 md:right-6'} top-3 sm:top-4 md:top-6 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 rounded-full p-2.5 sm:p-3 shadow-xl transition-all duration-200 hover:scale-110 active:scale-95`}
						title={isArabic ? "فتح الموقع على الخريطة" : "Open location on map"}
						aria-label={isArabic ? "فتح الموقع على الخريطة" : "Open location on map"}
					>
						<svg className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</button>
				)}
			</div>

			{/* Store Info Card */}
			<div className="relative z-10 -mt-8 rounded-t-2xl bg-white dark:bg-gray-800 p-4 shadow-lg dark:shadow-gray-900/50 md:p-8">
				<div className={`flex items-start justify-between`}>
					<div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
						<div className={`flex items-center gap-3`}>
							{store.logo && (
								<img
									src={store.logo}
									alt={store.name}
									className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-contain border-2 border-gray-200 dark:border-gray-700"
									onError={(e) => {
										const img = e.currentTarget as HTMLImageElement;
										img.style.display = 'none';
									}}
								/>
							)}
							<div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
								<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
									{isArabic && store.nameAr ? store.nameAr : store.name}
								</h1>
								<p className="mt-1 text-gray-600 dark:text-gray-400">
									{isArabic && store.typeAr ? store.typeAr : store.type}
								</p>
								{store.rating && (
									<div className={`mt-2 flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
										<svg className="h-4 w-4 text-yellow-400 dark:text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
										<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{store.rating}</span>
										{store.reviewsCount && (
											<span className="text-xs text-gray-500 dark:text-gray-400">
												({store.reviewsCount > 999 ? '999+' : store.reviewsCount} {isArabic ? 'تقييم' : 'reviews'})
											</span>
										)}
									</div>
								)}
								{/* Location Button */}
								{store.location && (
									<button
										onClick={handleLocationClick}
										className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 font-medium text-sm ${isArabic ? 'flex-row-reverse' : ''}`}
										title={isArabic ? "فتح الموقع على الخريطة" : "Open location on map"}
										aria-label={isArabic ? "فتح الموقع على الخريطة" : "Open location on map"}
									>
										<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										<span>{isArabic ? "عرض الموقع" : "View Location"}</span>
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Categories Section */}
			<section className="px-4 py-6 md:px-8">
				<SectionHeader title={isArabic ? 'أقسام المتجر' : 'Store Departments'} isArabic={isArabic} />
				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
					{departments && departments.length > 0 ? departments.map((department, index) => {
						return (
							<DepartmentCard
								key={index}
								department={department}
								category={categorySlug}
								store={storeSlug}
								className="w-full"
							/>
						);
					}) : null}
				</div>
			</section>

			{/* Recommended Section */}
			<section className="px-4 py-6 md:px-8 bg-gray-50 dark:bg-gray-900/50">
				<div className={`mb-4 flex items-center ${isArabic ? 'justify-start' : 'justify-end'}`}>
					<h2 className={`text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 ${isArabic ? 'text-right' : 'text-left'}`}>
						{isArabic ? 'موصى به' : 'Recommended'}
					</h2>
				</div>

				<div className={`mb-6 flex gap-3 ${isArabic ? 'justify-start' : 'justify-end'}`}>
					{filterButtons.map((filter) => (
						<button
							key={filter.key}
							onClick={() => setActiveFilter(filter.key)}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
								activeFilter === filter.key
									? "bg-green-600 dark:bg-green-500 text-white shadow-md dark:shadow-green-900/50"
									: "border border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
							}`}
						>
							{filter.label}
						</button>
					))}
				</div>

				<div className="overflow-x-auto" dir={direction}>
					<div className={`flex gap-4 pb-4`}>
						{filteredProducts && filteredProducts.length > 0 ? filteredProducts.map((product) => (
							<div key={product.id} className="w-48 flex-shrink-0">
								<ProductCard
									product={product}
									onClick={handleProductClick}
									onAddToCart={handleAddToCart}
									showRating={true}
									showStock={true}
								/>
							</div>
						)) : (
							<p className="text-gray-500 dark:text-gray-400 py-8">{isArabic ? 'لا توجد منتجات متاحة' : 'No products available'}</p>
						)}
					</div>
				</div>
			</section>

			{/* Popular Section */}
			<section className="px-4 py-6 md:px-8 dark:bg-gray-900">
				<div className={`mb-4 flex items-center ${isArabic ? 'justify-start' : 'justify-end'}`}>
					<h2 className={`text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 ${isArabic ? 'text-right' : 'text-left'}`}>
						{isArabic ? 'الأكثر شعبية' : 'Most Popular'}
					</h2>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{popularProducts && popularProducts.length > 0 ? popularProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onClick={handleProductClick}
							onAddToCart={handleAddToCart}
							showRating={true}
							showStock={true}
						/>
					)) : (
						<p className="text-gray-500 dark:text-gray-400 py-8 col-span-full">{isArabic ? 'لا توجد منتجات شائعة' : 'No popular products available'}</p>
					)}
				</div>
			</section>
		</div>
	);
}
