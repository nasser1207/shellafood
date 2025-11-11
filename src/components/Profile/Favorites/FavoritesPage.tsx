"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FavoritesHeader from "./FavoritesHeader";
import FavoritesTabs from "./FavoritesTabs";
import { InfoCard } from "../UI";
import { FaHeart, FaShoppingBag, FaStore, FaUtensils, FaTrash, FaPlusCircle } from "react-icons/fa";
import { getFavoriteProducts, getFavoriteStores, removeProductFromFavorites, removeStoreFromFavorites, type FavoriteProduct, type FavoriteStore } from "@/lib/utils/favoritesStorage";
import { useCart } from "@/hooks/useCart";
import { ToastContainer, useToast } from "@/components/ui/Toast";

export default function FavoritesPage() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const router = useRouter();
	const { addToCart } = useCart();
	const { toasts, showToast, removeToast } = useToast();
	
	const [products, setProducts] = useState<FavoriteProduct[]>([]);
	const [stores, setStores] = useState<FavoriteStore[]>([]);
	const [activeTab, setActiveTab] = useState<"products" | "stores">("products");
	const [addingToCart, setAddingToCart] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	// Load favorites from localStorage
	const loadFavorites = useCallback(() => {
		const favoriteProducts = getFavoriteProducts();
		const favoriteStores = getFavoriteStores();
		setProducts(favoriteProducts);
		setStores(favoriteStores);
	}, []);

	// Initial load
	useEffect(() => {
		loadFavorites();
		
		// Listen for favorites updates
		const handleFavoritesUpdate = () => {
			loadFavorites();
		};
		
		window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
		return () => {
			window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
		};
	}, [loadFavorites]);

	// Filter favorites based on search query
	const filteredFavorites = useMemo(() => {
		if (!searchQuery) {
			return { products, stores };
		}

		const query = searchQuery.toLowerCase();
		return {
			products: products.filter(item => 
				item.name.toLowerCase().includes(query) ||
				(item.nameAr && item.nameAr.toLowerCase().includes(query)) ||
				(item.storeName && item.storeName.toLowerCase().includes(query))
			),
			stores: stores.filter(item => 
				item.name.toLowerCase().includes(query) ||
				(item.nameAr && item.nameAr.toLowerCase().includes(query))
			),
		};
	}, [products, stores, searchQuery]);

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	const handleRemoveProduct = (productId: string) => {
		const removed = removeProductFromFavorites(productId);
		if (removed) {
			loadFavorites();
			showToast(
				isArabic ? "تم إزالة المنتج من المفضلة" : "Product removed from favorites",
				"success",
				isArabic ? "تم إزالة المنتج من المفضلة" : undefined
			);
		}
	};

	const handleRemoveStore = (storeId: string) => {
		const removed = removeStoreFromFavorites(storeId);
		if (removed) {
			loadFavorites();
			showToast(
				isArabic ? "تم إزالة المتجر من المفضلة" : "Store removed from favorites",
				"success",
				isArabic ? "تم إزالة المتجر من المفضلة" : undefined
			);
		}
	};

	const handleAddToCart = async (product: FavoriteProduct) => {
		if (!product.storeId) {
			showToast(
				isArabic ? "خطأ: معرف المتجر غير متوفر" : "Error: Store ID not available",
				"error",
				isArabic ? "خطأ: معرف المتجر غير متوفر" : undefined
			);
			return;
		}

		setAddingToCart(product.id);
		try {
			const result = await addToCart({ 
				productId: product.id, 
				storeId: product.storeId, 
				quantity: 1,
				productName: product.name,
				productNameAr: product.nameAr,
				productImage: product.image,
				priceAtAdd: product.price || 0,
				storeName: product.storeName,
				storeNameAr: product.storeNameAr,
			});
			
			if (result.success) {
				showToast(
					result.message || (isArabic ? "تم إضافة المنتج إلى السلة بنجاح!" : "Product added to cart successfully!"),
					"success",
					result.message || (isArabic ? "تم إضافة المنتج إلى السلة بنجاح!" : undefined)
				);
			} else {
				showToast(
					result.error || (isArabic ? "حدث خطأ أثناء إضافة المنتج إلى السلة" : "Error adding product to cart"),
					"error",
					result.error || (isArabic ? "حدث خطأ أثناء إضافة المنتج إلى السلة" : undefined)
				);
			}
		} catch (error) {
			console.error("Error adding to cart:", error);
			showToast(
				isArabic ? "حدث خطأ أثناء إضافة المنتج إلى السلة" : "Error adding product to cart",
				"error",
				isArabic ? "حدث خطأ أثناء إضافة المنتج إلى السلة" : undefined
			);
		} finally {
			setAddingToCart(null);
		}
	};

	const handleStoreClick = (store: FavoriteStore) => {
		// Navigate to store page - you may need to adjust this based on your routing
		if (store.id) {
			router.push(`/categories/restaurants/${store.id}`);
		}
	};

	const handleClearAll = () => {
		if (window.confirm(isArabic ? "هل أنت متأكد من مسح جميع المفضلة؟" : "Are you sure you want to clear all favorites?")) {
			products.forEach(p => removeProductFromFavorites(p.id));
			stores.forEach(s => removeStoreFromFavorites(s.id));
			loadFavorites();
			showToast(
				isArabic ? "تم مسح جميع المفضلة" : "All favorites cleared",
				"success",
				isArabic ? "تم مسح جميع المفضلة" : undefined
			);
		}
	};

	const totalCount = products.length + stores.length;

	const tabs = [
		{
			id: "products",
			label: isArabic ? "المنتجات" : "Products",
			icon: FaShoppingBag,
			count: products.length,
			color: "blue" as const
		},
		{
			id: "stores",
			label: isArabic ? "المتاجر" : "Stores",
			icon: FaStore,
			count: stores.length,
			color: "green" as const
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Header */}
				<div className="mb-6 sm:mb-8">
					<FavoritesHeader
						onSearch={handleSearch}
						onClearAll={totalCount > 0 ? handleClearAll : undefined}
						totalCount={totalCount}
					/>
				</div>

				{/* Content */}
				{totalCount > 0 ? (
					<>
						{/* Tabs */}
						<div className="mb-6 sm:mb-8">
							<FavoritesTabs	
								tabs={tabs}
								activeTab={activeTab}
								onTabChange={setActiveTab}
							/>
						</div>

						{/* Tab Content */}
						<div className="space-y-6">
							{activeTab === "products" && (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
									{filteredFavorites.products.map((product) => (
										<div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 hover:border-red-200 dark:hover:border-red-800">
											{/* Product Image */}
											<div className="relative mb-4">
												<div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
													{product.image ? (
														<Image
															src={product.image}
															alt={isArabic ? product.nameAr || product.name : product.name}
															width={200}
															height={200}
															className="w-full h-full object-cover"
														/>
													) : (
														<FaShoppingBag className="text-gray-400 dark:text-gray-500 text-3xl" />
													)}
												</div>
												<button
													onClick={() => handleRemoveProduct(product.id)}
													className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
													aria-label={isArabic ? "إزالة من المفضلة" : "Remove from favorites"}
												>
													<FaHeart className="text-red-500 text-sm fill-current" />
												</button>
											</div>

											{/* Product Info */}
											<div className={isArabic ? 'text-right' : 'text-left'}>
												<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-2">
													{isArabic ? product.nameAr || product.name : product.name}
												</h3>
												{product.storeName && (
													<p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
														{isArabic ? "من: " : "From: "}{product.storeName}
													</p>
												)}
												<div className={`flex items-center gap-2 mb-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
													{product.price && (
														<span className="font-bold text-green-600 dark:text-green-400 text-sm">
															{product.price.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}
														</span>
													)}
													{product.originalPrice && product.originalPrice > (product.price || 0) && (
														<span className="text-xs text-gray-500 dark:text-gray-400 line-through">
															{product.originalPrice.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}
														</span>
													)}
													{product.unit && (
														<span className="text-xs text-gray-500 dark:text-gray-400">
															{isArabic ? product.unitAr || product.unit : product.unit}
														</span>
													)}
												</div>
												<button
													onClick={() => handleAddToCart(product)}
													disabled={addingToCart === product.id}
													className="w-full flex items-center justify-center gap-2 bg-green-600 dark:bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 text-sm font-medium"
												>
													{addingToCart === product.id ? (
														<>
															<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
															<span>{isArabic ? "جاري الإضافة..." : "Adding..."}</span>
														</>
													) : (
														<>
															<FaPlusCircle className="text-sm" />
															<span>{isArabic ? "أضف للسلة" : "Add to Cart"}</span>
														</>
													)}
												</button>
											</div>
										</div>
									))}
								</div>
							)}

							{activeTab === "stores" && (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
									{filteredFavorites.stores.map((store) => (
										<div key={store.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 hover:border-red-200 dark:hover:border-red-800 cursor-pointer" onClick={() => handleStoreClick(store)}>
											{/* Store Image */}
											<div className="relative mb-4">
												<div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
													{store.image ? (
														<Image
															src={store.image}
															alt={isArabic ? store.nameAr || store.name : store.name}
															width={300}
															height={200}
															className="w-full h-full object-cover"
														/>
													) : (
														<FaStore className="text-gray-400 dark:text-gray-500 text-3xl" />
													)}
												</div>
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleRemoveStore(store.id);
													}}
													className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
													aria-label={isArabic ? "إزالة من المفضلة" : "Remove from favorites"}
												>
													<FaHeart className="text-red-500 text-sm fill-current" />
												</button>
											</div>

											{/* Store Info */}
											<div className={isArabic ? 'text-right' : 'text-left'}>
												<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
													{isArabic ? store.nameAr || store.name : store.name}
												</h3>
												{store.type && (
													<p className="text-gray-600 dark:text-gray-400 text-xs mb-2">
														{isArabic ? store.typeAr || store.type : store.type}
													</p>
												)}
												{store.rating && (
													<div className={`flex items-center gap-1 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
														<span className="text-yellow-500">★</span>
														<span className="text-sm text-gray-600 dark:text-gray-400">{store.rating}</span>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</>
				) : (
					<InfoCard 
						title={isArabic ? "لا توجد مفضلة" : "No Favorites"}
						icon={FaHeart}
					>
						<div className="text-center py-6 sm:py-8">
							<div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
								<FaHeart className="text-gray-400 dark:text-gray-500 text-2xl" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
								{isArabic ? "لم تقم بإضافة أي مفضلة بعد" : "You haven't added any favorites yet"}
							</h3>
							<p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
								{isArabic 
									? "ابدأ بإضافة المنتجات والمتاجر المفضلة لديك" 
									: "Start adding your favorite products and stores"
								}
							</p>
							<button
								onClick={() => router.push("/categories")}
								className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-medium mx-auto touch-manipulation"
							>
								<FaHeart className="text-sm" />
								<span>{isArabic ? "تصفح المنتجات" : "Browse Products"}</span>
							</button>
						</div>
					</InfoCard>
				)}
			</div>
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
		</div>
	);
}
