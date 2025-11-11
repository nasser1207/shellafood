"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DriverOrWorker } from "../types";

interface DriverInfoCardProps {
	driverOrWorker?: DriverOrWorker;
	language: "en" | "ar";
	onCall?: () => void;
	onChat?: () => void;
	onViewDetails?: () => void;
}

export default React.memo(function DriverInfoCard({
	driverOrWorker,
	language,
	onCall,
	onChat,
	onViewDetails,
}: DriverInfoCardProps) {
	const isArabic = language === "ar";
	const router = useRouter();

	if (!driverOrWorker) return null;

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
		<div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
			<div
				className={`flex items-center gap-3 mb-3 ${isArabic ? "flex-row-reverse" : ""} ${
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
					<div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 flex-shrink-0 shadow-md">
						<Image
							src={driverOrWorker.photo}
							alt={driverOrWorker.name}
							fill
							className="object-cover"
							sizes="48px"
						/>
					</div>
				) : (
					<div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 dark:from-green-900/30 to-green-200 dark:to-green-800/30 flex items-center justify-center flex-shrink-0 border-2 border-gray-200 dark:border-gray-700">
						<User className="w-6 h-6 text-green-600 dark:text-green-400" />
					</div>
				)}
				<div className="flex-1 min-w-0">
					<h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-base">{driverOrWorker.name}</h4>
					{driverOrWorker.vehicle && (
						<p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{driverOrWorker.vehicle}</p>
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
							className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
						>
							<MessageCircle className="w-4 h-4" />
							<span>{isArabic ? "محادثة" : "Chat"}</span>
						</motion.button>
					)}
				</div>
			)}
		</div>
	);
});

