"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Headphones } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section
			className="py-16 sm:py-24 md:py-32 bg-gradient-to-br from-green-600 to-emerald-600 relative overflow-hidden w-full"
			aria-labelledby="cta-heading"
		>
			<div className="absolute inset-0 opacity-10 overflow-hidden">
				<div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl" />
			</div>

			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center w-full overflow-x-hidden">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<h2
						id="cta-heading"
						className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6"
					>
						{isArabic ? "جاهز للبدء؟" : "Ready to Get Started?"}
					</h2>
					<p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
						{isArabic
							? "انضم إلى آلاف العملاء السعداء واحصل على توصيل سريع وموثوق"
							: "Join thousands of happy customers and get fast, reliable delivery"}
					</p>

					<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12">
						<Link
							href="/home"
							className="px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-white text-green-600 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all flex items-center justify-center gap-2 min-h-[44px]"
							aria-label={isArabic ? "ابدأ الآن" : "Get Started Now"}
						>
							<span className="whitespace-nowrap">{isArabic ? "ابدأ الآن" : "Get Started Now"}</span>
							<ArrowRight
								className={`w-4 h-4 sm:w-5 sm:h-5 ${isArabic ? "rotate-180" : ""}`}
							/>
						</Link>
						<Link
							href="/profile/support"
							className="px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-transparent border-2 border-white text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-white hover:text-green-600 transition-all min-h-[44px] flex items-center justify-center"
							aria-label={isArabic ? "تواصل معنا" : "Contact Us"}
						>
							<span className="whitespace-nowrap">{isArabic ? "تواصل معنا" : "Contact Us"}</span>
						</Link>
					</div>

					<div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-white/80 text-sm sm:text-base">
						<div className="flex items-center gap-2">
							<Shield className="w-4 h-4 sm:w-5 sm:h-5" />
							<span>{isArabic ? "آمن 100%" : "100% Secure"}</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 sm:w-5 sm:h-5" />
							<span>{isArabic ? "توصيل سريع" : "Fast Delivery"}</span>
						</div>
						<div className="flex items-center gap-2">
							<Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
							<span>{isArabic ? "دعم 24/7" : "24/7 Support"}</span>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

