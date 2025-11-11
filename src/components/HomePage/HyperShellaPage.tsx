"use client";

import { useEffect, useState } from "react";

// Define the component's props
interface StorePageProps {
	storeName: string;
	onCategoryClick: (categoryName: string) => void;
}

interface StoreDetails {
	id: string;
	name: string;
	type: string;
	rating: string;
	image: string;
}
export default function HyperPage({
	storeName,
	onCategoryClick,
}: StorePageProps) {
	const [productCategories, setProductCategories] = useState<string[]>([]);
	const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// حالة قسم موصى بها لك
	const [activeFilter, setActiveFilter] = useState("الكل");
	const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
	const [supermarketStores, setSupermarketStores] = useState<any[]>([]);
	const [freshOffers, setFreshOffers] = useState<any[]>([]);
	const [isLoadingProducts, setIsLoadingProducts] = useState(false);

	// حالة قسم الاختيارات الأكثر شهرة
	const [activePopularFilter, setActivePopularFilter] = useState("الكل");
	const [popularProducts, setPopularProducts] = useState<any[]>([]);
	const [perfumeProducts, setPerfumeProducts] = useState<any[]>([]);
	const [vegetableFruitProducts, setVegetableFruitProducts] = useState<any[]>(
		[],
	);
	const [isLoadingPopular, setIsLoadingPopular] = useState(false);

	// جلب أقسام هايبر شلة من قاعدة البيانات
	useEffect(() => {
		const fetchHyperShellaCategories = async () => {
			setIsLoading(true);
			try {
				const { getHyperShellaCategoriesAction } = await import("@/app/actions/stores/hyper-shella.action");
				const data = await getHyperShellaCategoriesAction();
				if (data.success && !data.error) {
					// جلب الأقسام من API هايبر شلة
					setProductCategories(
						data.categories?.map((cat: any) => cat.name) || [],
					);

					// إعداد تفاصيل هايبر شلة
					setStoreDetails({
						id: "hyper-shella",
						name: "هايبر شلة",
						type: "سوبر ماركت",
						rating: "4.8",
						image: "hyshealla.png",
					});
				}
			} catch (error) {
				console.error("خطأ في جلب أقسام هايبر شلة:", error);
				// في حالة الخطأ، عرض مصفوفة فارغة
				setProductCategories([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchHyperShellaCategories();
	}, []);

	// جلب البيانات للموصى بها
	useEffect(() => {
		const fetchRecommendedData = async () => {
			setIsLoadingProducts(true);
			try {
				// جلب المنتجات الموصى بها
				const { getProductsAction } = await import("@/app/actions/products/products.action");
				const productsData = await getProductsAction();
				if (productsData.success && productsData.data) {
					setRecommendedProducts(productsData.data.products?.slice(0, 10) || []);
					setFreshOffers(
						productsData.data.products
							?.filter(
								(p: any) => p.originalPrice && p.originalPrice !== p.price,
							)
							?.slice(0, 10) || [],
					);
				}

				// جلب متاجر السوبرماركت
				const { getStoresByCategoryAction } = await import("@/app/actions/stores");
				const storesResult = await getStoresByCategoryAction("سوبر ماركت", 10, 0);
				if (storesResult.success && storesResult.data) {
					setSupermarketStores((storesResult.data as any).stores?.slice(0, 10) || []);
				}
			} catch (error) {
				console.error("خطأ في جلب البيانات الموصى بها:", error);
			} finally {
				setIsLoadingProducts(false);
			}
		};

		fetchRecommendedData();
	}, []);

	// جلب البيانات للاختيارات الأكثر شهرة
	useEffect(() => {
		const fetchPopularData = async () => {
			setIsLoadingPopular(true);
			try {
				// جلب المنتجات الأكثر شهرة
				const { getProductsAction } = await import("@/app/actions/products");
				const productsResult = await getProductsAction({ limit: 10 });
				if (productsResult.success && productsResult.data) {
					// أخذ المنتجات الأكثر شهرة (يمكن تحسين هذا لاحقاً بإضافة rating أو popularity)
					setPopularProducts(productsResult.data.products?.slice(0, 10) || []);

					// فلترة منتجات العطور (يمكن تحسين هذا لاحقاً بإضافة category)
					setPerfumeProducts(
						productsResult.data.products
							?.filter(
								(p: any) =>
									p.name?.toLowerCase().includes("عطر") ||
									p.name?.toLowerCase().includes("perfume") ||
									p.name?.toLowerCase().includes("كولونيا"),
							)
							?.slice(0, 10) || [],
					);

					// فلترة الخضار والفواكه
					setVegetableFruitProducts(
						productsResult.data.products
							?.filter(
								(p: any) =>
									p.name?.toLowerCase().includes("خضار") ||
									p.name?.toLowerCase().includes("فواكه") ||
									p.name?.toLowerCase().includes("طماطم") ||
									p.name?.toLowerCase().includes("بصل") ||
									p.name?.toLowerCase().includes("جزر") ||
									p.name?.toLowerCase().includes("تفاح") ||
									p.name?.toLowerCase().includes("موز"),
							)
							?.slice(0, 10) || [],
					);
				}
			} catch (error) {
				console.error("خطأ في جلب البيانات الأكثر شهرة:", error);
			} finally {
				setIsLoadingPopular(false);
			}
		};

		fetchPopularData();
	}, []);

	// دالة للحصول على البيانات حسب الفلتر النشط
	const getFilteredData = () => {
		switch (activeFilter) {
			case "بقالة":
				return supermarketStores;
			case "عروض طازجة":
				return freshOffers;
			default:
				return recommendedProducts;
		}
	};

	// دالة للحصول على البيانات المفلترة للاختيارات الأكثر شهرة
	const getPopularFilteredData = () => {
		switch (activePopularFilter) {
			case "العطور":
				return perfumeProducts;
			case "الخضار والفواكه":
				return vegetableFruitProducts;
			default:
				return popularProducts;
		}
	};

	return (
		//main div
		<div
			className={`font-tajawal flex min-h-screen w-full flex-col bg-[#FFFFFF] text-gray-800`}
			dir="rtl"
		>
			<main className="flex-grow">
				{/* picture section */}
				<section>
					<div className="relative">
						{/* صورة الخلفية */}
						<div className="w-full">
							<img
								src="hyshealla.png"
								alt="مع شلة كل احتياجاتك بضغطة زر"
								className="h-auto w-full object-cover object-center dark:opacity-80 transition-opacity duration-300"
							/>
						</div>
					</div>
				</section>

				{/* //categories section */}
				<section>
					<div className="p-4 md:p-8">
						<h2 className="mb-4 text-xl font-bold text-gray-900">
							أقسام هايبر شلة
						</h2>
						<div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
							{isLoading ? (
								// عرض skeleton أثناء التحميل بنفس التصميم
								Array.from({ length: 12 }).map((_, index) => (
									<div
										key={index}
										className="flex flex-col items-center rounded-lg bg-white p-2 text-center shadow-sm"
									>
										<div className="h-16 w-16 animate-pulse rounded-lg bg-gray-300"></div>
										<div className="mt-2 h-3 w-12 animate-pulse rounded bg-gray-300"></div>
									</div>
								))
							) : productCategories.length > 0 ? (
								productCategories.map((category, index) => (
									<button
										key={index}
										onClick={() => onCategoryClick(category)}
										className="flex flex-col items-center rounded-lg bg-white p-2 text-center shadow-sm transition-colors hover:bg-gray-100"
									>
										<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200">
											{/* Placeholder for icon/image */}
											<span className="text-xs text-gray-500">
												{category.slice(0, 3)}
											</span>
										</div>
										<p className="mt-2 text-sm font-semibold text-gray-700">
											{category}
										</p>
									</button>
								))
							) : (
								// عرض رسالة عدم وجود بيانات
								<div className="col-span-full flex flex-col items-center justify-center py-12">
									<div className="mb-4 text-6xl">📦</div>
									<p className="mb-2 text-lg font-semibold text-gray-600">
										لا توجد أقسام متاحة حالياً
									</p>
									<p className="text-sm text-gray-500">
										سيتم إضافة الأقسام قريباً
									</p>
								</div>
							)}
						</div>
					</div>
				</section>
				{/* قسم موصى بها لك */}
				<section className="p-4 md:p-8">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-xl font-bold text-gray-900">موصى بها لك</h2>
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">عرض الكل</span>
							<div className="flex gap-1">
								<svg
									className="h-4 w-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								<svg
									className="h-4 w-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* فلاتر */}
					<div className="mb-6 flex gap-3">
						<button
							onClick={() => setActiveFilter("الكل")}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
								activeFilter === "الكل"
									? "bg-green-600 text-white"
									: "border border-green-600 text-green-600 hover:bg-green-50"
							}`}
						>
							الكل
						</button>
						<button
							onClick={() => setActiveFilter("بقالة")}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
								activeFilter === "بقالة"
									? "bg-green-600 text-white"
									: "border border-green-600 text-green-600 hover:bg-green-50"
							}`}
						>
							بقالة
						</button>
						<button
							onClick={() => setActiveFilter("عروض طازجة")}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
								activeFilter === "عروض طازجة"
									? "bg-green-600 text-white"
									: "border border-green-600 text-green-600 hover:bg-green-50"
							}`}
						>
							عروض طازجة
						</button>
					</div>

					{/* عرض البيانات */}
					<div className="overflow-x-auto">
						<div className="flex gap-4 pb-4">
							{isLoadingProducts ? (
								// Skeleton loading
								Array.from({ length: 5 }).map((_, index) => (
									<div key={index} className="w-48 flex-shrink-0">
										<div className="rounded-lg bg-white p-4 shadow-sm">
											<div className="mb-3 h-32 animate-pulse rounded-lg bg-gray-300"></div>
											<div className="mb-2 h-4 animate-pulse rounded bg-gray-300"></div>
											<div className="mb-3 h-3 w-3/4 animate-pulse rounded bg-gray-300"></div>
											<div className="flex items-center justify-between">
												<div className="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
												<div className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
											</div>
										</div>
									</div>
								))
							) : getFilteredData().length > 0 ? (
								getFilteredData().map((item, index) => (
									<div key={index} className="w-48 flex-shrink-0">
										<div className="rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
											{/* صورة المنتج/المتجر */}
											<div className="relative mb-3">
												<img
													src={item.image || "/placeholder-product.png"}
													alt={item.name}
													className="h-32 w-full rounded-lg object-cover"
												/>
												{/* زر إضافة للسلة */}
												<button className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700">
													<svg
														className="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 6v6m0 0v6m0-6h6m-6 0H6"
														/>
													</svg>
												</button>
											</div>

											{/* اسم المنتج/المتجر */}
											<h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
												{item.name}
											</h3>

											{/* تفاصيل إضافية */}
											{item.unit && (
												<p className="mb-2 text-xs text-gray-500">
													{item.unit}
												</p>
											)}

											{/* الأسعار */}
											<div className="flex items-center justify-between">
												<div className="flex flex-col">
													{item.original_price &&
														item.original_price !== item.price && (
															<span className="text-xs text-gray-400 line-through">
																{item.original_price} ريال
															</span>
														)}
													<span className="text-sm font-bold text-gray-900">
														{item.price} ريال
													</span>
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="col-span-full flex flex-col items-center justify-center py-12">
									<div className="mb-4 text-6xl">🛒</div>
									<p className="mb-2 text-lg font-semibold text-gray-600">
										لا توجد منتجات متاحة حالياً
									</p>
									<p className="text-sm text-gray-500">
										سيتم إضافة المنتجات قريباً
									</p>
								</div>
							)}
						</div>
					</div>
				</section>

				{/* قسم الاختيارات الأكثر شهرة */}
				<section className="p-4 md:p-8">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-xl font-bold text-gray-900">
							الاختيارات الأكثر شهرة
						</h2>
						<div className="flex items-center gap-2">
							<span className="text-sm text-gray-600">عرض الكل</span>
							<div className="flex gap-1">
								<svg
									className="h-4 w-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 19l-7-7 7-7"
									/>
								</svg>
								<svg
									className="h-4 w-4 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* فلاتر الاختيارات الأكثر شهرة */}
					<div className="mb-6 flex gap-3">
						<button
							onClick={() => setActivePopularFilter("الكل")}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
								activePopularFilter === "الكل"
									? "bg-green-600 text-white"
									: "border border-green-600 text-green-600 hover:bg-green-50"
							}`}
						>
							الكل
						</button>
						<button
							onClick={() => setActivePopularFilter("العطور")}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
								activePopularFilter === "العطور"
									? "bg-green-600 text-white"
									: "border border-green-600 text-green-600 hover:bg-green-50"
							}`}
						>
							العطور
						</button>
						<button
							onClick={() => setActivePopularFilter("الخضار والفواكه")}
							className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
								activePopularFilter === "الخضار والفواكه"
									? "bg-green-600 text-white"
									: "border border-green-600 text-green-600 hover:bg-green-50"
							}`}
						>
							الخضار والفواكه
						</button>
					</div>

					{/* عرض البيانات */}
					<div className="overflow-x-auto">
						<div className="flex gap-4 pb-4">
							{isLoadingPopular ? (
								// Skeleton loading
								Array.from({ length: 5 }).map((_, index) => (
									<div key={index} className="w-48 flex-shrink-0">
										<div className="rounded-lg bg-white p-4 shadow-sm">
											<div className="mb-3 h-32 animate-pulse rounded-lg bg-gray-300"></div>
											<div className="mb-2 h-4 animate-pulse rounded bg-gray-300"></div>
											<div className="mb-3 h-3 w-3/4 animate-pulse rounded bg-gray-300"></div>
											<div className="flex items-center justify-between">
												<div className="h-4 w-16 animate-pulse rounded bg-gray-300"></div>
												<div className="h-8 w-8 animate-pulse rounded-full bg-gray-300"></div>
											</div>
										</div>
									</div>
								))
							) : getPopularFilteredData().length > 0 ? (
								getPopularFilteredData().map((item, index) => (
									<div key={index} className="w-48 flex-shrink-0">
										<div className="rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
											{/* صورة المنتج */}
											<div className="relative mb-3">
												<img
													src={item.image || "/placeholder-product.png"}
													alt={item.name}
													className="h-32 w-full rounded-lg object-cover"
												/>
												{/* زر إضافة للسلة */}
												<button className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700">
													<svg
														className="h-4 w-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 6v6m0 0v6m0-6h6m-6 0H6"
														/>
													</svg>
												</button>
											</div>

											{/* اسم المنتج */}
											<h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
												{item.name}
											</h3>

											{/* تفاصيل إضافية */}
											{item.unit && (
												<p className="mb-2 text-xs text-gray-500">
													{item.unit}
												</p>
											)}

											{/* الأسعار */}
											<div className="flex items-center justify-between">
												<div className="flex flex-col">
													{item.original_price &&
														item.original_price !== item.price && (
															<span className="text-xs text-gray-400 line-through">
																{item.original_price} ريال
															</span>
														)}
													<span className="text-sm font-bold text-gray-900">
														{item.price} ريال
													</span>
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="col-span-full flex flex-col items-center justify-center py-12">
									<div className="mb-4 text-6xl">⭐</div>
									<p className="mb-2 text-lg font-semibold text-gray-600">
										لا توجد منتجات متاحة حالياً
									</p>
									<p className="text-sm text-gray-500">
										سيتم إضافة المنتجات قريباً
									</p>
								</div>
							)}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
