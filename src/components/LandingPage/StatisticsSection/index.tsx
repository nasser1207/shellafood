"use client";
import { motion } from "framer-motion";
import { Package, Users, Store, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedCounter from "../shared/AnimatedCounter";

interface Stat {
	icon: typeof Package;
	value: number;
	label: string;
	suffix?: string;
}

export default function StatisticsSection() {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	const stats: Stat[] = [
		{
			icon: Package,
			value: 2000000,
			label: isArabic ? "طلب مكتمل" : "Orders Completed",
		},
		{
			icon: Users,
			value: 50000,
			label: isArabic ? "مستخدم نشط" : "Active Users",
		},
		{
			icon: Store,
			value: 1000,
			label: isArabic ? "شريك" : "Partners",
		},
		{
			icon: Star,
			value: 4.8,
			label: isArabic ? "تقييم" : "Rating",
			suffix: "/5",
		},
	];

	return (
		<section
			className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-green-600 to-emerald-600 relative overflow-hidden w-full"
			aria-label="Statistics"
		>
			<div className="absolute inset-0 opacity-10 overflow-hidden">
				<div className="absolute inset-0" style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
				}} />
			</div>

			<div className="relative container mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
					{stats.map((stat, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: i * 0.1 }}
							className="text-center"
						>
							<div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
								<stat.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
							</div>
							<div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1 sm:mb-2">
								{stat.suffix ? (
									<>
										<AnimatedCounter end={stat.value} decimals={1} />
										{stat.suffix}
									</>
								) : stat.value >= 1000000 ? (
									<>
										<AnimatedCounter end={stat.value / 1000000} decimals={1} />
										M+
									</>
								) : stat.value >= 1000 ? (
									<>
										<AnimatedCounter end={stat.value / 1000} decimals={0} />
										K+
									</>
								) : (
									<>
										<AnimatedCounter end={stat.value} />
										+
									</>
								)}
							</div>
							<p className="text-xs sm:text-sm md:text-base text-white/90 font-semibold px-2">{stat.label}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

