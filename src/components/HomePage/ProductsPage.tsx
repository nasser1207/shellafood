"use client";

import Breadcrumb from "@/components/HomePage/Breadcrumb";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useCart } from "@/hooks/useCart";
import { useProductFavorites } from "@/hooks/useFavorites";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
	id: string;
	name: string;
	image: string;
	price: string;
	originalPrice?: string;
	unit?: string;
}

interface ProductsPageProps {
	categoryName?: string;
	storeName?: string;
	onProductClick?: (productId: string) => void;
	isFullPage?: boolean; // جديد: لتحديد ما إذا كانت صفحة كاملة أم مكون
}

// مكون بطاقة المنتج مع زر المفضلة
function ProductCard({
	product,
	onProductClick,
	onAddToCart,
	cartLoading,
}: {
	product: Product;
	onProductClick: (productId: string) => void;
	onAddToCart: (productId: string) => void;
	cartLoading: boolean;
}) {
	const {
		isFavorite,
		isLoading: favoriteLoading,
		toggleFavorite,
	} = useProductFavorites(product.id);

	return (
		<button
			onClick={() => onProductClick(product.id)}
			className="relative flex cursor-pointer flex-col overflow-hidden rounded-lg bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
		>
			<div className="relative">
				<img
					src={product.image}
					alt={product.name}
					className="h-32 w-full object-contain"
				/>

				{/* زر المفضلة */}
				<FavoriteButton
					isFavorite={isFavorite}
					isLoading={favoriteLoading}
					onToggle={toggleFavorite}
					size="sm"
				/>

				{/* زر إضافة للسلة */}
				<button
					onClick={(e) => {
						e.stopPropagation();
						onAddToCart(product.id);
					}}
					disabled={cartLoading}
					className={`absolute right-2 bottom-2 rounded-full p-2 text-white shadow-md transition-colors ${
						cartLoading
							? "cursor-not-allowed bg-gray-400"
							: "bg-green-500 hover:bg-green-600"
					}`}
				>
					{cartLoading ? (
						<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
					)}
				</button>
			</div>
			<div className="mt-2 text-right">
				<h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
				{product.unit && (
					<p className="text-xs text-gray-500">{product.unit}</p>
				)}
				<div className="mt-2 flex items-center justify-end">
					{product.originalPrice && (
						<span className="ml-2 text-xs text-gray-400 line-through">
							{product.originalPrice}
						</span>
					)}
					<span className="text-md font-bold text-green-600">
						{product.price}
					</span>
				</div>
			</div>
		</button>
	);
}

export default function ProductsPage({
	categoryName: propCategoryName,
	storeName: propStoreName,
	onProductClick: propOnProductClick,
	isFullPage = false,
}: ProductsPageProps) {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [storeId, setStoreId] = useState<string>("");
	const [showClearCartDialog, setShowClearCartDialog] = useState(false);
	const [pendingProduct, setPendingProduct] = useState<{
		productId: string;
		storeId: string;
	} | null>(null);
	const { addToCart, clearCart, isLoading: cartLoading } = useCart();

	// استخدام URL parameters للصفحة الكاملة
	const searchParams = useSearchParams();
	const urlStoreName = searchParams.get("store") || "";
	const urlCategoryName = searchParams.get("category") || "";

	// تحديد البيانات المستخدمة
	const storeName = isFullPage ? urlStoreName : propStoreName;
	const categoryName = isFullPage ? urlCategoryName : propCategoryName;
	const onProductClick = isFullPage ? undefined : propOnProductClick;

	// دالة التعامل مع النقر على المنتج للصفحة الكاملة
	const handleProductClick = (productId: string) => {
		if (isFullPage) {
			window.location.href = `/product-details?productId=${encodeURIComponent(productId)}&store=${encodeURIComponent(storeName || '')}&category=${encodeURIComponent(categoryName || '')}`;
		} else if (propOnProductClick) {
			propOnProductClick(productId);
		}
	};

	// دالة التعامل مع النقر على Breadcrumb
	const handleBreadcrumbClick = (index: number) => {
		if (index === 0) {
			window.location.href = "/HomePage";
		} else {
			window.location.href = `/store?store=${encodeURIComponent(storeName || '')}`;
		}
	};

	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			try {
				const { getStoreProductsAction } = await import("@/app/actions/stores");
				const result = await getStoreProductsAction(storeName || '', categoryName || '');
				if (result.success && result.data) {
					const data = result.data as any;
					setProducts(data.products || []);
					if (data.store?.id) {
						setStoreId(data.store.id);
					}
				} else {
					console.error("فشل في جلب المنتجات:", result.error);
				}
			} catch (error) {
				console.error("خطأ في جلب المنتجات:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (
			categoryName &&
			storeName &&
			categoryName.trim() !== "" &&
			storeName.trim() !== ""
		) {
			fetchProducts();
		}
	}, [categoryName, storeName, isFullPage]);

	const handleAddToCart = async (productId: string) => {
		if (!storeId) {
			alert("خطأ: معرف المتجر غير متوفر");
			return;
		}

		const result = await addToCart({ productId, storeId });

		if (result.success) {
			alert(result.message || "تم إضافة المنتج للسلة بنجاح");
		} else if (result.requiresClearCart) {
			setPendingProduct({ productId, storeId });
			setShowClearCartDialog(true);
		} else {
			alert(result.error || "حدث خطأ أثناء إضافة المنتج للسلة");
		}
	};

	const handleClearCartAndAdd = async () => {
		if (!pendingProduct) return;

		const clearSuccess = await clearCart();
		if (clearSuccess) {
			const result = await addToCart(pendingProduct);
			if (result.success) {
				alert(result.message || "تم إضافة المنتج للسلة بنجاح");
			} else {
				alert(result.error || "حدث خطأ أثناء إضافة المنتج للسلة");
			}
		} else {
			alert("حدث خطأ أثناء إفراغ السلة");
		}

		setShowClearCartDialog(false);
		setPendingProduct(null);
	};

	const handleCancelClearCart = () => {
		setShowClearCartDialog(false);
		setPendingProduct(null);
	};

	// عرض حالة التحميل
	if (isLoading) {
		if (isFullPage) {
			return (
				<>
					<div className="mb-4">
						<Breadcrumb
							path={[
								"الرئيسية",
								storeName || "المتجر",
								categoryName || "القسم",
							]}
							onBreadcrumbClick={handleBreadcrumbClick}
						/>
					</div>
					<div className="p-4 md:p-8" dir="rtl">
						<div className="mb-4 h-8 w-64 animate-pulse rounded bg-gray-300"></div>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
								<div
									key={item}
									className="flex flex-col overflow-hidden rounded-lg bg-gray-100 p-4 shadow-sm"
								>
									<div className="mb-2 h-32 w-full animate-pulse rounded bg-gray-300"></div>
									<div className="mb-1 h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
									<div className="mb-2 h-3 w-1/2 animate-pulse rounded bg-gray-300"></div>
									<div className="h-5 w-16 animate-pulse rounded bg-gray-300"></div>
								</div>
							))}
						</div>
					</div>
				</>
			);
		} else {
			return (
				<div className="p-4 md:p-8" dir="rtl">
					<div className="mb-4 h-8 w-64 animate-pulse rounded bg-gray-300"></div>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
							<div
								key={item}
								className="flex flex-col overflow-hidden rounded-lg bg-gray-100 p-4 shadow-sm"
							>
								<div className="mb-2 h-32 w-full animate-pulse rounded bg-gray-300"></div>
								<div className="mb-1 h-4 w-3/4 animate-pulse rounded bg-gray-300"></div>
								<div className="mb-2 h-3 w-1/2 animate-pulse rounded bg-gray-300"></div>
								<div className="h-5 w-16 animate-pulse rounded bg-gray-300"></div>
							</div>
						))}
					</div>
				</div>
			);
		}
	}

	// عرض الصفحة الكاملة
	if (isFullPage) {
		return (
			<>
				<div className="mb-4">
					<Breadcrumb
						path={["الرئيسية", storeName || "المتجر", categoryName || "القسم"]}
						onBreadcrumbClick={handleBreadcrumbClick}
					/>
				</div>
				<div className="p-4 md:p-8" dir="rtl">
					<h2 className="mb-4 text-xl font-bold text-gray-900">
						المنتجات في قسم {categoryName}
					</h2>
					{products.length === 0 ? (
						<div className="flex items-center justify-center py-12">
							<div className="text-center">
								<svg
									className="mx-auto mb-4 h-12 w-12 text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
									/>
								</svg>
								<p className="text-lg text-gray-500">
									لا توجد منتجات في {categoryName}
								</p>
								<p className="mt-2 text-sm text-gray-400">
									جرب تصفح أقسام أخرى
								</p>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{products.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									onProductClick={handleProductClick}
									onAddToCart={handleAddToCart}
									cartLoading={cartLoading}
								/>
							))}
						</div>
					)}

					{/* Dialog لتأكيد إفراغ السلة */}
					{showClearCartDialog && (
						<div
							className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
							dir="rtl"
						>
							<div className="mx-4 max-w-md rounded-lg bg-white p-6">
								<h3 className="mb-4 text-lg font-semibold">
									تأكيد إفراغ السلة
								</h3>
								<p className="mb-6 text-gray-600">
									يبدو أن لديك منتجات من متجر آخر في السلة. هل تريد إفراغ السلة
									وإضافة هذا المنتج؟
								</p>
								<div className="flex gap-3">
									<button
										onClick={handleClearCartAndAdd}
										className="flex-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
									>
										إفراغ السلة وإضافة المنتج
									</button>
									<button
										onClick={handleCancelClearCart}
										className="flex-1 rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
									>
										إلغاء
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</>
		);
	}

	// عرض المكون (الوضع الافتراضي)
	return (
		<div className="p-4 md:p-8" dir="rtl">
			<h2 className="mb-4 text-xl font-bold text-gray-900">
				المنتجات في قسم {categoryName}
			</h2>
			{products.length === 0 ? (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<svg
							className="mx-auto mb-4 h-12 w-12 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
							/>
						</svg>
						<p className="text-lg text-gray-500">
							لا توجد منتجات في {categoryName}
						</p>
						<p className="mt-2 text-sm text-gray-400">جرب تصفح أقسام أخرى</p>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onProductClick={onProductClick || (() => {})}
							onAddToCart={handleAddToCart}
							cartLoading={cartLoading}
						/>
					))}
				</div>
			)}

			{/* Dialog لتأكيد إفراغ السلة */}
			{showClearCartDialog && (
				<div
					className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
					dir="rtl"
				>
					<div className="m-4 w-full max-w-md rounded-lg bg-white p-6">
						<h3 className="mb-4 text-lg font-semibold text-gray-900">
							تحذير: السلة تحتوي على منتجات من متجر آخر
						</h3>
						<p className="mb-6 text-gray-600">
							لا يمكن إضافة منتجات من متاجر مختلفة في نفس السلة. هل تريد إفراغ
							السلة الحالية وإضافة هذا المنتج؟
						</p>
						<div className="flex justify-end gap-4">
							<button
								onClick={() => {
									setShowClearCartDialog(false);
									setPendingProduct(null);
								}}
								className="rounded-md border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
								disabled={cartLoading}
							>
								إلغاء
							</button>
							<button
								onClick={handleClearCartAndAdd}
								disabled={cartLoading}
								className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
							>
								{cartLoading ? "جاري الإفراغ..." : "إفراغ السلة والإضافة"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
