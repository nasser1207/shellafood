"use client";

import { memo, useCallback } from "react";
import { RefreshCw } from "lucide-react";

interface CategoriesSliderControlsProps {
	onRefresh: () => void;
	children: React.ReactNode;
}

function CategoriesSliderControls({ onRefresh, children }: CategoriesSliderControlsProps) {
	const handleScrollRight = useCallback(() => {
		document
			.getElementById("categories-scroll-container")
			?.scrollBy({ left: 200, behavior: "smooth" });
	}, []);

	const handleScrollLeft = useCallback(() => {
		document
			.getElementById("categories-scroll-container")
			?.scrollBy({ left: -200, behavior: "smooth" });
	}, []);

	return (
		<div className="relative flex items-center">
			{/* Refresh Button */}
			<button
				onClick={onRefresh}
				className="absolute -left-12 z-10 hidden rounded-full bg-white dark:bg-gray-800 p-2 shadow-md dark:shadow-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 md:block"
				title="إعادة تحميل الأقسام"
			>
				<RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
			</button>

			{/* Left Arrow */}
			<button
				className="absolute -left-4 z-10 hidden rounded-full bg-white dark:bg-gray-800 p-2 shadow-md dark:shadow-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 md:block"
				onClick={handleScrollLeft}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-600 dark:text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			{/* Categories Grid */}
			{children}

			{/* Right Arrow */}
			<button
				className="absolute -right-4 z-10 hidden rounded-full bg-white dark:bg-gray-800 p-2 shadow-md dark:shadow-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 md:block"
				onClick={handleScrollRight}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-600 dark:text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</button>
		</div>
	);
}

export default memo(CategoriesSliderControls);
