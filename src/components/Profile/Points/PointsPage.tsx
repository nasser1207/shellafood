"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaStar, FaGift, FaExclamationTriangle, FaHistory, FaTag } from "react-icons/fa";
import PointCard from "./PointCard";

interface Offer {
	image: string;
	title: string;
	price: string;
	points: number;
	expirationDate?: string;
}

export default function PointsPage() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const [activeTab, setActiveTab] = useState("offers");

	// Bilingual content
	const content = {
		ar: {
			title: "نقاطي",
			subtitle: "إدارة نقاطك المكتسبة والعروض المتاحة",
			pointsTab: "العروض",
			historyTab: "السجل",
			pointsBalance: "500 نقطة",
			viewHistory: "عرض السجل",
			couponsBalance: "0 قسيمة",
			viewCoupons: "عرض القسائم",
			expirationAlert: "200 نقطة تنتهي صلاحيتها في 2/2/2025",
			noOffersAvailable: "لا توجد عروض متاحة حالياً",
			noHistoryAvailable: "لا يوجد سجل نقاط",
			offers: [
				{
					image: "/byrger.png",
					title: "خصم 10.00 رس على بيغ تيستي",
					price: "خصم 10.00 رس",
					points: 600,
					expirationDate: "2/2/2025"
				},
				{
					image: "/coffe.png",
					title: "خصم 15.00 رس على قهوة لاتيه",
					price: "خصم 15.00 رس",
					points: 800,
					expirationDate: "5/2/2025"
				},
				{
					image: "/restaurent.png",
					title: "خصم 20.00 رس على طلب المطعم",
					price: "خصم 20.00 رس",
					points: 1000,
					expirationDate: "10/2/2025"
				},
				{
					image: "/supermarket.png",
					title: "خصم 25.00 رس على طلب السوبر ماركت",
					price: "خصم 25.00 رس",
					points: 1200,
					expirationDate: "15/2/2025"
				},
				{
					image: "/byrger.png",
					title: "خصم 30.00 رس على طلب كبير",
					price: "خصم 30.00 رس",
					points: 1500,
					expirationDate: "20/2/2025"
				},
				{
					image: "/coffe.png",
					title: "خصم 12.00 رس على مشروب ساخن",
					price: "خصم 12.00 رس",
					points: 700,
					expirationDate: "25/2/2025"
				}
			],
			history: [
				{
					image: "/byrger.png",
					title: "استخدمت 600 نقطة لخصم 10.00 رس",
					price: "خصم 10.00 رس",
					points: 600,
					expirationDate: "1/2/2025"
				},
				{
					image: "/coffe.png",
					title: "استخدمت 800 نقطة لخصم 15.00 رس",
					price: "خصم 15.00 رس",
					points: 800,
					expirationDate: "28/1/2025"
				}
			]
		},
		en: {
			title: "My Points",
			subtitle: "Manage your earned points and available offers",
			pointsTab: "Offers",
			historyTab: "History",
			pointsBalance: "500 Points",
			viewHistory: "View History",
			couponsBalance: "0 Coupons",
			viewCoupons: "View Coupons",
			expirationAlert: "200 points expire on 2/2/2025",
			noOffersAvailable: "No offers available at the moment",
			noHistoryAvailable: "No points history",
			offers: [
				{
					image: "/byrger.png",
					title: "10.00 SAR discount on Big Tasty",
					price: "10.00 SAR off",
					points: 600,
					expirationDate: "2/2/2025"
				},
				{
					image: "/coffe.png",
					title: "15.00 SAR discount on Latte Coffee",
					price: "15.00 SAR off",
					points: 800,
					expirationDate: "5/2/2025"
				},
				{
					image: "/restaurent.png",
					title: "20.00 SAR discount on Restaurant Order",
					price: "20.00 SAR off",
					points: 1000,
					expirationDate: "10/2/2025"
				},
				{
					image: "/supermarket.png",
					title: "25.00 SAR discount on Supermarket Order",
					price: "25.00 SAR off",
					points: 1200,
					expirationDate: "15/2/2025"
				},
				{
					image: "/byrger.png",
					title: "30.00 SAR discount on Large Order",
					price: "30.00 SAR off",
					points: 1500,
					expirationDate: "20/2/2025"
				},
				{
					image: "/coffe.png",
					title: "12.00 SAR discount on Hot Drink",
					price: "12.00 SAR off",
					points: 700,
					expirationDate: "25/2/2025"
				}
			],
			history: [
				{
					image: "/byrger.png",
					title: "Used 600 points for 10.00 SAR discount",
					price: "10.00 SAR off",
					points: 600,
					expirationDate: "1/2/2025"
				},
				{
					image: "/coffe.png",
					title: "Used 800 points for 15.00 SAR discount",
					price: "15.00 SAR off",
					points: 800,
					expirationDate: "28/1/2025"
				}
			]
		}
	};

	const currentContent = content[language];
	const currentOffers = activeTab === "offers" ? currentContent.offers : currentContent.history;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Header */}
				<div className="mb-6 sm:mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className={`flex items-center gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
							<div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
								<FaStar className="text-green-600 dark:text-green-400 text-lg" />
							</div>
							<div className={isArabic ? 'text-right' : 'text-left'}>
								<h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
									{currentContent.title}
								</h1>
								<p className="text-gray-600 dark:text-gray-400 text-sm">
									{currentContent.subtitle}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Points and Coupons Summary */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
					{/* Points Card */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className={`flex items-center justify-between ${isArabic ? 'flex-row' : 'flex-row'}`}>
							<div className={`flex flex-col gap-1 ${isArabic ? 'text-right' : 'text-left'}`}>
								<span className="text-xl font-bold text-gray-800 dark:text-gray-200">
									{currentContent.pointsBalance}
								</span>
								<span className="text-sm text-green-600 dark:text-green-400 font-medium">
									{currentContent.viewHistory}
								</span>
							</div>
							<div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
								<FaStar className="text-green-600 dark:text-green-400 text-xl" />
							</div>
						</div>
					</div>

					{/* Coupons Card */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className={`flex items-center justify-between ${isArabic ? 'flex-row' : 'flex-row'}`}>
							<div className={`flex flex-col gap-1 ${isArabic ? 'text-right' : 'text-left'}`}>
								<span className="text-xl font-bold text-gray-800">
									{currentContent.couponsBalance}
								</span>
								<span className="text-sm text-green-600 font-medium">
									{currentContent.viewCoupons}
								</span>
							</div>
							<div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
								<FaGift className="text-green-600 text-xl" />
							</div>
						</div>
					</div>
				</div>

				{/* Expiration Alert */}
				<div className={`mb-6 flex items-center gap-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 ${isArabic ? 'flex-row' : 'flex-row'}`}>
					<div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
						<FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 text-sm" />
					</div>
					<span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
						{currentContent.expirationAlert}
					</span>
				</div>

				{/* Tabs */}
				<div className="mb-6" dir={direction}>
					<div className="flex justify-center gap-8 items-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
						<button
							onClick={() => setActiveTab("offers")}
							className={`py-3 px-4 text-sm md:text-lg font-medium rounded-lg transition-all duration-200 ${
								activeTab === "offers"
									? "bg-green-500 dark:bg-green-600 text-white shadow-sm"
									: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
							}`}
						>
							{currentContent.pointsTab}
						</button>
						<button
							onClick={() => setActiveTab("history")}
							className={`py-3 px-4 text-sm md:text-lg font-medium rounded-lg transition-all duration-200 ${
								activeTab === "history"
									? "bg-green-500 text-white shadow-sm"
									: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							}`}
						>
							{currentContent.historyTab}
						</button>
					</div>
				</div>

				{/* Offers/History Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
					{currentOffers.length > 0 ? (
						currentOffers.map((offer, index) => (
							<PointCard
								key={index}
								offer={offer}
								isArabic={isArabic}
							/>
						))
					) : (
						<div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
							<div className="flex flex-col items-center gap-4">
								<div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
									{activeTab === "offers" ? (
										<FaTag className="w-8 h-8 text-gray-400 dark:text-gray-500" />
									) : (
										<FaHistory className="w-8 h-8 text-gray-400 dark:text-gray-500" />
									)}
								</div>
								<div>
									<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
										{activeTab === "offers" ? currentContent.noOffersAvailable : currentContent.noHistoryAvailable}
									</h3>
									<p className="text-gray-500 dark:text-gray-400 text-sm">
										{isArabic ? 'تحقق مرة أخرى لاحقاً للحصول على عروض جديدة' : 'Check back later for new offers'}
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
