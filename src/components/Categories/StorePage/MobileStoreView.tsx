"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState, useCallback, useRef, useEffect, useLayoutEffect, memo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Store } from "@/components/Utils/StoreCard";
import { Product } from "@/components/Utils/ProductCard";
import { Department } from "@/components/Utils/DepartmentCard";
import { Search, MapPin, Star, Clock, ShoppingCart, Heart, Share2, ArrowLeft, ArrowUp, Grid3x3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileProductCard from "../shared/MobileProductCard";
import BottomSheet from "../shared/BottomSheet";
import FilterChip from "../shared/FilterChip";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useStoreFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/hooks/useCart";
import { getCartItems } from "@/lib/utils/cartStorage";
import Link from "next/link";
import { getImageBlurDataURL, getImageSizes, getImageQuality } from "@/lib/utils/imageOptimization";

interface MobileStoreViewProps {
	store: Store;
	departments: Department[];
	productsByDepartment: Record<string, Product[]>;
	categorySlug?: string;
	storeSlug?: string;
}

function MobileStoreView({
	store,
	departments,
	productsByDepartment,
	categorySlug,
	storeSlug,
}: MobileStoreViewProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const direction = isArabic ? "rtl" : "ltr";
	const router = useRouter();
	const { addToCart } = useCart();
	const [activeDepartment, setActiveDepartment] = useState<string | undefined>();
	const [searchTerm, setSearchTerm] = useState("");
	const [showSearchModal, setShowSearchModal] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [showScrollToTop, setShowScrollToTop] = useState(false);
	const [cartItems, setCartItems] = useState(getCartItems());
	const [headerHeight, setHeaderHeight] = useState(0);
	const departmentsRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);

	// Update cart items when cart changes
	useEffect(() => {
		const updateCart = () => {
			setCartItems(getCartItems());
		};
		updateCart();
		// Listen for storage events (cart updates from other tabs/components)
		window.addEventListener("storage", updateCart);
		// Also check periodically (for same-tab updates)
		const interval = setInterval(updateCart, 1000);
		return () => {
			window.removeEventListener("storage", updateCart);
			clearInterval(interval);
		};
	}, []);

	const { isFavorite, isLoading: favoriteLoading, toggleFavorite } =
		useStoreFavorites(store.id, {
			name: store.name,
			nameAr: store.nameAr,
			image: store.image,
			logo: store.logo || undefined,
			type: store.type,
			typeAr: store.typeAr,
			rating: store.rating,
		});

	const displayName = isArabic && store.nameAr ? store.nameAr : store.name;
	const displayDeliveryTime =
		isArabic && store.deliveryTimeAr ? store.deliveryTimeAr : store.deliveryTime;

	const cartCount = useMemo(() => {
		if (!cartItems || !Array.isArray(cartItems)) return 0;
		return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
	}, [cartItems]);

	// Handle scroll to top visibility and scroll spy for departments
	useEffect(() => {
		const updateActiveDepartment = () => {
			// Scroll spy: Update active department based on scroll position
			const scrollPosition = window.scrollY + headerHeight + 100; // 100px offset for better detection
			
			for (let i = departments.length - 1; i >= 0; i--) {
				const dept = departments[i];
				const element = document.getElementById(dept.slug || dept.name || "");
				if (element) {
					const elementTop = element.offsetTop;
					if (scrollPosition >= elementTop) {
						setActiveDepartment(dept.slug || undefined);
						break;
					}
				}
			}
		};

		const handleScroll = () => {
			setShowScrollToTop(window.scrollY > 400);
			updateActiveDepartment();
		};

		// Initial check on mount
		updateActiveDepartment();

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [departments, headerHeight]);

	const scrollToTop = useCallback(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	// Calculate total header height
	useLayoutEffect(() => {
		const calculateHeight = () => {
			setHeaderHeight(headerRef.current?.offsetHeight || 360);
		};

		calculateHeight();
		
		// Use ResizeObserver for better accuracy
		const resizeObserver = new ResizeObserver(() => {
			calculateHeight();
		});

		if (headerRef.current) {
			resizeObserver.observe(headerRef.current);
		}

		window.addEventListener('resize', calculateHeight);
		
		return () => {
			resizeObserver.disconnect();
			window.removeEventListener('resize', calculateHeight);
		};
	}, []);

	const filteredProducts = useMemo(() => {
		if (!searchTerm) return productsByDepartment;

		const filtered: Record<string, Product[]> = {};
		Object.entries(productsByDepartment).forEach(([deptId, products]) => {
			const matching = products.filter((p) => {
				const name = isArabic && p.nameAr ? p.nameAr : p.name;
				return name.toLowerCase().includes(searchTerm.toLowerCase());
			});
			if (matching.length > 0) {
				filtered[deptId] = matching;
			}
		});
		return filtered;
	}, [productsByDepartment, searchTerm, isArabic]);

	const handleDepartmentClick = useCallback((deptSlug: string) => {
		setActiveDepartment(deptSlug);
		const element = document.getElementById(deptSlug);
		if (element) {
			// Calculate the position accounting for fixed header
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16; // 16px for extra padding
			
			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth"
			});
		}
	}, [headerHeight]);

	const handleProductClick = useCallback(
		(productId: string) => {
			const product = Object.values(productsByDepartment)
				.flat()
				.find((p) => p.id === productId);
			if (product && categorySlug && storeSlug && product.department) {
				const deptSlug = departments.find((d) => d.name === product.department)?.slug || "food";
				router.push(`/categories/${categorySlug}/${storeSlug}/${deptSlug}/${product.slug || productId}`);
			}
		},
		[productsByDepartment, categorySlug, storeSlug, departments, router]
	);

	const handleQuickAdd = useCallback((product: Product) => {
		// Animation feedback could be added here
	}, []);

	const handleLocationClick = () => {
		if (!store.location) return;
		const coords = store.location.split(",").map((c) => parseFloat(c.trim()));
		if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
			const [lat, lng] = coords;
			window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			{/* Fixed Header - All Elements Combined */}
			<div ref={headerRef} className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900">
				{/* Mobile Hero */}
				<div className="relative h-48 overflow-hidden">
					{store.image ? (
						<Image
							src={store.image}
							alt={displayName}
							fill
							priority
							className="object-cover"
							sizes={getImageSizes('hero')}
							quality={getImageQuality('hero')}
							placeholder="blur"
							blurDataURL={getImageBlurDataURL()}
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
					)}

					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

					{/* Back button */}
					<button
						onClick={() => router.back()}
						className={`absolute top-4 ${isArabic ? "right-4" : "left-4"} z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center`}
					>
						<ArrowLeft className="w-5 h-5 text-white" />
					</button>

					{/* Store info overlay */}
					<div className="absolute bottom-0 left-0 right-0 p-4">
						<div className={`flex items-end gap-3 `}>
							{/* Small logo */}
							{store.logo && (
								<div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
									<Image
										src={store.logo}
										alt={displayName}
										width={64}
										height={64}
										className="object-cover w-full h-full"
										quality={getImageQuality('thumbnail')}
										placeholder="blur"
										blurDataURL={getImageBlurDataURL(64, 64)}
									/>
								</div>
							)}

							<div className="flex-1 min-w-0 text-white">
								<h1 className="text-xl font-black truncate mb-1">{displayName}</h1>
								<div className={`flex items-center gap-2 text-sm flex-wrap `}>
									{store.rating && (
										<div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
											<Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
											<span className="font-bold text-xs">{store.rating}</span>
										</div>
									)}
									{displayDeliveryTime && (
										<>
											<span className="text-white/80">•</span>
											<div className="flex items-center gap-1">
												<Clock className="w-3 h-3" />
												<span className="text-xs">{displayDeliveryTime}</span>
											</div>
										</>
									)}
								</div>
							</div>

							{/* Favorite - in thumb zone */}
							<div onClick={(e) => e.stopPropagation()}>
								<FavoriteButton
									isFavorite={isFavorite}
									isLoading={favoriteLoading}
									onToggle={toggleFavorite}
									size="sm"
									className="bg-white/20 backdrop-blur-sm"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Quick info bar */}
				<div className="px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm">
					<button
						onClick={handleLocationClick}
						className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 `}
					>
						<MapPin className="w-4 h-4" />
						<span>2.5 km</span>
					</button>
					<div className="text-gray-600 dark:text-gray-400">
						{store.fee === "0" || store.fee === "Free" || store.feeAr === "مجاني" ? (
							<span className="text-green-600 font-bold">
								{isArabic ? "توصيل مجاني" : "Free Delivery"}
							</span>
						) : (
							<span>
								{isArabic ? "رسوم: " : "Fee: "}
								{isArabic && store.feeAr ? store.feeAr : store.fee}
							</span>
						)}
					</div>
					<div className="text-gray-600 dark:text-gray-400">
						{isArabic ? "الحد الأدنى: " : "Min: "}
						{isArabic && store.minimumOrderAr ? store.minimumOrderAr : store.minimumOrder}
					</div>
				</div>

				{/* Search & Filters */}
				<div className="bg-white dark:bg-gray-900 border-b shadow-sm">
				{/* Search bar */}
				<div className="px-4 py-3">
					<button
						onClick={() => setShowSearchModal(true)}
						className={`w-full flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl ${isArabic ? "flex-row-reverse text-right" : "text-left"}`}
					>
						<Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
						<span className="text-gray-500 text-sm">
							{isArabic ? "ابحث عن منتجات..." : "Search products..."}
						</span>
					</button>
				</div>

				{/* Horizontal department tabs - swipeable */}
				<div className="overflow-x-auto scrollbar-hide momentum-scroll">
					<div className={`flex gap-2 px-4 pb-3 `}>
						{departments.map((dept) => {
							const deptKey = dept.slug || dept.name || "";
							const products = filteredProducts[deptKey] || [];
							const isActive = activeDepartment === dept.slug;

							return (
								<button
									key={dept.slug || dept.name}
									onClick={() => handleDepartmentClick(dept.slug || "")}
									className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all active:scale-95 ${
										isActive
											? "bg-green-600 text-white"
											: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
									}`}
								>
									<span className="whitespace-nowrap">
										{isArabic && dept.nameAr ? dept.nameAr : dept.name}
										{products.length > 0 && (
											<span className={`ml-1.5 sm:ml-2 text-[10px] sm:text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>
												({products.length})
											</span>
										)}
									</span>
								</button>
							);
						})}
						
						{/* Show All Tab */}
						{categorySlug && storeSlug && (
							<Link
								href={`/categories/${categorySlug}/${storeSlug}/departments`}
								className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-1 sm:gap-1.5 ${
									"bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:shadow-lg"
								}`}
							>
								<Grid3x3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
								<span className="whitespace-nowrap">{isArabic ? "عرض الكل" : "Show All"}</span>
							</Link>
						)}
					</div>
				</div>
				</div>
			</div>

			{/* Products by Department */}
			<div className="px-4 py-4 space-y-8 pb-24" style={{ paddingTop: `${headerHeight + 16}px` }}>
				{departments.map((dept) => {
					const deptKey = dept.slug || dept.name || "";
					const products = filteredProducts[deptKey] || [];
					if (products.length === 0) return null;

					return (
						<section 
							key={dept.slug || dept.name} 
							id={dept.slug || dept.name}
							style={{ scrollMarginTop: `${headerHeight + 16}px` }}
						>
							{/* Department header */}
							<div
								className={`flex items-center justify-between mb-4 `}
							>
								<h2 className="text-lg font-bold text-gray-900 dark:text-white">
									{isArabic && dept.nameAr ? dept.nameAr : dept.name}
								</h2>
								{categorySlug && storeSlug && (
									<Link
										href={`/categories/${categorySlug}/${storeSlug}/${dept.slug || dept.name}`}
										className="text-sm text-green-600 font-semibold"
									>
										{isArabic ? "عرض الكل →" : "View All →"}
									</Link>
								)}
							</div>

							{/* Mobile-optimized product grid - 2 columns */}
							<div className="grid grid-cols-2 gap-3">
								{products.slice(0, 6).map((product, index) => (
									<MobileProductCard
										key={product.id}
										product={product}
										index={index}
										onClick={handleProductClick}
										onQuickAdd={handleQuickAdd}
										storeId={store.id}
										storeName={store.name}
										storeNameAr={store.nameAr}
									/>
								))}
							</div>
						</section>
					);
				})}
			</div>

			{/* Floating Cart Button */}
			<AnimatePresence>
				{cartCount > 0 && (
					<motion.button
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						onClick={() => router.push("/cart")}
						className={`fixed ${isArabic ? "left-4" : "right-4"} bottom-6 z-50 w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all duration-300`}
					>
						<ShoppingCart className="w-6 h-6 text-white" />
						<span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
							{cartCount > 99 ? "99+" : cartCount}
						</span>
					</motion.button>
				)}
			</AnimatePresence>

			{/* Scroll to Top Button - Square like cart button */}
			<AnimatePresence>
				{showScrollToTop && (
					<motion.button
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						onClick={scrollToTop}
						className={`fixed ${isArabic ? "right-4" : "left-4"} bottom-6 z-50 w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-2xl flex items-center justify-center active:scale-95 transition-transform hover:shadow-green-500/50`}
						aria-label={isArabic ? 'الانتقال إلى الأعلى' : 'Scroll to top'}
					>
						<ArrowUp className="w-6 h-6 text-white" />
					</motion.button>
				)}
			</AnimatePresence>

			{/* Search Modal */}
			<BottomSheet
				isOpen={showSearchModal}
				onClose={() => setShowSearchModal(false)}
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
		</div>
	);
}

export default memo(MobileStoreView);
