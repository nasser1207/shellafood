"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Store } from "@/components/Utils/StoreCard";
import { Product } from "@/components/Utils/ProductCard";
import StoreCard from "@/components/Utils/StoreCard";
import ProductCard from "@/components/Utils/ProductCard";

interface SearchResultsProps {
	stores: Store[];
	products: Product[];
	onStoreClick: (store: Store) => void;
	onProductClick: (productId: string) => void;
	visible?: boolean;
}

export default function SearchResults({
	stores,
	products,
	onStoreClick,
	onProductClick,
	visible = true,
}: SearchResultsProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	if (!visible) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}
			className="space-y-8"
		>
			{/* Stores Section */}
			{stores.length > 0 && (
				<div>
					<motion.h2
						initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.4 }}
						className={`text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 ${isArabic ? "text-right" : "text-left"}`}
					>
						{isArabic ? "المتاجر" : "Stores"} ({stores.length})
					</motion.h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{stores.map((store, index) => (
							<motion.div
								key={`store-${store.id}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
								whileHover={{ y: -4 }}
							>
								<StoreCard store={store} onClick={onStoreClick} />
							</motion.div>
						))}
					</div>
				</div>
			)}

			{/* Products Section */}
			{products.length > 0 && (
				<div>
					<motion.h2
						initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.4 }}
						className={`text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 ${isArabic ? "text-right" : "text-left"}`}
					>
						{isArabic ? "المنتجات" : "Products"} ({products.length})
					</motion.h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{products.map((product, index) => (
							<motion.div
								key={`product-${product.id}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.05 }}
								whileHover={{ y: -4 }}
							>
								<ProductCard
									product={product}
									onClick={onProductClick}
									showAddButton={true}
									showRating={true}
									showStock={true}
								/>
							</motion.div>
						))}
					</div>
				</div>
			)}
		</motion.div>
	);
}

