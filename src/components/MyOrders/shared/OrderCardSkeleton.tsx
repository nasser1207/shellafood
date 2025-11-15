"use client";

import React from "react";

export function OrderCardSkeleton() {
	return (
		<div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
			{/* Status Bar */}
			<div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-t-2xl -mx-6 -mt-6 mb-4" />

			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
					<div>
						<div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
						<div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
					</div>
				</div>
				<div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
			</div>

			{/* Items */}
			<div className="space-y-2 mb-4">
				{[1, 2].map((i) => (
					<div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
						<div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
						<div className="flex-1">
							<div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
							<div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
						</div>
					</div>
				))}
			</div>

			{/* Footer */}
			<div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
				<div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
				<div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
			</div>
		</div>
	);
}

export function OrderListSkeleton() {
	return (
		<div className="space-y-4">
			{[...Array(3)].map((_, i) => (
				<OrderCardSkeleton key={i} />
			))}
		</div>
	);
}

