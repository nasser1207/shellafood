"use client";

import React from "react";
import Image from "next/image";
import { X, Sparkles, Star, MapPin as MapPinIcon, User, ArrowRight } from "lucide-react";

interface RecommendedWorker {
	id: string;
	name: string;
	nameAr: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	price: number;
	experience: string;
	experienceAr: string;
	location: string;
	specialization: string;
	specializationAr: string;
	distance: number;
}

interface WorkerRecommendationModalProps {
	isOpen: boolean;
	onClose: () => void;
	worker: RecommendedWorker | null;
	isArabic: boolean;
	onChooseWorker: () => void;
	onViewDetails: () => void;
	onChooseAvailable: () => void;
}

/**
 * Worker Recommendation Modal Component
 * Displays platform-recommended worker with details and actions
 */
export default function WorkerRecommendationModal({
	isOpen,
	onClose,
	worker,
	isArabic,
	onChooseWorker,
	onViewDetails,
	onChooseAvailable,
}: WorkerRecommendationModalProps) {
	if (!isOpen || !worker) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="recommendation-modal-title"
		>
			<div
				className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden ${
					isArabic ? "text-right" : "text-left"
				}`}
				dir={isArabic ? "rtl" : "ltr"}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 dark:from-blue-700 to-blue-700 dark:to-blue-800 px-6 py-5">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
								<Sparkles className="w-6 h-6 text-white" />
							</div>
							<div>
								<h3
									id="recommendation-modal-title"
									className="text-lg font-bold text-white"
								>
									{isArabic ? "توصية المنصة" : "Platform Recommendation"}
								</h3>
								<p className="text-xs text-blue-100 dark:text-blue-200 mt-0.5">
									{isArabic
										? "تم اختيار أفضل فني بناءً على القرب والتقييم والتخصص"
										: "Best worker selected based on proximity, rating & specialization"}
								</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 dark:hover:bg-white/40 flex items-center justify-center transition-colors touch-manipulation"
							aria-label={isArabic ? "إغلاق" : "Close"}
						>
							<X className="w-5 h-5 text-white" />
						</button>
					</div>
				</div>

				{/* Worker Info */}
				<div className="p-6 space-y-4">
					{/* Worker Card */}
					<div className="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-white dark:to-gray-800 rounded-xl border-2 border-blue-200 dark:border-blue-800 p-5">
						<div className={`flex items-start gap-4 ${isArabic ? "flex-row-reverse" : ""}`}>
							{/* Avatar */}
							<div className="relative flex-shrink-0">
								<div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-200 dark:border-blue-700 shadow-lg">
									<Image
										src={worker.avatar}
										alt={isArabic ? worker.nameAr : worker.name}
										width={80}
										height={80}
										className="w-full h-full object-cover"
										loading="lazy"
									/>
								</div>
								<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
									<Star className="w-3 h-3 text-white fill-white" />
								</div>
							</div>

							{/* Worker Details */}
							<div className="flex-1 min-w-0">
								<h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
									{isArabic ? worker.nameAr : worker.name}
								</h4>
								<div className="flex items-center gap-2 mb-2">
									<div className="flex items-center gap-1">
										<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
										<span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
											{worker.rating}
										</span>
									</div>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										({worker.reviewsCount}{" "}
										{isArabic ? "تقييم" : "reviews"})
									</span>
								</div>
								<div className="space-y-1.5 text-sm">
									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
										<MapPinIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
										<span>
											{worker.distance} {isArabic ? "كم" : "km"} • {worker.location}
										</span>
									</div>
									<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
										<User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
										<span>
											{isArabic ? worker.experienceAr : worker.experience}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
											{isArabic ? worker.specializationAr : worker.specialization}
										</span>
									</div>
								</div>
								<div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{isArabic ? "السعر:" : "Price:"}
										</span>
										<span className="text-lg font-bold text-green-600 dark:text-green-400">
											{worker.price} {isArabic ? "ريال" : "SAR"}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col gap-3">
						<button
							onClick={onChooseWorker}
							className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
								isArabic ? "flex-row-reverse" : ""
							}`}
						>
							<Star className="w-5 h-5" />
							<span>{isArabic ? "اختيار هذا الفني" : "Choose This Worker"}</span>
							<ArrowRight className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
						</button>

						<div className="flex flex-col sm:flex-row gap-3">
							<button
								onClick={onViewDetails}
								className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-50 transition-all shadow-md hover:shadow-lg touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2"
							>
								<User className="w-5 h-5" />
								<span>{isArabic ? "عرض التفاصيل" : "View Details"}</span>
							</button>

							<button
								onClick={onChooseAvailable}
								className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2"
							>
								<span>{isArabic ? "اختر العامل المتاح" : "Choose Available Worker"}</span>
								<ArrowRight className={`w-5 h-5 ${isArabic ? "rotate-180" : ""}`} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

