"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle, Smile, Frown } from "lucide-react";

interface RatingModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (rating: number, feedback: string) => Promise<void> | void;
	language?: "en" | "ar";
	serviceName?: string;
	driverName?: string;
	driverPhoto?: string;
}

/**
 * Rating Modal Component
 * Displays rating interface for service/driver feedback
 */
export default function RatingModal({
	isOpen,
	onClose,
	onSubmit,
	language = "en",
	serviceName,
	driverName,
	driverPhoto,
}: RatingModalProps) {
	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [feedback, setFeedback] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	const isArabic = language === "ar";

	// Translations
	const translations = useMemo(() => ({
		en: {
			thankYou: "Thank you for your booking!",
			howWasExperience: "How was your experience?",
			shareFeedback: "Share your feedback (optional)",
			submitRating: "Submit Rating",
			submitting: "Submitting...",
			successMessage: "Your rating has been submitted. Thank you!",
			lowRatingMessage: "We're sorry to hear that. What can we improve?",
			rateDriver: "Rate your driver",
			rateService: "Rate your service",
			ratingLabels: {
				1: "Poor",
				2: "Fair",
				3: "Good",
				4: "Very Good",
				5: "Excellent",
			},
		},
		ar: {
			thankYou: "شكرًا لتأكيد الحجز!",
			howWasExperience: "كيف كانت تجربتك؟",
			shareFeedback: "شاركنا ملاحظاتك (اختياري)",
			submitRating: "إرسال التقييم",
			submitting: "جاري الإرسال...",
			successMessage: "تم إرسال تقييمك بنجاح. شكرًا لك!",
			lowRatingMessage: "نأسف لذلك. ما الذي يمكننا تحسينه؟",
			rateDriver: "قيم سائقك",
			rateService: "قيم خدمتك",
			ratingLabels: {
				1: "ضعيف",
				2: "مقبول",
				3: "جيد",
				4: "جيد جدًا",
				5: "ممتاز",
			},
		},
	}), []);

	const t = translations[language];

	// Auto-focus textarea after rating is selected
	useEffect(() => {
		if (rating > 0 && rating < 5 && textareaRef.current && !isSubmitting) {
			const timer = setTimeout(() => {
				textareaRef.current?.focus();
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [rating, isSubmitting]);

	// Keyboard accessibility
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isSubmitting && !isSuccess) {
				onClose();
			}
			if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && rating > 0 && !isSubmitting && !isSuccess) {
				handleSubmit();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, rating, isSubmitting, isSuccess, onClose]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	const handleSubmit = useCallback(async () => {
		if (rating === 0) return;

		setIsSubmitting(true);
		try {
			await onSubmit(rating, feedback);
			setIsSuccess(true);
			setTimeout(() => {
				onClose();
				setIsSuccess(false);
				setRating(0);
				setFeedback("");
				setHoveredRating(0);
			}, 2000);
		} catch (error) {
			console.error("Error submitting rating:", error);
		} finally {
			setIsSubmitting(false);
		}
	}, [rating, feedback, onSubmit, onClose]);

	const handleClose = useCallback(() => {
		if (isSubmitting || isSuccess) return;
		onClose();
		setTimeout(() => {
			setRating(0);
			setFeedback("");
			setHoveredRating(0);
		}, 300);
	}, [isSubmitting, isSuccess, onClose]);

	const handleRatingClick = useCallback((star: number) => {
		setRating(star);
	}, []);

	const handleFeedbackChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setFeedback(e.target.value);
	}, []);

	// Memoized computed values
	const displayRating = useMemo(() => hoveredRating || rating, [hoveredRating, rating]);
	const showLowRatingMessage = useMemo(() => rating > 0 && rating < 3, [rating]);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50 bg-black/60 dark:bg-black/70 backdrop-blur-sm"
						onClick={handleClose}
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
						<motion.div
							ref={modalRef}
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
							className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl pointer-events-auto overflow-hidden ${isArabic ? "rtl" : "ltr"}`}
							dir={isArabic ? "rtl" : "ltr"}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close Button */}
							<button
								onClick={handleClose}
								disabled={isSubmitting || isSuccess}
								className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2`}
								aria-label={isArabic ? "إغلاق" : "Close"}
							>
								<X className="w-5 h-5" />
							</button>

							{/* Success State */}
							<AnimatePresence>
								{isSuccess && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										transition={{ duration: 0.3 }}
										className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-6"
									>
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
											className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 shadow-md"
										>
											<CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" strokeWidth={2.5} />
										</motion.div>
										<motion.p
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.2 }}
											className={`text-lg font-semibold text-gray-900 dark:text-gray-100 text-center ${isArabic ? "text-right" : "text-left"}`}
										>
											{t.successMessage}
										</motion.p>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Main Content */}
							{!isSuccess && (
								<div className="p-6 sm:p-8">
									{/* Top Section */}
									<div className={`flex flex-col items-center mb-6 ${isArabic ? "text-right" : "text-left"}`}>
										{/* Avatar/Illustration */}
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
											className="relative mb-4"
										>
											{driverPhoto ? (
												<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-blue-50 dark:border-blue-900/30 shadow-lg">
													<img src={driverPhoto} alt={driverName || ""} className="w-full h-full object-cover" />
												</div>
											) : (
												<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 dark:from-blue-900/30 to-blue-200 dark:to-blue-800/30 flex items-center justify-center shadow-lg">
													{rating >= 4 ? (
														<Smile className="w-12 h-12 text-blue-600 dark:text-blue-400" strokeWidth={2} />
													) : rating > 0 && rating < 3 ? (
														<Frown className="w-12 h-12 text-blue-600 dark:text-blue-400" strokeWidth={2} />
													) : (
														<Star className="w-12 h-12 text-blue-600 dark:text-blue-400" strokeWidth={2} />
													)}
												</div>
											)}
										</motion.div>

										{/* Thank You Message */}
										<motion.h2
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.2 }}
											className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center"
										>
											{t.thankYou}
										</motion.h2>

										{/* Driver/Service Name */}
										{(driverName || serviceName) && (
											<motion.p
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: 0.3 }}
												className="text-sm text-gray-600 dark:text-gray-400 mb-1 text-center"
											>
												{driverName ? t.rateDriver : t.rateService}:{" "}
												<span className="font-semibold text-gray-900 dark:text-gray-100">{driverName || serviceName}</span>
											</motion.p>
										)}
									</div>

									{/* Rating Section */}
									<div className="mb-6">
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.3 }}
											className={`text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center ${isArabic ? "text-right" : "text-left"}`}
										>
											{t.howWasExperience}
										</motion.p>

										{/* Stars */}
										<div className={`flex items-center justify-center gap-1 sm:gap-2 mb-3 ${isArabic ? "flex-row-reverse" : ""}`}>
											{[1, 2, 3, 4, 5].map((star) => {
												const isActive = star <= displayRating;
												const isSelected = star <= rating;
												return (
													<motion.button
														key={star}
														type="button"
														onClick={() => handleRatingClick(star)}
														onMouseEnter={() => setHoveredRating(star)}
														onMouseLeave={() => setHoveredRating(0)}
														disabled={isSubmitting}
														className={`relative p-1 sm:p-2 transition-all ${
															isSubmitting ? "cursor-not-allowed" : "cursor-pointer active:scale-95"
														}`}
														whileHover={!isSubmitting ? { scale: 1.15 } : {}}
														whileTap={!isSubmitting ? { scale: 0.95 } : {}}
													>
														<Star
															className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 ${
																isActive
																	? isSelected
																		? "text-[#0B64B3] dark:text-blue-400 fill-[#0B64B3] dark:fill-blue-400"
																		: "text-[#0B64B3] dark:text-blue-400 fill-[#0B64B3] dark:fill-blue-400 opacity-70"
																	: "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
															}`}
															strokeWidth={2}
														/>
														{isActive && (
															<motion.div
																initial={{ scale: 0 }}
																animate={{ scale: 1 }}
																className="absolute inset-0 rounded-full bg-[#0B64B3]/20 dark:bg-blue-400/20"
															/>
														)}
													</motion.button>
												);
											})}
										</div>

										{/* Rating Label */}
										{rating > 0 && (
											<motion.p
												initial={{ opacity: 0, y: -5 }}
												animate={{ opacity: 1, y: 0 }}
												className={`text-sm font-medium text-[#0B64B3] dark:text-blue-400 text-center ${isArabic ? "text-right" : "text-left"}`}
											>
												{t.ratingLabels[rating as keyof typeof t.ratingLabels]}
											</motion.p>
										)}
									</div>

									{/* Low Rating Message */}
									<AnimatePresence>
										{showLowRatingMessage && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												transition={{ duration: 0.3 }}
												className={`mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg ${isArabic ? "text-right" : "text-left"}`}
											>
												<p className="text-sm text-orange-800 dark:text-orange-300">{t.lowRatingMessage}</p>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Feedback Section */}
									<div className="mb-6">
										<textarea
											ref={textareaRef}
											value={feedback}
											onChange={handleFeedbackChange}
											placeholder={t.shareFeedback}
											disabled={isSubmitting}
											rows={4}
											className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:border-[#0B64B3] dark:focus:border-blue-400 focus:ring-2 focus:ring-[#0B64B3]/20 dark:focus:ring-blue-400/20 focus:outline-none transition-all resize-none text-base ${
												isArabic ? "text-right" : "text-left"
											} disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed placeholder-gray-400 dark:placeholder-gray-500`}
											dir={isArabic ? "rtl" : "ltr"}
										/>
									</div>

									{/* Submit Button */}
									<motion.button
										type="button"
										onClick={handleSubmit}
										disabled={rating === 0 || isSubmitting}
										whileHover={rating > 0 && !isSubmitting ? { scale: 1.02 } : {}}
										whileTap={rating > 0 && !isSubmitting ? { scale: 0.98 } : {}}
										className={`w-full py-4 px-6 bg-[#0B64B3] dark:bg-blue-500 hover:bg-[#09539a] dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#0B64B3] dark:focus:ring-blue-400 focus:ring-offset-2 ${
											isArabic ? "flex-row-reverse" : ""
										}`}
									>
										{isSubmitting ? (
											<>
												<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
												<span>{t.submitting}</span>
											</>
										) : (
											<span>{t.submitRating}</span>
										)}
									</motion.button>

									{/* Keyboard Hint */}
									<p className={`mt-3 text-xs text-gray-500 dark:text-gray-400 text-center ${isArabic ? "text-right" : "text-left"}`}>
										{isArabic ? "اضغط Ctrl + Enter للإرسال" : "Press Ctrl + Enter to submit"}
									</p>
								</div>
							)}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}

