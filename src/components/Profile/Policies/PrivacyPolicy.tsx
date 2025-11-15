"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaShieldAlt, FaUserShield, FaLock, FaEye, FaDatabase, FaPhone } from "react-icons/fa";
import { PolicySection, ContactInfo, NoticeSection } from "../UI";

export default function PrivacyPolicy() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const content = {
		ar: {
			title: "سياسة الخصوصية",
			subtitle: "نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية",
			intro: "في عصر التكنولوجيا المالية (FinTech)، تُعدّ تطبيقات الهواتف الذكية وسيلةً مُبتكرةً لتقديم الخدمات المالية للعملاء بِكفاءة و سهولة. و لضمان تقديم هذه الخدمات بِشكل آمن و مُنظم، تُلزم هذه التطبيقات عملاءها بِتقديم إقرار يُحدّد مسؤولياتهم و حقوقهم، و يُنظّم كيفية التعامل مع بياناتهم الشخصية.",
			dataCollectionTitle: "جمع البيانات",
			dataCollectionText: "نقوم بجمع البيانات الشخصية اللازمة لتقديم خدماتنا بشكل فعال وآمن.",
			dataCollectionItems: [
				"الاسم الكامل وتفاصيل الهوية",
				"معلومات الاتصال (الهاتف والبريد الإلكتروني)",
				"العنوان ومعلومات الموقع",
				"البيانات المالية اللازمة للخدمة"
			],
			dataUsageTitle: "استخدام البيانات",
			dataUsageText: "نستخدم البيانات الشخصية لأغراض محددة ومشروعة فقط.",
			dataUsageItems: [
				"تقديم الخدمات المالية المطلوبة",
				"التحقق من الهوية والأمان",
				"تحسين جودة الخدمات المقدمة"
			],
			dataProtectionTitle: "حماية البيانات",
			dataProtectionText: "نطبق أعلى معايير الأمان لحماية بياناتك الشخصية.",
			dataProtectionItems: [
				"تشفير البيانات الحساسة",
				"الوصول المقيد للبيانات",
				"مراقبة الأمان المستمرة",
				"النسخ الاحتياطي الآمن"
			],
			contactTitle: "معلومات الاتصال",
			contactText: "للاستفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر:",
			contactItems: [
				"البريد الإلكتروني: privacy@shilla.com",
				"الهاتف: 920000000",
			
			],
			noticeTitle: "إشعار مهم:",
			noticeText: "نحتفظ بالحق في تحديث هذه السياسة من وقت لآخر. سيتم إشعارك بأي تغييرات مهمة عبر البريد الإلكتروني أو التطبيق."
		},
		en: {
			title: "Privacy Policy",
			subtitle: "We are committed to protecting your privacy and personal data",
			intro: "In the era of financial technology (FinTech), smartphone applications are an innovative way to provide financial services to customers efficiently and easily. To ensure the provision of these services in a safe and organized manner, these applications require their customers to provide a declaration that defines their responsibilities and rights, and regulates how to deal with their personal data.",
			dataCollectionTitle: "Data Collection",
			dataCollectionText: "We collect personal data necessary to provide our services effectively and securely.",
			dataCollectionItems: [
				"Full name and identity details",
				"Contact information (phone and email)",
				"Address and location information",
				"Financial data necessary for the service"
			],
			dataUsageTitle: "Data Usage",
			dataUsageText: "We use personal data for specific and legitimate purposes only.",
			dataUsageItems: [
				"Providing requested financial services",
				"Identity verification and security",
				"Improving the quality of services provided"
			],
			dataProtectionTitle: "Data Protection",
			dataProtectionText: "We apply the highest security standards to protect your personal data.",
			dataProtectionItems: [
				"Encryption of sensitive data",
				"Restricted access to data",
				"Continuous security monitoring",
				"Secure backup"
			],
			contactTitle: "Contact Information",
			contactText: "For inquiries about the privacy policy, you can contact us via:",
			contactItems: [
				"Email: privacy@shilla.com",
				"Phone: 920000000",
			
			],
			noticeTitle: "Important Notice:",
			noticeText: "We reserve the right to update this policy from time to time. You will be notified of any significant changes via email or the app."
		}
	};

	const currentContent = content[language];

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
				{/* Header */}
				<div className="mb-6 sm:mb-8">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<div className={`flex items-center gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
							<div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
								<FaShieldAlt className="text-green-600 dark:text-green-400 text-lg" />
							</div>
							<div className={isArabic ? 'text-right' : 'text-left'}>
								<h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
									{currentContent.title}
								</h1>
								<p className="text-gray-600 dark:text-gray-400 text-sm">
									{currentContent.subtitle}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="space-y-6">
					{/* Introduction */}
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
						<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
							{currentContent.intro}
						</p>
					</div>

					{/* Data Collection */}
					<PolicySection
						icon={<FaDatabase className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.dataCollectionTitle}
						description={currentContent.dataCollectionText}
						items={currentContent.dataCollectionItems}
						isArabic={isArabic}
					/>

					{/* Data Usage */}
					<PolicySection
						icon={<FaEye className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.dataUsageTitle}
						description={currentContent.dataUsageText}
						items={currentContent.dataUsageItems}
						isArabic={isArabic}
					/>

					{/* Data Protection */}
					<PolicySection
						icon={<FaLock className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.dataProtectionTitle}
						description={currentContent.dataProtectionText}
						items={currentContent.dataProtectionItems}
						isArabic={isArabic}
					/>

					{/* Contact Information */}
					<ContactInfo
						icon={<FaPhone className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.contactTitle}
						description={currentContent.contactText}
						contactItems={currentContent.contactItems}
						isArabic={isArabic}
					/>

					{/* Important Notice */}
					<NoticeSection
						icon={<FaUserShield className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.noticeTitle}
						text={currentContent.noticeText}
						isArabic={isArabic}
					/>
				</div>
			</div>
		</div>
	);
}
