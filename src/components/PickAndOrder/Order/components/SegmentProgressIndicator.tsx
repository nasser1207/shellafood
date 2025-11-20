"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock, MapPin, Navigation } from "lucide-react";
import type { RouteSegment } from "../types/routeSegment";

interface SegmentProgressIndicatorProps {
	segments: RouteSegment[];
	currentIndex: number;
	onSegmentClick: (index: number) => void;
	getCompletion: (segment: RouteSegment) => number;
	isArabic: boolean;
}

export const SegmentProgressIndicator: React.FC<SegmentProgressIndicatorProps> = ({
	segments,
	currentIndex,
	onSegmentClick,
	getCompletion,
	isArabic,
}) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	const getSegmentStatus = (completion: number, index: number) => {
		if (completion === 100) return "completed";
		if (index === currentIndex) return "current";
		if (completion > 0) return "in-progress";
		return "pending";
	};

	const getSegmentLabel = (segment: RouteSegment, index: number) => {
		if (segment.pickupPoint.location && segment.dropoffPoint.location) {
			const pickup = segment.pickupPoint.streetName || segment.pickupPoint.areaName || segment.pickupPoint.city;
			const dropoff = segment.dropoffPoint.streetName || segment.dropoffPoint.areaName || segment.dropoffPoint.city;
			if (pickup && dropoff) {
				return `${pickup.substring(0, 15)}... → ${dropoff.substring(0, 15)}...`;
			}
		}
		return isArabic ? `المسار ${index + 1}` : `Segment ${index + 1}`;
	};

	return (
		<div className="w-full mb-8">
			{/* Desktop View - Horizontal Progress Bar */}
			<div className="hidden md:block">
				<div className="relative">
					{/* Background Track */}
					<div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full transform -translate-y-1/2" />

					{/* Progress Fill */}
					<motion.div
						className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-[#31A342] to-[#4ade80] rounded-full transform -translate-y-1/2"
						initial={{ width: 0 }}
						animate={{
							width: `${(currentIndex / (segments.length - 1)) * 100}%`,
						}}
						transition={{ duration: 0.5, ease: "easeOut" }}
					/>

					{/* Segments */}
					<div className="relative flex items-center justify-between">
						{segments.map((segment, index) => {
							const completion = getCompletion(segment);
							const status = getSegmentStatus(completion, index);
							const isCurrent = index === currentIndex;
							const isHovered = hoveredIndex === index;
							const circumference = 2 * Math.PI * 22;

							return (
								<div
									key={segment.id}
									className="relative flex flex-col items-center group"
									style={{ flex: 1 }}
								>
									{/* Segment Circle */}
									<motion.button
										whileHover={{ scale: 1.15 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => onSegmentClick(index)}
										onMouseEnter={() => setHoveredIndex(index)}
										onMouseLeave={() => setHoveredIndex(null)}
										className={`
											relative w-14 h-14 rounded-full flex items-center justify-center
											transition-all duration-300 z-10
											${isCurrent 
												? "ring-4 ring-[#31A342]/40 dark:ring-[#4ade80]/40 shadow-lg shadow-[#31A342]/20" 
												: "ring-2 ring-gray-200 dark:ring-gray-700"
											}
											${status === "completed" 
												? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700" 
												: status === "current"
												? "bg-gradient-to-br from-[#31A342] to-[#2a8f38] dark:from-[#4ade80] dark:to-[#22c55e]"
												: status === "in-progress"
												? "bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600"
												: "bg-gray-300 dark:bg-gray-600"
											}
											${isHovered ? "shadow-xl" : ""}
										`}
									>
										{/* Progress Ring for In-Progress */}
										{status === "in-progress" && (
											<svg className="absolute inset-0 w-full h-full -rotate-90">
												<circle
													cx="28"
													cy="28"
													r="22"
													stroke="currentColor"
													strokeWidth="3"
													fill="none"
													className="text-white/30"
												/>
												<circle
													cx="28"
													cy="28"
													r="22"
													stroke="currentColor"
													strokeWidth="3"
													fill="none"
													className="text-white"
													strokeDasharray={circumference}
													strokeDashoffset={circumference * (1 - completion / 100)}
													strokeLinecap="round"
													style={{ transition: "stroke-dashoffset 0.5s ease" }}
												/>
											</svg>
										)}

										{/* Icon/Number */}
										{status === "completed" ? (
											<CheckCircle2 className="w-7 h-7 text-white" />
										) : status === "current" ? (
											<motion.div
												animate={{ scale: [1, 1.2, 1] }}
												transition={{ duration: 2, repeat: Infinity }}
											>
												<MapPin className="w-6 h-6 text-white" />
											</motion.div>
										) : (
											<span className="text-base font-bold text-white">
												{index + 1}
											</span>
										)}

										{/* Pulse animation for current */}
										{isCurrent && (
											<motion.div
												className="absolute inset-0 rounded-full bg-[#31A342]/30 dark:bg-[#4ade80]/30"
												animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
												transition={{ duration: 2, repeat: Infinity }}
											/>
										)}
									</motion.button>

									{/* Segment Label */}
									<AnimatePresence>
										{(isCurrent || isHovered) && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 10 }}
												className="absolute top-full mt-3 w-48"
											>
												<div className={`
													px-3 py-2 rounded-lg shadow-xl backdrop-blur-sm
													bg-white/95 dark:bg-gray-800/95
													border border-gray-200 dark:border-gray-700
													text-center
												`}>
													<p className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-1">
														{getSegmentLabel(segment, index)}
													</p>
													{status !== "completed" && (
														<div className="flex items-center justify-center gap-1 mt-1">
															{status === "in-progress" ? (
																<>
																	<Clock className="w-3 h-3 text-amber-500" />
																	<span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
																		{completion}% {isArabic ? "مكتمل" : "Complete"}
																	</span>
																</>
															) : (
																<>
																	<AlertCircle className="w-3 h-3 text-gray-400" />
																	<span className="text-xs text-gray-500 dark:text-gray-400">
																		{isArabic ? "في الانتظار" : "Pending"}
																	</span>
																</>
															)}
														</div>
													)}
												</div>
												{/* Tooltip Arrow */}
												<div className={`
													absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1
													w-2 h-2 rotate-45
													bg-white/95 dark:bg-gray-800/95
													border-l border-t border-gray-200 dark:border-gray-700
												`} />
											</motion.div>
										)}
									</AnimatePresence>

									{/* Step Number Badge */}
									<div className={`
										absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center
										text-xs font-bold
										${status === "completed" 
											? "bg-green-600 text-white" 
											: status === "current"
											? "bg-[#31A342] text-white"
											: "bg-gray-400 dark:bg-gray-600 text-white"
										}
										shadow-md
									`}>
										{index + 1}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Mobile View - Vertical/Compact Layout */}
			<div className="md:hidden">
				<div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
							{isArabic ? `المسار ${currentIndex + 1} من ${segments.length}` : `Segment ${currentIndex + 1} of ${segments.length}`}
						</h3>
						<div className="flex items-center gap-1">
							{segments.map((segment, index) => {
								const completion = getCompletion(segment);
								const status = getSegmentStatus(completion, index);
								const isCurrent = index === currentIndex;

								return (
									<button
										key={segment.id}
										onClick={() => onSegmentClick(index)}
										className={`
											w-8 h-8 rounded-full flex items-center justify-center
											transition-all duration-200
											${isCurrent 
												? "ring-2 ring-[#31A342] dark:ring-[#4ade80] scale-110" 
												: "ring-1 ring-gray-300 dark:ring-gray-600"
											}
											${status === "completed" 
												? "bg-green-500 dark:bg-green-600" 
												: status === "current"
												? "bg-[#31A342] dark:bg-[#4ade80]"
												: status === "in-progress"
												? "bg-amber-400 dark:bg-amber-500"
												: "bg-gray-300 dark:bg-gray-600"
											}
										`}
									>
										{status === "completed" ? (
											<CheckCircle2 className="w-4 h-4 text-white" />
										) : (
											<span className="text-xs font-bold text-white">
												{index + 1}
											</span>
										)}
									</button>
								);
							})}
						</div>
					</div>

					{/* Current Segment Info */}
					<div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
									{isArabic ? "الحالة" : "Status"}
								</p>
								<div className="flex items-center gap-2">
									{getSegmentStatus(getCompletion(segments[currentIndex]), currentIndex) === "completed" ? (
										<>
											<CheckCircle2 className="w-4 h-4 text-green-500" />
											<span className="text-sm font-bold text-green-600 dark:text-green-400">
												{isArabic ? "مكتمل" : "Completed"}
											</span>
										</>
									) : getSegmentStatus(getCompletion(segments[currentIndex]), currentIndex) === "in-progress" ? (
										<>
											<Clock className="w-4 h-4 text-amber-500" />
											<span className="text-sm font-bold text-amber-600 dark:text-amber-400">
												{getCompletion(segments[currentIndex])}% {isArabic ? "مكتمل" : "Complete"}
											</span>
										</>
									) : (
										<>
											<AlertCircle className="w-4 h-4 text-gray-400" />
											<span className="text-sm font-bold text-gray-500 dark:text-gray-400">
												{isArabic ? "في الانتظار" : "Pending"}
											</span>
										</>
									)}
								</div>
							</div>
							<button
								onClick={() => {
									if (currentIndex > 0) onSegmentClick(currentIndex - 1);
								}}
								disabled={currentIndex === 0}
								className={`
									px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
									${currentIndex === 0 
										? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed" 
										: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
									}
								`}
							>
								{isArabic ? "السابق" : "Previous"}
							</button>
							<button
								onClick={() => {
									if (currentIndex < segments.length - 1) onSegmentClick(currentIndex + 1);
								}}
								disabled={currentIndex === segments.length - 1}
								className={`
									px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
									${currentIndex === segments.length - 1 
										? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed" 
										: "bg-[#31A342] dark:bg-[#4ade80] text-white hover:bg-[#2a8f38] dark:hover:bg-[#22c55e]"
									}
								`}
							>
								{isArabic ? "التالي" : "Next"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
