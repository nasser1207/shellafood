"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, MapPin, CreditCard, CheckCircle } from "lucide-react";

const steps = [
	{
		icon: Search,
		title: "اختر ما تريد",
		titleEn: "Choose What You Want",
		description: "تصفح المتاجر والمطاعم واختر منتجاتك المفضلة",
		descriptionEn: "Browse stores and restaurants and choose your favorite products",
	},
	{
		icon: MapPin,
		title: "حدد موقعك",
		titleEn: "Set Your Location",
		description: "أدخل عنوان التوصيل أو استخدم موقعك الحالي",
		descriptionEn: "Enter delivery address or use your current location",
	},
	{
		icon: CreditCard,
		title: "ادفع بأمان",
		titleEn: "Pay Securely",
		description: "اختر طريقة الدفع المناسبة وأكمل طلبك",
		descriptionEn: "Choose your payment method and complete your order",
	},
];

export default function HowItWorks() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section className="py-20 bg-gray-50 dark:bg-gray-900">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 ${isArabic ? "text-right" : "text-left"}`}
				>
					{isArabic ? "اطلب في 3 خطوات بسيطة" : "Order in 3 Simple Steps"}
				</motion.h2>

				<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{steps.map((step, index) => {
						const Icon = step.icon;
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.2 }}
								className="text-center"
							>
								<motion.div
									whileHover={{ scale: 1.1, rotate: 360 }}
									transition={{ duration: 0.6 }}
									className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
								>
									<Icon className="w-10 h-10 text-white" />
								</motion.div>
								<div className="mb-4">
									<span className="text-3xl font-bold text-gray-400 dark:text-gray-600">{index + 1}</span>
								</div>
								<h3 className={`text-xl font-bold mb-2 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? step.title : step.titleEn}
								</h3>
								<p className={`text-gray-600 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? step.description : step.descriptionEn}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

