"use client";

import React from "react";
import { Package, AlertTriangle, Truck, Box, Weight, Ruler, FileText } from "lucide-react";

interface VehicleSpecificFieldsProps {
	transportType: "truck" | "motorbike";
	isArabic: boolean;
	// Truck fields
	truckType: string;
	setTruckType: (value: string) => void;
	cargoType: string;
	setCargoType: (value: string) => void;
	isFragile: boolean;
	setIsFragile: (value: boolean) => void;
	requiresRefrigeration: boolean;
	setRequiresRefrigeration: (value: boolean) => void;
	loadingEquipmentNeeded: boolean;
	setLoadingEquipmentNeeded: (value: boolean) => void;
	// Motorbike fields
	packageType: string;
	setPackageType: (value: string) => void;
	isDocuments: boolean;
	setIsDocuments: (value: boolean) => void;
	isExpress: boolean;
	setIsExpress: (value: boolean) => void;
}

export default function VehicleSpecificFields({
	transportType,
	isArabic,
	truckType,
	setTruckType,
	cargoType,
	setCargoType,
	isFragile,
	setIsFragile,
	requiresRefrigeration,
	setRequiresRefrigeration,
	loadingEquipmentNeeded,
	setLoadingEquipmentNeeded,
	packageType,
	setPackageType,
	isDocuments,
	setIsDocuments,
	isExpress,
	setIsExpress,
}: VehicleSpecificFieldsProps) {
	if (transportType === "truck") {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-gray-700">
				<div className="flex items-center gap-3 mb-4">
					<div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
						<Truck className="w-5 h-5 text-white" />
					</div>
					<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
						{isArabic ? "تفاصيل الشاحنة" : "Truck Details"}
					</h3>
				</div>

				<div className="space-y-4">
					{/* Truck Type */}
					<div>
						<label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
							{isArabic ? "نوع الشاحنة" : "Truck Type"}
							<span className="text-red-500 ml-1">*</span>
						</label>
						<select
							value={truckType}
							onChange={(e) => setTruckType(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#31A342] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors"
						>
							<option value="">{isArabic ? "اختر نوع الشاحنة" : "Select truck type"}</option>
							<option value="small">{isArabic ? "شاحنة صغيرة (حتى 1.5 طن)" : "Small Truck (up to 1.5 tons)"}</option>
							<option value="medium">{isArabic ? "شاحنة متوسطة (1.5 - 3 طن)" : "Medium Truck (1.5 - 3 tons)"}</option>
							<option value="large">{isArabic ? "شاحنة كبيرة (3 - 7 طن)" : "Large Truck (3 - 7 tons)"}</option>
							<option value="flatbed">{isArabic ? "شاحنة مسطحة" : "Flatbed Truck"}</option>
							<option value="refrigerated">{isArabic ? "شاحنة مبردة" : "Refrigerated Truck"}</option>
							<option value="container">{isArabic ? "شاحنة حاوية" : "Container Truck"}</option>
							<option value="crane">{isArabic ? "شاحنة رافعة" : "Crane Truck"}</option>
						</select>
					</div>

					{/* Cargo Type */}
					<div>
						<label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
							{isArabic ? "نوع البضاعة" : "Cargo Type"}
						</label>
						<select
							value={cargoType}
							onChange={(e) => setCargoType(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#31A342] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors"
						>
							<option value="">{isArabic ? "اختر نوع البضاعة" : "Select cargo type"}</option>
							<option value="furniture">{isArabic ? "أثاث" : "Furniture"}</option>
							<option value="appliances">{isArabic ? "أجهزة كهربائية" : "Appliances"}</option>
							<option value="construction">{isArabic ? "مواد بناء" : "Construction Materials"}</option>
							<option value="food">{isArabic ? "مواد غذائية" : "Food Items"}</option>
							<option value="electronics">{isArabic ? "إلكترونيات" : "Electronics"}</option>
							<option value="other">{isArabic ? "أخرى" : "Other"}</option>
						</select>
					</div>

					{/* Checkboxes */}
					<div className="space-y-3">
						{/* Fragile */}
						<label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
							<input
								type="checkbox"
								checked={isFragile}
								onChange={(e) => setIsFragile(e.target.checked)}
								className="w-5 h-5 rounded border-gray-300 text-[#31A342] focus:ring-[#31A342]"
							/>
							<AlertTriangle className="w-5 h-5 text-orange-500" />
							<span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
								{isArabic ? "بضاعة قابلة للكسر" : "Fragile Items"}
							</span>
						</label>

						{/* Refrigeration */}
						<label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
							<input
								type="checkbox"
								checked={requiresRefrigeration}
								onChange={(e) => setRequiresRefrigeration(e.target.checked)}
								className="w-5 h-5 rounded border-gray-300 text-[#31A342] focus:ring-[#31A342]"
							/>
							<Box className="w-5 h-5 text-blue-500" />
							<span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
								{isArabic ? "يتطلب تبريد" : "Requires Refrigeration"}
							</span>
						</label>

						{/* Loading Equipment */}
						<label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
							<input
								type="checkbox"
								checked={loadingEquipmentNeeded}
								onChange={(e) => setLoadingEquipmentNeeded(e.target.checked)}
								className="w-5 h-5 rounded border-gray-300 text-[#31A342] focus:ring-[#31A342]"
							/>
							<Truck className="w-5 h-5 text-purple-500" />
							<span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
								{isArabic ? "يحتاج معدات تحميل" : "Loading Equipment Needed"}
							</span>
						</label>
					</div>
				</div>
			</div>
		);
	}

	// Motorbike fields
	return (
		<div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-gray-700">
			<div className="flex items-center gap-3 mb-4">
				<div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
					<Package className="w-5 h-5 text-white" />
				</div>
				<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
					{isArabic ? "تفاصيل الدراجة النارية" : "Motorbike Details"}
				</h3>
			</div>

			<div className="space-y-4">
				{/* Package Type */}
				<div>
					<label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
						{isArabic ? "نوع الطرد" : "Package Type"}
					</label>
					<select
						value={packageType}
						onChange={(e) => setPackageType(e.target.value)}
						className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#31A342] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors"
					>
						<option value="">{isArabic ? "اختر نوع الطرد" : "Select package type"}</option>
						<option value="documents">{isArabic ? "مستندات" : "Documents"}</option>
						<option value="food">{isArabic ? "طعام" : "Food"}</option>
						<option value="small-items">{isArabic ? "أغراض صغيرة" : "Small Items"}</option>
						<option value="electronics">{isArabic ? "إلكترونيات صغيرة" : "Small Electronics"}</option>
						<option value="clothing">{isArabic ? "ملابس" : "Clothing"}</option>
						<option value="other">{isArabic ? "أخرى" : "Other"}</option>
					</select>
				</div>

				{/* Checkboxes */}
				<div className="space-y-3">
					{/* Documents */}
					<label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
						<input
							type="checkbox"
							checked={isDocuments}
							onChange={(e) => setIsDocuments(e.target.checked)}
							className="w-5 h-5 rounded border-gray-300 text-[#31A342] focus:ring-[#31A342]"
						/>
						<FileText className="w-5 h-5 text-blue-500" />
						<span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
							{isArabic ? "مستندات مهمة" : "Important Documents"}
						</span>
					</label>

					{/* Express Delivery */}
					<label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
						<input
							type="checkbox"
							checked={isExpress}
							onChange={(e) => setIsExpress(e.target.checked)}
							className="w-5 h-5 rounded border-gray-300 text-[#31A342] focus:ring-[#31A342]"
						/>
						<Package className="w-5 h-5 text-red-500" />
						<span className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
							{isArabic ? "توصيل سريع (خلال ساعة)" : "Express Delivery (Within 1 hour)"}
						</span>
					</label>
				</div>

				{/* Weight Limit Notice */}
				<div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
					<div className="flex items-start gap-2">
						<Weight className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
						<div>
							<p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
								{isArabic ? "حد الوزن" : "Weight Limit"}
							</p>
							<p className="text-xs text-amber-800 dark:text-amber-200">
								{isArabic
									? "الحد الأقصى: 15 كجم، الأبعاد: 40×40×60 سم"
									: "Maximum: 15kg, Dimensions: 40×40×60 cm"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

