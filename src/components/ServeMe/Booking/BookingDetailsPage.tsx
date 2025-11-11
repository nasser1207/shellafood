"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooking } from "@/contexts/BookingContext";
import StepperNavigation from "@/components/ServeMe/Booking/StepperNavigation";
import AddEditAddressModal from "@/components/Profile/Addresses/AddEditAddressModal";
import { DescriptionTooltipModal, AttachmentGuidelinesModal } from "./modals";
import { Calendar, Clock, FileText, MapPin, ArrowRight, Upload, X, HelpCircle, Image as ImageIcon, Video, Mic } from "lucide-react";
import { getIndividualService } from "@/lib/data/services";
import { Address, ServiceType } from "./types";
import { TIME_SLOTS, MEDIA_LIMITS, DEFAULT_LOCATION, GEOLOCATION_OPTIONS } from "./utils/constants";
import { validateVideoType, validateVideoSize, validateVideoDuration, formatTime } from "./utils/validation";

export default function BookingDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const { bookingData, updateBooking } = useBooking();
	const service = params.service as string;
	const serviceType = params.serviceType as string;

	// Form state
	const [selectedDate, setSelectedDate] = useState(bookingData?.date || "");
	const [selectedTime, setSelectedTime] = useState(bookingData?.time || "");
	const [bookingServiceType, setBookingServiceType] = useState<ServiceType>(bookingData?.serviceType || "scheduled");
	const [description, setDescription] = useState(bookingData?.description || "");
	const [images, setImages] = useState<string[]>(bookingData?.images || []);
	const [video, setVideo] = useState<string | null>(bookingData?.video || null);
	const [voice, setVoice] = useState<string | null>(bookingData?.voice || null);
	const [notes, setNotes] = useState(bookingData?.notes || "");
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(
		bookingData?.address && typeof bookingData.address === 'object' && 'type' in bookingData.address
			? (bookingData.address as Address)
			: null
	);
	const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [showDescriptionTooltip, setShowDescriptionTooltip] = useState(false);
	const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

	// Voice recording state
	const [isRecording, setIsRecording] = useState(false);
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const [recordingTime, setRecordingTime] = useState(0);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);
	const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Refs
	const imageInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	// Memoized service data
	const serviceData = useMemo(() => getIndividualService(service, serviceType), [service, serviceType]);
	const serviceName = useMemo(() => 
		isArabic ? serviceData?.titleAr || "" : serviceData?.titleEn || "",
		[isArabic, serviceData]
	);

	// Initialize audioURL from existing voice data
	useEffect(() => {
		if (voice && !audioURL) {
			setAudioURL(voice);
		}
	}, [voice, audioURL]);

	// Handle body overflow and ESC key for modals
	useEffect(() => {
		const handleEscKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				if (showGuidelinesModal) {
					setShowGuidelinesModal(false);
				}
				if (showDescriptionTooltip) {
					setShowDescriptionTooltip(false);
				}
			}
		};

		const hasOpenModal = showGuidelinesModal || showDescriptionTooltip;

		if (hasOpenModal) {
			document.body.style.overflow = 'hidden';
			document.addEventListener('keydown', handleEscKey);
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.removeEventListener('keydown', handleEscKey);
			document.body.style.overflow = '';
		};
	}, [showGuidelinesModal, showDescriptionTooltip]);

	// Initialize booking data
	useEffect(() => {
		if (serviceData) {
			updateBooking({
				serviceId: `${service}-${serviceType}`,
				serviceName: serviceData.titleEn,
				serviceNameAr: serviceData.titleAr,
				unitPrice: serviceData.priceStartsFrom,
			});
		}
	}, [service, serviceType, serviceData, updateBooking]);

	// Mock addresses - in real app, fetch from API
	useEffect(() => {
		setAddresses([
			{
				id: "1",
				type: "home",
				title: isArabic ? "المنزل" : "Home",
				address: "123 Main Street",
				details: "Building 5, Floor 2, Apartment 201",
				phone: "+966501234567",
				isDefault: true,
				coordinates: DEFAULT_LOCATION,
			},
		]);
	}, [isArabic]);

	// Cleanup recording timer on unmount
	useEffect(() => {
		return () => {
			if (recordingTimerRef.current) {
				clearInterval(recordingTimerRef.current);
			}
		};
	}, []);

	// Handlers with useCallback for performance
	const handleServiceTypeChange = useCallback((type: ServiceType) => {
		setBookingServiceType(type);
		updateBooking({ serviceType: type });
		if (type === "instant") {
			setSelectedDate("");
			setSelectedTime("");
			updateBooking({ date: null, time: null });
		}
	}, [updateBooking]);

	const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newImages: string[] = [];
		const maxFiles = Math.min(files.length, MEDIA_LIMITS.MAX_IMAGES - images.length);
		
		for (let i = 0; i < maxFiles; i++) {
			const file = files[i];
			const reader = new FileReader();
			reader.onloadend = () => {
				if (reader.result) {
					newImages.push(reader.result as string);
					if (newImages.length === maxFiles) {
						const updatedImages = [...images, ...newImages];
						setImages(updatedImages);
						updateBooking({ images: updatedImages });
					}
				}
			};
			reader.readAsDataURL(file);
		}
	}, [images, updateBooking]);

	const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!validateVideoType(file)) {
			alert(isArabic 
				? "نوع الملف غير مدعوم. يرجى رفع ملف فيديو بصيغة MP4, MOV, أو WEBM."
				: "File type not supported. Please upload a video file in MP4, MOV, or WEBM format."
			);
			e.target.value = '';
			return;
		}

		// Validate file size
		if (!validateVideoSize(file)) {
			alert(isArabic 
				? "حجم الملف كبير جداً. الحد الأقصى هو 50 ميجابايت."
				: "File size too large. Maximum size is 50MB."
			);
			e.target.value = '';
			return;
		}

		// Validate video duration
		try {
			const isValidDuration = await validateVideoDuration(file);
			if (!isValidDuration) {
				alert(isArabic 
					? "مدة الفيديو طويلة جداً. الحد الأقصى هو 30 ثانية."
					: "Video duration too long. Maximum duration is 30 seconds."
				);
				e.target.value = '';
				return;
			}

			// If validation passes, read and set video
			const reader = new FileReader();
			reader.onloadend = () => {
				if (reader.result) {
					setVideo(reader.result as string);
					updateBooking({ video: reader.result as string });
				}
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error('Error validating video:', error);
			alert(isArabic 
				? "خطأ في التحقق من ملف الفيديو. يرجى المحاولة مرة أخرى."
				: "Error validating video file. Please try again."
			);
			e.target.value = '';
		}
	}, [isArabic, updateBooking]);

	const startRecording = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
				const url = URL.createObjectURL(audioBlob);
				setAudioURL(url);

				// Convert to Base64
				const reader = new FileReader();
				reader.onloadend = () => {
					if (reader.result) {
						setVoice(reader.result as string);
						updateBooking({ voice: reader.result as string });
					}
				};
				reader.readAsDataURL(audioBlob);

				// Stop all tracks
				stream.getTracks().forEach(track => track.stop());
			};

			mediaRecorder.start();
			setIsRecording(true);
			setRecordingTime(0);

			// Start timer
			recordingTimerRef.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);
		} catch (error) {
			console.error("Error starting recording:", error);
			alert(isArabic ? "خطأ في بدء التسجيل. يرجى التحقق من الصلاحيات." : "Error starting recording. Please check permissions.");
		}
	}, [isArabic, updateBooking]);

	const stopRecording = useCallback(() => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			if (recordingTimerRef.current) {
				clearInterval(recordingTimerRef.current);
				recordingTimerRef.current = null;
			}
		}
	}, [isRecording]);

	const removeImage = useCallback((index: number) => {
		const updatedImages = images.filter((_, i) => i !== index);
		setImages(updatedImages);
		updateBooking({ images: updatedImages });
	}, [images, updateBooking]);

	const removeVideo = useCallback(() => {
		setVideo(null);
		updateBooking({ video: null });
	}, [updateBooking]);

	const removeVoice = useCallback(() => {
		setVoice(null);
		setAudioURL(null);
		setRecordingTime(0);
		updateBooking({ voice: null });
	}, [updateBooking]);

	const handleNext = useCallback(() => {
		if (!description.trim()) {
			alert(isArabic ? "يرجى وصف المشكلة" : "Please describe the problem");
			return;
		}
		if (bookingServiceType === "scheduled" && (!selectedDate || !selectedTime)) {
			alert(isArabic ? "يرجى اختيار التاريخ والوقت" : "Please select date and time");
			return;
		}
		if (!selectedAddress) {
			alert(isArabic ? "يرجى اختيار العنوان" : "Please select an address");
			return;
		}

		updateBooking({
			description,
			images,
			video,
			voice,
			date: selectedDate || null,
			time: selectedTime || null,
			serviceType: bookingServiceType,
			notes,
			address: selectedAddress,
		});

		// Prefetch summary page for instant navigation
		const summaryPath = `/serve-me/${service}/${serviceType}/book/summary`;
		router.prefetch(summaryPath);
		router.push(summaryPath);
	}, [description, bookingServiceType, selectedDate, selectedTime, selectedAddress, images, video, voice, notes, updateBooking, service, serviceType, router, isArabic]);

	const handleAddressSelect = useCallback((address: Address) => {
		setSelectedAddress(address);
		updateBooking({ address });
	}, [updateBooking]);

	const handleAddAddress = useCallback(() => {
		setEditingAddress(null);
		setIsAddressModalOpen(true);
	}, []);

	const handleSaveAddress = useCallback((addressData: Omit<Address, "id">) => {
		if (editingAddress) {
			setAddresses(addresses.map((a) => (a.id === editingAddress.id ? { ...addressData, id: editingAddress.id } : a)));
		} else {
			const newAddress: Address = { ...addressData, id: Date.now().toString() };
			setAddresses([...addresses, newAddress]);
		}
		setIsAddressModalOpen(false);
		setEditingAddress(null);
	}, [editingAddress, addresses]);

	const handleCloseAddressModal = useCallback(() => {
		setIsAddressModalOpen(false);
		setEditingAddress(null);
	}, []);

	const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setDescription(value);
		updateBooking({ description: value });
	}, [updateBooking]);

	const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		setNotes(value);
		updateBooking({ notes: value });
	}, [updateBooking]);

	const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSelectedDate(value);
		updateBooking({ date: value });
	}, [updateBooking]);

	const handleTimeSelect = useCallback((time: string) => {
		setSelectedTime(time);
		updateBooking({ time });
	}, [updateBooking]);

	// Memoized formatted recording time
	const formattedRecordingTime = useMemo(() => formatTime(recordingTime), [recordingTime]);

	// Memoized validation states
	const canProceed = useMemo(() => {
		return description.trim() !== '' && 
			   (bookingServiceType === "instant" || (selectedDate && selectedTime)) &&
			   selectedAddress !== null;
	}, [description, bookingServiceType, selectedDate, selectedTime, selectedAddress]);

	if (!serviceData) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<p className="text-gray-600 dark:text-gray-400">{isArabic ? "الخدمة غير موجودة" : "Service not found"}</p>
			</div>
		);
	}

	return (
		<div className={`min-h-screen bg-white dark:bg-gray-900 ${isArabic ? "rtl" : "ltr"}`} dir={isArabic ? "rtl" : "ltr"}>
			<StepperNavigation service={service} serviceType={serviceType} />

			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				{/* Service Header */}
				<div className="mb-6 sm:mb-8 lg:mb-12 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200 dark:border-gray-700">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
						{serviceName}
					</h1>
					<p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
						{isArabic ? serviceData.descriptionAr : serviceData.descriptionEn}
					</p>
				</div>

				<div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 lg:space-y-12">
					{/* Problem Description Section */}
					<section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
								{isArabic ? "وصف المشكلة" : "Describe the Issue"}
							</h2>
							<div className="relative flex-shrink-0">
								<button
									type="button"
									onClick={() => setShowDescriptionTooltip(true)}
									className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 active:text-gray-600 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 rounded-full p-1"
									aria-label={isArabic ? "عرض التلميح" : "Show hint"}
								>
									<HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
								</button>
							</div>
						</div>
						<textarea
							value={description}
							onChange={handleDescriptionChange}
							placeholder={isArabic ? "يرجى وصف المشكلة أو ما تحتاج إلى إصلاحه..." : "Please describe your problem or what needs to be fixed..."}
							rows={5}
							required
							className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/20 focus:ring-offset-0 focus:outline-none resize-none text-sm sm:text-base transition-all touch-manipulation placeholder-gray-400 dark:placeholder-gray-500 ${
								isArabic ? "text-right" : "text-left"
							}`}
							dir={isArabic ? "rtl" : "ltr"}
						/>
					</section>

					{/* Media Upload Section */}
					<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
						<div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
								{isArabic ? "المرفقات" : "Attachments"}
							</h2>
							<button
								type="button"
								onClick={() => setShowGuidelinesModal(true)}
								className="text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 active:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 rounded-full p-1 touch-manipulation flex-shrink-0"
								aria-label={isArabic ? "عرض إرشادات المرفقات" : "Show attachment guidelines"}
							>
								<HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
							</button>
						</div>
						
						<div className="space-y-6 sm:space-y-8 lg:space-y-10">
							{/* Images Section */}
							<div className="border-b border-gray-100 dark:border-gray-700 pb-6 sm:pb-8">
								<div className="flex items-center gap-2 mb-3 sm:mb-4">
									<ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
									<label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
										{isArabic ? "الصور" : "Images"} ({images.length}/{MEDIA_LIMITS.MAX_IMAGES})
									</label>
								</div>
								<input
									ref={imageInputRef}
									type="file"
									accept="image/*"
									multiple
									onChange={handleImageUpload}
									className="hidden"
									aria-label={isArabic ? "رفع صور" : "Upload images"}
								/>
								{images.length === 0 ? (
									<button
										type="button"
										onClick={() => imageInputRef.current?.click()}
										className="w-full p-6 sm:p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 touch-manipulation"
										aria-label={isArabic ? "رفع صور" : "Upload images"}
									>
										<ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
										<span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
											{isArabic ? "رفع صور" : "Upload Images"}
										</span>
									</button>
								) : (
									<div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
										{images.map((img, index) => (
											<div key={index} className="relative group">
												<div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
													<Image
														src={img}
														alt={`Upload ${index + 1}`}
														fill
														className="object-cover"
														loading="lazy"
													/>
												</div>
												<button
													type="button"
													onClick={() => removeImage(index)}
													className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 active:bg-red-600 touch-manipulation"
													aria-label={isArabic ? `حذف الصورة ${index + 1}` : `Remove image ${index + 1}`}
												>
													<X className="w-3 h-3 sm:w-4 sm:h-4" />
												</button>
											</div>
										))}
										{images.length < MEDIA_LIMITS.MAX_IMAGES && (
											<button
												type="button"
												onClick={() => imageInputRef.current?.click()}
												className="aspect-square rounded-lg sm:rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50 transition-all flex items-center justify-center touch-manipulation"
												aria-label={isArabic ? "إضافة صور إضافية" : "Add more images"}
											>
												<Upload className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400" />
											</button>
										)}
									</div>
								)}
							</div>

							{/* Video Section */}
							<div className="border-b border-gray-100 dark:border-gray-700 pb-6 sm:pb-8">
								<div className="flex items-center gap-2 mb-3 sm:mb-4">
									<Video className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
									<label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
										{isArabic ? "فيديو" : "Video"} <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">{isArabic ? `(حد أقصى ${MEDIA_LIMITS.MAX_VIDEO_DURATION} ثانية)` : `(max ${MEDIA_LIMITS.MAX_VIDEO_DURATION} seconds)`}</span>
									</label>
								</div>
								<input
									ref={videoInputRef}
									type="file"
									accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
									onChange={handleVideoUpload}
									className="hidden"
									aria-label={isArabic ? "رفع فيديو" : "Upload video"}
								/>
								{video ? (
									<div className="relative rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
										<div className="relative aspect-video bg-gray-900">
											<video src={video} controls className="w-full h-full object-contain" />
										</div>
										<button
											type="button"
											onClick={removeVideo}
											className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 active:bg-red-600 transition-colors touch-manipulation"
											aria-label={isArabic ? "حذف الفيديو" : "Remove video"}
										>
											<X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
										</button>
									</div>
								) : (
									<button
										type="button"
										onClick={() => videoInputRef.current?.click()}
										className="w-full p-6 sm:p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 sm:gap-3 touch-manipulation"
										aria-label={isArabic ? "رفع فيديو" : "Upload video"}
									>
										<Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 dark:text-gray-400" />
										<span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
											{isArabic ? "رفع فيديو" : "Upload Video"}
										</span>
										<span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center px-2">
											{isArabic ? `MP4, MOV, أو WEBM - حد أقصى ${MEDIA_LIMITS.MAX_VIDEO_DURATION} ثانية و 50 ميجابايت` : `MP4, MOV, or WEBM - max ${MEDIA_LIMITS.MAX_VIDEO_DURATION} seconds and 50MB`}
										</span>
									</button>
								)}
							</div>

							{/* Voice Recording Section */}
							<div>
								<div className="flex items-center gap-2 mb-3 sm:mb-4">
									<Mic className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
									<label className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
										{isArabic ? "تسجيل صوتي" : "Voice Recording"}
									</label>
								</div>
								{voice && audioURL ? (
									<div className="space-y-3 sm:space-y-4">
										<div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
											<audio ref={audioRef} src={audioURL} controls className="w-full" />
										</div>
										<button
											type="button"
											onClick={removeVoice}
											className="flex items-center gap-2 px-3 sm:px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 active:text-red-700 transition-colors touch-manipulation"
											aria-label={isArabic ? "حذف التسجيل الصوتي" : "Delete voice recording"}
										>
											<X className="w-4 h-4" />
											<span className="text-xs sm:text-sm font-medium">
												{isArabic ? "حذف التسجيل" : "Delete Recording"}
											</span>
										</button>
									</div>
								) : (
									<div className="space-y-3 sm:space-y-4">
										<button
											type="button"
											onClick={isRecording ? stopRecording : startRecording}
											className={`w-full p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all flex items-center justify-center gap-2 sm:gap-3 touch-manipulation ${
												isRecording
													? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 active:bg-red-100 animate-pulse"
													: "border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/60 dark:bg-gray-800/60 hover:border-green-600 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 active:bg-green-50"
											}`}
											aria-label={isRecording 
												? (isArabic ? "إيقاف التسجيل" : "Stop recording")
												: (isArabic ? "بدء التسجيل" : "Start recording")
											}
										>
											<div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
												isRecording ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
											}`}>
												<Mic className="w-4 h-4 sm:w-5 sm:h-5" />
											</div>
											<span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
												{isRecording 
													? (isArabic ? "إيقاف التسجيل" : "Stop Recording") 
													: (isArabic ? "بدء التسجيل" : "Start Recording")
												}
											</span>
											{isRecording && (
												<span className="text-xs sm:text-sm font-mono text-red-600 dark:text-red-400">
													{formattedRecordingTime}
												</span>
											)}
										</button>
									</div>
								)}
							</div>
						</div>
					</section>

					{/* Service Type */}
					<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
							{isArabic ? "نوع الخدمة" : "Service Type"}
						</h2>
						<div className="grid grid-cols-2 gap-3 sm:gap-4">
							<button
								type="button"
								onClick={() => handleServiceTypeChange("instant")}
								className={`p-4 rounded-lg border-2 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
									bookingServiceType === "instant"
										? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
										: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-gray-300 text-gray-700 dark:text-gray-300"
								}`}
							>
								<span className="text-sm sm:text-base">{isArabic ? "فوري" : "Instant"}</span>
							</button>
							<button
								type="button"
								onClick={() => handleServiceTypeChange("scheduled")}
								className={`p-4 rounded-lg border-2 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
									bookingServiceType === "scheduled"
										? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
										: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-gray-300 text-gray-700 dark:text-gray-300"
								}`}
							>
								<span className="text-sm sm:text-base">{isArabic ? "مجدول" : "Scheduled"}</span>
							</button>
						</div>
					</section>

					{/* Date & Time (only for scheduled) */}
					{bookingServiceType === "scheduled" && (
						<>
							<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
								<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
									{isArabic ? "التاريخ والوقت" : "Date & Time"}
								</h2>
								<div className="space-y-4 sm:space-y-6">
									<div>
										<label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
											{isArabic ? "التاريخ" : "Date"}
										</label>
										<input
											type="date"
											value={selectedDate}
											onChange={handleDateChange}
											min={new Date().toISOString().split("T")[0]}
											className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/20 focus:ring-offset-2 focus:outline-none transition-all text-base touch-manipulation"
										/>
									</div>
									<div>
										<label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
											{isArabic ? "الوقت" : "Time"}
										</label>
										<div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3">
											{TIME_SLOTS.map((time) => (
												<button
													key={time}
													type="button"
													onClick={() => handleTimeSelect(time)}
													className={`py-3 px-4 rounded-lg border-2 transition-all text-sm touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
														selectedTime === time
															? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
															: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-gray-300 text-gray-700 dark:text-gray-300"
													}`}
												>
													{time}
												</button>
											))}
										</div>
									</div>
								</div>
							</section>
						</>
					)}

					{/* Address Selection */}
					<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
								{isArabic ? "العنوان" : "Address"}
							</h2>
							<button
								type="button"
								onClick={handleAddAddress}
								className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 transition-all text-sm font-medium touch-manipulation self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2"
							>
								{isArabic ? "+ إضافة عنوان" : "+ Add Address"}
							</button>
						</div>
						<div className="space-y-3">
							{addresses.length === 0 ? (
								<div className="text-center py-8 text-gray-500 dark:text-gray-400">
									<p className="mb-4">{isArabic ? "لا توجد عناوين متاحة" : "No addresses available"}</p>
									<button
										type="button"
										onClick={handleAddAddress}
										className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2"
									>
										{isArabic ? "إضافة عنوان جديد" : "Add New Address"}
									</button>
								</div>
							) : (
								addresses.map((address) => (
									<div
										key={address.id}
										onClick={() => handleAddressSelect(address)}
										className={`p-4 rounded-lg border-2 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
											selectedAddress?.id === address.id
												? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
												: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
										}`}
									>
										<div className="flex items-start gap-3">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">{address.title}</h3>
													{address.isDefault && (
														<span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium">
															{isArabic ? "افتراضي" : "Default"}
														</span>
													)}
												</div>
												<p className="text-sm text-gray-600 dark:text-gray-400">{address.address}</p>
												{address.details && (
													<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{address.details}</p>
												)}
											</div>
											<div className={`flex-shrink-0 ${isArabic ? "mr-2" : "ml-2"}`}>
												<div
													className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
														selectedAddress?.id === address.id
															? "border-green-600 dark:border-green-500 bg-green-600 dark:bg-green-500"
															: "border-gray-300 dark:border-gray-600"
													}`}
												>
													{selectedAddress?.id === address.id && (
														<div className="w-2.5 h-2.5 rounded-full bg-white"></div>
													)}
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</section>

					{/* Notes */}
					<section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
						<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
							{isArabic ? "ملاحظات إضافية" : "Additional Notes"}
						</h2>
						<textarea
							value={notes}
							onChange={handleNotesChange}
							placeholder={isArabic ? "أضف أي ملاحظات أو تعليمات إضافية..." : "Add any additional notes or instructions..."}
							rows={4}
							className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/20 focus:ring-offset-0 focus:outline-none resize-none text-sm sm:text-base transition-all touch-manipulation placeholder-gray-400 dark:placeholder-gray-500 ${
								isArabic ? "text-right" : "text-left"
							}`}
							dir={isArabic ? "rtl" : "ltr"}
						/>
					</section>

					{/* Confirm Button */}
					<div className="pt-6 sm:pt-8 flex justify-center">
						<button
							onClick={handleNext}
							disabled={!canProceed}
							className={`w-full sm:w-auto bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 active:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 px-8 sm:px-10 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
								isArabic ? "flex-row-reverse" : ""
							}`}
						>
							<span className="text-sm sm:text-base">{isArabic ? "تأكيد والمتابعة" : "Confirm & Continue"}</span>
							<ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isArabic ? "rotate-180" : ""}`} />
						</button>
					</div>
				</div>
			</div>

			{/* Address Modal */}
			<AddEditAddressModal
				isOpen={isAddressModalOpen}
				onClose={handleCloseAddressModal}
				onSave={handleSaveAddress}
				editingAddress={editingAddress}
			/>

			{/* Modals */}
			<DescriptionTooltipModal
				isOpen={showDescriptionTooltip}
				onClose={() => setShowDescriptionTooltip(false)}
				isArabic={isArabic}
			/>

			<AttachmentGuidelinesModal
				isOpen={showGuidelinesModal}
				onClose={() => setShowGuidelinesModal(false)}
				isArabic={isArabic}
			/>
		</div>
	);
}
