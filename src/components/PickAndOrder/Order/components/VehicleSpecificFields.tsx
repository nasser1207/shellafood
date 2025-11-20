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
			<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg border border-gray-200/80 dark:border-gray-700 backdrop-blur-sm">
				<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
					<div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-500 dark:bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
						<Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
					</div>
					<h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
						{isArabic ? "تفاصيل الشاحنة" : "Truck Details"}
					</h3>
				</div>

				<div className="space-y-3 sm:space-y-4">
					{/* Truck Type */}
					<div>
						<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
							{isArabic ? "نوع الشاحنة" : "Truck Type"}
							<span className="text-red-500 ml-1">*</span>
						</label>
						<select
							value={truckType}
							onChange={(e) => setTruckType(e.target.value)}
							className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:border-[#31A342] dark:focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation shadow-sm hover:shadow-md"
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
						<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
							{isArabic ? "نوع البضاعة" : "Cargo Type"}
						</label>
						<select
							value={cargoType}
							onChange={(e) => setCargoType(e.target.value)}
							className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:border-[#31A342] dark:focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation shadow-sm hover:shadow-md"
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
					<div className="space-y-2 sm:space-y-3">
						{/* Fragile */}
						<label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-all touch-manipulation min-h-[44px] shadow-sm hover:shadow-md">
							<input
								type="checkbox"
								checked={isFragile}
								onChange={(e) => setIsFragile(e.target.checked)}
								className="w-5 h-5 sm:w-6 sm:h-6 rounded border-gray-400 dark:border-gray-600 text-[#31A342] dark:text-green-500 focus:ring-2 focus:ring-[#31A342] dark:focus:ring-green-500 bg-white dark:bg-gray-900 cursor-pointer flex-shrink-0 shadow-sm"
							/>
							<AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400 flex-shrink-0" />
							<span className="flex-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
								{isArabic ? "بضاعة قابلة للكسر" : "Fragile Items"}
							</span>
						</label>

						{/* Refrigeration */}
						<label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-all touch-manipulation min-h-[44px] shadow-sm hover:shadow-md">
							<input
								type="checkbox"
								checked={requiresRefrigeration}
								onChange={(e) => setRequiresRefrigeration(e.target.checked)}
								className="w-5 h-5 sm:w-6 sm:h-6 rounded border-gray-400 dark:border-gray-600 text-[#31A342] dark:text-green-500 focus:ring-2 focus:ring-[#31A342] dark:focus:ring-green-500 bg-white dark:bg-gray-900 cursor-pointer flex-shrink-0 shadow-sm"
							/>
							<Box className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
							<span className="flex-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
								{isArabic ? "يتطلب تبريد" : "Requires Refrigeration"}
							</span>
						</label>

						{/* Loading Equipment */}
						<label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-all touch-manipulation min-h-[44px] shadow-sm hover:shadow-md">
							<input
								type="checkbox"
								checked={loadingEquipmentNeeded}
								onChange={(e) => setLoadingEquipmentNeeded(e.target.checked)}
								className="w-5 h-5 sm:w-6 sm:h-6 rounded border-gray-400 dark:border-gray-600 text-[#31A342] dark:text-green-500 focus:ring-2 focus:ring-[#31A342] dark:focus:ring-green-500 bg-white dark:bg-gray-900 cursor-pointer flex-shrink-0 shadow-sm"
							/>
							<Truck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
							<span className="flex-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
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
		<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md border border-gray-200 dark:border-gray-700">
			<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
				<div className="w-9 h-9 sm:w-10 sm:h-10 bg-cyan-500 dark:bg-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
					<Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
				</div>
				<h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100">
					{isArabic ? "تفاصيل الدراجة النارية" : "Motorbike Details"}
				</h3>
			</div>

			<div className="space-y-3 sm:space-y-4">
				{/* Package Type */}
				<div>
					<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
						{isArabic ? "نوع الطرد" : "Package Type"}
					</label>
					<select
						value={packageType}
						onChange={(e) => setPackageType(e.target.value)}
						className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:border-[#31A342] dark:focus:border-green-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors text-sm sm:text-base min-h-[44px] touch-manipulation shadow-sm hover:shadow-md"
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
				<div className="space-y-2 sm:space-y-3">
					{/* Documents */}
					<label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-all touch-manipulation min-h-[44px] shadow-sm hover:shadow-md">
						<input
							type="checkbox"
							checked={isDocuments}
							onChange={(e) => setIsDocuments(e.target.checked)}
							className="w-5 h-5 sm:w-6 sm:h-6 rounded border-gray-400 dark:border-gray-600 text-[#31A342] dark:text-green-500 focus:ring-2 focus:ring-[#31A342] dark:focus:ring-green-500 bg-white dark:bg-gray-900 cursor-pointer flex-shrink-0 shadow-sm"
						/>
						<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
						<span className="flex-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
							{isArabic ? "مستندات مهمة" : "Important Documents"}
						</span>
					</label>

					{/* Express Delivery */}
					<label className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition-all touch-manipulation min-h-[44px] shadow-sm hover:shadow-md">
						<input
							type="checkbox"
							checked={isExpress}
							onChange={(e) => setIsExpress(e.target.checked)}
							className="w-5 h-5 sm:w-6 sm:h-6 rounded border-gray-400 dark:border-gray-600 text-[#31A342] dark:text-green-500 focus:ring-2 focus:ring-[#31A342] dark:focus:ring-green-500 bg-white dark:bg-gray-900 cursor-pointer flex-shrink-0 shadow-sm"
						/>
						<Package className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
						<span className="flex-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
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

