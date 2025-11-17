"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface DailyNeededItem {
	id: string;
	name: string;
	nameAr: string;
	image: string;
	emoji: string;
}

const DAILY_NEEDED_ITEMS: DailyNeededItem[] = [
	{
		id: "1",
		name: "Fruits & Vegetables",
		nameAr: "خضار وفواكه",
		image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop",
		emoji: "🥬",
	},
	{
		id: "2",
		name: "Dairy Products",
		nameAr: "منتجات ألبان",
		image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
		emoji: "🥛",
	},
	{
		id: "3",
		name: "Meat & Poultry",
		nameAr: "لحوم ودواجن",
		image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
		emoji: "🍗",
	},
	{
		id: "4",
		name: "Bakery",
		nameAr: "مخبوزات",
		image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
		emoji: "🍞",
	},
	{
		id: "5",
		name: "Beverages",
		nameAr: "مشروبات",
		image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
		emoji: "🥤",
	},
	{
		id: "6",
		name: "Snacks",
		nameAr: "وجبات خفيفة",
		image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=300&fit=crop",
		emoji: "🍿",
	},
	{
		id: "7",
		name: "Cleaning Supplies",
		nameAr: "مواد تنظيف",
		image: "https://images.unsplash.com/photo-1584487227103-5d8b5e9a5c5b?w=400&h=300&fit=crop",
		emoji: "🧹",
	},
	{
		id: "8",
		name: "Personal Care",
		nameAr: "العناية الشخصية",
		image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
		emoji: "🧴",
	},
	{
		id: "9",
		name: "Frozen Foods",
		nameAr: "أطعمة مجمدة",
		image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop",
		emoji: "🧊",
	},
	{
		id: "10",
		name: "Canned Goods",
		nameAr: "معلبات",
		image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
		emoji: "🥫",
	},
	{
		id: "11",
		name: "Spices & Herbs",
		nameAr: "بهارات وأعشاب",
		image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
		emoji: "🌿",
	},
	{
		id: "12",
		name: "Rice & Grains",
		nameAr: "أرز وحبوب",
		image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
		emoji: "🌾",
	},
];

export default function DailyNeeded() {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();

	const handleItemClick = () => {
		router.push("/categories/supermarket/hyper-shella");
	};

	const title = isArabic ? "احتياجات يومية" : "Daily Needed";
	const description = isArabic 
		? "تسوق من هايبر شلة واحصل على كل ما تحتاجه"
		: "Shop from Hyper Shella and get everything you need";

	return (
		<div className="mb-8 sm:mb-12">
			{/* Header */}
			<div className="mb-4 sm:mb-6">
				<h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2">
					{title}
				</h2>
				<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
					{description}
				</p>
			</div>

			{/* Items Grid - 3 columns */}
			<div className="grid grid-cols-3 gap-2 sm:gap-3">
				{DAILY_NEEDED_ITEMS.map((item, index) => {
					const displayName = isArabic ? item.nameAr : item.name;
					return (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: index * 0.05 }}
							whileHover={{ y: -4 }}
							onClick={handleItemClick}
							className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
						>
							{/* Image - Smaller */}
							<div className="relative h-20 sm:h-24 overflow-hidden bg-gray-100 dark:bg-gray-700">
								<Image
									src={item.image}
									alt={displayName}
									fill
									className="object-cover group-hover:scale-110 transition-transform duration-500"
									unoptimized
								/>
								{/* Emoji Overlay - Smaller */}
								<div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-lg sm:text-xl bg-white/90 dark:bg-gray-800/90 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow-md">
									{item.emoji}
								</div>
							</div>

							{/* Content - Smaller */}
							<div className="p-2 sm:p-2.5">
								<h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white text-center group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
									{displayName}
								</h3>
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}

