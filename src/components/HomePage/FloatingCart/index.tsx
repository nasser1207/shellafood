"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface FloatingCartProps {
	cartCount: number;
}

export default function FloatingCart({ cartCount }: FloatingCartProps) {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	if (cartCount === 0) return null;

	return (
		<AnimatePresence>
			<motion.button
				initial={{ opacity: 0, scale: 0, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0, y: 20 }}
				whileHover={{ scale: 1.1, rotate: 5 }}
				whileTap={{ scale: 0.9 }}
				onClick={() => router.push("/cart")}
				className={`fixed bottom-6 z-50 ${isArabic ? "left-6" : "right-6"}`}
				aria-label={isArabic ? "عرض السلة" : "View Cart"}
			>
				<div className="relative">
					{/* Pulsing ring */}
					<motion.div
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.75, 0, 0.75],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="absolute inset-0 bg-green-500 rounded-full"
					/>

					{/* Main button */}
					<div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full shadow-2xl ring-4 ring-white/50 dark:ring-gray-900/50">
						<ShoppingCart className="w-6 h-6 text-white" />

						{/* Animated badge */}
						<motion.div
							key={cartCount}
							initial={{ scale: 0, rotate: -180 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{
								type: "spring",
								stiffness: 500,
								damping: 15,
							}}
							className="absolute -top-2 -right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
						>
							{cartCount > 99 ? "99+" : cartCount}
						</motion.div>
					</div>
				</div>
			</motion.button>
		</AnimatePresence>
	);
}

