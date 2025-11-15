"use client";

import { ReactNode, useState, useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	title?: string;
	titleAr?: string;
	snapPoints?: number[]; // e.g., [0.9, 0.5] for 90% and 50% of screen
}

export default function BottomSheet({
	isOpen,
	onClose,
	children,
	title,
	titleAr,
	snapPoints = [0.9],
}: BottomSheetProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const [snapPoint, setSnapPoint] = useState(snapPoints[0]);
	const dragControls = useDragControls();
	const handleRef = useRef<HTMLDivElement>(null);

	const handleDragEnd = (_: any, info: any) => {
		// Close if dragged down significantly or with high velocity
		if (info.velocity.y > 500 || info.offset.y > 100) {
			onClose();
			return;
		}

		// Snap to nearest snap point
		const currentY = info.point.y;
		const screenHeight = window.innerHeight;
		const currentPercentage = 1 - (currentY / screenHeight);
		
		// Find nearest snap point
		const nearest = snapPoints.reduce((prev, curr) => {
			return Math.abs(curr - currentPercentage) < Math.abs(prev - currentPercentage)
				? curr
				: prev;
		});
		
		setSnapPoint(nearest);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop with blur */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
					/>

					{/* Sheet */}
					<motion.div
						initial={{ y: "100%" }}
						animate={{ y: `${(1 - snapPoint) * 100}%` }}
						exit={{ y: "100%" }}
						drag="y"
						dragControls={dragControls}
						dragConstraints={{ top: 0, bottom: 0 }}
						dragElastic={0.2}
						onDragEnd={handleDragEnd}
						transition={{ type: "spring", damping: 30, stiffness: 300 }}
						className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl"
					>
						{/* Drag handle */}
						<div className="flex justify-center pt-3 pb-2">
							<div
								ref={handleRef}
								className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full cursor-grab active:cursor-grabbing"
								onPointerDown={(e) => dragControls.start(e)}
							/>
						</div>

						{/* Header */}
						{(title || titleAr) && (
							<div
								className={cn(
									"flex items-center justify-between px-4 pb-4 border-b border-gray-200 dark:border-gray-700",
									
								)}
							>
								<h2 className="text-xl font-bold text-gray-900 dark:text-white">
									{isArabic && titleAr ? titleAr : title}
								</h2>
								<button
									onClick={onClose}
									className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-95"
									aria-label={isArabic ? "إغلاق" : "Close"}
								>
									<X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
								</button>
							</div>
						)}

						{/* Content */}
						<div className="overflow-y-auto max-h-[calc(90vh-100px)] px-4 pb-safe momentum-scroll">
							{children}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

