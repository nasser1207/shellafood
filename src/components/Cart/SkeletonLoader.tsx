"use client";

import { motion } from "framer-motion";

export function CartItemSkeleton() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
		>
			<div className="p-4">
				<div className="flex items-start gap-4">
					{/* Image Skeleton */}
					<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
					
					{/* Content Skeleton */}
					<div className="flex-1 space-y-3">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
						<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
						<div className="flex items-center gap-3">
							<div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
							<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
						</div>
					</div>
					
					{/* Price Skeleton */}
					<div className="text-right">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 mb-2" />
						<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export function OrderSummarySkeleton() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 sm:p-6"
		>
			<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-6" />
			<div className="space-y-3 mb-6">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex justify-between">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24" />
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
					</div>
				))}
			</div>
			<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-full" />
		</motion.div>
	);
}

