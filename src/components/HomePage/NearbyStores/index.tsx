"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, Filter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { Store } from "@/components/Utils/StoreCard";
import StoreCard from "@/components/Utils/StoreCard";
import Image from "next/image";
import { navigateToStore } from "@/lib/utils/categories/navigation";
import { TEST_CATEGORIES } from "@/lib/data/categories/testData";

interface NearbyStoresProps {
	stores: Store[];
}

export default function NearbyStores({ stores }: NearbyStoresProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	const [distanceFilter, setDistanceFilter] = useState<string>("all");

	if (stores.length === 0) return null;

	const filteredStores = stores.slice(0, 10);

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.4 }}
			className="mb-12"
		>
			{/* Header with Filters */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
							<MapPin className="h-5 w-5 text-white" />
						</div>
						<h2 className={`text-xl font-bold text-gray-900 dark:text-white sm:text-2xl ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "المتاجر القريبة" : "Nearby Stores"}
						</h2>
					</div>
					<button
						onClick={() => router.push("/nearby-stores")}
						className="text-sm font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
					>
						{isArabic ? "عرض الكل" : "View All"} →
					</button>
				</div>

				{/* Distance Filters */}
				<div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide ${isArabic ? "flex-row-reverse justify-end" : ""}`}>
					<Filter className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
					<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
						{["all", "500m", "1km", "2km"].map((filter) => (
							<button
								key={filter}
								onClick={() => setDistanceFilter(filter)}
								className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap touch-manipulation ${
									distanceFilter === filter
										? "bg-green-600 text-white shadow-lg"
										: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
								}`}
							>
								{filter === "all" ? (isArabic ? "الكل" : "All") : filter}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Stores Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{filteredStores.map((store, index) => (
					<motion.div
						key={store.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.05 }}
						whileHover={{ y: -4 }}
						className="group cursor-pointer"
						onClick={() => {
							if (store.categoryId && store.slug) {
								const category = TEST_CATEGORIES.find(c => c.id === store.categoryId);
								if (category) {
									navigateToStore(router, category.slug, store);
								}
							}
						}}
					>
						<div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
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

								{/* Status Badge */}
								<div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-2 bg-green-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
									<span className="whitespace-nowrap">{isArabic ? "مفتوح" : "Open"}</span>
								</div>

								{/* Delivery Time */}
								<div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1">
									<Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
									<span className="whitespace-nowrap">20-30 {isArabic ? "د" : "min"}</span>
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

								<div className="flex items-center justify-between text-xs sm:text-sm gap-2">
									<span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
										<MapPin className="w-3 h-3 flex-shrink-0" />
										<span className="whitespace-nowrap">1.2 {isArabic ? "كم" : "km"}</span>
									</span>
									<span className="text-green-600 dark:text-green-400 font-semibold whitespace-nowrap text-xs sm:text-sm">
										{isArabic ? "توصيل مجاني" : "Free delivery"}
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</motion.section>
	);
}

