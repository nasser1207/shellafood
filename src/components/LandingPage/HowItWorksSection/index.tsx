"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Package } from "lucide-react";

export default function HowItWorksSection() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const steps = [
		{
			number: "01",
			icon: Search,
			title: isArabic ? "اختر" : "Choose",
			color: "from-green-500 to-emerald-500",
		},
		{
			number: "02",
			icon: ShoppingCart,
			title: isArabic ? "اطلب" : "Order",
			color: "from-blue-500 to-cyan-500",
		},
		{
			number: "03",
			icon: Package,
			title: isArabic ? "استلم" : "Receive",
			color: "from-purple-500 to-pink-500",
		},
	];

	return (
		<section
			className="py-16 sm:py-24 md:py-32 bg-white dark:bg-gray-900 w-full overflow-x-hidden"
			aria-labelledby="how-it-works-heading"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12 sm:mb-16 md:mb-20"
				>
					<h2
						id="how-it-works-heading"
						className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6"
					>
						<span className="text-gray-900 dark:text-white">
							{isArabic ? "كيف " : "How "}
						</span>
						<span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
							{isArabic ? "يعمل؟" : "It Works?"}
						</span>
					</h2>
				</motion.div>

				<div className="grid sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
					{steps.map((step, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: i * 0.2 }}
							className="text-center"
						>
							<div
								className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}
							>
								<span className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
									{step.number}
								</span>
							</div>
							<div
								className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
							>
								<step.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
							</div>
							<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
								{step.title}
							</h3>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

