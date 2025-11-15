"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
	{
		name: "أحمد محمد",
		nameEn: "Ahmed Mohammed",
		rating: 5,
		text: "خدمة رائعة وتوصيل سريع جداً. أنصح الجميع بتجربة شلة فود",
		textEn: "Excellent service and very fast delivery. I recommend everyone to try Shella Food",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
	},
	{
		name: "فاطمة علي",
		nameEn: "Fatima Ali",
		rating: 5,
		text: "أفضل تطبيق توصيل استخدمته. الأسعار معقولة والجودة ممتازة",
		textEn: "Best delivery app I've used. Reasonable prices and excellent quality",
		image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
	},
	{
		name: "خالد سعيد",
		nameEn: "Khalid Saeed",
		rating: 5,
		text: "تطبيق سهل الاستخدام وخدمة عملاء ممتازة. شكراً لكم",
		textEn: "Easy to use app and excellent customer service. Thank you",
		image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
	},
];

export default function Testimonials() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section className="py-20 bg-white dark:bg-gray-800">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className={`text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 ${isArabic ? "text-right" : "text-left"}`}
				>
					{isArabic ? "ماذا يقول عملاؤنا" : "What Our Customers Say"}
				</motion.h2>

				<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.2 }}
							whileHover={{ y: -8 }}
							className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all"
						>
							{/* Quote Icon */}
							<div className="mb-4">
								<Quote className="w-8 h-8 text-green-500 dark:text-green-400" />
							</div>

							{/* Rating */}
							<div className="flex items-center gap-1 mb-4">
								{[...Array(testimonial.rating)].map((_, i) => (
									<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
								))}
							</div>

							{/* Text */}
							<p className={`text-gray-700 dark:text-gray-300 mb-6 ${isArabic ? "text-right" : "text-left"}`}>
								{isArabic ? testimonial.text : testimonial.textEn}
							</p>

							{/* Author */}
							<div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
								<div className="relative w-12 h-12 rounded-full overflow-hidden">
									<Image
										src={testimonial.image}
										alt={isArabic ? testimonial.name : testimonial.nameEn}
										fill
										className="object-cover"
										unoptimized
									/>
								</div>
								<div>
									<p className="font-semibold text-gray-900 dark:text-gray-100">
										{isArabic ? testimonial.name : testimonial.nameEn}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{isArabic ? "عميل موثوق" : "Verified Customer"}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

