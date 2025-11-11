// src/components/Investor/ContractModal.tsx
"use client";

import { useEffect, useState } from "react";
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
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	// كشف نوع الجهاز بطريقة محسنة
	useEffect(() => {
		const checkDevice = () => {
			// طريقة 1: User Agent
			const userAgent = navigator.userAgent.toLowerCase();
			const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
			
			// طريقة 2: Screen width
			const isMobileScreen = window.innerWidth <= 768;
			
			// طريقة 3: Touch support
			const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
			
			// طريقة 4: Platform
			const isMobilePlatform = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.platform);
			
			// إذا كان أي من الطرق تشير للموبايل، نعتبره موبايل
			const isMobileDevice = isMobileUserAgent || isMobileScreen || (isTouchDevice && isMobilePlatform);
			
			setIsMobile(isMobileDevice);
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
			mobileMessage: "على الموبايل، نوصي بفتح العقد في نافذة جديدة للحصول على أفضل تجربة عرض.",
			errorMessage: "حدث خطأ في عرض العقد. يمكنك استخدام الخيارات التالية:",
			fileName: "عقد_المستثمر.pdf",
			fileType: "نوع الملف: PDF",
			fileStatus: "الحالة: جاهز للعرض",
			openInNewWindow: "فتح العقد في نافذة جديدة",
			downloadContract: "تحميل العقد",
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
			mobileMessage: "On mobile, we recommend opening the contract in a new window for the best viewing experience.",
			errorMessage: "An error occurred while displaying the contract. You can use the following options:",
			fileName: "Investor_Contract.pdf",
			fileType: "File type: PDF",
			fileStatus: "Status: Ready for viewing",
			openInNewWindow: "Open contract in new window",
			downloadContract: "Download contract",
			additionalOptions: "If the contract doesn't appear above, you can use the following options:",
			openInNewWindowShort: "Open in new window",
			downloadContractShort: "Download contract",
			mobileFooter: "On mobile, use the buttons above to view the contract",
			desktopFooter: "The contract is displayed above. If it doesn't appear, use the options above."
		}
	};

	const t = content[language];

	return (
		<div className="bg-opacity-50 dark:bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black p-2 sm:p-4" dir={direction}>
			<div className="relative flex h-full max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50">
				{/* رأس النافذة */}
				<div className={`flex flex-shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
					<h2 className={`text-lg font-semibold text-gray-800 dark:text-gray-100 sm:text-xl ${isArabic ? 'text-right' : 'text-left'}`}>
						{t.title}
					</h2>

					<button
						onClick={onClose}
						className="p-2 text-gray-400 dark:text-gray-500 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
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
				<div className="flex-1 overflow-hidden p-2 sm:p-4">
					{isLoading && (
						<div className="flex h-full w-full items-center justify-center">
							<div className="text-center">
								<div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-500 dark:border-green-400 border-t-transparent"></div>
								<p className={`mt-2 text-sm text-gray-600 dark:text-gray-400 ${isArabic ? 'text-right' : 'text-left'}`}>
									{t.loading}
								</p>
							</div>
						</div>
					)}

					{/* عرض العقد */}
					{!isLoading && (
						<div className="h-full w-full">
							{/* محاولة عرض PDF باستخدام iframe */}
							{!iframeFailed && (
								<div className="h-full w-full">
									<iframe
										src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
										className="h-full w-full rounded"
										title={t.title}
										frameBorder="0"
										onError={handleIframeError}
										onLoad={() => setIframeFailed(false)}
										style={{
											minHeight: '400px',
											height: 'calc(100vh - 200px)',
											maxHeight: '80vh'
										}}
									/>
								</div>
							)}

							{/* إذا فشل iframe أو على الموبايل، نعرض واجهة بديلة */}
							{(iframeFailed || isMobile) && (
								<div className={`flex h-full w-full flex-col items-center justify-center text-center p-4 ${isArabic ? 'text-right' : 'text-left'}`}>
									{/* أيقونة PDF كبيرة */}
									<div className="mb-6 text-red-500 dark:text-red-400">
										<svg className="mx-auto h-20 w-20 sm:h-24 sm:w-24" fill="currentColor" viewBox="0 0 24 24">
											<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
										</svg>
									</div>
									
									<h3 className={`mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100 sm:text-xl ${isArabic ? 'text-right' : 'text-left'}`}>
										{t.contractReady}
									</h3>
									
									<p className={`mb-6 text-sm text-gray-600 dark:text-gray-400 max-w-sm ${isArabic ? 'text-right' : 'text-left'}`}>
										{isMobile ? t.mobileMessage : t.errorMessage}
									</p>

									{/* معلومات الملف */}
									<div className={`mb-6 w-full rounded-lg bg-gray-50 dark:bg-gray-700 p-4 text-sm text-gray-600 dark:text-gray-300 ${isArabic ? 'text-right' : 'text-left'}`}>
										<div className={`flex items-center justify-center gap-2 mb-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
											<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
												<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
											</svg>
											<span className="font-medium">{t.fileName}</span>
										</div>
										<p>{t.fileType}</p>
										<p>{t.fileStatus}</p>
									</div>

									{/* أزرار الإجراءات */}
									<div className="flex w-full flex-col gap-3">
										<a
											href={fileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={`flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
										>
											<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
											{t.openInNewWindow}
										</a>
										
										<a
											href={fileUrl}
											download={t.fileName}
											className={`flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 dark:bg-green-500 px-6 py-3 text-white transition-colors hover:bg-green-700 dark:hover:bg-green-600 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
										>
											<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											{t.downloadContract}
										</a>
									</div>
								</div>
							)}

							{/* خيارات إضافية للكمبيوتر إذا لم يفشل iframe */}
							{!isMobile && !iframeFailed && (
								<div className={`mt-4 text-center ${isArabic ? 'text-right' : 'text-left'}`}>
									<p className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${isArabic ? 'text-right' : 'text-left'}`}>
										{t.additionalOptions}
									</p>
									<div className={`flex flex-col gap-2 sm:flex-row justify-center ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
										<a
											href={fileUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={`inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
										>
											<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
											</svg>
											{t.openInNewWindowShort}
										</a>
										
										<a
											href={fileUrl}
											download={t.fileName}
											className={`inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 dark:bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700 dark:hover:bg-green-600 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}
										>
											<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											{t.downloadContractShort}
										</a>
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* أسفل النافذة */}
				<div className={`flex flex-shrink-0 justify-between border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
					<div className={`text-sm text-gray-500 dark:text-gray-400 ${isArabic ? 'text-right' : 'text-left'}`}>
						{isMobile ? t.mobileFooter : t.desktopFooter}
					</div>
					<div className={`flex gap-2 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
						<a
							href={fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 dark:hover:bg-blue-600"
						>
							{t.openInNewWindowShort}
						</a>
						<a
							href={fileUrl}
							download={t.fileName}
							className="rounded-lg bg-green-600 dark:bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700 dark:hover:bg-green-600"
						>
							{t.downloadContractShort}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
