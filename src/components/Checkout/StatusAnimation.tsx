"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

interface StatusAnimationProps {
	status: "success" | "pending" | "failed";
	size?: "sm" | "md" | "lg";
}

export default function StatusAnimation({ status, size = "lg" }: StatusAnimationProps) {
	const [showConfetti, setShowConfetti] = useState(false);

	const sizeClasses = {
		sm: "w-16 h-16",
		md: "w-24 h-24",
		lg: "w-32 h-32",
	};

	useEffect(() => {
		if (status === "success") {
			setShowConfetti(true);
			const timer = setTimeout(() => setShowConfetti(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [status]);

	return (
		<div className="relative flex items-center justify-center">
			{/* Confetti Effect */}
			<AnimatePresence>
				{showConfetti && (
					<div className="absolute inset-0 pointer-events-none">
						{[...Array(12)].map((_, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, scale: 0, y: 0 }}
								animate={{
									opacity: [0, 1, 0],
									scale: [0, 1, 0.5],
									y: [0, -100, -150],
									x: [0, (Math.random() - 0.5) * 200],
									rotate: [0, 360],
								}}
								exit={{ opacity: 0 }}
								transition={{
									duration: 2,
									delay: i * 0.1,
									ease: "easeOut",
								}}
								className="absolute w-3 h-3 rounded-full"
								style={{
									backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"][
										i % 5
									],
									left: "50%",
									top: "50%",
								}}
							/>
						))}
					</div>
				)}
			</AnimatePresence>

			{/* Status Icon */}
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
				className={`relative ${sizeClasses[size]}`}
			>
				{status === "success" && (
					<>
						<div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
							className="relative w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-lg"
						>
							<CheckCircle className="w-1/2 h-1/2 text-white" strokeWidth={3} />
						</motion.div>
					</>
				)}
				{status === "pending" && (
					<div className="w-full h-full bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
						<Loader2 className="w-1/2 h-1/2 text-white animate-spin" strokeWidth={3} />
					</div>
				)}
				{status === "failed" && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", bounce: 0.5 }}
						className="w-full h-full bg-red-500 rounded-full flex items-center justify-center shadow-lg"
					>
						<XCircle className="w-1/2 h-1/2 text-white" strokeWidth={3} />
					</motion.div>
				)}
			</motion.div>
		</div>
	);
}

