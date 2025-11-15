"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HeroBackground() {
	return (
		<div className="absolute inset-0">
			{/* Base gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

			{/* Animated decorative blobs */}
			<motion.div
				animate={{
					x: [0, 100, 0],
					y: [0, -50, 0],
					scale: [1, 1.1, 1],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				className="absolute top-20 left-10 w-72 h-72 bg-green-300/30 dark:bg-green-900/20 rounded-full blur-3xl"
			/>
			<motion.div
				animate={{
					x: [0, -80, 0],
					y: [0, 60, 0],
					scale: [1, 1.2, 1],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0.5,
				}}
				className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-900/20 rounded-full blur-3xl"
			/>
			<motion.div
				animate={{
					x: [0, 50, 0],
					y: [0, -30, 0],
					scale: [1, 0.9, 1],
				}}
				transition={{
					duration: 18,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1,
				}}
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300/20 dark:bg-blue-900/10 rounded-full blur-3xl"
			/>

			{/* Grid pattern overlay */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
		</div>
	);
}

