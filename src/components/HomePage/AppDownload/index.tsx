"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Smartphone, Download, QrCode } from "lucide-react";
import Image from "next/image";

export default function AppDownload() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
					{/* Content */}
					<motion.div
						initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className={`${isArabic ? "md:order-2" : ""}`}
					>
						<h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "حمّل تطبيقنا الآن" : "Download Our App Now"}
						</h2>
						<p className={`text-lg text-gray-600 dark:text-gray-400 mb-8 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic
								? "احصل على تجربة أفضل مع تطبيقنا. طلبات أسرع، عروض حصرية، وتتبع مباشر للطلبات"
								: "Get a better experience with our app. Faster orders, exclusive offers, and real-time order tracking"}
						</p>

						{/* Download Buttons */}
						<div className={`flex flex-col sm:flex-row gap-4 ${isArabic ? "items-end" : "items-start"}`}>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
							>
								<Download className="w-5 h-5" />
								<div className="text-left">
									<div className="text-xs">Download on the</div>
									<div className="text-lg">App Store</div>
								</div>
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
							>
								<Download className="w-5 h-5" />
								<div className="text-left">
									<div className="text-xs">Get it on</div>
									<div className="text-lg">Google Play</div>
								</div>
							</motion.button>
						</div>
					</motion.div>

					{/* Phone Mockup */}
					<motion.div
						initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className={`relative ${isArabic ? "md:order-1" : ""}`}
					>
						<div className="relative w-full max-w-sm mx-auto">
							{/* Phone Frame */}
							<div className="relative bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
								<div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden aspect-[9/19.5]">
									{/* Placeholder for app screenshot */}
									<div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
										<Smartphone className="w-24 h-24 text-white/50" />
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

