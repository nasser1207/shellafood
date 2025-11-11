// src/components/Partner/PartnerBenefits.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { 
	CheckCircle2, 
	Truck, 
	Lightbulb, 
	History, 
	DollarSign, 
	BarChart3, 
	Target 
} from "lucide-react";

export default function PartnerBenefits() {
	const { t, language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<section className="rounded-lg bg-[#FFFFFF] dark:bg-gray-900 p-6 md:p-12" dir={direction}>
			<div className="container mx-auto px-4 md:px-12">
				<h2 className="mb-12 text-center font-['Readex_Pro'] text-4xl font-semibold text-gray-800 dark:text-gray-100 md:text-[39px]">
					{t("partner.benefits")}{" "}
					<span className="text-[#31A342] dark:text-green-400">{t("company.name")}</span>
				</h2>
			</div>
			<div className="container mx-auto border-2 border-[#31A342] dark:border-green-500 px-4 md:px-12">
				{/* Container for the benefits grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{/* Benefit 4: رسوم مخفضة */}
					<div
						className="flex cursor-pointer flex-col items-center p-4 text-center"
						onClick={() => {
							window.location.href = "/BenefitPage";
						}}
					>
						<div className="flex h-24 w-24 items-center justify-center rounded-full p-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r text-green-600">
								<Target className="h-20 w-20" />
							</div>
						</div>
						<h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
							{t("partner.benefit1.title")}
						</h3>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{t("partner.benefit1.description")}
						</p>
					</div>

					{/* Benefit 3: توسيع نقاط البيع */}
					<div
						className="flex cursor-pointer flex-col items-center p-4 text-center"
						onClick={() => {
							window.location.href = "/PointOfSale";
						}}
					>
						<div className="flex h-24 w-24 items-center justify-center rounded-full p-4 text-green-600">
							<CheckCircle2 className="h-20 w-20" />
						</div>
						<h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
							{t("partner.benefit2.title")}
						</h3>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{t("partner.benefit2.description")}
						</p>
					</div>

					{/* Benefit 1: أرباح أعلى وطلبات أكثر */}
					<div
						className="flex cursor-pointer flex-col items-center p-4 text-center"
						onClick={() => {
							window.location.href = "/AddToMoney";
						}}
					>
						<div className="flex h-24 w-24 items-center justify-center rounded-full p-4 text-green-600">
							<DollarSign className="h-20 w-20" />
						</div>
						<h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
							{t("partner.benefit3.title")}
						</h3>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{t("partner.benefit3.description")}
						</p>
					</div>

					{/* Benefit 8: لا قلق بعد اليوم */}
					<div
						className="flex cursor-pointer flex-col items-center p-4 text-center"
						onClick={() => {
							window.location.href = "/ShippingPage";
						}}
					>
						<div className="flex h-24 w-24 items-center justify-center rounded-full p-4 text-green-600">
							<Truck className="h-20 w-20" />
						</div>
						<h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
							{t("partner.benefit4.title")}
						</h3>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{t("partner.benefit4.description")}
						</p>
					</div>

					{/* Benefit 7: إحصائيات البيع */}
					<div
						className="flex cursor-pointer flex-col items-center p-4 text-center"
						onClick={() => {
							window.location.href = "/SaleStatisticsPage";
						}}
					>
						<div className="flex h-24 w-24 items-center justify-center rounded-full p-4 text-green-600">
							<BarChart3 className="h-20 w-20" />
						</div>
						<h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
							{t("partner.benefit5.title")}
						</h3>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{t("partner.benefit5.description")}
						</p>
					</div>

					{/* Benefit 6: أبدع في عملك */}
					<div
						className="flex cursor-pointer flex-col items-center p-4 text-center"
						onClick={() => {
							window.location.href = "/CreativityWrokePage";
						}}
					>
						<div className="flex h-24 w-24 items-center justify-center rounded-full p-4 text-green-600">
							<Lightbulb className="h-20 w-20" />
						</div>
						<h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
							{t("partner.benefit6.title")}
						</h3>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{t("partner.benefit6.description")}
						</p>
					</div>

					{/* Benefit 5: خاصية التنبيه بالطلبات الجديدة */}
					<div
						className="flex cursor-pointer flex-col items-center p-4 text-center"
						onClick={() => {
							window.location.href = "/ManagmentOperationPage";
						}}
					>
						<div className="flex h-24 w-24 items-center justify-center rounded-full p-4 text-green-600">
							<History className="h-20 w-20" />
						</div>
						<h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">
							{t("partner.benefit7.title")}
						</h3>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							{t("partner.benefit7.description")}
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

