// src/components/Investor/InvestorFormSection.tsx
"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ContractModal from "./ContractModal";
import InvestorForm from "./InvestorForm";

export default function InvestorFormSection() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const handleOpenModal = () => {
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<section className="mb-6 rounded-xl bg-white dark:bg-gray-900 p-3 shadow-md dark:shadow-gray-900/50 sm:mb-8 sm:p-6 md:p-5" dir={direction}>
				<div className={`p-4 text-center font-['Readex_Pro'] text-2xl leading-none font-semibold tracking-normal text-gray-900 dark:text-gray-100 sm:p-10 sm:text-[39px] ${isArabic ? 'text-right' : 'text-left'}`}>
					<p>
						{isArabic ? "انضم إلى برنامج الاستثمار في" : "Join the Investment Program in"}{" "}
						<span className="text-green-600 dark:text-green-400 mt-2">{isArabic ? "شلة" : "Shella"}</span>{" "}
					</p>
				</div>

				{/* زر تحميل العقد */}
				<div className="mt-6 flex justify-center p-4 sm:mt-10 sm:p-8">
					<button
						onClick={handleOpenModal}
						className="flex w-full max-w-sm items-center justify-center rounded-lg border border-green-600 dark:border-green-500 bg-white dark:bg-gray-800 px-6 py-3 font-semibold text-green-600 dark:text-green-400 shadow-sm transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:outline-none sm:w-auto sm:px-10"
					>
						{isArabic ? "تحميل العقد" : "Download Contract"}
					</button>
				</div>

					<InvestorForm />
			</section>

		</>
	);
}
