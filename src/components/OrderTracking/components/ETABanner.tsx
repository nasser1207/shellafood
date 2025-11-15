"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navigation, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatETA } from "@/lib/utils/etaCalculation";
import { DriverOrWorker, OrderType, ORDER_TYPE } from "../types";
import { getWorkerTypeLabel, getETALabel } from "../utils/orderStatus";

interface ETABannerProps {
	etaMinutes: number | null;
	driverOrWorker?: DriverOrWorker;
	language: "en" | "ar";
	onViewDetails?: () => void;
	orderType: OrderType;
}

export default React.memo(function ETABanner({
	etaMinutes,
	driverOrWorker,
	language,
	onViewDetails,
	orderType,
}: ETABannerProps) {
	const isArabic = language === "ar";
	const router = useRouter();
	const formattedETA = etaMinutes !== null ? formatETA(etaMinutes, language) : null;
	const workerTypeLabel = getWorkerTypeLabel(orderType, language);
	const etaLabel = getETALabel(orderType, language);

	// Hide banner if no ETA or driver/worker not assigned yet
	if (!etaMinutes || etaMinutes <= 0 || !driverOrWorker) return null;

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
			<div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 dark:from-green-600 dark:via-emerald-600 dark:to-teal-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white overflow-hidden">
				{/* Decorative Elements */}
				<div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 dark:bg-white/5 rounded-full -mr-16 -mt-16 sm:-mr-32 sm:-mt-32" />
				<div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 dark:bg-white/5 rounded-full -ml-12 -mb-12 sm:-ml-24 sm:-mb-24" />

				<div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className={`flex items-center gap-3 sm:gap-4 ${isArabic ? "flex-row-reverse" : ""}`}>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
							className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
						>
							<Navigation className="w-6 h-6 sm:w-8 sm:h-8" />
						</motion.div>
						<div className="flex-1 min-w-0">
							<p className="text-xs sm:text-sm opacity-90 mb-0.5 sm:mb-1 font-medium">
								{etaLabel}
							</p>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold truncate">
								{formattedETA || (isArabic ? "جاري الحساب..." : "Calculating...")}
							</h2>
							{etaMinutes <= 5 && (
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-xs opacity-90 mt-1 font-semibold animate-pulse"
								>
									{isArabic
										? orderType === ORDER_TYPE.SERVICE
											? "الفني قريب!"
											: "السائق قريب!"
										: orderType === ORDER_TYPE.SERVICE
											? "Technician nearby!"
											: "Driver nearby!"}
								</motion.p>
							)}
						</div>
					</div>
					{driverOrWorker?.name && (
						<div
							className={`flex items-center gap-2 sm:gap-3 ${isArabic ? "flex-row-reverse" : ""} ${
								canViewDetails
									? "cursor-pointer hover:opacity-90 transition-opacity"
									: "cursor-default"
							}`}
							onClick={canViewDetails ? handleViewDetails : undefined}
							title={canViewDetails ? (isArabic ? "انقر لعرض التفاصيل" : "Click to view details") : undefined}
						>
							{driverOrWorker.photo ? (
								<div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0">
									<Image
										src={driverOrWorker.photo}
										alt={driverOrWorker.name}
										fill
										className="object-cover"
										sizes="48px"
									/>
								</div>
							) : (
								<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 flex-shrink-0">
									<User className="w-5 h-5 sm:w-6 sm:h-6" />
								</div>
							)}
							<div className={`min-w-0 ${isArabic ? "text-right" : "text-left"}`}>
								<p className="text-xs opacity-80 font-medium">{workerTypeLabel}</p>
								<p className="font-bold text-sm sm:text-base truncate">{driverOrWorker.name}</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
});

