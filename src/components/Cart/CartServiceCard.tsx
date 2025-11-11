"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Calendar, AlertCircle, Edit, Trash2, Wrench, User } from "lucide-react";

interface CartServiceItem {
	id: string;
	serviceId: string;
	serviceName: string;
	serviceNameAr?: string;
	serviceImage?: string;
	serviceType?: string;
	serviceTypeAr?: string;
	preferredDate?: string;
	preferredTime?: string;
	urgency: "normal" | "urgent" | "emergency";
	estimatedPrice?: number;
	confirmedPrice?: number;
	workerName?: string;
	workerPhoto?: string;
}

interface CartServiceCardProps {
	item: CartServiceItem;
	language: "en" | "ar";
	onEdit: (itemId: string) => void;
	onRemove: (itemId: string) => Promise<void>;
}

const urgencyConfig = {
	normal: { color: "bg-gray-100 text-gray-700", labelEn: "Normal", labelAr: "عادي" },
	urgent: { color: "bg-orange-100 text-orange-700", labelEn: "Urgent", labelAr: "عاجل" },
	emergency: { color: "bg-red-100 text-red-700", labelEn: "Emergency", labelAr: "طوارئ" },
};

export default function CartServiceCard({
	item,
	language,
	onEdit,
	onRemove,
}: CartServiceCardProps) {
	const isArabic = language === "ar";
	const [isRemoving, setIsRemoving] = useState(false);
	const [showConfirmRemove, setShowConfirmRemove] = useState(false);

	const urgency = urgencyConfig[item.urgency];
	const price = item.confirmedPrice || item.estimatedPrice || 0;

	const handleRemove = async () => {
		setIsRemoving(true);
		try {
			await onRemove(item.id);
		} finally {
			setIsRemoving(false);
			setShowConfirmRemove(false);
		}
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
			>
				<div className="p-4 sm:p-5">
					<div className={`flex items-start gap-4 `}>
						{/* Service Image */}
						{item.serviceImage ? (
							<div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
								<Image
									src={item.serviceImage}
									alt={isArabic ? item.serviceNameAr || item.serviceName : item.serviceName}
									fill
									className="object-cover"
									sizes="96px"
								/>
							</div>
						) : (
							<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/20 flex items-center justify-center flex-shrink-0">
								<Wrench className="w-8 h-8 text-[#10b981]" />
							</div>
						)}

						{/* Service Info */}
						<div className="flex-1 min-w-0">
							<div className={`flex items-start justify-between gap-3 mb-2 `}>
								<div className="flex-1 min-w-0">
									<h4 className={`font-semibold text-base sm:text-lg text-gray-900 mb-1 ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic ? item.serviceNameAr || item.serviceName : item.serviceName}
									</h4>
									{item.serviceType && (
										<p className={`text-sm text-gray-600 ${isArabic ? "text-right" : "text-left"}`}>
											{isArabic ? item.serviceTypeAr || item.serviceType : item.serviceType}
										</p>
									)}
								</div>
								{/* Urgency Badge */}
								<div className={`px-2 py-1 rounded-lg text-xs font-semibold ${urgency.color} flex-shrink-0`}>
									{isArabic ? urgency.labelAr : urgency.labelEn}
								</div>
							</div>

							{/* Date & Time */}
							{(item.preferredDate || item.preferredTime) && (
								<div className={`flex items-center gap-2 mb-2 text-sm text-gray-600 `}>
									<Calendar className="w-4 h-4" />
									<span>
										{item.preferredDate && new Date(item.preferredDate).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}
										{item.preferredTime && ` • ${item.preferredTime}`}
									</span>
								</div>
							)}

							{/* Worker Info */}
							{item.workerName && (
								<div className={`flex items-center gap-2 mb-2 `}>
									{item.workerPhoto ? (
										<div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200">
											<Image
												src={item.workerPhoto}
												alt={item.workerName}
												fill
												className="object-cover"
												sizes="24px"
											/>
										</div>
									) : (
										<div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#10b981]/20 to-[#10b981]/30 flex items-center justify-center">
											<User className="w-3 h-3 text-[#10b981]" />
										</div>
									)}
									<span className="text-sm text-gray-600">
										{isArabic ? "الفني:" : "Worker:"} {item.workerName}
									</span>
								</div>
							)}

							{/* Price */}
							<div className={`flex items-center justify-between mt-3 `}>
								<div>
									{item.confirmedPrice ? (
										<p className={`text-lg font-bold text-[#10b981] ${isArabic ? "text-right" : "text-left"}`}>
											{price.toFixed(2)} {isArabic ? "ريال" : "SAR"}
										</p>
									) : (
										<p className={`text-sm text-gray-600 ${isArabic ? "text-right" : "text-left"}`}>
											{isArabic ? "السعر المقدر:" : "Estimated:"} {price.toFixed(2)} {isArabic ? "ريال" : "SAR"}
										</p>
									)}
								</div>

								{/* Actions */}
								<div className={`flex items-center gap-2 `}>
									<button
										onClick={() => onEdit(item.id)}
										className="p-2 text-[#10b981] hover:bg-[#10b981]/10 rounded-lg transition-colors"
										aria-label={isArabic ? "تعديل الحجز" : "Edit booking"}
									>
										<Edit className="w-4 h-4" />
									</button>
									<button
										onClick={() => setShowConfirmRemove(true)}
										disabled={isRemoving}
										className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
										aria-label={isArabic ? "إزالة من السلة" : "Remove from cart"}
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Confirm Remove Modal */}
			{showConfirmRemove && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className={`bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full ${isArabic ? "rtl" : "ltr"}`}
						dir={isArabic ? "rtl" : "ltr"}
					>
						<h3 className={`text-lg font-bold text-gray-900 mb-2 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "إزالة الخدمة؟" : "Remove Service?"}
						</h3>
						<p className={`text-sm text-gray-600 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic
								? "هل أنت متأكد من إزالة هذه الخدمة من السلة؟"
								: "Are you sure you want to remove this service from your cart?"}
						</p>
						<div className={`flex gap-3 `}>
							<button
								onClick={() => setShowConfirmRemove(false)}
								className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
							>
								{isArabic ? "إلغاء" : "Cancel"}
							</button>
							<button
								onClick={handleRemove}
								disabled={isRemoving}
								className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
							>
								{isRemoving ? (isArabic ? "جاري..." : "Removing...") : isArabic ? "إزالة" : "Remove"}
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</>
	);
}

