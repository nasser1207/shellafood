"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, Package, Loader2, Truck, Wrench, User, Home } from "lucide-react";

interface TimelineStep {
	label: string;
	labelAr?: string;
	time: string;
	comment?: string;
	commentAr?: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface TrackingTimelineProps {
	language: "en" | "ar";
	type: "product" | "service";
	status: string;
	timeline: TimelineStep[];
	currentStepIndex: number;
}

const defaultSteps = {
	product: [
		{ key: "confirmed", labelEn: "Order Confirmed", labelAr: "تم تأكيد الطلب", icon: CheckCircle },
		{ key: "preparing", labelEn: "Preparing Order", labelAr: "قيد التحضير", icon: Package },
		{ key: "on_the_way", labelEn: "Out for Delivery", labelAr: "قيد التوصيل", icon: Truck },
		{ key: "delivered", labelEn: "Delivered", labelAr: "تم التوصيل", icon: Home },
	],
	service: [
		{ key: "confirmed", labelEn: "Booking Confirmed", labelAr: "تم تأكيد الحجز", icon: CheckCircle },
		{ key: "assigned", labelEn: "Technician Assigned", labelAr: "تم تعيين الفني", icon: User },
		{ key: "on_the_way", labelEn: "Technician on the Way", labelAr: "الفني في الطريق", icon: Truck },
		{ key: "in_progress", labelEn: "Work in Progress", labelAr: "قيد التنفيذ", icon: Wrench },
		{ key: "completed", labelEn: "Completed", labelAr: "مكتمل", icon: CheckCircle },
	],
};

export default function TrackingTimeline({
	language,
	type,
	status,
	timeline,
	currentStepIndex,
}: TrackingTimelineProps) {
	const isArabic = language === "ar";
	const steps = defaultSteps[type];

	return (
		<div className="bg-white dark:bg-[#1B1D22] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
			<h2 className={`text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 ${isArabic ? "text-right" : "text-left"}`}>
				{isArabic ? "مسار الطلب" : "Order Timeline"}
			</h2>

			<div className={`relative ${isArabic ? "pr-6 sm:pr-8" : "pl-6 sm:pl-8"}`}>
				{/* Vertical Line */}
				<div
					className={`absolute top-0 bottom-0 w-0.5 ${
						isArabic ? "right-3 sm:right-4" : "left-3 sm:left-4"
					} bg-gray-200 dark:bg-gray-700`}
				>
					<motion.div
						initial={{ height: 0 }}
						animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="absolute top-0 left-0 right-0 bg-[#10b981] rounded-full"
					/>
				</div>

				{/* Steps */}
				<div className="space-y-6 sm:space-y-8">
					{steps.map((stepTemplate, index) => {
						const timelineStep = timeline.find(
							(t) => t.label === stepTemplate.labelEn || t.label === stepTemplate.labelAr
						) || timeline[index];
						const isCompleted = index <= currentStepIndex;
						const isActive = index === currentStepIndex;
						const StepIcon = stepTemplate.icon || Clock;
						const label = isArabic
							? stepTemplate.labelAr || timelineStep?.label || stepTemplate.labelEn
							: timelineStep?.label || stepTemplate.labelEn;
						const comment = isArabic
							? timelineStep?.commentAr || timelineStep?.comment
							: timelineStep?.comment;

						return (
							<motion.div
								key={stepTemplate.key}
								initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className={`flex items-start gap-3 sm:gap-4 ${isArabic ? "flex-row-reverse" : ""}`}
							>
								{/* Icon */}
								<div
									className={`relative flex-shrink-0 ${isArabic ? "ml-3 sm:ml-4" : "mr-3 sm:mr-4"}`}
									style={{ marginTop: "-2px" }}
								>
									{isCompleted ? (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ type: "spring", delay: index * 0.1, bounce: 0.5 }}
											className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 ${
												isActive
													? "bg-[#10b981] border-[#10b981] text-white shadow-lg shadow-[#10b981]/50"
													: "bg-green-500 border-green-500 text-white"
											}`}
										>
											{isActive ? (
												<StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
											) : (
												<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
											)}
										</motion.div>
									) : (
										<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-[#1B1D22] flex items-center justify-center">
											<Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" fill="currentColor" />
										</div>
									)}
									{isActive && (
										<motion.div
											className="absolute inset-0 rounded-full bg-[#10b981] opacity-20"
											animate={{ scale: [1, 1.5, 1] }}
											transition={{ duration: 2, repeat: Infinity }}
										/>
									)}
								</div>

								{/* Content */}
								<div className={`flex-1 min-w-0 ${isArabic ? "text-right" : "text-left"}`}>
									<h3
										className={`font-semibold text-sm sm:text-base mb-0.5 sm:mb-1 ${
											isCompleted
												? "text-gray-900 dark:text-white"
												: "text-gray-400 dark:text-gray-500"
										}`}
									>
										{label}
									</h3>
									{timelineStep?.time && (
										<p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">
											{new Date(timelineStep.time).toLocaleString(isArabic ? "ar-SA" : "en-US", {
												dateStyle: "short",
												timeStyle: "short",
											})}
										</p>
									)}
									{comment && (
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: index * 0.1 + 0.2 }}
											className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 italic"
										>
											{comment}
										</motion.p>
									)}
									{isActive && (
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="text-xs text-[#10b981] mt-1.5 sm:mt-2 font-medium"
										>
											{isArabic ? "قيد التنفيذ..." : "In progress..."}
										</motion.p>
									)}
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

