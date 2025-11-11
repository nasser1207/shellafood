"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "../ui/button";
import { ShoppingCart, Plus } from "lucide-react";

interface Product {
	id: string;
	name: string;
	image: string;
	price: string;
	originalPrice?: string;
	unit?: string;
	storeId: string;
	storeName: string;
}

interface MoreProductsSectionProps {
	excludeProductIds?: string[];
}

export default function MoreProductsSection({ excludeProductIds = [] }: MoreProductsSectionProps) {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showClearCartDialog, setShowClearCartDialog] = useState(false);
	const [pendingProduct, setPendingProduct] = useState<{ productId: string; storeId: string } | null>(null);
	const { addToCart, clearCart, isLoading: cartLoading } = useCart();

	useEffect(() => {
		fetchMoreProducts();
	}, [excludeProductIds]);

	const fetchMoreProducts = async () => {
		setIsLoading(true);
		try {
			// جلب منتجات عشوائية مع استبعاد المنتجات الموجودة في السلة
			const exclude = excludeProductIds.length > 0 ? excludeProductIds.join(',') : undefined;
			const { getProductsAction } = await import("@/app/actions/products");
			const result = await getProductsAction({ limit: 8, exclude });
			
			if (result.success && result.data) {
				setProducts(result.data.products || []);
			} else {
				console.error('فشل في جلب المنتجات الإضافية');
			}
		} catch (error) {
			console.error('خطأ في جلب المنتجات الإضافية:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddToCart = async (productId: string, storeId: string) => {
		const result = await addToCart({ productId, storeId });
		
		if (result.success) {
			alert(result.message || 'تم إضافة المنتج للسلة بنجاح');
		} else if (result.requiresClearCart) {
			setPendingProduct({ productId, storeId });
			setShowClearCartDialog(true);
		} else {
			alert(result.error || 'حدث خطأ أثناء إضافة المنتج للسلة');
		}
	};

	const handleClearCartAndAdd = async () => {
		if (!pendingProduct) return;

		const clearSuccess = await clearCart();
		if (clearSuccess) {
			const result = await addToCart(pendingProduct);
			if (result.success) {
				alert(result.message || 'تم إضافة المنتج للسلة بنجاح');
			} else {
				alert(result.error || 'حدث خطأ أثناء إضافة المنتج للسلة');
			}
		} else {
			alert('حدث خطأ أثناء إفراغ السلة');
		}

		setShowClearCartDialog(false);
		setPendingProduct(null);
	};

	if (isLoading) {
		return (
			<div className="mt-12" dir="rtl">
				<div className="h-8 w-64 animate-pulse bg-gray-300 rounded mb-6"></div>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
					{[1, 2, 3, 4, 5, 6].map((item) => (
						<div key={item} className="flex flex-col overflow-hidden rounded-lg bg-gray-100 p-4 shadow-sm">
							<div className="h-24 w-full animate-pulse bg-gray-300 rounded mb-2"></div>
							<div className="h-4 w-3/4 animate-pulse bg-gray-300 rounded mb-1"></div>
							<div className="h-3 w-1/2 animate-pulse bg-gray-300 rounded mb-2"></div>
							<div className="h-5 w-16 animate-pulse bg-gray-300 rounded"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (products.length === 0) {
		return null;
	}

	return (
		<div className="mt-12" dir="rtl">
			{/* العنوان */}
			<div className="flex items-center gap-3 mb-6">
				<ShoppingCart className="w-6 h-6 text-[#00203F]" />
				<h2 className="text-2xl font-bold text-[#00203F]">شراء المزيد</h2>
				<span className="text-sm text-gray-600">منتجات قد تعجبك</span>
			</div>

			{/* شبكة المنتجات */}
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{products.map((product) => (
					<div
						key={product.id}
						className="flex flex-col overflow-hidden rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
					>
						{/* صورة المنتج */}
						<div className="relative mb-3">
							<img
								src={product.image || "/placeholder-product.jpg"}
								alt={product.name}
								className="h-24 w-full object-contain rounded"
							/>
							<button 
								onClick={() => handleAddToCart(product.id, product.storeId)}
								disabled={cartLoading}
								className={`absolute left-2 bottom-2 rounded-full p-2 text-white shadow-md transition-colors ${
									cartLoading 
										? 'bg-gray-400 cursor-not-allowed' 
										: 'bg-[#ADF0D1] hover:bg-[#9de0c1] text-[#00203F]'
								}`}
							>
								{cartLoading ? (
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
								) : (
									<Plus className="h-4 w-4" />
								)}
							</button>
						</div>

						{/* معلومات المنتج */}
						<div className="flex-1">
							<h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
								{product.name}
							</h3>
							{product.unit && (
								<p className="text-xs text-gray-500 mb-2">{product.unit}</p>
							)}
							<div className="flex items-center justify-between">
								{product.originalPrice && (
									<span className="text-xs text-gray-400 line-through">
										{product.originalPrice}
									</span>
								)}
								<span className="text-sm font-bold text-[#00203F]">
									{product.price} ريال
								</span>
							</div>
						</div>

						{/* زر إضافة للسلة */}
						<Button
							onClick={() => handleAddToCart(product.id, product.storeId)}
							disabled={cartLoading}
							className="w-full mt-3 bg-[#ADF0D1] text-[#00203F] hover:bg-[#9de0c1] text-sm py-2"
						>
							{cartLoading ? 'جاري الإضافة...' : 'أضف للسلة'}
						</Button>
					</div>
				))}
			</div>

			{/* Dialog لتأكيد إفراغ السلة */}
			{showClearCartDialog && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
					<div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							تحذير: السلة تحتوي على منتجات من متجر آخر
						</h3>
						<p className="text-gray-600 mb-6">
							لا يمكن إضافة منتجات من متاجر مختلفة في نفس السلة. هل تريد إفراغ السلة الحالية وإضافة هذا المنتج؟
						</p>
						<div className="flex gap-4 justify-end">
							<button
								onClick={() => {
									setShowClearCartDialog(false);
									setPendingProduct(null);
								}}
								className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
								disabled={cartLoading}
							>
								إلغاء
							</button>
							<button
								onClick={handleClearCartAndAdd}
								disabled={cartLoading}
								className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
							>
								{cartLoading ? 'جاري الإفراغ...' : 'إفراغ السلة والإضافة'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
