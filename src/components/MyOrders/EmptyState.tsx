"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package, Wrench, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
	type: "products" | "services";
	language: "en" | "ar";
}

export default function EmptyState({ type, language }: EmptyStateProps) {
	const isArabic = language === "ar";
	const Icon = type === "products" ? ShoppingBag : Wrench;
	const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

	const translations = {
		products: {
			titleEn: "You have no orders yet.",
			titleAr: "لا توجد طلبات حالياً.",
			subtitleEn: "Start shopping to see your product orders here.",
			subtitleAr: "ابدأ التسوق لرؤية طلبات المنتجات هنا.",
			ctaEn: "Browse Products",
			ctaAr: "تصفح المنتجات",
			link: "/categories",
		},
		services: {
			titleEn: "No service requests yet.",
			titleAr: "لا توجد طلبات خدمات حتى الآن.",
			subtitleEn: "Book a service to see your requests here.",
			subtitleAr: "احجز خدمة لرؤية طلباتك هنا.",
			ctaEn: "Explore Services",
			ctaAr: "استكشف الخدمات",
			link: "/serve-me",
		},
	};

	const t = translations[type];

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5 }}
			className={`flex flex-col items-center justify-center py-16 sm:py-20 px-4 ${isArabic ? "text-right" : "text-left"}`}
		>
			{/* Illustration */}
			<motion.div
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
				className="relative mb-8"
			>
				<div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-3xl opacity-50"></div>
				<div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shadow-lg border-2 border-green-100">
					<Icon className="w-16 h-16 sm:w-20 sm:h-20 text-green-600" />
				</div>
			</motion.div>

			{/* Title */}
			<motion.h3
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center"
			>
				{isArabic ? t.titleAr : t.titleEn}
			</motion.h3>

			{/* Subtitle */}
			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="text-sm sm:text-base text-gray-600 text-center max-w-md mb-8"
			>
				{isArabic ? t.subtitleAr : t.subtitleEn}
			</motion.p>

			{/* CTA Button */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
			>
				<Link
					href={t.link}
					className={`inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all ${isArabic ? "flex-row-reverse" : ""}`}
				>
					<span>{isArabic ? t.ctaAr : t.ctaEn}</span>
					<ArrowIcon className="w-5 h-5" />
				</Link>
			</motion.div>
		</motion.div>
	);
}
