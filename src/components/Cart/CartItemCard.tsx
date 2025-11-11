"use client";

import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Minus, Trash2, Store, AlertCircle, X } from "lucide-react";

interface CartProductItem {
	id: string;
	productId: string;
	productName: string;
	productNameAr?: string;
	productImage?: string;
	quantity: number;
	priceAtAdd: number;
	storeId: string;
	storeName: string;
	storeNameAr?: string;
	storeLogo?: string;
	stock?: number;
	hasSpecialOffer?: boolean;
}

interface CartItemCardProps {
	item: CartProductItem;
	language: "en" | "ar";
	onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
	onRemove: (itemId: string) => Promise<void>;
}

function CartItemCard({
	item,
	language,
	onUpdateQuantity,
	onRemove,
}: CartItemCardProps) {
	const isArabic = language === "ar";
	const [isUpdating, setIsUpdating] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const [showConfirmRemove, setShowConfirmRemove] = useState(false);

	const unitPrice = item.priceAtAdd;
	const subtotal = unitPrice * item.quantity;
	const isLowStock = item.stock !== undefined && item.quantity > item.stock;

	const handleQuantityChange = useCallback(async (newQuantity: number) => {
		if (newQuantity < 1) {
			setShowConfirmRemove(true);
			return;
		}
		setIsUpdating(true);
		try {
			await onUpdateQuantity(item.id, newQuantity);
		} finally {
			setIsUpdating(false);
		}
	}, [item.id, onUpdateQuantity]);

	const handleRemove = useCallback(async () => {
		setIsRemoving(true);
		try {
			await onRemove(item.id);
		} finally {
			setIsRemoving(false);
			setShowConfirmRemove(false);
		}
	}, [item.id, onRemove]);

	const handleDecrease = useCallback(() => {
		handleQuantityChange(item.quantity - 1);
	}, [item.quantity, handleQuantityChange]);

	const handleIncrease = useCallback(() => {
		handleQuantityChange(item.quantity + 1);
	}, [item.quantity, handleQuantityChange]);

	const handleShowRemove = useCallback(() => {
		setShowConfirmRemove(true);
	}, []);

	const handleCancelRemove = useCallback(() => {
		setShowConfirmRemove(false);
	}, []);

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				whileHover={{ y: -2 }}
				className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200"
			>
				{/* Store Header */}
				<div className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 ${isArabic ? "text-right" : "text-left"}`}>
					<div className={`flex items-center gap-3`}>
						{item.storeLogo ? (
							<motion.div
								whileHover={{ scale: 1.1 }}
								className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-200 dark:border-gray-700 shadow-sm"
							>
								<Image
									src={item.storeLogo}
									alt={isArabic ? item.storeNameAr || item.storeName : item.storeName}
									fill
									className="object-cover"
									sizes="40px"
								/>
							</motion.div>
						) : (
							<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center flex-shrink-0 border border-emerald-200 dark:border-emerald-800">
								<Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
							</div>
						)}
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
								{isArabic ? item.storeNameAr || item.storeName : item.storeName}
							</h3>
						</div>
						{item.hasSpecialOffer && (
							<motion.span
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-lg shadow-sm"
							>
								{isArabic ? "عرض خاص" : "Special Offer"}
							</motion.span>
						)}
					</div>
				</div>

				{/* Product Details */}
				<div className="p-4 sm:p-5">
					<div className={`flex items-start gap-4`}>
						{/* Product Image */}
						<motion.div
							whileHover={{ scale: 1.05 }}
							className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-gray-700"
						>
							{item.productImage ? (
								<Image
									src={item.productImage}
									alt={isArabic ? item.productNameAr || item.productName : item.productName}
									fill
									className="object-cover"
									sizes="96px"
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
									<Store className="w-8 h-8 text-gray-400 dark:text-gray-500" />
								</div>
							)}
						</motion.div>

						{/* Product Info */}
						<div className="flex-1 min-w-0">
							<h4 className={`font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100 mb-1.5 line-clamp-2 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? item.productNameAr || item.productName : item.productName}
							</h4>

							{/* Price */}
							<div className={`flex items-center gap-2 mb-3`}>
								<span className="text-sm font-medium text-gray-600 dark:text-gray-400">
									{unitPrice.toFixed(2)} {isArabic ? "ريال" : "SAR"} {isArabic ? "للقطعة" : "per unit"}
								</span>
							</div>

							{/* Stock Warning */}
							{isLowStock && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className={`flex items-center gap-2 mb-3 text-orange-600 dark:text-orange-400 text-xs font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg ${isArabic ? "flex-row-reverse justify-end" : ""}`}
								>
									<AlertCircle className="w-3.5 h-3.5" />
									<span>{isArabic ? "مخزون محدود" : "Limited stock"}</span>
								</motion.div>
							)}

							{/* Quantity Controls */}
							<div className={`flex items-center gap-3`}>
								<div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
									<motion.button
										whileHover={{ backgroundColor: "#f3f4f6" }}
										whileTap={{ scale: 0.95 }}
										onClick={handleDecrease}
										disabled={isUpdating || item.quantity <= 1}
										className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										aria-label={isArabic ? "تقليل الكمية" : "Decrease quantity"}
									>
										<Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
									</motion.button>
									<span className="px-4 py-2 min-w-[3rem] text-center font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 border-x-2 border-gray-300 dark:border-gray-600">
										{isUpdating ? (
											<motion.div
												animate={{ rotate: 360 }}
												transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
												className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"
											/>
										) : (
											item.quantity
										)}
									</span>
									<motion.button
										whileHover={{ backgroundColor: "#f3f4f6" }}
										whileTap={{ scale: 0.95 }}
										onClick={handleIncrease}
										disabled={isUpdating || (item.stock !== undefined && item.quantity >= item.stock)}
										className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										aria-label={isArabic ? "زيادة الكمية" : "Increase quantity"}
									>
										<Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
									</motion.button>
								</div>

								{/* Remove Button */}
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={handleShowRemove}
									disabled={isRemoving}
									className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 border border-red-200 dark:border-red-800"
									aria-label={isArabic ? "إزالة من السلة" : "Remove from cart"}
								>
									<Trash2 className="w-4 h-4" />
								</motion.button>
							</div>
						</div>

						{/* Subtotal */}
						<div className={`text-right ${isArabic ? "mr-auto" : "ml-auto"}`}>
							<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isArabic ? "المجموع" : "Subtotal"}</p>
							<motion.p
								key={subtotal}
								initial={{ scale: 1.2 }}
								animate={{ scale: 1 }}
								className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400"
							>
								{subtotal.toFixed(2)} {isArabic ? "ريال" : "SAR"}
							</motion.p>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Confirm Remove Modal */}
			<AnimatePresence>
				{showConfirmRemove && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
							onClick={handleCancelRemove}
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.9, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, y: 20 }}
								className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-200 dark:border-gray-700 ${isArabic ? "rtl" : "ltr"}`}
								dir={isArabic ? "rtl" : "ltr"}
								onClick={(e) => e.stopPropagation()}
							>
								<div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4 mx-auto">
									<AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
								</div>
								<h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 text-center`}>
									{isArabic ? "إزالة المنتج؟" : "Remove Item?"}
								</h3>
								<p className={`text-sm text-gray-600 dark:text-gray-400 mb-6 text-center`}>
									{isArabic
										? "هل أنت متأكد من إزالة هذا المنتج من السلة؟"
										: "Are you sure you want to remove this item from your cart?"}
								</p>
								<div className={`flex gap-3`}>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleCancelRemove}
										className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
									>
										{isArabic ? "إلغاء" : "Cancel"}
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handleRemove}
										disabled={isRemoving}
										className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
									>
										{isRemoving ? (
											<>
												<motion.div
													animate={{ rotate: 360 }}
													transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
													className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
												/>
												<span>{isArabic ? "جاري..." : "Removing..."}</span>
											</>
										) : (
											<>
												<Trash2 className="w-4 h-4" />
												<span>{isArabic ? "إزالة" : "Remove"}</span>
											</>
										)}
									</motion.button>
								</div>
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}

export default memo(CartItemCard, (prevProps, nextProps) => {
	// Custom comparison function for memo
	return (
		prevProps.item.id === nextProps.item.id &&
		prevProps.item.quantity === nextProps.item.quantity &&
		prevProps.item.priceAtAdd === nextProps.item.priceAtAdd &&
		prevProps.language === nextProps.language &&
		prevProps.onUpdateQuantity === nextProps.onUpdateQuantity &&
		prevProps.onRemove === nextProps.onRemove
	);
});
