"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import DeliveryAddressSelector from "./DeliveryAddressSelector";

interface DeliveryAddressHeroProps {
	onAddressChange?: (address: any) => void;
}

export default function DeliveryAddressHero({ onAddressChange }: DeliveryAddressHeroProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";

	return (
		<motion.section
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="relative overflow-hidden bg-gradient-to-br from-[#10b981]/5 dark:from-[#10b981]/10 via-white dark:via-gray-900 to-gray-50 dark:to-gray-800 pb-8 pt-6 sm:pb-12 sm:pt-8"
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMyIDIgNSAyIDcgMGw0LTQtNy03LTQtNGMtMi0yLTItNSAwLTdsNC00IDctNyA0LTRjMi0yIDUtMiA3IDBsNCA0IDcgNyA0IDRjMiAyIDIgNSAwIDdsLTQgNC03IDctNCA0Yy0yIDItNSAyLTcgMGwtNC00LTctNy00LTR6IiBzdHJva2U9IiMxMGI5ODEiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4=')]" />
			</div>

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Address Selector Card */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className="mb-8"
				>
					<div className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-lg ring-1 ring-gray-200/50 dark:ring-gray-700/50 sm:p-6">
						<div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-emerald-600 shadow-md">
								<MapPin className="h-6 w-6 text-white" />
							</div>
							<div className="flex-1">
								<p className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "عنوان التوصيل" : "Delivery Address"}
								</p>
							</div>
						</div>
						<div className="mt-4">
							<DeliveryAddressSelector onAddressChange={onAddressChange} />
						</div>
					</div>
				</motion.div>
			</div>
		</motion.section>
	);
}

