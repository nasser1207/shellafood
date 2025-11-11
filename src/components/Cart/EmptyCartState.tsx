"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Package, Wrench, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyCartStateProps {
	language: "en" | "ar";
}

export default function EmptyCartState({ language }: EmptyCartStateProps) {
	const isArabic = language === "ar";
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center px-4 py-12">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-md w-full text-center"
			>
				{/* Animated Cart Icon */}
				<motion.div
					initial={{ scale: 0, rotate: -180 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
					className="relative mb-8 mx-auto"
				>
					<div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 flex items-center justify-center shadow-lg">
						<motion.div
							animate={{ 
								y: [0, -10, 0],
								rotate: [0, 5, -5, 0]
							}}
							transition={{ 
								duration: 2, 
								repeat: Infinity, 
								repeatDelay: 1,
								ease: "easeInOut"
							}}
						>
							<ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-600 dark:text-emerald-400" />
						</motion.div>
					</div>
					{/* Floating sparkles */}
					{[...Array(6)].map((_, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, scale: 0 }}
							animate={{ 
								opacity: [0, 1, 0],
								scale: [0, 1, 0],
								x: Math.cos((i * Math.PI * 2) / 6) * 60,
								y: Math.sin((i * Math.PI * 2) / 6) * 60,
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								delay: i * 0.2,
								ease: "easeInOut"
							}}
							className="absolute top-1/2 left-1/2"
						>
							<Sparkles className="w-4 h-4 text-emerald-400" />
						</motion.div>
					))}
				</motion.div>

				{/* Title */}
				<motion.h2
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
					className={`text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 ${isArabic ? "text-right" : "text-left"}`}
				>
					{isArabic ? "سلة التسوق فارغة" : "Your Cart is Empty"}
				</motion.h2>

				{/* Description */}
				<motion.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.4 }}
					className={`text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed ${isArabic ? "text-right" : "text-left"}`}
				>
					{isArabic
						? "ابدأ إضافة المنتجات والخدمات إلى سلة التسوق الخاصة بك لتجربة تسوق رائعة"
						: "Start adding products and services to your cart for an amazing shopping experience"}
				</motion.p>

				{/* CTA Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.4 }}
					className={`flex flex-col sm:flex-row gap-4 justify-center`}
				>
					<motion.button
						whileHover={{ scale: 1.05, y: -2 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {
							router.push("/categories");
						}}
						className={`flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all ${isArabic ? "flex-row-reverse" : ""}`}
					>
						<Package className="w-5 h-5" />
						<span>{isArabic ? "استكشف المنتجات" : "Explore Products"}</span>
						<ArrowRight className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.05, y: -2 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => router.push("/serve-me")}
						className={`flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold text-base hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all shadow-md hover:shadow-lg ${isArabic ? "flex-row-reverse" : ""}`}
					>
						<Wrench className="w-5 h-5" />
						<span>{isArabic ? "استكشف الخدمات" : "Explore Services"}</span>
						<ArrowRight className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
					</motion.button>
				</motion.div>

				{/* Decorative elements */}
				<div className="mt-12 flex items-center justify-center gap-2">
					{[...Array(3)].map((_, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
							className="w-2 h-2 rounded-full bg-emerald-400"
						/>
					))}
				</div>
			</motion.div>
		</div>
	);
}
