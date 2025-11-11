"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Step {
	id: string;
	path: string;
	labelEn: string;
	labelAr: string;
}

interface StepperNavigationProps {
	service: string;
	serviceType: string;
}

export default function StepperNavigation({ service, serviceType }: StepperNavigationProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const pathname = usePathname();
	const router = useRouter();

	const steps: Step[] = [
		{
			id: "details",
			path: `/serve-me/${service}/${serviceType}/book/details`,
			labelEn: "Details",
			labelAr: "التفاصيل",
		},
		{
			id: "summary",
			path: `/serve-me/${service}/${serviceType}/book/summary`,
			labelEn: "Summary",
			labelAr: "الملخص",
		},
		{
			id: "choose-worker",
			path: `/serve-me/${service}/${serviceType}/book/choose-worker`,
			labelEn: "Choose Worker",
			labelAr: "اختر العامل",
		},
		{
			id: "payment",
			path: `/serve-me/${service}/${serviceType}/book/payment`,
			labelEn: "Payment",
			labelAr: "الدفع",
		},
		{
			id: "confirmation",
			path: `/serve-me/${service}/${serviceType}/book/confirmation`,
			labelEn: "Confirmation",
			labelAr: "التأكيد",
		},
	];

	const actualCurrentStepIndex = steps.findIndex((step) => pathname?.includes(step.path));
	const safeCurrentStepIndex = actualCurrentStepIndex >= 0 ? actualCurrentStepIndex : 0;

	// Prefetch next steps for faster navigation
	useEffect(() => {
		const nextStepIndex = safeCurrentStepIndex + 1;
		if (nextStepIndex < steps.length) {
			router.prefetch(steps[nextStepIndex].path);
		}
		// Prefetch all steps on mount for instant navigation
		steps.forEach((step) => {
			router.prefetch(step.path);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [service, serviceType, safeCurrentStepIndex]);

	return (
		<div className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-start justify-between">
					{steps.map((step, index) => {
						const isCompleted = index < safeCurrentStepIndex;
						const isActive = index === safeCurrentStepIndex;

						return (
							<React.Fragment key={step.id}>
								{/* Step */}
								<div className={`flex items-start flex-1 `}>
									<Link
										href={step.path}
										prefetch={true}
										className="flex flex-col items-center flex-1 min-w-0 cursor-pointer group"
										aria-label={isArabic ? step.labelAr : step.labelEn}
									>
										{/* Step Circle */}
										<div
											className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 z-10 ${
												isActive
													? "border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white scale-110 shadow-lg shadow-green-500/30"
													: isCompleted
														? "border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500 text-white shadow-md group-hover:scale-105"
														: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:border-green-400 dark:group-hover:border-green-500"
											}`}
										>
											{isCompleted ? (
												<Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={3} />
											) : (
												<span className="text-sm sm:text-base font-bold">{index + 1}</span>
											)}
										</div>

										{/* Step Label */}
										<div
											className={`mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-center max-w-[80px] sm:max-w-[100px] leading-tight transition-colors ${
												isActive 
													? "text-green-600 dark:text-green-400 font-bold" 
													: isCompleted 
														? "text-green-600 dark:text-green-400" 
														: "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
											}`}
										>
											{isArabic ? step.labelAr : step.labelEn}
										</div>
									</Link>

									{/* Connector Line */}
									{index < steps.length - 1 && (
										<div
											className={`flex-1 h-1 mx-2 sm:mx-3 lg:mx-4 transition-all duration-300 relative top-5 sm:top-6 ${
												isCompleted || isActive 
													? "bg-green-600 dark:bg-green-500" 
													: "bg-gray-300 dark:bg-gray-700"
											}`}
										/>
									)}
								</div>
							</React.Fragment>
						);
					})}
				</div>
			</div>
		</div>
	);
}

