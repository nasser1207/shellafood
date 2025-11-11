"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Check, X, Loader2, Sparkles, AlertCircle } from "lucide-react";

interface Coupon {
	id: string;
	code: string;
	titleEn: string;
	titleAr?: string;
	discountValue: number;
	discountType: "percentage" | "fixed";
}

interface CouponSectionProps {
	language: "en" | "ar";
	onCouponApplied: (coupon: Coupon) => void;
	onCouponRemoved: () => void;
	appliedCoupon?: Coupon | null;
}

// Mock coupon validation
const validateCoupon = async (code: string): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> => {
	await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
	
	const mockCoupons: Record<string, Coupon> = {
		SAVE10: {
			id: "1",
			code: "SAVE10",
			titleEn: "Save 10%",
			titleAr: "وفر 10%",
			discountValue: 10,
			discountType: "percentage",
		},
		FIXED20: {
			id: "2",
			code: "FIXED20",
			titleEn: "20 SAR Off",
			titleAr: "خصم 20 ريال",
			discountValue: 20,
			discountType: "fixed",
		},
		WELCOME15: {
			id: "3",
			code: "WELCOME15",
			titleEn: "Welcome 15%",
			titleAr: "ترحيب 15%",
			discountValue: 15,
			discountType: "percentage",
		},
	};

	const coupon = mockCoupons[code.toUpperCase()];
	if (coupon) {
		return { valid: true, coupon };
	}
	return { valid: false, error: "Invalid or expired coupon" };
};

export default function CouponSection({
	language,
	onCouponApplied,
	onCouponRemoved,
	appliedCoupon,
}: CouponSectionProps) {
	const isArabic = language === "ar";
	const [couponCode, setCouponCode] = useState("");
	const [isValidating, setIsValidating] = useState(false);
	const [validationState, setValidationState] = useState<"idle" | "valid" | "invalid">("idle");
	const [error, setError] = useState("");

	const handleApply = useCallback(async () => {
		if (!couponCode.trim()) {
			setError(isArabic ? "الرجاء إدخال رمز الكوبون" : "Please enter a coupon code");
			setValidationState("invalid");
			return;
		}

		setIsValidating(true);
		setError("");
		setValidationState("idle");

		try {
			const result = await validateCoupon(couponCode);
			
			if (result.valid && result.coupon) {
				setValidationState("valid");
				onCouponApplied(result.coupon);
				setCouponCode("");
				setTimeout(() => setValidationState("idle"), 2000);
			} else {
				setValidationState("invalid");
				setError(result.error || (isArabic ? "كوبون غير صالح أو منتهي الصلاحية" : "Invalid or expired coupon"));
			}
		} catch (err) {
			setValidationState("invalid");
			setError(isArabic ? "حدث خطأ. الرجاء المحاولة مرة أخرى." : "An error occurred. Please try again.");
		} finally {
			setIsValidating(false);
		}
	}, [couponCode, isArabic, onCouponApplied]);

	const handleInputChange = useCallback((value: string) => {
		setCouponCode(value.toUpperCase());
		setError("");
		setValidationState("idle");
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5"
		>
			<div className="flex items-center gap-2 mb-4">
				<Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
				<h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic ? "كوبون خصم" : "Coupon Code"}
				</h3>
			</div>

			{appliedCoupon ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className={`flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl`}
				>
					<div className={`flex items-center gap-3 flex-1`}>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", duration: 0.5 }}
							className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg"
						>
							<Check className="w-5 h-5 text-white" />
						</motion.div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
								{isArabic ? appliedCoupon.titleAr || appliedCoupon.titleEn : appliedCoupon.titleEn}
							</p>
							<p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
								{appliedCoupon.code} -{" "}
								{appliedCoupon.discountType === "percentage"
									? `${appliedCoupon.discountValue}%`
									: `${appliedCoupon.discountValue} ${isArabic ? "ريال" : "SAR"}`}{" "}
								{isArabic ? "خصم" : "off"}
							</p>
						</div>
					</div>
					<motion.button
						whileHover={{ scale: 1.1, rotate: 90 }}
						whileTap={{ scale: 0.9 }}
						onClick={onCouponRemoved}
						className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors flex-shrink-0"
						aria-label={isArabic ? "إزالة الكوبون" : "Remove coupon"}
					>
						<X className="w-5 h-5" />
					</motion.button>
				</motion.div>
			) : (
				<div className="space-y-3">
					<div className={`flex gap-2`}>
						<div className="flex-1 relative">
							<Tag className={`absolute ${isArabic ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 z-10`} />
							<motion.input
								type="text"
								value={couponCode}
								onChange={(e) => handleInputChange(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !isValidating) {
										handleApply();
									}
								}}
								placeholder={isArabic ? "أدخل رمز الكوبون" : "Enter coupon code"}
								className={`w-full px-4 ${isArabic ? "pr-10" : "pl-10"} py-3 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
									validationState === "valid"
										? "border-emerald-500 dark:border-emerald-500 focus:ring-emerald-500/20"
										: validationState === "invalid"
										? "border-red-300 dark:border-red-700 focus:ring-red-500/20"
										: "border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20"
								} ${isArabic ? "text-right" : "text-left"}`}
								dir={isArabic ? "rtl" : "ltr"}
								disabled={isValidating}
							/>
							{isValidating && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className={`absolute ${isArabic ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
								>
									<Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
								</motion.div>
							)}
							{validationState === "valid" && !isValidating && (
								<motion.div
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className={`absolute ${isArabic ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
								>
									<Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
								</motion.div>
							)}
							{validationState === "invalid" && !isValidating && (
								<motion.div
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									className={`absolute ${isArabic ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
								>
									<AlertCircle className="w-5 h-5 text-red-500" />
								</motion.div>
							)}
						</div>
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleApply}
							disabled={isValidating || !couponCode.trim()}
							className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
						>
							{isValidating ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Tag className="w-4 h-4" />
							)}
							<span>{isArabic ? "تطبيق" : "Apply"}</span>
						</motion.button>
					</div>

					<AnimatePresence>
						{error && (
							<motion.p
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className={`text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2 ${isArabic ? "text-right flex-row-reverse" : "text-left"}`}
							>
								<AlertCircle className="w-4 h-4 flex-shrink-0" />
								{error}
							</motion.p>
						)}
					</AnimatePresence>

					{/* Hint */}
					<p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
						<Sparkles className="w-3 h-3" />
						<span>{isArabic ? "جرب: SAVE10, FIXED20, أو WELCOME15" : "Try: SAVE10, FIXED20, or WELCOME15"}</span>
					</p>
				</div>
			)}
		</motion.div>
	);
}
