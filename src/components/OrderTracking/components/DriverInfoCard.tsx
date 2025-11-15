"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DriverOrWorker, OrderType, ORDER_TYPE } from "../types";
import { getWorkerTypeLabel } from "../utils/orderStatus";

interface DriverInfoCardProps {
	driverOrWorker?: DriverOrWorker;
	language: "en" | "ar";
	onCall?: () => void;
	onChat?: () => void;
	onViewDetails?: () => void;
	orderType: OrderType;
}

export default React.memo(function DriverInfoCard({
	driverOrWorker,
	language,
	onCall,
	onChat,
	onViewDetails,
	orderType,
}: DriverInfoCardProps) {
	const isArabic = language === "ar";
	const router = useRouter();
	const workerTypeLabel = getWorkerTypeLabel(orderType, language);

	if (!driverOrWorker) return null;

	// Show vehicle info only for product orders
	const shouldShowVehicle = orderType === ORDER_TYPE.PRODUCT && driverOrWorker.vehicle;

	// Handle view worker details
	const handleViewDetails = () => {
		if (onViewDetails) {
			onViewDetails();
		} else if (driverOrWorker.id) {
			// Route: /worker/[workerId]
			const detailsPath = `/worker/${driverOrWorker.id}`;
			router.push(detailsPath);
		} else {
			// Show helpful message if info is missing
			console.log("Worker details not available - missing worker ID");
		}
	};

	return (
		<div className={`p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
			<div
				className={`flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 ${isArabic ? "flex-row-reverse" : ""} ${
					(onViewDetails || driverOrWorker.id)
						? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
						: ""
				}`}
				onClick={
					(onViewDetails || driverOrWorker.id)
						? handleViewDetails
						: undefined
				}
			>
				{driverOrWorker.photo ? (
					<div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0 shadow-md">
						<Image
							src={driverOrWorker.photo}
							alt={driverOrWorker.name}
							fill
							className="object-cover"
							sizes="48px"
						/>
					</div>
				) : (
					<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-100 dark:from-green-900/30 to-green-200 dark:to-green-800/30 flex items-center justify-center flex-shrink-0 border-2 border-gray-200 dark:border-gray-700">
						<User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
					</div>
				)}
				<div className="flex-1 min-w-0">
					<h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">{driverOrWorker.name}</h4>
					{shouldShowVehicle && (
						<p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate">{driverOrWorker.vehicle}</p>
					)}
					{orderType === ORDER_TYPE.SERVICE && !shouldShowVehicle && (
						<p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
							{isArabic ? "فني خدمة" : "Service Technician"}
						</p>
					)}
				</div>
			</div>
			{(onChat || driverOrWorker.id) && (
				<div className={`flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
					{(onChat || driverOrWorker.id) && (
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={(e) => {
								e.stopPropagation();
								if (onChat) {
									onChat();
								} else if (driverOrWorker.id) {
									// Route: /worker/[workerId]/chat
									const chatPath = `/worker/${driverOrWorker.id}/chat`;
									router.push(chatPath);
								}
							}}
							className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px] ${isArabic ? "flex-row-reverse" : ""}`}
						>
							<MessageCircle className="w-4 h-4 flex-shrink-0" />
							<span>{isArabic ? "محادثة" : "Chat"}</span>
						</motion.button>
					)}
				</div>
			)}
		</div>
	);
});

