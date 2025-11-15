"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import VoucherCard from "./VoucherCard";

interface Voucher {
	title: string;
	subtitle: string;
	details: string[];
	expirationDate: string;
}

export default function VouchersPage() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const [activeTab, setActiveTab] = useState("available");

	// Bilingual content
	const content = {
		ar: {
			title: "قسائمي",
			subtitle: "إدارة القسائم والخصومات المتاحة",
			availableTab: "المتاحة",
			expiredTab: "منتهية الصلاحية",
			noVouchersAvailable: "لا توجد قسائم متاحة حالياً",
			noVouchersExpired: "لا توجد قسائم منتهية الصلاحية",
			vouchers: [
				{
					title: "30% خصم",
					subtitle: "بدون حد أدنى",
					details: [
						"خصم 30% وفر حتى 50 رس",
						"طلبات التوصيل فقط",
						"خصم يصل إلى 50 رس",
					],
					expirationDate: "صالح حتى 20/3/2025 11:59 م",
				},
				{
					title: "50% خصم",
					subtitle: "للطلبات أكثر من 100 رس",
					details: [
						"خصم 50% وفر حتى 100 رس",
						"طلبات التوصيل والتجميع",
						"خصم يصل إلى 100 رس",
					],
					expirationDate: "صالح حتى 15/4/2025 11:59 م",
				},
				{
					title: "20% خصم",
					subtitle: "للطلبات الأولى",
					details: [
						"خصم 20% للطلبات الأولى",
						"جميع أنواع الطلبات",
						"خصم يصل إلى 30 رس",
					],
					expirationDate: "صالح حتى 10/5/2025 11:59 م",
				},
			],
			expiredVouchers: [
				{
					title: "25% خصم",
					subtitle: "منتهي الصلاحية",
					details: [
						"خصم 25% وفر حتى 40 رس",
						"طلبات التوصيل فقط",
						"خصم يصل إلى 40 رس",
					],
					expirationDate: "انتهت في 15/2/2025 11:59 م",
				},
			]
		},
		en: {
			title: "My Vouchers",
			subtitle: "Manage your available vouchers and discounts",
			availableTab: "Available",
			expiredTab: "Expired",
			noVouchersAvailable: "No vouchers available at the moment",
			noVouchersExpired: "No expired vouchers",
			vouchers: [
				{
					title: "30% Off",
					subtitle: "No minimum order",
					details: [
						"30% discount save up to 50 SAR",
						"Delivery orders only",
						"Discount up to 50 SAR",
					],
					expirationDate: "Valid until 20/3/2025 11:59 PM",
				},
				{
					title: "50% Off",
					subtitle: "Orders over 100 SAR",
					details: [
						"50% discount save up to 100 SAR",
						"Delivery and pickup orders",
						"Discount up to 100 SAR",
					],
					expirationDate: "Valid until 15/4/2025 11:59 PM",
				},
				{
					title: "20% Off",
					subtitle: "First time orders",
					details: [
						"20% discount for first orders",
						"All order types",
						"Discount up to 30 SAR",
					],
					expirationDate: "Valid until 10/5/2025 11:59 PM",
				},
			],
			expiredVouchers: [
				{
					title: "25% Off",
					subtitle: "Expired",
					details: [
						"25% discount save up to 40 SAR",
						"Delivery orders only",
						"Discount up to 40 SAR",
					],
					expirationDate: "Expired on 15/2/2025 11:59 PM",
				},
			]
		}
	};

	const currentContent = content[language];
	const currentVouchers = activeTab === "available" ? currentContent.vouchers : currentContent.expiredVouchers;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Header */}
				<div className="mb-6 sm:mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className={`flex items-center gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
							<div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
								<svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
								</svg>
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

				{/* Tabs */}
				<div className="mb-6" dir={direction}>
						<div className="flex justify-center gap-8 items-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
							<button
								onClick={() => setActiveTab("available")}
								className={` py-3 px-4 text-sm md:text-lg font-medium rounded-lg transition-all duration-200 ${
									activeTab === "available"
										? "bg-green-500 dark:bg-green-600 text-white shadow-sm"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
								}`}
							>
								{currentContent.availableTab}
							</button>
							<button
								onClick={() => setActiveTab("expired")}
								className={` py-3 px-4 text-sm md:text-lg font-medium rounded-lg transition-all duration-200 ${
									activeTab === "expired"
										? "bg-green-500 text-white shadow-sm"
										: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
								}`}
							>
								{currentContent.expiredTab}
							</button>
						</div>
			
				</div>

				{/* Vouchers List */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
					{currentVouchers.length > 0 ? (
						currentVouchers.map((voucher, index) => (
							<VoucherCard
								key={index}
								voucher={voucher}
								isExpired={activeTab === "expired"}
								isArabic={isArabic}
							/>
						))
					) : (
						<div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
							<div className="flex flex-col items-center gap-4">
								<div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
									<svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
									</svg>
								</div>
								<div>
									<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
										{activeTab === "available" ? currentContent.noVouchersAvailable : currentContent.noVouchersExpired}
									</h3>
									<p className="text-gray-500 dark:text-gray-400 text-sm">
										{isArabic ? 'تحقق مرة أخرى لاحقاً للحصول على قسائم جديدة' : 'Check back later for new vouchers'}
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
