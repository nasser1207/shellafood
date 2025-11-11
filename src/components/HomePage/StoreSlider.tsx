'use client';

import React from 'react';

// Define the component's props
interface StoreSliderProps {
    onStoreClick: (storeName: string) => void;
}

export default function StoreSlider({ onStoreClick }: StoreSliderProps) {
	const handleScrollRight = () => {
		document
			.getElementById("stores-scroll-container")
			?.scrollBy({ left: 200, behavior: "smooth" });
	};

	const handleScrollLeft = () => {
		document
			.getElementById("stores-scroll-container")
			?.scrollBy({ left: -200, behavior: "smooth" });
	};

	const stores = [
		"متجر الفارس",
		"بيت القهوة",
		"بروست",
		"اليت",
		"الشيف",
		"استراحة",
		"بيت المندي",
		"قهوجي",
		"بيك",
		"حلويات العسل",
		"أجواء الرياض",
		"مخبز الشفاء",
		"مأكولات زمان",
		"عصيرات السعد",
	];

	return (
		<div className="relative flex items-center">
			{/* سهم التنقل الأيسر */}
			<button
				className="absolute -left-4 z-10 hidden rounded-full bg-white p-2 shadow-md md:block"
				onClick={handleScrollLeft}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-600"
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

			{/* Changed `space-x-4` to `gap-4` and added `px-4` to the container */}
			<div
				id="stores-scroll-container"
				className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-2"
			>
				{stores.map((store, index) => (
                    // Changed from `div` to a clickable `button`
					<button
						key={index}
                        onClick={() => onStoreClick(store)}
						className="flex w-24 flex-shrink-0 flex-col items-center text-center cursor-pointer"
					>
						<div className="mb-2 flex h-24 w-24 items-center justify-center rounded-lg bg-gray-200 shadow-md">
							<span className="text-xs text-gray-500">متجر</span>
						</div>
						<p className="text-sm font-semibold text-gray-700">{store}</p>
					</button>
				))}
			</div>

			{/* سهم التنقل الأيمن */}
			<button
				className="absolute -right-4 z-10 hidden rounded-full bg-white p-2 shadow-md md:block"
				onClick={handleScrollRight}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 w-6 text-gray-600"
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