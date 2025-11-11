// RestaurantSectionsPage.tsx

"use client";

import { useState, useEffect } from "react";

interface Restaurant {
	id: number;
	name: string;
	image: string;
	type?: string;
	rating?: string;
}

interface RestaurantSectionsPageProps {
	restaurantId: number;
	onSectionClick: (sectionName: string, restaurantId: number) => void;
}

export default function RestaurantSectionsPage({
	restaurantId,
	onSectionClick,
}: RestaurantSectionsPageProps) {
	const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
	const [sections, setSections] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRestaurantDetails = async () => {
			try {
				// جلب تفاصيل المطعم
				const restaurantResponse = await fetch(`/api/restaurants/${restaurantId}`);
				if (restaurantResponse.ok) {
					const restaurantData = await restaurantResponse.json();
					setRestaurant(restaurantData.restaurant);
				}

				// جلب أقسام المطعم
				const sectionsResponse = await fetch(`/api/restaurants/${restaurantId}/sections`);
				if (sectionsResponse.ok) {
					const sectionsData = await sectionsResponse.json();
					setSections(sectionsData.sections || []);
				}
			} catch (error) {
				console.error("خطأ في جلب تفاصيل المطعم:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRestaurantDetails();
	}, [restaurantId]);

	// عرض حالة التحميل
	if (isLoading) {
		return (
			<div className="p-4 md:p-8" dir="rtl">
				<div className="relative mb-8 h-48 w-full overflow-hidden rounded-lg shadow-md md:h-64">
					<div className="h-full w-full animate-pulse bg-gray-300"></div>
				</div>
				<div className="h-6 w-32 animate-pulse bg-gray-300 rounded mb-4"></div>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{[1, 2, 3, 4, 5, 6].map((item) => (
						<div key={item} className="rounded-lg bg-gray-100 p-4 text-center shadow-sm">
							<div className="h-6 w-full animate-pulse bg-gray-300 rounded"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!restaurant || sections.length === 0) {
		return (
			<div className="p-8 text-center text-red-600">المطعم غير موجود أو لا يحتوي على أقسام.</div>
		);
	}

	return (
		<div className="p-4 md:p-8" dir="rtl">
			<div className="relative mb-8 h-48 w-full overflow-hidden rounded-lg shadow-md md:h-64">
				<img
					src={restaurant.image}
					alt={restaurant.name}
					className="h-full w-full object-cover"
				/>
				<div className="absolute inset-0 flex items-end bg-black/40 p-4 text-white">
					<h1 className="text-2xl font-bold">{restaurant.name}</h1>
				</div>
			</div>

			<h2 className="mb-4 text-xl font-bold text-gray-900">أقسام المطعم</h2>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
				{sections.map((section: string) => (
					<button
						key={section}
						onClick={() => onSectionClick(section, restaurantId)}
						className="rounded-lg bg-gray-100 p-4 text-center shadow-sm transition-colors hover:bg-gray-200"
					>
						<p className="text-md font-semibold text-gray-800">{section}</p>
					</button>
				))}
			</div>
		</div>
	);
}
