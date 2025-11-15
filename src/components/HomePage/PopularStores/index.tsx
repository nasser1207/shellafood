"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Star, Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { Store } from "@/components/Utils/StoreCard";
import Image from "next/image";
import { navigateToStore } from "@/lib/utils/categories/navigation";
import { TEST_CATEGORIES } from "@/lib/data/categories/testData";

interface PopularStoresProps {
	stores: Store[];
}

export default function PopularStores({ stores }: PopularStoresProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();

	if (stores.length === 0) return null;

	const filteredStores = stores.slice(0, 10);

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.6 }}
			className="mb-12"
		>
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
						<TrendingUp className="h-5 w-5 text-white" />
					</div>
					<h2 className={`text-xl font-bold text-gray-900 dark:text-white sm:text-2xl ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "المتاجر الشائعة" : "Popular Stores"}
					</h2>
				</div>
				<button
					onClick={() => router.push("/popular-stores")}
					className="text-sm font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
				>
					{isArabic ? "عرض الكل" : "View All"} →
				</button>
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
							<div className="relative h-48 overflow-hidden">
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

								{/* Trending Badge */}
								<div className="absolute top-3 left-3 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
									<Flame className="w-3 h-3" />
									{isArabic ? "شائع" : "Trending"}
								</div>

								{/* Social Proof */}
								<div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
									{isArabic ? "1000+ طلب اليوم" : "1000+ orders today"}
								</div>
							</div>

							{/* Content */}
							<div className="p-4">
								<div className="flex items-center justify-between mb-2">
									<h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{store.name}</h3>
									<div className="flex items-center gap-1">
										<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
										<span className="font-semibold text-sm">{store.rating || "4.8"}</span>
									</div>
								</div>

								{store.type && (
									<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
										{isArabic && store.typeAr ? store.typeAr : store.type}
									</p>
								)}

								<div className="flex items-center justify-between text-sm">
									<span className="text-gray-500 dark:text-gray-400">
										{isArabic ? "مطعم • وجبات سريعة" : "Restaurant • Fast Food"}
									</span>
									<span className="text-green-600 dark:text-green-400 font-semibold">
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

