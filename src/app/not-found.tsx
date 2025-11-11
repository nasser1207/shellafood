"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, Search, ArrowRight, ArrowLeft } from "lucide-react";

/**
 * Custom 404 Not Found Page
 * Displays when a page is not found
 * Supports RTL/LTR with beautiful design
 */
export default function NotFound() {
	const { language, t } = useLanguage();
	const isArabic = language === "ar";

	return (
		<div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			<div className="max-w-2xl w-full text-center">
				{/* 404 Number */}
				<div className="mb-8">
					<h1 className="text-9xl sm:text-[12rem] font-bold text-gray-200 select-none">
						404
					</h1>
				</div>

				{/* Error Icon */}
				<div className="mb-6 flex justify-center">
					<div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
						<Search className="w-12 h-12 text-red-500" />
					</div>
				</div>

				{/* Title */}
				<h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
					{isArabic ? "عذراً، الصفحة غير موجودة!" : "Oops! Page Not Found"}
				</h2>

				{/* Description */}
				<p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
					{isArabic 
						? "الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية."
						: "The page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage."
					}
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					{/* Home Button */}
					<Link
						href="/"
						className="group inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
					>
						<Home className="w-5 h-5" />
						<span>{isArabic ? "العودة للرئيسية" : "Go to Homepage"}</span>
						{isArabic ? (
							<ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						) : (
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						)}
					</Link>

					{/* Services Button */}
					<Link
						href="/serve-me"
						className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-200 border-2 border-gray-300 hover:border-green-600"
					>
						<span>{isArabic ? "تصفح الخدمات" : "Browse Services"}</span>
						{isArabic ? (
							<ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						) : (
							<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						)}
					</Link>
				</div>

				{/* Helpful Links */}
				<div className="mt-12 pt-8 border-t border-gray-200">
					<p className="text-sm text-gray-500 mb-4">
						{isArabic ? "روابط مفيدة:" : "Helpful links:"}
					</p>
					<div className="flex flex-wrap justify-center gap-4 text-sm">
						<Link
							href="/home"
							className="text-green-600 hover:text-green-700 hover:underline"
						>
							{isArabic ? "الصفحة الرئيسية" : "Home"}
						</Link>
						<span className="text-gray-300">•</span>
						<Link
							href="/serve-me"
							className="text-green-600 hover:text-green-700 hover:underline"
						>
							{isArabic ? "اخدمني" : "Serve Me"}
						</Link>
						<span className="text-gray-300">•</span>
						<Link
							href="/partner"
							className="text-green-600 hover:text-green-700 hover:underline"
						>
							{isArabic ? "شريك تاجر" : "Partner"}
						</Link>
						<span className="text-gray-300">•</span>
						<Link
							href="/driver"
							className="text-green-600 hover:text-green-700 hover:underline"
						>
							{isArabic ? "مندوب توصيل" : "Driver"}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

