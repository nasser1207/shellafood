"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, CheckCircle, Circle, Loader2, Truck, Package } from "lucide-react";

interface OrderTimelineModalProps {
	isOpen: boolean;
	onClose: () => void;
	orderNumber: string;
	status: string;
	type: "product" | "service";
	language: "en" | "ar";
}

const productSteps = [
	{ key: "pending", labelEn: "Order Received", labelAr: "تم استلام الطلب", icon: Package },
	{ key: "preparing", labelEn: "Preparing", labelAr: "قيد التحضير", icon: Loader2 },
	{ key: "ready", labelEn: "Ready for Pickup", labelAr: "جاهز للاستلام", icon: CheckCircle },
	{ key: "delivering", labelEn: "Out for Delivery", labelAr: "قيد التوصيل", icon: Truck },
	{ key: "completed", labelEn: "Completed", labelAr: "مكتمل", icon: CheckCircle },
];

const serviceSteps = [
	{ key: "pending", labelEn: "Request Received", labelAr: "تم استلام الطلب", icon: Clock },
	{ key: "assigned", labelEn: "Worker Assigned", labelAr: "تم تعيين الفني", icon: CheckCircle },
	{ key: "in_progress", labelEn: "In Progress", labelAr: "قيد التنفيذ", icon: Loader2 },
	{ key: "completed", labelEn: "Completed", labelAr: "مكتمل", icon: CheckCircle },
];

export default function OrderTimelineModal({
	isOpen,
	onClose,
	orderNumber,
	status,
	type,
	language,
}: OrderTimelineModalProps) {
	const isArabic = language === "ar";
	const steps = type === "product" ? productSteps : serviceSteps;

	const getCurrentStepIndex = () => {
		const statusMap: Record<string, number> = {
			pending: 0,
			preparing: type === "product" ? 1 : -1,
			assigned: type === "service" ? 1 : -1,
			ready: type === "product" ? 2 : -1,
			delivering: type === "product" ? 3 : -1,
			in_progress: type === "service" ? 2 : -1,
			completed: type === "product" ? 4 : type === "service" ? 3 : -1,
			cancelled: -1,
		};
		return statusMap[status] ?? 0;
	};

	const currentStepIndex = getCurrentStepIndex();

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
						onClick={onClose}
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
							className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden ${isArabic ? "rtl" : "ltr"}`}
							dir={isArabic ? "rtl" : "ltr"}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className={`p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
								<button
									onClick={onClose}
									className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300`}
								>
									<X className="w-5 h-5" />
								</button>
								<h2 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "تتبع الطلب" : "Track Order"}
								</h2>
								<p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "رقم الطلب:" : "Order"} {orderNumber}
								</p>
							</div>

							{/* Timeline */}
							<div className="p-6 sm:p-8">
								<div className={`relative ${isArabic ? "pr-8" : "pl-8"}`}>
									{/* Vertical Line */}
									<div
										className={`absolute top-0 bottom-0 w-0.5 ${
											isArabic ? "right-4" : "left-4"
										} bg-gray-200 dark:bg-gray-700`}
									>
										<motion.div
											initial={{ height: 0 }}
											animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
											transition={{ duration: 0.5, delay: 0.2 }}
											className="absolute top-0 left-0 right-0 bg-[#10b981] rounded-full"
										/>
									</div>

									{/* Steps */}
									<div className="space-y-6">
										{steps.map((step, index) => {
											const isCompleted = index <= currentStepIndex;
											const isActive = index === currentStepIndex;
											const StepIcon = step.icon;
											const label = isArabic ? step.labelAr : step.labelEn;

											return (
												<motion.div
													key={step.key}
													initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: index * 0.1 }}
													className={`flex items-start gap-4 `}
												>
													{/* Icon */}
													<div
														className={`relative flex-shrink-0 ${isArabic ? "ml-4" : "mr-4"}`}
														style={{
															marginTop: "-2px",
														}}
													>
														{isCompleted ? (
															<motion.div
																initial={{ scale: 0 }}
																animate={{ scale: 1 }}
																transition={{ type: "spring", delay: index * 0.1 }}
																className={`w-8 h-8 rounded-full flex items-center justify-center ${
																	isActive
																		? "bg-[#10b981] text-white shadow-lg shadow-[#10b981]/50"
																		: "bg-green-500 text-white"
																}`}
															>
																{isActive ? (
																	<StepIcon className="w-4 h-4" />
																) : (
																	<CheckCircle className="w-4 h-4" />
																)}
															</motion.div>
														) : (
															<div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-800">
																<Circle className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="currentColor" />
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
															className={`font-semibold ${
																isCompleted ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"
															}`}
														>
															{label}
														</h3>
														{isActive && (
															<motion.p
																initial={{ opacity: 0 }}
																animate={{ opacity: 1 }}
																className="text-xs text-[#10b981] mt-1 font-medium"
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
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}

