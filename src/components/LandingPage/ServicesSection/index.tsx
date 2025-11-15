"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
	BriefcaseBusiness,
	Store,
	Truck,
	UsersRound,
	ArrowRight,
	Sparkles,
	ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ServiceCard from "./ServiceCard";
import FeaturedQaydha from "./FeaturedQaydha";

export default function ServicesSection() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<section
			className="py-16 sm:py-24 md:py-32 bg-white dark:bg-gray-900 w-full overflow-x-hidden"
			aria-labelledby="services-heading"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-x-hidden">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-12 sm:mb-16 md:mb-20"
				>
					<h2
						id="services-heading"
						className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6"
					>
						<span className="text-gray-900 dark:text-white">
							{isArabic ? "انضم إلى " : "Join Our "}
						</span>
						<span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
							{isArabic ? "شبكة شلة" : "Shella Network"}
						</span>
					</h2>
				</motion.div>

				{/* Featured Qaydha - Large Hero Card */}
				<FeaturedQaydha />

				{/* Services Grid */}
				<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{[
						{
							title: t("landing.tiles.partner.title"),
							desc: t("landing.tiles.partner.desc"),
							Icon: Store,
							href: "/partner",
							gradient: "from-green-500 to-emerald-500",
						},
						{
							title: t("landing.tiles.driver.title"),
							desc: t("landing.tiles.driver.desc"),
							Icon: Truck,
							href: "/driver",
							gradient: "from-blue-500 to-cyan-500",
						},
						{
							title: t("landing.tiles.investor.title"),
							desc: t("landing.tiles.investor.desc"),
							Icon: UsersRound,
							href: "/investor",
							gradient: "from-purple-500 to-pink-500",
						},
						{
							title: t("landing.tiles.worker.title"),
							desc: t("landing.tiles.worker.desc"),
							Icon: BriefcaseBusiness,
							href: "/worker",
							gradient: "from-orange-500 to-amber-500",
						},
					].map((service, i) => (
						<ServiceCard key={i} {...service} index={i} />
					))}
				</div>
			</div>
		</section>
	);
}

