"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { IndividualServiceData } from "@/lib/data/services";
import { 
	Home, 
	Plus, 
	Camera, 
	MapPin,
	Upload,
	X
} from "lucide-react";

interface ScheduleServiceProps {
	serviceData: IndividualServiceData;
	serviceSlug: string;
	serviceTypeSlug: string;
	workerId: string;
}

interface Address {
	id: string;
	title: string;
	location: string;
	isDefault: boolean;
}

interface UploadedFile {
	id: string;
	file: File;
	preview: string;
	type: 'image' | 'video';
}

/**
 * Schedule Service Component
 * Comprehensive scheduling interface with location, image upload, and description
 */
const ScheduleService: React.FC<ScheduleServiceProps> = ({ 
	serviceData, 
	serviceSlug, 
	serviceTypeSlug, 
	workerId 
}) => {
	const { language, t } = useLanguage();
	const isArabic = language === "ar";
	
	const [selectedAddress, setSelectedAddress] = useState<string>("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [isDragOver, setIsDragOver] = useState(false);
	
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const title = isArabic ? serviceData.titleAr : serviceData.titleEn;

	// Mock addresses data
	const addresses: Address[] = [
		{
			id: "1",
			title: isArabic ? "المنزل" : "Home",
			location: isArabic ? "شارع الملك فهد، الرياض، المملكة العربية السعودية" : "King Fahd Street, Riyadh, Saudi Arabia",
			isDefault: true
		},
		{
			id: "2", 
			title: isArabic ? "المكتب" : "Office",
			location: isArabic ? "حي العليا، الرياض، المملكة العربية السعودية" : "Al Olaya District, Riyadh, Saudi Arabia",
			isDefault: false
		}
	];

	const handleFileUpload = (files: FileList | null) => {
		if (!files) return;

		Array.from(files).forEach(file => {
			if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
				const newFile: UploadedFile = {
					id: Date.now().toString() + Math.random(),
					file,
					preview: URL.createObjectURL(file),
					type: file.type.startsWith('image/') ? 'image' : 'video'
				};
				setUploadedFiles(prev => [...prev, newFile]);
			}
		});
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		handleFileUpload(e.dataTransfer.files);
	};

	const removeFile = (fileId: string) => {
		setUploadedFiles(prev => {
			const fileToRemove = prev.find(f => f.id === fileId);
			if (fileToRemove) {
				URL.revokeObjectURL(fileToRemove.preview);
			}
			return prev.filter(f => f.id !== fileId);
		});
	};

	const handleSaveAndContinue = () => {
		// Handle save and continue logic
		console.log({
			selectedAddress,
			description,
			price,
			uploadedFiles: uploadedFiles.map(f => f.file.name)
		});
	};

	const adjustTextareaHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
		}
	};

	return (
		<div className={`min-h-screen bg-gray-50 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className={`text-2xl sm:text-3xl font-bold text-gray-900 ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "موقع طالب الخدمة" : "Service Requester Location"}
					</h1>
					<p className={`text-gray-600 mt-2 ${isArabic ? "text-right" : "text-left"}`}>
						{title}
					</p>
				</div>

				{/* Address Selection */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Address List */}
						<div className="lg:col-span-2 space-y-4">
							{addresses.map((address) => (
								<div
									key={address.id}
									onClick={() => setSelectedAddress(address.id)}
									className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
										selectedAddress === address.id
											? "border-[#31A342] bg-green-50"
											: "border-gray-200 hover:border-gray-300"
									}`}
								>
									<div className={`flex items-start gap-3 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
										<div className={`p-2 rounded-full ${
											selectedAddress === address.id ? "bg-[#31A342]" : "bg-gray-100"
										}`}>
											<Home className={`w-5 h-5 ${
												selectedAddress === address.id ? "text-white" : "text-gray-600"
											}`} />
										</div>
										<div className="flex-1">
											<h3 className={`font-bold text-gray-900 ${isArabic ? "text-right" : "text-left"}`}>
												{address.title}
											</h3>
											<p className={`text-sm text-gray-600 mt-1 ${isArabic ? "text-right" : "text-left"}`}>
												{address.location}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Add New Address */}
						<div className="flex items-center justify-center">
							<button className="w-full p-6 border-2 border-dashed border-[#FA9D2B] rounded-lg hover:bg-orange-50 transition-colors duration-200 group">
								<div className="flex flex-col items-center gap-3">
									<div className="p-3 bg-[#FA9D2B] rounded-full group-hover:bg-orange-600 transition-colors duration-200">
										<Plus className="w-6 h-6 text-white" />
									</div>
									<span className="text-[#FA9D2B] font-medium">
										{isArabic ? "إضافة عنوان جديد" : "Add New Address"}
									</span>
								</div>
							</button>
						</div>
					</div>
				</div>

				{/* Image/Video Upload */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className={`text-lg font-semibold text-gray-900 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "قم بوضع صورة او فيديو عن المشكلة" : "Upload Image or Video of the Problem"}
					</h2>
					
					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current?.click()}
						className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
							isDragOver 
								? "border-[#31A342] bg-green-50" 
								: "border-gray-300 hover:border-gray-400"
						}`}
					>
						<div className="flex flex-col items-center gap-4">
							<div className="p-4 bg-[#31A342] rounded-full">
								<Camera className="w-8 h-8 text-white" />
							</div>
							<div>
								<p className="text-gray-900 font-medium">
									{isArabic ? "اضغط لاضافة الصور" : "Click to Add Images"}
								</p>
								<p className="text-gray-500 text-sm mt-1">
									{isArabic ? "او قم بسحب وافلات الصور" : "or Drag and Drop Images"}
								</p>
							</div>
						</div>
					</div>

					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept="image/*,video/*"
						onChange={(e) => handleFileUpload(e.target.files)}
						className="hidden"
					/>

					{/* Uploaded Files Preview */}
					{uploadedFiles.length > 0 && (
						<div className="mt-6">
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
								{uploadedFiles.map((file) => (
									<div key={file.id} className="relative group">
										<div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
											{file.type === 'image' ? (
												<Image
													src={file.preview}
													alt={file.file.name}
													width={200}
													height={200}
													className="w-full h-full object-cover"
												/>
											) : (
												<video
													src={file.preview}
													className="w-full h-full object-cover"
													controls
												/>
											)}
										</div>
										<button
											onClick={() => removeFile(file.id)}
											className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
										>
											<X className="w-4 h-4" />
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Description */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className={`text-lg font-semibold text-gray-900 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "اشرح مشكلتك" : "Describe Your Problem"}
					</h2>
					<textarea
						ref={textareaRef}
						value={description}
						onChange={(e) => {
							setDescription(e.target.value);
							adjustTextareaHeight();
						}}
						placeholder={isArabic ? "اكتب وصفاً مفصلاً لمشكلتك..." : "Write a detailed description of your problem..."}
						className={`w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#31A342] focus:border-transparent ${isArabic ? "text-right" : "text-left"}`}
						rows={4}
					/>
				</div>

				{/* Price */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<h2 className={`text-lg font-semibold text-gray-900 mb-4 ${isArabic ? "text-right" : "text-left"}`}>
						{isArabic ? "تحديد السعر" : "Set Price"}
					</h2>
					<div className="max-w-md">
						<input
							type="number"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder={isArabic ? "أدخل السعر المتوقع" : "Enter Expected Price"}
							className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#31A342] focus:border-transparent ${isArabic ? "text-right" : "text-left"}`}
						/>
					</div>
				</div>

				{/* Save and Continue Button */}
				<div className="flex justify-end">
					<button
						onClick={handleSaveAndContinue}
						className="px-8 py-3 bg-[#31A342] hover:bg-[#2a8f3a] text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
					>
						{isArabic ? "حفظ ومتابعة" : "Save and Continue"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ScheduleService;
