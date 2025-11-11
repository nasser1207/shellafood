"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, ArrowLeft, Sparkles, Store as StoreIcon } from "lucide-react";
import CartItemCard from "./CartItemCard";
import CouponSection from "./CouponSection";
import AddressSelector from "./AddressSelector";
import PaymentOptions from "./PaymentOptions";
import OrderSummary from "./OrderSummary";
import EmptyCartState from "./EmptyCartState";
import ConfirmCheckoutModal from "./ConfirmCheckoutModal";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { CartItemSkeleton, OrderSummarySkeleton } from "./SkeletonLoader";
import { getCartItems, updateCartItemQuantity as updateCartItemQuantityStorage, removeCartItem as removeCartItemStorage, type CartProductItem } from "@/lib/utils/cartStorage";

interface Coupon {
	id: string;
	code: string;
	titleEn: string;
	titleAr?: string;
	discountValue: number;
	discountType: "percentage" | "fixed";
}

export default function CartPage() {
	const { language } = useLanguage();
	const router = useRouter();
	const isArabic = language === "ar";
	const { toasts, showToast, removeToast } = useToast();
	
	// Use refs to avoid re-renders from toast functions
	const showToastRef = useRef(showToast);
	const isArabicRef = useRef(isArabic);
	
	// Update refs when values change
	useEffect(() => {
		showToastRef.current = showToast;
		isArabicRef.current = isArabic;
	}, [showToast, isArabic]);

	// State
	const [productItems, setProductItems] = useState<CartProductItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"apple_pay" | "stc_pay" | "card" | "cash" | "kaidha" | null>(null);
	const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
	const [showCheckoutModal, setShowCheckoutModal] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	// Initial cart load - only runs once
	useEffect(() => {
		let mounted = true;
		setIsLoading(true);
		
		// Simulate realistic loading time
		const timeoutId = setTimeout(() => {
			if (!mounted) return;
			
			try {
				const items = getCartItems();
				setProductItems(items);
			} catch (error) {
				console.error("Error fetching cart data:", error);
				if (mounted) {
					showToastRef.current(
						isArabicRef.current ? "حدث خطأ في تحميل السلة" : "Error loading cart",
						"error",
						isArabicRef.current ? "حدث خطأ في تحميل السلة" : undefined
					);
				}
			} finally {
				if (mounted) {
					setIsLoading(false);
				}
			}
		}, 500);
		
		return () => {
			mounted = false;
			clearTimeout(timeoutId);
		};
	}, []); // Only run on mount

	// Listen for cart updates
	useEffect(() => {
		const handleCartUpdate = () => {
			// Directly update from localStorage without delay for real-time updates
			try {
				const items = getCartItems();
				setProductItems(items);
			} catch (error) {
				console.error("Error fetching cart data:", error);
			}
		};
		
		window.addEventListener('cartUpdated', handleCartUpdate);
		return () => {
			window.removeEventListener('cartUpdated', handleCartUpdate);
		};
	}, []); // Only run on mount

	// Update product quantity with instant feedback
	const updateProductQuantity = useCallback(async (itemId: string, quantity: number) => {
		// Optimistic update for instant feedback
		setProductItems(prev => 
			prev.map(item => 
				item.id === itemId ? { ...item, quantity } : item
			)
		);

		setIsUpdating(true);
		try {
			const success = updateCartItemQuantityStorage(itemId, quantity);
			if (!success) {
				// Revert on error - sync from localStorage
				const items = getCartItems();
				setProductItems(items);
				showToastRef.current(
					isArabicRef.current ? "حدث خطأ في تحديث الكمية" : "Error updating quantity",
					"error",
					isArabicRef.current ? "حدث خطأ في تحديث الكمية" : undefined
				);
			}
			// No need to call fetchCartData on success - optimistic update is already applied
		} catch (error) {
			console.error("Error updating quantity:", error);
			// Revert on error - sync from localStorage
			const items = getCartItems();
			setProductItems(items);
			showToastRef.current(
				isArabicRef.current ? "حدث خطأ في تحديث الكمية" : "Error updating quantity",
				"error",
				isArabicRef.current ? "حدث خطأ في تحديث الكمية" : undefined
			);
		} finally {
			setIsUpdating(false);
		}
	}, []); // No dependencies - uses refs

	// Remove product with animation
	const removeProduct = useCallback(async (itemId: string) => {
		setIsUpdating(true);
		try {
			const success = removeCartItemStorage(itemId);
			if (success) {
				// Remove from state immediately for smooth animation
				setProductItems(prev => prev.filter(item => item.id !== itemId));
				showToastRef.current(
					isArabicRef.current ? "تم إزالة المنتج من السلة" : "Product removed from cart",
					"success",
					isArabicRef.current ? "تم إزالة المنتج من السلة" : undefined
				);
			} else {
				// Sync from localStorage on error
				const items = getCartItems();
				setProductItems(items);
				showToastRef.current(
					isArabicRef.current ? "حدث خطأ في إزالة المنتج" : "Error removing product",
					"error",
					isArabicRef.current ? "حدث خطأ في إزالة المنتج" : undefined
				);
			}
		} catch (error) {
			console.error("Error removing item:", error);
			// Sync from localStorage on error
			const items = getCartItems();
			setProductItems(items);
			showToastRef.current(
				isArabicRef.current ? "حدث خطأ في إزالة المنتج" : "Error removing product",
				"error",
				isArabicRef.current ? "حدث خطأ في إزالة المنتج" : undefined
			);
		} finally {
			setIsUpdating(false);
		}
	}, []); // No dependencies - uses refs

	// Calculate totals with memoization
	const totals = useMemo(() => {
		const productSubtotal = productItems.reduce((sum, item) => {
			return sum + item.priceAtAdd * item.quantity;
		}, 0);

		const subtotal = productSubtotal;

		// Calculate discount
		let discount = 0;
		if (appliedCoupon) {
			if (appliedCoupon.discountType === "percentage") {
				discount = (subtotal * appliedCoupon.discountValue) / 100;
			} else {
				discount = appliedCoupon.discountValue;
			}
		}

		// Delivery fee (only for products)
		const deliveryFee = productItems.length > 0 ? 10 : 0;

		const total = Math.max(0, subtotal + deliveryFee - discount);

		return {
			subtotal,
			deliveryFee,
			discount,
			total,
			itemsCount: productItems.reduce((sum, item) => sum + item.quantity, 0),
		};
	}, [productItems, appliedCoupon]);

	// Handle checkout with validation
	const handleCheckout = useCallback(async () => {
		if (!selectedAddressId) {
			showToastRef.current(
				isArabicRef.current ? "الرجاء اختيار عنوان التوصيل" : "Please select a delivery address",
				"warning",
				isArabicRef.current ? "الرجاء اختيار عنوان التوصيل" : undefined
			);
			return;
		}

		if (!selectedPaymentMethod) {
			showToastRef.current(
				isArabicRef.current ? "الرجاء اختيار طريقة الدفع" : "Please select a payment method",
				"warning",
				isArabicRef.current ? "الرجاء اختيار طريقة الدفع" : undefined
			);
			return;
		}

		setShowCheckoutModal(true);
	}, [selectedAddressId, selectedPaymentMethod]); // No showToast dependency

	const confirmCheckout = useCallback(async () => {
		setIsProcessing(true);
		try {
			// Simulate realistic processing time
			await new Promise((resolve) => setTimeout(resolve, 2500));

			// Redirect to confirmation
			router.push(`/checkout/confirmation?type=products`);
		} catch (error) {
			console.error("Checkout error:", error);
			showToastRef.current(
				isArabicRef.current ? "حدث خطأ أثناء معالجة الطلب" : "An error occurred processing your order",
				"error",
				isArabicRef.current ? "حدث خطأ أثناء معالجة الطلب" : undefined
			);
			setIsProcessing(false);
		}
	}, [router]); // No showToast dependency

	// Memoized callbacks
	const handleCouponRemoved = useCallback(() => {
		setAppliedCoupon(null);
	}, []);

	const handleModalCancel = useCallback(() => {
		if (!isProcessing) {
			setShowCheckoutModal(false);
		}
	}, [isProcessing]);

	// Group products by store with store info
	const productsByStore = useMemo(() => {
		const grouped: Record<string, { items: CartProductItem[]; storeName: string; storeNameAr?: string; storeLogo?: string }> = {};
		productItems.forEach((item) => {
			if (!grouped[item.storeId]) {
				grouped[item.storeId] = {
					items: [],
					storeName: item.storeName,
					storeNameAr: item.storeNameAr,
					storeLogo: item.storeLogo,
				};
			}
			grouped[item.storeId].items.push(item);
		});
		return grouped;
	}, [productItems]);

	// Memoize order summary to prevent unnecessary re-renders
	const orderSummary = useMemo(() => ({
		subtotal: totals.subtotal,
		deliveryFee: totals.deliveryFee,
		discount: totals.discount,
		total: totals.total,
		itemsCount: totals.itemsCount,
	}), [totals.subtotal, totals.deliveryFee, totals.discount, totals.total, totals.itemsCount]);

	// Empty state
	if (!isLoading && productItems.length === 0) {
		return (
			<>
				<EmptyCartState language={language} />
				<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
			</>
		);
	}

	return (
		<div
			className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className={`mb-6 sm:mb-8 ${isArabic ? "text-right" : "text-left"}`}
				>
					<div className="flex items-center justify-between mb-4">
						<div className={`flex items-center gap-3`}>
							<motion.div
								whileHover={{ scale: 1.05, rotate: -5 }}
								whileTap={{ scale: 0.95 }}
								className="relative"
							>
								<ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
								{productItems.length > 0 && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center"
									>
										<span className="text-xs font-bold text-white">{totals.itemsCount}</span>
									</motion.div>
								)}
							</motion.div>
							<div>
								<h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
									{isArabic ? "سلة التسوق" : "Shopping Cart"}
								</h1>
								<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
									{isArabic
										? `${totals.itemsCount} ${totals.itemsCount === 1 ? "عنصر" : "عناصر"} في السلة`
										: `${totals.itemsCount} ${totals.itemsCount === 1 ? "item" : "items"} in cart`}
								</p>
							</div>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => router.push("/categories")}
							className={`flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
						>
							<ArrowLeft className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
							<span className="text-sm font-medium">{isArabic ? "متابعة التسوق" : "Continue Shopping"}</span>
						</motion.button>
					</div>

					{/* Promo Banner */}
					{productItems.length > 0 && totals.subtotal < 100 && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl"
						>
							<Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
							<p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
								{isArabic
									? `أضف ${(100 - totals.subtotal).toFixed(2)} ريال أخرى للحصول على توصيل مجاني!`
									: `Add ${(100 - totals.subtotal).toFixed(2)} SAR more for free delivery!`}
							</p>
						</motion.div>
					)}
				</motion.div>

				{isLoading ? (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2 space-y-4">
							{[1, 2, 3].map((i) => (
								<CartItemSkeleton key={i} />
							))}
						</div>
						<div className="lg:col-span-1">
							<OrderSummarySkeleton />
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
						{/* Left Column - Items */}
						<div className="lg:col-span-2 space-y-6">
							{/* Products Section with Store Grouping */}
							{productItems.length > 0 && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4 }}
									className="space-y-6"
								>
									{Object.entries(productsByStore).map(([storeId, storeData], storeIndex) => (
										<motion.div
											key={storeId}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: storeIndex * 0.1 }}
											className="space-y-4"
										>
											{/* Store Header */}
											<div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
												{storeData.storeLogo ? (
													<div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
														<img
															src={storeData.storeLogo}
															alt={isArabic ? storeData.storeNameAr || storeData.storeName : storeData.storeName}
															className="w-full h-full object-cover"
														/>
												</div>
												) : (
													<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
														<StoreIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
													</div>
												)}
												<div className="flex-1">
													<h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
														{isArabic ? storeData.storeNameAr || storeData.storeName : storeData.storeName}
													</h2>
													<p className="text-xs text-gray-500 dark:text-gray-400">
														{storeData.items.length} {isArabic ? "منتج" : "product"}{storeData.items.length !== 1 ? (isArabic ? "ات" : "s") : ""}
													</p>
												</div>
											</div>

											{/* Store Items */}
											<AnimatePresence mode="popLayout">
												{storeData.items.map((item, index) => (
													<motion.div
														key={item.id}
														initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
														animate={{ opacity: 1, x: 0 }}
														exit={{ opacity: 0, x: isArabic ? -20 : 20, scale: 0.95 }}
														transition={{ duration: 0.3, delay: index * 0.05 }}
														layout
													>
														<CartItemCard
															item={item}
															language={language}
															onUpdateQuantity={updateProductQuantity}
															onRemove={removeProduct}
														/>
													</motion.div>
												))}
											</AnimatePresence>
										</motion.div>
									))}
								</motion.div>
							)}
						</div>

						{/* Right Column - Summary & Options (Sticky on large screens) */}
						<div className="lg:col-span-1 space-y-6">
							{/* Coupon Section */}
							<CouponSection
								language={language}
								onCouponApplied={setAppliedCoupon}
								onCouponRemoved={handleCouponRemoved}
								appliedCoupon={appliedCoupon}
							/>

							{/* Address Selector */}
							<AddressSelector
								language={language}
								selectedAddressId={selectedAddressId || undefined}
								onAddressSelect={setSelectedAddressId}
							/>

							{/* Payment Options */}
							<PaymentOptions
								language={language}
								selectedMethod={selectedPaymentMethod}
								onMethodSelect={setSelectedPaymentMethod}
							/>

							{/* Order Summary - Sticky */}
							<OrderSummary
								language={language}
								subtotal={totals.subtotal}
								deliveryFee={totals.deliveryFee}
								discount={totals.discount}
								couponDiscount={0}
								total={totals.total}
								isLoading={isProcessing}
								onCheckout={handleCheckout}
								canCheckout={!isUpdating && totals.total > 0 && selectedAddressId !== null && selectedPaymentMethod !== null}
								estimatedDeliveryTime={productItems.length > 0 ? "30-45 min" : undefined}
								estimatedDeliveryTimeAr={productItems.length > 0 ? "30-45 دقيقة" : undefined}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Checkout Confirmation Modal */}
			<ConfirmCheckoutModal
				isOpen={showCheckoutModal}
				language={language}
				isProcessing={isProcessing}
				onConfirm={confirmCheckout}
				onCancel={handleModalCancel}
				orderSummary={orderSummary}
			/>

			{/* Toast Container */}
			<ToastContainer toasts={toasts} onRemoveToast={removeToast} isArabic={isArabic} />
		</div>
	);
}
