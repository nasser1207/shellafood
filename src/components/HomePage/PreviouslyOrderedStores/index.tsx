"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Clock, CheckCircle2, History, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { Store } from "@/components/Utils/StoreCard";
import Image from "next/image";
import { navigateToStore } from "@/lib/utils/categories/navigation";
import { TEST_CATEGORIES } from "@/lib/data/categories/testData";
import ReorderModal from "./ReorderModal";
import { getLastOrderItems, getLastOrderDate } from "@/lib/utils/orderHistory";

interface PreviouslyOrderedStoresProps {
	stores: Store[];
}

export default function PreviouslyOrderedStores({ stores }: PreviouslyOrderedStoresProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	const [reorderModalStore, setReorderModalStore] = useState<Store | null>(null);

	if (stores.length === 0) return null;

	// Show first 10 stores
	const displayedStores = stores.slice(0, 10);

	const handleOrderAgain = useCallback((store: Store) => {
		setReorderModalStore(store);
	}, []);

	const handleCloseModal = useCallback(() => {
		setReorderModalStore(null);
	}, []);

	const content = {
		ar: {
			title: "متاجرك المفضلة",
			subtitle: "المتاجر التي طلبت منها من قبل",
			viewAll: "عرض الكل",
			filters: "الفلاتر",
			sortBy: "ترتيب حسب",
			sortOptions: {
				rating: "التقييم",
				deliveryTime: "وقت التوصيل",
				name: "الاسم",
				lastOrdered: "آخر طلب",
			},
			results: "نتيجة",
			orderedBefore: "طلبت منها",
			orderCount: "طلب",
			orders: "طلبات",
			lastOrder: "آخر طلب",
			lastOrderTime: "منذ",
		},
		en: {
			title: "Your Favorite Stores",
			subtitle: "Stores you've ordered from before",
			viewAll: "View All",
			filters: "Filters",
			sortBy: "Sort by",
			sortOptions: {
				rating: "Rating",
				deliveryTime: "Delivery Time",
				name: "Name",
				lastOrdered: "Last Ordered",
			},
			results: "results",
			orderedBefore: "Ordered Before",
			orderCount: "order",
			orders: "orders",
			lastOrder: "Last order",
			lastOrderTime: "ago",
		},
	};

	const t = content[language];

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.2 }}
			className="mb-12"
		>
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
							<ShoppingBag className="h-5 w-5 text-white" />
						</div>
						<div>
							<h2 className={`text-xl font-bold text-gray-900 dark:text-white sm:text-2xl mb-1 ${isArabic ? "text-right" : "text-left"}`}>
								{t.title}
							</h2>
							<p className={`text-sm text-gray-600 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
								{t.subtitle}
							</p>
						</div>
					</div>
					<button
						onClick={() => router.push("/previously-ordered-stores")}
						className="text-sm font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
					>
						{t.viewAll} →
					</button>
				</div>
			</div>

			{/* Stores Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{displayedStores.map((store, index) => {
							// Mock order count (in real app, get from user's order history)
							const orderCount = Math.floor(Math.random() * 10) + 1;
							const category = store.categoryId ? TEST_CATEGORIES.find(c => c.id === store.categoryId) : null;
							const categorySlug = category?.slug;
							
							return (
								<motion.div
									key={store.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: index * 0.05 }}
									whileHover={{ y: -4 }}
									className="group cursor-pointer"
									onClick={() => {
										if (store.categoryId && store.slug && categorySlug) {
											navigateToStore(router, categorySlug, store);
										}
									}}
								>
									<div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border-2 border-transparent hover:border-amber-200 dark:hover:border-amber-800">
										{/* Store Image */}
										<div className="relative h-40 sm:h-48 overflow-hidden">
											{store.image ? (
												<Image
													src={store.image}
													alt={store.name || ""}
													fill
													className="object-cover group-hover:scale-110 transition-transform duration-500"
													unoptimized
												/>
											) : (
												<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
											)}


											{/* Ordered Before Badge */}
											<div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg z-10">
												<CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
												<span className="whitespace-nowrap">{t.orderedBefore}</span>
											</div>

											{/* Order Count Badge - Moved to bottom right to avoid overlap */}
											<div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md z-10">
												<History className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
												<span className="text-gray-900 dark:text-gray-100 whitespace-nowrap">
													{orderCount} {orderCount === 1 ? t.orderCount : t.orders}
												</span>
											</div>

											{/* Delivery Time */}
											<div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
												<Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
												<span className="whitespace-nowrap">{store.deliveryTime || "20-30"} {isArabic ? "د" : "min"}</span>
											</div>
										</div>

										{/* Content */}
										<div className="p-3 sm:p-4">
											<div className="flex items-center justify-between mb-2 gap-2">
												<h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 line-clamp-1 flex-1 min-w-0">{store.name}</h3>
												<div className="flex items-center gap-1 flex-shrink-0">
													<Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
													<span className="font-semibold text-xs sm:text-sm">{store.rating || "4.5"}</span>
												</div>
											</div>

											{store.type && (
												<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
													{isArabic && store.typeAr ? store.typeAr : store.type}
												</p>
											)}

											<div className="flex items-center justify-between text-xs sm:text-sm gap-2 mb-3">
												<span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
													<span className="whitespace-nowrap">
													 {t.lastOrder} {t.lastOrderTime}	 {isArabic ? " أسبوع" : "1 week"}
													</span>
												</span>
												<span className="text-green-600 dark:text-green-400 font-semibold whitespace-nowrap text-xs sm:text-sm">
													{isArabic ? "توصيل مجاني" : "Free delivery"}
												</span>
											</div>

											{/* Order Again Button - Positioned below image as expert UX */}
											{orderCount > 0 && (
												<motion.button
													onClick={(e) => {
														e.stopPropagation();
														handleOrderAgain(store);
													}}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													className="w-full flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40 border border-green-500/20 transition-all duration-300 group"
													aria-label={isArabic ? 'اطلب مجدداً' : 'Order Again'}
												>
													<RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:rotate-180" />
													<span className="drop-shadow-sm">{isArabic ? 'اطلب مجدداً' : 'Order Again'}</span>
												</motion.button>
											)}
										</div>
									</div>
								</motion.div>
							);
						})}
			</div>

			{/* Reorder Modal */}
			{reorderModalStore && (
				<ReorderModal
					isOpen={!!reorderModalStore}
					onClose={handleCloseModal}
					store={reorderModalStore}
					lastOrderItems={getLastOrderItems(reorderModalStore.id)}
					lastOrderDate={getLastOrderDate(reorderModalStore.id, language)}
					categorySlug={reorderModalStore.categoryId ? TEST_CATEGORIES.find(c => c.id === reorderModalStore.categoryId)?.slug : undefined}
					storeSlug={reorderModalStore.slug}
				/>
			)}
		</motion.section>
	);
}

