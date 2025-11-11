"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PromotionalBanner() {
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<motion.section
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, delay: 0.3 }}
			className="mb-16 sm:mb-20"
		>
			<Link
				href="/offers"
				prefetch={true}
				onMouseEnter={() => router.prefetch("/offers")}
				className="group relative block overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl"
			>
				<div className="relative h-[200px] w-full overflow-hidden sm:h-[280px] md:h-[350px] lg:h-[400px]">
					<Image
						src="/ramadan.png"
						alt={isArabic ? "مع شلة كل احتياجاتك بضغطة زر" : "With Shilla, all your needs at the click of a button"}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
						className="object-cover transition-transform duration-700 group-hover:scale-110"
						priority
					/>
					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
					
					{/* Content Overlay */}
					<div className={`absolute inset-0 flex items-end ${isArabic ? "justify-end pr-8 pb-8" : "justify-start pl-8 pb-8"}`}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className={`max-w-2xl ${isArabic ? "text-right" : "text-left"}`}
						>
							<h3 className="text-2xl font-black text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
								{isArabic ? "مع شلة كل احتياجاتك بضغطة زر" : "With Shilla, All Your Needs at the Click of a Button"}
							</h3>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.7 }}
								className={`mt-4 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}
							>
								<span className="text-sm font-semibold text-white sm:text-base">
									{isArabic ? "اكتشف العروض الآن" : "Discover Offers Now"}
								</span>
								{isArabic ? (
									<ArrowLeft className="h-4 w-4 text-white transition-transform group-hover:-translate-x-1" />
								) : (
									<ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
								)}
							</motion.div>
						</motion.div>
					</div>
				</div>
			</Link>
		</motion.section>
	);
}

