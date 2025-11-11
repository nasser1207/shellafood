"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PackageSearch, Home, Star } from "lucide-react";
import { RatingModal } from "@/components/ServeMe/Booking/modals";

interface ActionButtonsProps {
	language: "en" | "ar";
	orderId: string;
	type: "service" | "product";
	status: "success" | "pending" | "failed";
}

export default function ActionButtons({ language, orderId, type, status }: ActionButtonsProps) {
	const isArabic = language === "ar";
	const router = useRouter();
	const [showRating, setShowRating] = useState(false);

	const handleRatingSubmit = async (rating: number, feedback: string) => {
		console.log("Rating submitted:", { orderId, rating, feedback });
		// TODO: Submit rating to API
		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.5 }}
				className={`flex flex-col sm:flex-row gap-3 `}
			>
				{status === "success" && (
					<>
						{/* Track Order Button */}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => router.push(`/my-orders`)}
							className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl `}
						>
							<PackageSearch className="w-5 h-5" />
							<span>{isArabic ? "تتبع الطلب" : "Track Order"}</span>
						</motion.button>

						{/* Rate Experience Button */}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => setShowRating(true)}
							className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-[#1B1D22] border-2 border-[#10b981] text-[#10b981] rounded-xl font-bold text-base hover:bg-[#10b981]/10 transition-all `}
						>
							<Star className="w-5 h-5" />
							<span>{isArabic ? "قيم التجربة" : "Rate Experience"}</span>
						</motion.button>
					</>
				)}

				{/* Back to Home Button */}
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => router.push("/")}
					className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold text-base transition-all `}
				>
					<Home className="w-5 h-5" />
					<span>{isArabic ? "العودة للرئيسية" : "Back to Home"}</span>
				</motion.button>
			</motion.div>

			{/* Rating Modal */}
			{showRating && (
				<RatingModal
					isOpen={showRating}
					onClose={() => setShowRating(false)}
					onSubmit={handleRatingSubmit}
					language={language}
					serviceName={type === "service" ? "Service" : "Order"}
				/>
			)}
		</>
	);
}

