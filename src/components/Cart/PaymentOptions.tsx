"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Smartphone, Wallet, Banknote, Check, Lock } from "lucide-react";

type PaymentMethod = "apple_pay" | "stc_pay" | "card" | "cash" | "kaidha";

interface PaymentOptionsProps {
	language: "en" | "ar";
	selectedMethod: PaymentMethod | null;
	onMethodSelect: (method: PaymentMethod) => void;
}

const paymentMethods: Array<{
	id: PaymentMethod;
	labelEn: string;
	labelAr: string;
	icon: React.ComponentType<{ className?: string }>;
	descriptionEn?: string;
	descriptionAr?: string;
	requiresDetails?: boolean;
}> = [
	{
		id: "apple_pay",
		labelEn: "Apple Pay",
		labelAr: "Apple Pay",
		icon: Smartphone,
	},
	{
		id: "stc_pay",
		labelEn: "STC Pay",
		labelAr: "STC Pay",
		icon: Smartphone,
	},
	{
		id: "card",
		labelEn: "Credit/Debit Card",
		labelAr: "بطاقة ائتمانية/مدفوعة مسبقاً",
		icon: CreditCard,
		requiresDetails: true,
	},
	{
		id: "cash",
		labelEn: "Cash on Delivery",
		labelAr: "الدفع عند الاستلام",
		icon: Banknote,
		descriptionEn: "Pay upon delivery",
		descriptionAr: "ادفع عند الاستلام",
	},
	{
		id: "kaidha",
		labelEn: "Kaidha Wallet",
		labelAr: "قيدها",
		icon: Wallet,
	},
];

export default function PaymentOptions({
	language,
	selectedMethod,
	onMethodSelect,
}: PaymentOptionsProps) {
	const isArabic = language === "ar";
	const [cardDetails, setCardDetails] = useState({
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardholderName: "",
	});

	const selectedPayment = paymentMethods.find(m => m.id === selectedMethod);
	const showCardForm = selectedMethod === "card" && selectedPayment?.requiresDetails;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5"
		>
			<div className="flex items-center gap-2 mb-4">
				<Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
				<h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic ? "طريقة الدفع" : "Payment Method"}
				</h3>
			</div>

			<div className="space-y-2">
				{paymentMethods.map((method, index) => {
					const Icon = method.icon;
					const isSelected = selectedMethod === method.id;
					const label = isArabic ? method.labelAr : method.labelEn;

					return (
						<motion.div
							key={method.id}
							initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.2, delay: index * 0.05 }}
						>
							<motion.button
								onClick={() => onMethodSelect(method.id)}
								whileHover={{ scale: 1.01, y: -2 }}
								whileTap={{ scale: 0.99 }}
								className={`w-full p-4 border-2 rounded-xl transition-all ${
									isSelected
										? "border-emerald-500 dark:border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 shadow-md"
										: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-sm"
								} ${isArabic ? "text-right" : "text-left"}`}
							>
								<div className={`flex items-center justify-between gap-3`}>
									<div className={`flex items-center gap-3 flex-1`}>
										<motion.div
											animate={{
												scale: isSelected ? 1.1 : 1,
												backgroundColor: isSelected ? "#10b981" : undefined,
											}}
											className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
												isSelected 
													? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg" 
													: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
											}`}
										>
											<Icon className="w-6 h-6" />
										</motion.div>
										<div className="flex-1">
											<p className="font-semibold text-gray-900 dark:text-gray-100">{label}</p>
											{method.descriptionEn && (
												<p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
													{isArabic ? method.descriptionAr : method.descriptionEn}
												</p>
											)}
										</div>
									</div>
									{isSelected && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg"
										>
											<Check className="w-4 h-4 text-white" />
										</motion.div>
									)}
								</div>
							</motion.button>
						</motion.div>
					);
				})}
			</div>

			{/* Card Details Form */}
			<AnimatePresence>
				{showCardForm && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden"
					>
						<div className="space-y-3">
							<div>
								<label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "رقم البطاقة" : "Card Number"}
								</label>
								<input
									type="text"
									value={cardDetails.cardNumber}
									onChange={(e) => {
										const value = e.target.value.replace(/\D/g, '').slice(0, 16);
										const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
										setCardDetails(prev => ({ ...prev, cardNumber: formatted }));
									}}
									placeholder={isArabic ? "1234 5678 9012 3456" : "1234 5678 9012 3456"}
									className={`w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
										isArabic ? "text-right" : "text-left"
									}`}
									dir="ltr"
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic ? "تاريخ الانتهاء" : "Expiry Date"}
									</label>
									<input
										type="text"
										value={cardDetails.expiryDate}
										onChange={(e) => {
											const value = e.target.value.replace(/\D/g, '').slice(0, 4);
											const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
											setCardDetails(prev => ({ ...prev, expiryDate: formatted }));
										}}
										placeholder={isArabic ? "MM/YY" : "MM/YY"}
										className={`w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
											isArabic ? "text-right" : "text-left"
										}`}
										dir="ltr"
									/>
								</div>
								<div>
									<label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic ? "CVV" : "CVV"}
									</label>
									<input
										type="text"
										value={cardDetails.cvv}
										onChange={(e) => {
											const value = e.target.value.replace(/\D/g, '').slice(0, 3);
											setCardDetails(prev => ({ ...prev, cvv: value }));
										}}
										placeholder="123"
										className={`w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
											isArabic ? "text-right" : "text-left"
										}`}
										dir="ltr"
									/>
								</div>
							</div>
							<div>
								<label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ${isArabic ? "text-right" : "text-left"}`}>
									{isArabic ? "اسم حامل البطاقة" : "Cardholder Name"}
								</label>
								<input
									type="text"
									value={cardDetails.cardholderName}
									onChange={(e) => setCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
									placeholder={isArabic ? "اسم حامل البطاقة" : "Cardholder Name"}
									className={`w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
										isArabic ? "text-right" : "text-left"
									}`}
									dir={isArabic ? "rtl" : "ltr"}
								/>
							</div>
							<div className="flex items-center gap-2 pt-2">
								<Lock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{isArabic ? "معلوماتك محمية ومشفرة" : "Your information is secure and encrypted"}
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{selectedMethod === "cash" && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className={`mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl ${isArabic ? "text-right" : "text-left"}`}
				>
					<p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
						{isArabic ? "سيتم الدفع عند استلام الطلب" : "You will pay upon delivery"}
					</p>
				</motion.div>
			)}
		</motion.div>
	);
}
