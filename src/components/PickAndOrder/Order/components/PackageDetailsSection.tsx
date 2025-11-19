"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
	Package,
	Weight,
	Ruler,
	FileText,
	Upload,
	X,
	Image as ImageIcon,
	Video,
	AlertCircle,
	CheckCircle2,
	Trash2,
} from "lucide-react";

interface PackageDetailsSectionProps {
	isArabic: boolean;
	packageDescription: string;
	setPackageDescription: (value: string) => void;
	packageWeight: string;
	setPackageWeight: (value: string) => void;
	packageDimensions: string;
	setPackageDimensions: (value: string) => void;
	specialInstructions: string;
	setSpecialInstructions: (value: string) => void;
	images: string[];
	setImages: React.Dispatch<React.SetStateAction<string[]>>;
	video: string | null;
	setVideo: React.Dispatch<React.SetStateAction<string | null>>;
	errors?: { [key: string]: string };
	touched?: { [key: string]: boolean };
	setTouched?: (touched: { [key: string]: boolean } | ((prev: { [key: string]: boolean }) => { [key: string]: boolean })) => void;
}

export default function PackageDetailsSection({
	isArabic,
	packageDescription,
	setPackageDescription,
	packageWeight,
	setPackageWeight,
	packageDimensions,
	setPackageDimensions,
	specialInstructions,
	setSpecialInstructions,
	images,
	setImages,
	video,
	setVideo,
	errors = {},
	touched = {},
	setTouched,
}: PackageDetailsSectionProps) {
	const imageInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);

	const MAX_IMAGES = 5;
	const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
	const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

	// Handle image upload
	const handleImageUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files || []);
			
			if (files.length === 0) return;

			// Check total images limit
			if (images.length + files.length > MAX_IMAGES) {
				alert(
					isArabic
						? `يمكنك رفع ما يصل إلى ${MAX_IMAGES} صور فقط`
						: `You can upload up to ${MAX_IMAGES} images only`
				);
				return;
			}

			const validFiles: File[] = [];
			const invalidFiles: string[] = [];

			files.forEach((file) => {
				// Validate file type
				if (!file.type.startsWith("image/")) {
					invalidFiles.push(file.name);
					return;
				}

				// Validate file size
				if (file.size > MAX_IMAGE_SIZE) {
					invalidFiles.push(`${file.name} (${isArabic ? "حجم كبير" : "too large"})`);
					return;
				}

				validFiles.push(file);
			});

			if (invalidFiles.length > 0) {
				alert(
					isArabic
						? `الملفات التالية غير صالحة:\n${invalidFiles.join("\n")}`
						: `Invalid files:\n${invalidFiles.join("\n")}`
				);
			}

			// Process valid files - use a closure to accumulate images
			const newImages: string[] = [];
			let loadedCount = 0;

			validFiles.forEach((file) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					newImages.push(reader.result as string);
					loadedCount++;
					
					// Update state when all files are loaded using functional update
					if (loadedCount === validFiles.length) {
						setImages((prev) => [...prev, ...newImages]);
					}
				};
				reader.readAsDataURL(file);
			});

			// Reset input
			if (imageInputRef.current) {
				imageInputRef.current.value = "";
			}
		},
		[images.length, isArabic, setImages]
	);

	// Handle video upload
	const handleVideoUpload = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			// Validate file type
			if (!file.type.startsWith("video/")) {
				alert(isArabic ? "يرجى اختيار ملف فيديو فقط" : "Please select a video file only");
				return;
			}

			// Validate file size
			if (file.size > MAX_VIDEO_SIZE) {
				alert(
					isArabic
						? "حجم الفيديو يجب أن يكون أقل من 50 ميجابايت"
						: "Video size must be less than 50MB"
				);
				return;
			}

			const reader = new FileReader();
			reader.onloadend = () => {
				setVideo(reader.result as string);
			};
			reader.readAsDataURL(file);

			// Reset input
			if (videoInputRef.current) {
				videoInputRef.current.value = "";
			}
		},
		[isArabic, setVideo]
	);

	// Remove image
	const handleRemoveImage = useCallback(
		(index: number) => {
			setImages((prev) => prev.filter((_, i) => i !== index));
		},
		[setImages]
	);

	// Remove video
	const handleRemoveVideo = useCallback(() => {
		setVideo(null);
	}, [setVideo]);

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200 dark:border-gray-700">
			<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
				<div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
					<Package className="w-5 h-5 text-white" />
				</div>
				<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
					{isArabic ? "تفاصيل الطرد" : "Package Details"}
				</h3>
			</div>

			<div className="space-y-3 sm:space-y-4">
				{/* Description */}
				<div>
					<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
						{isArabic ? "وصف الطرد" : "Description"}
						<span className="text-red-500 ml-1">*</span>
					</label>
					<textarea
						value={packageDescription}
						onChange={(e) => setPackageDescription(e.target.value)}
						onBlur={() => setTouched?.((prev) => ({ ...prev, packageDescription: true }))}
						rows={3}
						placeholder={isArabic ? "مثال: صندوق من الملابس" : "Example: Box of clothes"}
						className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 ${
							touched.packageDescription && errors.packageDescription
								? "border-red-500 focus:border-red-500"
								: "border-gray-200 dark:border-gray-700 focus:border-[#31A342]"
						} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors`}
					/>
					{touched.packageDescription && errors.packageDescription && (
						<p className="text-red-500 text-xs mt-1 flex items-center gap-1">
							<AlertCircle className="w-3 h-3" />
							{errors.packageDescription}
						</p>
					)}
				</div>

				{/* Weight & Dimensions */}
				<div className="grid grid-cols-2 gap-3 sm:gap-4">
					<div>
						<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
							{isArabic ? "الوزن (كجم)" : "Weight (kg)"}
							<span className="text-red-500 ml-1">*</span>
						</label>
						<div className="relative">
							<Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
							<input
								type="number"
								value={packageWeight}
								onChange={(e) => setPackageWeight(e.target.value)}
								onBlur={() => setTouched?.((prev) => ({ ...prev, packageWeight: true }))}
								placeholder="5.0"
								className={`w-full pl-8 sm:pl-10 pr-3 py-2 sm:pr-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 ${
									touched.packageWeight && errors.packageWeight
										? "border-red-500 focus:border-red-500"
										: "border-gray-200 dark:border-gray-700 focus:border-[#31A342]"
								} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors`}
							/>
						</div>
						{touched.packageWeight && errors.packageWeight && (
							<p className="text-red-500 text-xs mt-1 flex items-center gap-1">
								<AlertCircle className="w-3 h-3" />
								{errors.packageWeight}
							</p>
						)}
					</div>

					<div>
						<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
							{isArabic ? "الأبعاد (سم)" : "Size (cm)"}
						</label>
						<div className="relative">
							<Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
							<input
								type="text"
								value={packageDimensions}
								onChange={(e) => setPackageDimensions(e.target.value)}
								placeholder="50x40x30"
								className="w-full pl-8 sm:pl-10 pr-3 py-2 sm:pr-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#31A342] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors"
							/>
						</div>
					</div>
				</div>

				{/* Images Upload Section */}
				<div>
					<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
						{isArabic ? "صور الطرد" : "Package Images"}
						<span className="text-gray-500 text-xs ml-1">
							({images.length}/{MAX_IMAGES})
						</span>
					</label>
					
					<input
						ref={imageInputRef}
						type="file"
						accept="image/*"
						multiple
						onChange={handleImageUpload}
						className="hidden"
						id="package-images"
						disabled={images.length >= MAX_IMAGES}
					/>

					{/* Images Grid */}
					{images.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-3">
							<AnimatePresence>
								{images.map((image, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200"
									>
										<Image
											src={image}
											alt={`Package image ${index + 1}`}
											fill
											className="object-cover transition-transform duration-200 group-hover:scale-105"
										/>
										{/* Remove Button - Always Visible */}
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveImage(index);
											}}
											className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full shadow-lg z-10 transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center"
											title={isArabic ? "حذف الصورة" : "Remove image"}
											aria-label={isArabic ? "حذف الصورة" : "Remove image"}
										>
											<X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										</button>
										{/* Image Number Badge */}
										<div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-bold flex items-center gap-1">
											<ImageIcon className="w-3 h-3" />
											<span>{index + 1}</span>
										</div>
										{/* Hover Overlay */}
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 pointer-events-none" />
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					)}

					{/* Upload Button */}
					{images.length < MAX_IMAGES && (
						<label
							htmlFor="package-images"
							className="block w-full px-3 py-3 sm:py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:border-[#31A342] dark:hover:border-[#31A342] transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-[#31A342]/5"
						>
							<div className="flex flex-col items-center gap-2">
								<ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
								<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
									{isArabic ? "انقر لرفع الصور" : "Click to upload images"}
								</span>
								<span className="text-[10px] sm:text-xs text-gray-500">
									{isArabic
										? `PNG, JPG حتى 5MB (${MAX_IMAGES - images.length} متبقي)`
										: `PNG, JPG up to 5MB (${MAX_IMAGES - images.length} remaining)`}
								</span>
							</div>
						</label>
					)}

					{images.length >= MAX_IMAGES && (
						<div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
							<CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
							<span className="text-xs text-green-700 dark:text-green-300">
								{isArabic ? "تم رفع الحد الأقصى من الصور" : "Maximum images uploaded"}
							</span>
						</div>
					)}
				</div>

				{/* Video Upload Section */}
				<div>
					<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
						{isArabic ? "فيديو الطرد (اختياري)" : "Package Video (Optional)"}
					</label>

					<input
						ref={videoInputRef}
						type="file"
						accept="video/*"
						onChange={handleVideoUpload}
						className="hidden"
						id="package-video"
						disabled={!!video}
					/>

					{/* Video Preview */}
					{video ? (
						<div className="relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 group">
							<video
								src={video}
								controls
								className="w-full h-48 sm:h-64 object-cover"
							/>
							<button
								onClick={handleRemoveVideo}
								className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
							>
								<Trash2 className="w-4 h-4" />
							</button>
							<div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-white text-xs font-semibold flex items-center gap-1">
								<Video className="w-3 h-3" />
								{isArabic ? "فيديو" : "Video"}
							</div>
						</div>
					) : (
						<label
							htmlFor="package-video"
							className="block w-full px-3 py-3 sm:py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
						>
							<div className="flex flex-col items-center gap-2">
								<Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
								<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
									{isArabic ? "انقر لرفع فيديو" : "Click to upload video"}
								</span>
								<span className="text-[10px] sm:text-xs text-gray-500">
									{isArabic ? "MP4, MOV حتى 50MB" : "MP4, MOV up to 50MB"}
								</span>
							</div>
						</label>
					)}
				</div>

				{/* Special Instructions */}
				<div>
					<label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
						{isArabic ? "ملاحظات خاصة" : "Special Notes"}
					</label>
					<textarea
						value={specialInstructions}
						onChange={(e) => setSpecialInstructions(e.target.value)}
						rows={2}
						placeholder={isArabic ? "أي ملاحظات إضافية..." : "Any additional notes..."}
						className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#31A342] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none transition-colors"
					/>
				</div>
			</div>
		</div>
	);
}

