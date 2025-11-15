// src/components/Investor/ContractModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContractModalProps {
	isOpen: boolean;
	onClose: () => void;
	fileUrl: string;
}

export default function ContractModal({
	isOpen,
	onClose,
	fileUrl,
}: ContractModalProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const [iframeFailed, setIframeFailed] = useState(false);
	const [mounted, setMounted] = useState(false);
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	// Ensure component is mounted on client
	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	// Detect mobile device - simplified and more reliable
	useEffect(() => {
		const checkDevice = () => {
			// Primary check: screen width (most reliable for responsive design)
			const isMobileScreen = window.innerWidth < 768;
			setIsMobile(isMobileScreen);
		};

		checkDevice();
		window.addEventListener('resize', checkDevice);
		
		return () => window.removeEventListener('resize', checkDevice);
	}, []);

	// إغلاق النافذة عند الضغط على زر Escape
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			// منع التمرير عند فتح النافذة
			document.body.style.overflow = "hidden";
			// محاكاة التحميل
			setTimeout(() => {
				setIsLoading(false);
			}, 800);
			// إعادة تعيين حالة iframe
			setIframeFailed(false);
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			// إعادة التمرير عند إغلاق النافذة
			document.body.style.overflow = "auto";
		};
	}, [isOpen, onClose]);

	// معالجة فشل iframe
	const handleIframeError = () => {
		setIframeFailed(true);
	};

	if (!isOpen) return null;

	const content = {
		ar: {
			title: "مسودة العقد",
			close: "إغلاق",
			loading: "جاري فتح العقد...",
			contractReady: "مسودة العقد جاهزة",
			mobileTitle: "اختر طريقة العرض",
			mobileMessage: "على الموبايل، يمكنك فتح العقد في نافذة جديدة لعرضه مباشرة، أو تحميله على جهازك للمراجعة لاحقاً.",
			mobileStep1: "الخطوة 1: اختر طريقة العرض",
			mobileStep2: "الخطوة 2: راجع العقد بعناية",
			mobileStep3: "الخطوة 3: أكمل عملية التسجيل",
			errorMessage: "حدث خطأ في عرض العقد. يمكنك استخدام الخيارات التالية:",
			fileName: "عقد_المستثمر.pdf",
			fileType: "نوع الملف: PDF",
			fileStatus: "الحالة: جاهز للعرض",
			openInNewWindow: "فتح العقد في نافذة جديدة",
			openInNewWindowDesc: "يفتح العقد في متصفحك لعرضه مباشرة",
			downloadContract: "تحميل العقد",
			downloadContractDesc: "يحفظ العقد على جهازك للمراجعة لاحقاً",
			additionalOptions: "إذا لم يظهر العقد أعلاه، يمكنك استخدام الخيارات التالية:",
			openInNewWindowShort: "فتح في نافذة جديدة",
			downloadContractShort: "تحميل العقد",
			mobileFooter: "على الموبايل، استخدم الأزرار أعلاه لعرض العقد",
			desktopFooter: "العقد معروض أعلاه. إذا لم يظهر، استخدم الخيارات في الأعلى."
		},
		en: {
			title: "Contract Draft",
			close: "Close",
			loading: "Opening contract...",
			contractReady: "Contract draft is ready",
			mobileTitle: "Choose Viewing Method",
			mobileMessage: "On mobile, you can open the contract in a new window to view it directly, or download it to your device for later review.",
			mobileStep1: "Step 1: Choose viewing method",
			mobileStep2: "Step 2: Review the contract carefully",
			mobileStep3: "Step 3: Complete the registration process",
			errorMessage: "An error occurred while displaying the contract. You can use the following options:",
			fileName: "Investor_Contract.pdf",
			fileType: "File type: PDF",
			fileStatus: "Status: Ready for viewing",
			openInNewWindow: "Open contract in new window",
			openInNewWindowDesc: "Opens the contract in your browser for immediate viewing",
			downloadContract: "Download contract",
			downloadContractDesc: "Saves the contract to your device for later review",
			additionalOptions: "If the contract doesn't appear above, you can use the following options:",
			openInNewWindowShort: "Open in new window",
			downloadContractShort: "Download contract",
			mobileFooter: "On mobile, use the buttons above to view the contract",
			desktopFooter: "The contract is displayed above. If it doesn't appear, use the options above."
		}
	};

	const t = content[language];

	const modalContent = (
		<div 
			className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-0 sm:p-4 overflow-hidden w-full" 
			dir={direction} 
			onClick={onClose}
		>
			<div 
				className="relative flex h-[95vh] sm:h-auto sm:max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-gray-900/50 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-w-full safe-area-inset-bottom"
				onClick={(e) => e.stopPropagation()}
				style={{
					maxHeight: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))'
				}}
			>
				{/* Mobile Drag Handle */}
				<div className="sm:hidden w-full pt-3 pb-2 flex justify-center flex-shrink-0">
					<div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
				</div>

				{/* رأس النافذة */}
				<div className={`flex flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 sticky top-0 bg-white dark:bg-gray-800 z-10 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
					<h2 className={`text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-100 flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'} pr-2 sm:pr-0`}>
						{t.title}
					</h2>

					<button
						onClick={onClose}
						className="p-2 text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg active:scale-95 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
						aria-label={t.close}
					>
						<svg
							className="h-5 w-5 sm:h-6 sm:w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* محتوى النافذة */}
				<div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 w-full overscroll-contain">
					{isLoading && (
						<div className="flex min-h-[300px] sm:min-h-[400px] md:min-h-[500px] w-full items-center justify-center px-4">
							<div className="text-center w-full">
								<div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-green-500 dark:border-green-400 border-t-transparent"></div>
								<p className={`mt-4 text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 ${isArabic ? 'text-right' : 'text-left'}`}>
									{t.loading}
								</p>
							</div>
						</div>
					)}

					{/* عرض العقد */}
					{!isLoading && (
						<div className="w-full">
							{/* محاولة عرض PDF باستخدام iframe */}
							{!iframeFailed && !isMobile && (
								<div className="w-full">
									<iframe
										src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
										className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
										title={t.title}
										frameBorder="0"
										onError={handleIframeError}
										onLoad={() => setIframeFailed(false)}
										style={{
											minHeight: '400px',
											height: 'calc(90vh - 250px)',
											maxHeight: '600px'
										}}
									/>
								</div>
							)}

							{/* إذا فشل iframe أو على الموبايل، نعرض واجهة بديلة */}
							{(iframeFailed || isMobile) && (
								<div className={`flex w-full flex-col items-center justify-center text-center px-3 py-4 sm:px-4 sm:py-6 md:px-6 ${isArabic ? 'text-right' : 'text-left'} overflow-x-hidden`}>
									{/* أيقونة PDF كبيرة */}
									<div className="mb-4 sm:mb-5 md:mb-6 text-red-500 dark:text-red-400 flex-shrink-0">
										<svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24" fill="currentColor" viewBox="0 0 24 24">
											<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
										</svg>
									</div>
									
									{/* العنوان الرئيسي */}
									<h3 className={`mb-2 sm:mb-3 text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 px-2 ${isArabic ? 'text-right' : 'text-left'}`}>
										{isMobile ? t.mobileTitle : t.contractReady}
									</h3>
									
									{/* رسالة توضيحية */}
									<p className={`mb-4 sm:mb-5 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto px-2 leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
										{isMobile ? t.mobileMessage : t.errorMessage}
									</p>

									{/* معلومات الملف */}
									<div className={`mb-5 sm:mb-6 w-full max-w-md rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 sm:p-5 border border-gray-200 dark:border-gray-600 shadow-sm ${isArabic ? 'text-right' : 'text-left'}`}>
										<div className={`flex items-center gap-2.5 mb-3 ${isArabic ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
											<div className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm">
												<svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
													<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
												</svg>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">{isArabic ? 'اسم الملف' : 'File Name'}</p>
												<p className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-200 truncate">{t.fileName}</p>
											</div>
										</div>
										<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
											<span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md font-medium">{t.fileType}</span>
											<span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md font-medium">{t.fileStatus}</span>
										</div>
									</div>

								

									{/* أزرار الإجراءات */}
									<div className="flex w-full max-w-md flex-col gap-3 sm:gap-3.5">
										{/* زر فتح في نافذة جديدة */}
										<a
											href={fileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={`group relative flex flex-col w-full rounded-xl sm:rounded-lg bg-blue-600 dark:bg-blue-500 px-4 sm:px-5 md:px-6 py-4 sm:py-4 text-white transition-all hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-[0.97] shadow-lg hover:shadow-xl touch-manipulation overflow-hidden ${isArabic ? 'text-right' : 'text-left'}`}
										>
											{/* خلفية متحركة */}
											<div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											<div className={`relative flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
												<div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
													<svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
													</svg>
												</div>
												<div className="flex-1 min-w-0">
													<p className="font-bold text-sm sm:text-base mb-1">{t.openInNewWindow}</p>
													<p className="text-xs sm:text-sm text-blue-100 dark:text-blue-200 opacity-90">{t.openInNewWindowDesc}</p>
												</div>
											</div>
										</a>
										
										{/* زر تحميل العقد */}
										<a
											href={fileUrl}
											download={t.fileName}
											className={`group relative flex flex-col w-full rounded-xl sm:rounded-lg bg-green-600 dark:bg-green-500 px-4 sm:px-5 md:px-6 py-4 sm:py-4 text-white transition-all hover:bg-green-700 dark:hover:bg-green-600 active:scale-[0.97] shadow-lg hover:shadow-xl touch-manipulation overflow-hidden ${isArabic ? 'text-right' : 'text-left'}`}
										>
											{/* خلفية متحركة */}
											<div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
											<div className={`relative flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
												<div className="flex-shrink-0 p-2 bg-white/20 rounded-lg">
													<svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
													</svg>
												</div>
												<div className="flex-1 min-w-0">
													<p className="font-bold text-sm sm:text-base mb-1">{t.downloadContract}</p>
													<p className="text-xs sm:text-sm text-green-100 dark:text-green-200 opacity-90">{t.downloadContractDesc}</p>
												</div>
											</div>
										</a>
									</div>
								</div>
							)}

							{/* خيارات إضافية للكمبيوتر إذا لم يفشل iframe */}
							{!isMobile && !iframeFailed && (
								<div className={`mt-4 sm:mt-6 text-center px-2 ${isArabic ? 'text-right' : 'text-left'} overflow-x-hidden w-full`}>
									<p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 ${isArabic ? 'text-right' : 'text-left'}`}>
										{t.additionalOptions}
									</p>
									<div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
										<a
											href={fileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={`inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-500 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-[0.98] shadow-sm hover:shadow-md touch-manipulation min-h-[44px] sm:min-h-[40px] ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
										>
											<svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
											<span className="whitespace-nowrap">{t.openInNewWindowShort}</span>
										</a>
										
										<a
											href={fileUrl}
											download={t.fileName}
											className={`inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 dark:bg-green-500 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-green-700 dark:hover:bg-green-600 active:scale-[0.98] shadow-sm hover:shadow-md touch-manipulation min-h-[44px] sm:min-h-[40px] ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
										>
											<svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											<span className="whitespace-nowrap">{t.downloadContractShort}</span>
										</a>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);

	return createPortal(modalContent, document.body);
}
