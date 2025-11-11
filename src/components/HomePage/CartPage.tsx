"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import MoreProductsSection from "./MoreProductsSection";

interface CartItem {
	id: string;
	productId: string;
	productName: string;
	productImage: string;
	storeId: string;
	storeName: string;
	quantity: number;
	priceAtAdd: string;
	totalPrice: number;
}

interface CartData {
	id: string;
	items: CartItem[];
	totalAmount: number;
	itemsCount: number;
}

export default function CartPage() {
	const [cartData, setCartData] = useState<CartData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		fetchCartData();
	}, []);

		const fetchCartData = async () => {
		try {
			const { getCartAction } = await import("@/app/actions/cart");
			const result = await getCartAction();
			if (!result.success) {
				console.error("Failed to fetch cart data:", result.error);
				setCartData(null);
			} else {
				setCartData(result.data);
			}
		} catch (error) {
			console.error("Error fetching cart:", error);
			setCartData(null);
		} finally {
			setIsLoading(false);
		}
	};

	const updateQuantity = async (itemId: string, newQuantity: number) => {
		if (newQuantity < 1) {
			removeItem(itemId);
			return;
		}

		setIsUpdating(true);
		try {
			const { updateCartAction } = await import("@/app/actions/cart");
			const result = await updateCartAction({ itemId, quantity: newQuantity });
			if (result.success) {
				await fetchCartData();
			} else {
				console.error("Failed to update quantity:", result.error);
			}
		} catch (error) {
			console.error("Error updating quantity:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	const removeItem = async (itemId: string) => {
		setIsUpdating(true);
		try {
			const { removeFromCartAction } = await import("@/app/actions/cart");
			const result = await removeFromCartAction(itemId);
			if (result.success) {
				await fetchCartData();
			} else {
				console.error("Failed to remove item:", result.error);
			}
		} catch (error) {
			console.error("Error removing item:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	const clearCart = async () => {
		if (!confirm("هل أنت متأكد من حذف جميع العناصر من السلة؟")) return;

		setIsUpdating(true);
		try {
			const { clearCartAction } = await import("@/app/actions/cart");
			const result = await clearCartAction();
			if (result.success) {
				await fetchCartData();
			} else {
				console.error("Failed to clear cart:", result.error);
			}
		} catch (error) {
			console.error("Error clearing cart:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-[#ADF0D1] mx-auto mb-4"></div>
					<p className="text-gray-600">جاري تحميل السلة...</p>
				</div>
			</div>
		);
	}

	if (!cartData || cartData.items.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-800 mb-2">السلة فارغة</h2>
					<p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات إلى السلة بعد</p>
					<Button
						onClick={() => window.history.back()}
						className="bg-[#ADF0D1] text-[#00203F] hover:bg-[#9de0c1]"
					>
						العودة للتسوق
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<ShoppingBag className="w-8 h-8 text-[#00203F]" />
						<h1 className="text-3xl font-bold text-[#00203F]">سلة التسوق</h1>
						<span className="bg-[#ADF0D1] text-[#00203F] px-3 py-1 rounded-full text-sm font-medium">
							{cartData.itemsCount} عنصر
						</span>
					</div>
					<Button
						onClick={clearCart}
						disabled={isUpdating}
						variant="outline"
						className="text-red-600 border-red-600 hover:bg-red-50"
					>
						<Trash2 className="w-4 h-4 mr-2" />
						إفراغ السلة
					</Button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-sm">
							{cartData.items.map((item, index) => (
								<div
									key={item.id}
									className={`p-6 ${
										index !== cartData.items.length - 1 ? "border-b border-gray-200" : ""
									}`}
								>
									<div className="flex items-start gap-4">
										{/* Product Image */}
										<div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
											<img
												src={item.productImage || "/placeholder-product.jpg"}
												alt={item.productName}
												className="w-full h-full object-cover"
											/>
										</div>

										{/* Product Info */}
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-800 mb-1">
												{item.productName}
											</h3>
											<p className="text-sm text-gray-600 mb-2">
												من متجر: {item.storeName}
											</p>
											<p className="text-lg font-bold text-[#00203F]">
												{item.priceAtAdd} ريال
											</p>
										</div>

										{/* Quantity Controls */}
										<div className="flex items-center gap-3">
											<button
												onClick={() => updateQuantity(item.id, item.quantity - 1)}
												disabled={isUpdating}
												className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
											>
												<Minus className="w-4 h-4" />
											</button>
											<span className="w-8 text-center font-semibold">
												{item.quantity}
											</span>
											<button
												onClick={() => updateQuantity(item.id, item.quantity + 1)}
												disabled={isUpdating}
												className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
											>
												<Plus className="w-4 h-4" />
											</button>
										</div>

										{/* Remove Button */}
										<button
											onClick={() => removeItem(item.id)}
											disabled={isUpdating}
											className="text-red-600 hover:text-red-800 p-2 disabled:opacity-50"
										>
											<Trash2 className="w-5 h-5" />
										</button>
									</div>

									{/* Total for this item */}
									<div className="mt-4 text-right">
										<p className="text-sm text-gray-600">
											الإجمالي: {item.totalPrice.toFixed(2)} ريال
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Order Summary */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
							<h3 className="text-xl font-bold text-[#00203F] mb-6">ملخص الطلب</h3>
							
							<div className="space-y-3 mb-6">
								<div className="flex justify-between text-gray-600">
									<span>عدد العناصر:</span>
									<span>{cartData.itemsCount}</span>
								</div>
								<div className="flex justify-between text-gray-600">
									<span>المجموع الفرعي:</span>
									<span>{cartData.totalAmount.toFixed(2)} ريال</span>
								</div>
								<div className="flex justify-between text-gray-600">
									<span>رسوم التوصيل:</span>
									<span>15.00 ريال</span>
								</div>
								<div className="border-t border-gray-200 pt-3">
									<div className="flex justify-between text-lg font-bold text-[#00203F]">
										<span>الإجمالي:</span>
										<span>{(cartData.totalAmount + 15).toFixed(2)} ريال</span>
									</div>
								</div>
							</div>

							<Button
								className="w-full bg-[#ADF0D1] text-[#00203F] hover:bg-[#9de0c1] py-3 text-lg font-semibold"
								disabled={isUpdating}
							>
								المتابعة للدفع
							</Button>

							<Button
								variant="outline"
								className="w-full mt-3 border-[#00203F] text-[#00203F] hover:bg-[#00203F] hover:text-white"
								onClick={() => window.history.back()}
							>
								مواصلة التسوق
							</Button>
						</div>
					</div>
				</div>

				{/* قسم شراء المزيد */}
				<MoreProductsSection 
					excludeProductIds={cartData.items.map(item => item.productId)}
				/>
			</div>
		</div>
	);
}
