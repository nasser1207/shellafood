// MealDetailsPage.tsx

"use client";

import { useState, useEffect } from "react";

interface Meal {
	id: number;
	name: string;
	price: string;
	image: string;
	section: string;
	description: string;
}

interface MealDetailsPageProps {
	mealId: number;
}

export default function MealDetailsPage({ mealId }: MealDetailsPageProps) {
	const [meal, setMeal] = useState<Meal | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchMealDetails = async () => {
			try {
				const response = await fetch(`/api/meals/${mealId}`);
				if (response.ok) {
					const data = await response.json();
					setMeal(data.meal);
				} else {
					console.error("فشل في جلب تفاصيل الوجبة");
				}
			} catch (error) {
				console.error("خطأ في جلب تفاصيل الوجبة:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMealDetails();
	}, [mealId]);

	// عرض حالة التحميل
	if (isLoading) {
		return (
			<div className="p-4 md:p-8" dir="rtl">
				<div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg shadow-md md:h-80">
					<div className="h-full w-full animate-pulse bg-gray-300"></div>
				</div>
				<div className="text-right">
					<div className="h-8 w-3/4 animate-pulse bg-gray-300 rounded mb-2"></div>
					<div className="h-6 w-24 animate-pulse bg-gray-300 rounded mb-4"></div>
					<div className="h-4 w-full animate-pulse bg-gray-300 rounded mb-2"></div>
					<div className="h-4 w-2/3 animate-pulse bg-gray-300 rounded"></div>
				</div>
			</div>
		);
	}

	if (!meal) {
		return (
			<div className="p-8 text-center text-red-600">
				عذراً، الوجبة غير موجودة.
			</div>
		);
	}

	return (
		<div className="p-4 md:p-8" dir="rtl">
			<div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg shadow-md md:h-80">
				<img
					src={meal.image}
					alt={meal.name}
					className="h-full w-full object-cover"
				/>
			</div>

			<div className="text-right">
				<h1 className="text-2xl font-bold text-gray-900">{meal.name}</h1>
				<p className="mt-2 text-lg font-semibold text-green-600">
					{meal.price}
				</p>
				<p className="mt-4 text-gray-600">{meal.description}</p>
			</div>

			<div className="fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between bg-green-700 p-4 text-white shadow-lg">
				<span className="text-lg font-bold">{meal.price}</span>
				<button className="flex items-center rounded-full bg-white px-6 py-2 font-semibold text-green-700 transition-colors hover:bg-gray-100">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="ml-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					أضف إلى السلة
				</button>
			</div>
		</div>
	);
}
