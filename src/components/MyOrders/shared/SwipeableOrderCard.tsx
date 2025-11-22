"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { MapPin, X, Star, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface SwipeableOrderCardProps {
	children: React.ReactNode;
	onTrack?: () => void;
	onCancel?: () => void;
	onRate?: () => void;
	onChat?: () => void;
	canTrack?: boolean;
	canCancel?: boolean;
	canRate?: boolean;
	canChat?: boolean;
}

const SWIPE_THRESHOLD = 100;
const MAX_SWIPE_DISTANCE = 150;

export function SwipeableOrderCard({
	children,
	onTrack,
	onCancel,
	onRate,
	onChat,
	canTrack = true,
	canCancel = false,
	canRate = false,
	canChat = false,
}: SwipeableOrderCardProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const x = useMotionValue(0);
	const opacity = useTransform(x, [-MAX_SWIPE_DISTANCE, 0, MAX_SWIPE_DISTANCE], [0, 1, 0]);
	const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

	const handleDragEnd = (_: any, info: PanInfo) => {
		const threshold = SWIPE_THRESHOLD;

		if (info.offset.x > threshold && canTrack && onTrack) {
			// Swiped right - Track
			onTrack();
			setSwipeDirection("right");
		} else if (info.offset.x < -threshold && canCancel && onCancel) {
			// Swiped left - Cancel
			onCancel();
			setSwipeDirection("left");
		}

		// Reset
		setTimeout(() => {
			setSwipeDirection(null);
			x.set(0);
		}, 300);
	};

	return (
		<div className="relative w-full overflow-hidden rounded-2xl md:overflow-visible">
			{/* Background Actions - Only visible on mobile */}
			<div className="md:hidden absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
				{canTrack && (
					<motion.div
						style={{ opacity }}
						className={cn(
							"flex items-center gap-2 text-green-600 dark:text-green-400",
							isArabic ? "flex-row-reverse" : ""
						)}
					>
						<MapPin className="w-5 h-5" />
						<span className="font-bold text-sm">{isArabic ? "تتبع" : "Track"}</span>
					</motion.div>
				)}
				{canCancel && (
					<motion.div
						style={{ opacity }}
						className={cn(
							"flex items-center gap-2 text-red-600 dark:text-red-400",
							isArabic ? "flex-row-reverse" : ""
						)}
					>
						<X className="w-5 h-5" />
						<span className="font-bold text-sm">{isArabic ? "إلغاء" : "Cancel"}</span>
					</motion.div>
				)}
			</div>

			{/* Swipeable Card - Only on mobile */}
			<motion.div
				drag="x"
				dragConstraints={{ left: canCancel ? -MAX_SWIPE_DISTANCE : 0, right: canTrack ? MAX_SWIPE_DISTANCE : 0 }}
				dragElastic={0.2}
				onDragEnd={handleDragEnd}
				style={{ x }}
				className="relative w-full z-10 md:static md:transform-none"
			>
				{children}
			</motion.div>

			{/* Swipe Indicator - Only on mobile */}
			{swipeDirection && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					className="md:hidden absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-2xl pointer-events-none z-20"
				>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className={cn(
							"w-16 h-16 rounded-full flex items-center justify-center",
							swipeDirection === "right"
								? "bg-green-500 text-white"
								: "bg-red-500 text-white"
						)}
					>
						{swipeDirection === "right" ? (
							<MapPin className="w-8 h-8" />
						) : (
							<X className="w-8 h-8" />
						)}
					</motion.div>
				</motion.div>
			)}
		</div>
	);
}

