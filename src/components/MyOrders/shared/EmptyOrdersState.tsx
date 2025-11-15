"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Wrench, Truck, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface EmptyOrdersStateProps {
	type: "products" | "services" | "delivery";
}

const emptyStateConfig = {
	products: {
		icon: ShoppingBag,
		title: { en: "No Orders Yet", ar: "لا توجد طلبات بعد" },
		description: {
			en: "Start shopping and your orders will appear here",
			ar: "ابدأ التسوق وستظهر طلباتك هنا",
		},
		cta: { en: "Browse Stores", ar: "تصفح المتاجر" },
		href: "/categories",
		gradient: "from-green-500 to-emerald-500",
	},
	services: {
		icon: Wrench,
		title: { en: "No Service Requests", ar: "لا توجد طلبات خدمات" },
		description: {
			en: "Book a service and track it here",
			ar: "احجز خدمة وتابعها هنا",
		},
		cta: { en: "Browse Services", ar: "تصفح الخدمات" },
		href: "/serve-me",
		gradient: "from-blue-500 to-cyan-500",
	},
	delivery: {
		icon: Truck,
		title: { en: "No Delivery Orders", ar: "لا توجد طلبات توصيل" },
		description: {
			en: "Create a delivery order to get started",
			ar: "أنشئ طلب توصيل للبدء",
		},
		cta: { en: "Create Order", ar: "إنشاء طلب" },
		href: "/pickandorder",
		gradient: "from-purple-500 to-pink-500",
	},
};

export function EmptyOrdersState({ type }: EmptyOrdersStateProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

	const config = emptyStateConfig[type];

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4 }}
			className="flex flex-col items-center justify-center py-16 px-4"
		>
			{/* Animated Icon */}
			<motion.div
				animate={{
					y: [0, -10, 0],
					rotate: [0, 5, -5, 0],
				}}
				transition={{
					repeat: Infinity,
					duration: 3,
					ease: "easeInOut",
				}}
				className={`w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-8 shadow-2xl`}
			>
				<config.icon className="w-16 h-16 text-white" />
			</motion.div>

			{/* Title */}
			<h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 text-center">
				{isArabic ? config.title.ar : config.title.en}
			</h3>

			{/* Description */}
			<p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
				{isArabic ? config.description.ar : config.description.en}
			</p>

			{/* CTA Button */}
			<Link
				href={config.href}
				className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${config.gradient} text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all ${isArabic ? "flex-row-reverse" : ""}`}
			>
				<span>{isArabic ? config.cta.ar : config.cta.en}</span>
				<ArrowIcon className="w-5 h-5" />
			</Link>

			{/* Decorative Elements */}
			<div className="mt-12 flex gap-4">
				{[...Array(3)].map((_, i) => (
					<motion.div
						key={i}
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.3, 0.6, 0.3],
						}}
						transition={{
							repeat: Infinity,
							duration: 2,
							delay: i * 0.3,
						}}
						className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.gradient}`}
					/>
				))}
			</div>
		</motion.div>
	);
}

