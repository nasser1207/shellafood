"use client";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function ShellaFooter() {
	const { t, language } = useLanguage();
	const isArabic = language === "ar";
	const router = useRouter();
	
	return (
		<div
			className={`w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 ${isArabic ? "rtl" : "ltr"}`}
			dir={isArabic ? "rtl" : "ltr"}
		>
			{/* App Download Section - Full Width */}
			<div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
				<div className="w-full px-4 sm:px-8 lg:px-16 py-6">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 text-center sm:text-right">
							{t("footer.downloadApp")}
						</h2>
						<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center max-w-2xl">
							{t("footer.downloadSubtitle")}
						</p>
						<div className="flex items-center gap-3">
							{/* App Gallery */}
							<Link href="#" className="hover:opacity-80 transition-opacity">
								<img
									src="/appgalary.png"
									alt="App Gallery"
									className="h-12 sm:h-14 w-auto dark:opacity-80 transition-opacity duration-300"
								/>
							</Link>
							{/* Google Play */}
							<Link href="#" className="hover:opacity-80 transition-opacity">
								<img
									src="/googleplay.png"
									alt="Google Play"
									className="h-12 sm:h-14 w-auto dark:opacity-80 transition-opacity duration-300"
								/>
							</Link>
							{/* App Store */}
							<Link href="#" className="hover:opacity-80 transition-opacity">
								<img
									src="/appstore.png"
									alt="App Store"
									className="h-12 sm:h-14 w-auto dark:opacity-80 transition-opacity duration-300"
								/>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Main Footer Content - Full Width */}
			<footer className="bg-white dark:bg-gray-900 py-12">
				<div className="w-full px-4 sm:px-8 lg:px-16">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 ">
						
					{/* Shella Logo Section */}
					<div className="flex flex-col items-center lg:items-start">
						<Link href="/" prefetch={true} className="inline-block mb-6">
							<img
								src="/shellalogo.png"
								alt="Shalla Logo"
								className="h-16 w-auto dark:opacity-80 transition-opacity duration-300"
							/>
						</Link>
						<p className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs text-center lg:${isArabic ? "text-right" : "text-left"}`}>
							{t("footer.companyDescription")}
						</p>
					</div>

						{/* Company Links (الشركة) */}
						<div className="text-center lg:text-start">
							<h3 className={`text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 mb-4`}>
								{t("footer.company")}
							</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
									• {t("footer.aboutUs")}
								</Link>
							</li>
							<li>
								<Link href="/" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
									• {t("footer.careers")}
								</Link>
							</li>
							<li>
								<Link href="/" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
									• {t("footer.faq")}
								</Link>
							</li>
							<li>
								<Link href="/" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
									• {t("footer.islamicLaw")}
								</Link>
							</li>
						</ul>
						</div>

						{/* Legal Links (القانونية) */}
						<div className="text-center lg:text-start">
							<h3 className={`text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 mb-4`}>
								{t("footer.legal")}
							</h3>
							<ul className="space-y-2">
								<li>
									<Link href="/profile/policies/kaidha-terms" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.kaidhaTerms")}
									</Link>
								</li>
								<li>
									<Link href="/profile/policies/privacy" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.privacyPolicy")}
									</Link>
								</li>
								<li>
									<Link href="/profile/policies/terms" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.termsConditions")}
									</Link>
								</li>
								<li>
									<Link href="/" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.violations")}
									</Link>
								</li>
							</ul>
						</div>

						{/* Application Links (التطبيق) */}
						<div className="text-center lg:text-start">
							<h3 className={`text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 mb-4`}>
								{t("footer.application")}
							</h3>
							<ul className="space-y-2">
								<li>
									<Link href="/driver" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.joinAsDriver")}
									</Link>
								</li>
								<li>
									<Link href="/partner" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.joinAsPartner")}
									</Link>
								</li>
								<li>
									<Link href="/worker" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.joinAsWorker")}
									</Link>
								</li>
								<li>
									<Link href="/investor" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.joinAsInvestor")}
									</Link>
								</li>
							</ul>
						</div>

						{/* Customer Service Links (خدمة العملاء) */}
						<div className="text-center lg:text-start">
							<h3 className={`text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 mb-4`}>
								{t("footer.customerService")}
							</h3>
							<ul className="space-y-2">
								<li>
									<Link href="/" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.customerTestimonials")}
									</Link>
								</li>
								<li>
									<Link href="/profile/support" prefetch={true} className={`text-sm text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors block`}>
										• {t("footer.contactUs")}
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Bottom Section - Social Media & Copyright - Full Width */}
					<div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
							{/* Social Media Icons */}
							<div className="flex items-center gap-4">
								<Link
									href="https://facebook.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
								>
									<Facebook className="w-6 h-6" />
								</Link>
								<Link
									href="https://instagram.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
								>
									<Instagram className="w-6 h-6" />
								</Link>
								<Link
									href="https://linkedin.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
								>
									<Linkedin className="w-6 h-6" />
								</Link>
								<Link
									href="https://twitter.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
								>
									<FaXTwitter className="w-6 h-6" />
								</Link>
							</div>

							{/* Copyright */}
							<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
								{t("footer.copyright")}
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
