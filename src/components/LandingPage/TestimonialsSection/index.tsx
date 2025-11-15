"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
	name: string;
	role: string;
	quote: string;
}

export default function TestimonialsSection() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const testimonials: Testimonial[] = [
		{
			name: isArabic ? "أحمد محمد" : "Ahmed Mohammed",
			role: isArabic ? "عميل" : "Customer",
			quote: isArabic
				? "خدمة رائعة! التوصيل سريع والطعام طازج دائماً. أنصح الجميع بتجربة شلة."
				: "Excellent service! Fast delivery and always fresh food. I recommend everyone to try Shella.",
		},
		{
			name: isArabic ? "فاطمة علي" : "Fatima Ali",
			role: isArabic ? "عميلة" : "Customer",
			quote: isArabic
				? "أفضل تطبيق توصيل في المنطقة. سهولة الاستخدام والدفع آمن جداً."
				: "Best delivery app in the region. Easy to use and very secure payment.",
		},
		{
			name: isArabic ? "خالد سعيد" : "Khalid Saeed",
			role: isArabic ? "شريك" : "Partner",
			quote: isArabic
				? "منصة ممتازة للشراكة. زادت مبيعاتنا بشكل كبير بعد الانضمام إلى شلة."
				: "Excellent platform for partnership. Our sales increased significantly after joining Shella.",
		},
		{
			name: isArabic ? "سارة أحمد" : "Sara Ahmed",
			role: isArabic ? "عميلة" : "Customer",
			quote: isArabic
				? "التطبيق سهل الاستخدام والتتبع المباشر ممتاز. شكراً شلة!"
				: "The app is easy to use and live tracking is excellent. Thanks Shella!",
		},
		{
			name: isArabic ? "محمد حسن" : "Mohammed Hassan",
			role: isArabic ? "سائق" : "Driver",
			quote: isArabic
				? "عمل ممتاز ومرن. الأرباح جيدة والدعم الفني متاح دائماً."
				: "Excellent and flexible work. Good earnings and technical support is always available.",
		},
	];

	return (
		<section
			className="py-16 sm:py-24 md:py-32 bg-gray-50 dark:bg-gray-800 w-full overflow-x-hidden"
			aria-labelledby="testimonials-heading"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12 sm:mb-16"
				>
					<h2
						id="testimonials-heading"
						className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4"
					>
						<span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
							{isArabic ? "ماذا يقول عملاؤنا" : "Customer Reviews"}
						</span>
					</h2>
				</motion.div>

				<Swiper
					modules={[Autoplay, Pagination]}
					spaceBetween={20}
					slidesPerView={1}
					breakpoints={{
						640: { slidesPerView: 2, spaceBetween: 24 },
						1024: { slidesPerView: 3, spaceBetween: 30 },
					}}
					autoplay={{ delay: 4000, disableOnInteraction: false }}
					pagination={{ clickable: true, dynamicBullets: true }}
					className="pb-12 [&_.swiper-pagination-bullet]:bg-green-600 [&_.swiper-pagination-bullet-active]:bg-green-600"
				>
					{testimonials.map((testimonial, i) => (
						<SwiperSlide key={i}>
							<div className="p-5 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg h-full flex flex-col">
								<div className="flex gap-1 mb-3 sm:mb-4">
									{[...Array(5)].map((_, j) => (
										<Star
											key={j}
											className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
										/>
									))}
								</div>
								<p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 italic flex-grow">
									"{testimonial.quote}"
								</p>
								<div className="flex items-center gap-3 sm:gap-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
										{testimonial.name.charAt(0)}
									</div>
									<div className="min-w-0">
										<p className="font-bold text-sm sm:text-base text-gray-900 dark:text-white truncate">
											{testimonial.name}
										</p>
										<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
											{testimonial.role}
										</p>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
}

