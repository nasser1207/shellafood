"use client";

import React, { useState } from "react";
import { UploadButton } from "@/components/uploadthing";

interface UploadFileInputProps {
	label: string;
	endpoint?: string;
	onUploadComplete: (url: string) => void;
	onUploadError?: (error: Error) => void;
	isArabic?: boolean;
	className?: string;
	containerClassName?: string;
	disabled?: boolean;
	required?: boolean;
}

/**
 * Reusable File Upload Component
 * Wraps UploadButton with consistent styling and label
 */
export const UploadFileInput: React.FC<UploadFileInputProps> = ({
	label,
	endpoint = "imageUploader",
	onUploadComplete,
	onUploadError,
	isArabic = true,
	className = "",
	containerClassName = "",
	disabled = false,
	required = false,
}) => {
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleUploadComplete = (res: Array<{ name: string; size: number; key: string; url: string }>) => {
		setIsUploading(false);
		const firstFile = res?.[0];
		if (firstFile?.url) {
			setUploadedUrl(firstFile.url);
			onUploadComplete(firstFile.url);
		} else {
			const error = new Error(isArabic ? "فشل تحميل الملف" : "File upload failed - no URL received");
			handleUploadError(error);
		}
	};

	const handleUploadError = (error: Error) => {
		setIsUploading(false);
		if (onUploadError) {
			onUploadError(error);
		} else {
			console.error("Upload error:", error);
		}
	};

	const handleUploadStart = () => {
		setIsUploading(true);
		setUploadedUrl(null);
	};

	return (
		<div
			className={`relative rounded-xl border-2 border-dashed transition-colors duration-300 ${
				uploadedUrl
					? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20"
					: isUploading
					? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
					: "border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400"
			} ${containerClassName} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
		>
			<label
				className={`block mb-3 font-semibold text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"} ${className}`}
			>
				{label}
				{required && <span className="text-red-500 dark:text-red-400 mr-1">*</span>}
			</label>

			{uploadedUrl ? (
				<div className="flex flex-col items-center gap-3 p-4">
					<div className="flex items-center gap-2 text-green-600 dark:text-green-400">
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
						<span className="text-sm font-medium">
							{isArabic ? "تم رفع الملف بنجاح" : "File uploaded successfully"}
						</span>
					</div>
					<div className="w-full max-w-xs">
						<img
							src={uploadedUrl}
							alt={label}
							className="w-full h-auto rounded-lg object-cover max-h-32"
							onError={(e) => {
								const img = e.currentTarget as HTMLImageElement;
								img.style.display = 'none';
							}}
						/>
					</div>
					<button
						type="button"
						onClick={() => {
							setUploadedUrl(null);
							onUploadComplete("");
						}}
						className="text-xs text-red-600 dark:text-red-400 hover:underline"
					>
						{isArabic ? "إزالة الملف" : "Remove file"}
					</button>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center p-6">
					{isUploading ? (
						<div className="flex flex-col items-center gap-3">
							<div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{isArabic ? "جاري الرفع..." : "Uploading..."}
							</p>
						</div>
					) : (
						<>
							<svg
								className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
							<UploadButton
								endpoint={endpoint as any}
								onClientUploadComplete={handleUploadComplete}
								onUploadError={handleUploadError}
								onUploadBegin={handleUploadStart}
								disabled={disabled}
								className="ut-button:bg-green-600 ut-button:hover:bg-green-700 ut-button:ut-uploading:bg-green-400 ut-allowed-content:text-gray-600 dark:ut-allowed-content:text-gray-400"
							/>
							<p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
								{isArabic ? "PNG, JPG, GIF حتى 4MB" : "PNG, JPG, GIF up to 4MB"}
							</p>
						</>
					)}
				</div>
			)}
		</div>
	);
};

