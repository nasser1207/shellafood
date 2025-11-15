"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingCardProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export default function FloatingCard({
	children,
	className = "",
	delay = 0,
}: FloatingCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ y: [0, -10, 0] }}
			transition={{
				repeat: Infinity,
				duration: 3,
				delay: delay,
				ease: "easeInOut",
			}}
			className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 ${className}`}
		>
			{children}
		</motion.div>
	);
}

