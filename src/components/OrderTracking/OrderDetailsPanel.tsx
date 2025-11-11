"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Package, CreditCard, MapPin, Phone, Info } from "lucide-react";

interface OrderDetailsPanelProps {
	language: "en" | "ar";
	items?: Array<{
		name: string;
		nameAr?: string;
		quantity: number;
		price: number;
	}>;
	paymentMethod: string;
	address: string;
	totalAmount: number;
	supportPhone?: string;
}

interface AccordionSectionProps {
	title: string;
	titleAr?: string;
	icon: React.ComponentType<{ className?: string }>;
	isOpen: boolean;
	onToggle: () => void;
	language: "en" | "ar";
	children: React.ReactNode;
}

function AccordionSection({
	title,
	titleAr,
	icon: Icon,
	isOpen,
	onToggle,
	language,
	children,
}: AccordionSectionProps) {
	const isArabic = language === "ar";
	const displayTitle = isArabic ? titleAr || title : title;

	return (
		<div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
			<button
				onClick={onToggle}
				className={`w-full p-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
			>
				<div className={`flex items-center gap-3 ${isArabic ? "flex-row-reverse" : ""}`}>
					<Icon className="w-5 h-5 text-[#10b981]" />
					<span className="font-semibold text-gray-900 dark:text-white">{displayTitle}</span>
				</div>
				{isOpen ? (
					<ChevronUp className="w-5 h-5 text-gray-500" />
				) : (
					<ChevronDown className="w-5 h-5 text-gray-500" />
				)}
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className={`p-4 bg-white dark:bg-[#1B1D22] ${isArabic ? "text-right" : "text-left"}`}>
							{children}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default function OrderDetailsPanel({
	language,
	items,
	paymentMethod,
	address,
	totalAmount,
	supportPhone,
}: OrderDetailsPanelProps) {
	const isArabic = language === "ar";
	const [openSections, setOpenSections] = useState({
		items: false,
		payment: false,
		address: false,
		support: false,
	});

	const toggleSection = (section: keyof typeof openSections) => {
		setOpenSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	return (
		<div className="bg-white dark:bg-[#1B1D22] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6 space-y-4">
			<h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 ${isArabic ? "text-right" : "text-left"}`}>
				{isArabic ? "تفاصيل الطلب" : "Order Details"}
			</h2>

			{/* Items Section */}
			{items && items.length > 0 && (
				<AccordionSection
					title="Order Items"
					titleAr="عناصر الطلب"
					icon={Package}
					isOpen={openSections.items}
					onToggle={() => toggleSection("items")}
					language={language}
				>
					<div className="space-y-3">
						{items.map((item, index) => (
							<div
								key={index}
								className={`flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 ${isArabic ? "flex-row-reverse" : ""}`}
							>
								<span className="text-sm text-gray-700 dark:text-gray-300">
									{isArabic ? item.nameAr || item.name : item.name} × {item.quantity}
								</span>
								<span className="text-sm font-semibold text-gray-900 dark:text-white">
									{(item.price * item.quantity).toFixed(2)} {isArabic ? "ريال" : "SAR"}
								</span>
							</div>
						))}
						<div className={`pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between ${isArabic ? "flex-row-reverse" : ""}`}>
							<span className="font-bold text-gray-900 dark:text-white">
								{isArabic ? "المجموع:" : "Total:"}
							</span>
							<span className="text-lg font-extrabold text-[#10b981]">
								{totalAmount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
							</span>
						</div>
					</div>
				</AccordionSection>
			)}

			{/* Payment Section */}
			<AccordionSection
				title="Payment"
				titleAr="الدفع"
				icon={CreditCard}
				isOpen={openSections.payment}
				onToggle={() => toggleSection("payment")}
				language={language}
			>
				<div className={`space-y-2 ${isArabic ? "text-right" : "text-left"}`}>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{isArabic ? "طريقة الدفع:" : "Payment Method:"}
					</p>
					<p className="font-semibold text-gray-900 dark:text-white">{paymentMethod}</p>
					<p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
						{isArabic ? "المبلغ المدفوع:" : "Amount Paid:"}
					</p>
					<p className="text-lg font-bold text-[#10b981]">
						{totalAmount.toFixed(2)} {isArabic ? "ريال" : "SAR"}
					</p>
				</div>
			</AccordionSection>

			{/* Address Section */}
			<AccordionSection
				title="Delivery Address"
				titleAr="عنوان التوصيل"
				icon={MapPin}
				isOpen={openSections.address}
				onToggle={() => toggleSection("address")}
				language={language}
			>
				<div className={`flex items-start gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
					<MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
					<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{address}</p>
				</div>
			</AccordionSection>

			{/* Support Section */}
			<AccordionSection
				title="Support"
				titleAr="الدعم"
				icon={Info}
				isOpen={openSections.support}
				onToggle={() => toggleSection("support")}
				language={language}
			>
				<div className={`space-y-3 ${isArabic ? "text-right" : "text-left"}`}>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{isArabic ? "تحتاج مساعدة؟" : "Need help?"}
					</p>
					{supportPhone && (
						<a
							href={`tel:${supportPhone}`}
							className={`inline-flex items-center gap-2 px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm transition-colors ${isArabic ? "flex-row-reverse" : ""}`}
						>
							<Phone className="w-4 h-4" />
							<span>{isArabic ? "اتصل بالدعم" : "Contact Support"}</span>
						</a>
					)}
				</div>
			</AccordionSection>
		</div>
	);
}

