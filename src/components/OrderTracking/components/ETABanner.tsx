"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatETA } from "@/lib/utils/etaCalculation";
import { DriverOrWorker } from "../types";

interface ETABannerProps {
	etaMinutes: number | null;
	driverOrWorker?: DriverOrWorker;
	language: "en" | "ar";
	onViewDetails?: () => void;
}

export default React.memo(function ETABanner({
	etaMinutes,
	driverOrWorker,
	language,
	onViewDetails,
}: ETABannerProps) {
	const isArabic = language === "ar";
	const router = useRouter();
	const formattedETA = etaMinutes !== null ? formatETA(etaMinutes, language) : null;

	if (!etaMinutes || etaMinutes <= 0) return null;

	// Handle view worker details
	const handleViewDetails = () => {
		if (onViewDetails) {
			onViewDetails();
		} else if (driverOrWorker?.id) {
			// Route: /worker/[workerId]
			const detailsPath = `/worker/${driverOrWorker.id}`;
			router.push(detailsPath);
		}
	};

	const canViewDetails =
		onViewDetails || driverOrWorker?.id;

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="mb-6"
		>
			<div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 dark:from-green-600 dark:via-emerald-600 dark:to-teal-600 rounded-2xl shadow-xl p-6 text-white overflow-hidden">
				{/* Decorative Elements */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full -mr-32 -mt-32" />
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 dark:bg-white/5 rounded-full -ml-24 -mb-24" />

				<div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
					<div className={`flex items-center gap-4 ${isArabic ? "flex-row-reverse" : ""}`}>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
							className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
						>
							<Navigation className="w-8 h-8" />
						</motion.div>
						<div>
							<p className="text-sm opacity-90 mb-1 font-medium">
								{isArabic ? "الوصول المتوقع" : "Estimated Arrival"}
							</p>
							<h2 className="text-3xl sm:text-4xl font-extrabold">
								{formattedETA || (isArabic ? "جاري الحساب..." : "Calculating...")}
							</h2>
							{etaMinutes <= 5 && (
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-xs opacity-90 mt-1 font-semibold animate-pulse"
								>
									{isArabic ? "الفني قريب!" : "Technician nearby!"}
								</motion.p>
							)}
						</div>
					</div>
					{driverOrWorker?.name && (
						<div
							className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""} ${
								canViewDetails
									? "cursor-pointer hover:opacity-90 transition-opacity"
									: "cursor-default"
							}`}
							onClick={canViewDetails ? handleViewDetails : undefined}
							title={canViewDetails ? (isArabic ? "انقر لعرض التفاصيل" : "Click to view details") : undefined}
						>
							{driverOrWorker.photo ? (
								<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
									<Image
										src={driverOrWorker.photo}
										alt={driverOrWorker.name}
										fill
										className="object-cover"
										sizes="48px"
									/>
								</div>
							) : (
								<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
									<User className="w-6 h-6" />
								</div>
							)}
							<div className={`${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-xs opacity-80 font-medium">{isArabic ? "الفني" : "Driver"}</p>
								<p className="font-bold text-base">{driverOrWorker.name}</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
});

