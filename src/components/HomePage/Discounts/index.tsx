"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Tag, Eye, Heart, ShoppingCart, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { Product } from "@/components/Utils/ProductCard";
import Image from "next/image";
import { navigateToProduct } from "@/lib/utils/categories/navigation";
import { TEST_STORES, TEST_CATEGORIES, TEST_DEPARTMENTS } from "@/lib/data/categories/testData";
import { useCart } from "@/hooks/useCart";
import { useToast, ToastContainer } from "@/components/ui/Toast";

interface DiscountsProps {
	products: Product[];
}

export default function Discounts({ products }: DiscountsProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	const { addToCart } = useCart();
	const { toasts, showToast, removeToast } = useToast();
	const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
	const [addingProducts, setAddingProducts] = useState<Set<string>>(new Set());

	if (products.length === 0) return null;

	const calculateDiscount = (originalPrice: number, price: number) => {
		return Math.round(((originalPrice - price) / originalPrice) * 100);
	};

	const handleProductClick = (product: Product) => {
		if (!product.slug || !product.storeId) return;

		// Find the store to get categoryId
		const store = TEST_STORES.find(s => s.id === product.storeId);
		if (!store || !store.categoryId || !store.slug) return;

		// Find the category to get slug
		const category = TEST_CATEGORIES.find(c => c.id === store.categoryId);
		if (!category) return;

		// Find the department to get slug
		let departmentSlug = 'food'; // default
		if (product.department) {
			const department = TEST_DEPARTMENTS.find(
				d => d.name === product.department || d.nameAr === product.department
			);
			if (department && department.slug) {
				departmentSlug = department.slug;
			} else {
				// Fallback: convert department name to slug format
				departmentSlug = product.department.toLowerCase().replace(/\s+/g, '-');
			}
		}

		// Navigate to product details
		navigateToProduct(router, category.slug, store.slug, departmentSlug, product);
	};

	const handleAddToCart = useCallback(async (e: React.MouseEvent, product: Product) => {
		e.stopPropagation();
		
		if (!product.storeId) {
			showToast(
				isArabic ? "خطأ: معلومات المتجر غير متوفرة" : "Error: Store information not available",
				"error"
			);
			return;
		}

		// Find store details
		const store = TEST_STORES.find(s => s.id === product.storeId);
		if (!store) {
			showToast(
				isArabic ? "خطأ: المتجر غير موجود" : "Error: Store not found",
				"error"
			);
			return;
		}

		const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || '0').replace(/[^0-9.]/g, ''));

		setAddingProducts(prev => new Set(prev).add(product.id));
		
		try {
			const result = await addToCart({
				productId: product.id,
				storeId: product.storeId,
				quantity: 1,
				productName: product.name,
				productNameAr: product.nameAr,
				productImage: product.image,
				priceAtAdd: price,
				storeName: store.name,
				storeNameAr: store.nameAr,
				storeLogo: store.logo || undefined,
				stock: product.stockQuantity,
			});

			if (result.success) {
				setAddedProducts(prev => new Set(prev).add(product.id));
				showToast(
					isArabic ? "تم إضافة المنتج للسلة" : "Product added to cart",
					"success"
				);
			} else if (result.requiresClearCart) {
				showToast(
					isArabic
						? "لديك منتجات من متجر آخر في السلة. يرجى إفراغ السلة أولاً"
						: "You have items from a different store in your cart. Please clear cart first",
					"warning"
				);
			} else {
				showToast(
					result.error || (isArabic ? "حدث خطأ أثناء إضافة المنتج" : "Error adding product"),
					"error"
				);
			}
		} catch (error) {
			console.error("Error adding to cart:", error);
			showToast(
				isArabic ? "حدث خطأ في الاتصال" : "Connection error",
				"error"
			);
		} finally {
			setAddingProducts(prev => {
				const newSet = new Set(prev);
				newSet.delete(product.id);
				return newSet;
			});
		}
	}, [addToCart, showToast, isArabic]);

	return (
		<motion.section
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.5 }}
			className="mb-12"
		>
			<div className="mb-6 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
						<Tag className="h-5 w-5 text-white" />
					</div>
					<h2 className={`text-xl font-bold text-gray-900 dark:text-white sm:text-2xl ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "العروض والخصومات" : "Offers & Discounts"}
					</h2>
				</div>
				<button
					onClick={() => router.push("/discounts")}
					className="text-sm font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
				>
					{isArabic ? "عرض الكل" : "View All"} →
				</button>
			</div>

			{/* Products Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{products.map((product, index) => {
					const discount =
						product.originalPrice && product.price
							? calculateDiscount(product.originalPrice, product.price)
							: 0;

					return (
						<motion.div
							key={product.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.05 }}
							whileHover={{ y: -4 }}
							className="group relative cursor-pointer"
							onClick={() => handleProductClick(product)}
						>
							{/* Discount Badge */}
							{discount > 0 && (
								<div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
									-{discount}%
								</div>
							)}

							<div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
								{/* Product Image */}
								<div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
									{product.image ? (
										<Image
											src={product.image}
											alt={product.name || ""}
											fill
											className="object-cover"
											unoptimized
										/>
									) : (
										<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
									)}

									{/* Quick Actions */}
									<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition"
											aria-label={isArabic ? "عرض سريع" : "Quick view"}
										>
											<Eye className="w-5 h-5" />
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition"
											aria-label={isArabic ? "إضافة للمفضلة" : "Add to favorites"}
										>
											<Heart className="w-5 h-5" />
										</motion.button>
									</div>
								</div>

								{/* Content */}
								<div className="p-3 sm:p-4">
									<h3 className="font-semibold mb-2 text-sm sm:text-base text-gray-900 dark:text-gray-100 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
										{product.name}
									</h3>

									<div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
										<span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
											{product.price} {isArabic ? "ريال" : "SAR"}
										</span>
										{product.originalPrice && (
											<span className="text-xs sm:text-sm text-gray-400 line-through">
												{product.originalPrice} {isArabic ? "ريال" : "SAR"}
											</span>
										)}
									</div>

									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={(e) => handleAddToCart(e, product)}
										disabled={addingProducts.has(product.id)}
										className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm hover:shadow-lg transition-all flex items-center justify-center gap-1 sm:gap-2 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed ${
											addedProducts.has(product.id)
												? "bg-green-500 text-white"
												: "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
										}`}
									>
										{addingProducts.has(product.id) ? (
											<>
												<div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
												<span className="whitespace-nowrap">{isArabic ? "جاري الإضافة..." : "Adding..."}</span>
											</>
										) : addedProducts.has(product.id) ? (
											<>
												<Check className="w-3 h-3 sm:w-4 sm:h-4" />
												<span className="whitespace-nowrap">{isArabic ? "تمت الإضافة" : "Added"}</span>
											</>
										) : (
											<>
												<ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
												<span className="whitespace-nowrap">{isArabic ? "أضف للسلة" : "Add to Cart"}</span>
											</>
										)}
									</motion.button>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Toast Container */}
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
		</motion.section>
	);
}

