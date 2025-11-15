"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaHeadset, FaPhone, FaClock, FaQuestionCircle, FaComments, FaDesktop, FaUserFriends } from "react-icons/fa";
import { PolicySection, ContactInfo, NoticeSection } from "../UI";

export default function SupportPage() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const content = {
		ar: {
			title: "المساعدة والدعم",
			subtitle: "نحن هنا لمساعدتك في أي وقت تحتاجه",
			intro: "فريق الدعم الفني في شلة متاح على مدار الساعة لمساعدتك في حل أي مشكلة قد تواجهها. نحن ملتزمون بتقديم أفضل تجربة مستخدم ممكنة.",
			contactMethodsTitle: "طرق التواصل معنا",
			contactMethodsText: "يمكنك التواصل معنا عبر الطرق التالية للحصول على المساعدة الفورية.",
			contactMethodsItems: [
				"الهاتف: متاح 24/7 للاستفسارات العاجلة",
				"البريد الإلكتروني: للاستفسارات التفصيلية",
				"التطبيق: الدردشة المباشرة مع فريق الدعم",
				"الموقع الإلكتروني: مركز المساعدة الشامل"
			],
			responseTimeTitle: "أوقات الاستجابة",
			responseTimeText: "نحن ملتزمون بالرد عليك في أسرع وقت ممكن.",
			responseTimeItems: [
				"الهاتف: فوري خلال ساعات العمل",
				"البريد الإلكتروني: خلال 24 ساعة",
				"الدردشة المباشرة: خلال دقائق",
				"الاستفسارات العامة: خلال 4 ساعات"
			],
	
			technicalSupportTitle: "الدعم الفني",
			technicalSupportText: "فريقنا التقني متخصص في حل المشاكل التقنية المعقدة.",
			technicalSupportItems: [
				"حل مشاكل التطبيق",
				"استكشاف أخطاء النظام",
				"تحسين الأداء",
				"التحديثات والأمان"
			],
			contactInfoTitle: "معلومات الاتصال",
			contactInfoText: "تواصل معنا عبر القنوات التالية:",
			contactInfoItems: [
				"الهاتف: 920000000",
				"البريد الإلكتروني: support@shilla.com",
				"العنوان: المملكة العربية السعودية, الرياض, المنطقة الشرقية",
			
			],
			noticeTitle: "ملاحظة مهمة:",
			noticeText: "نحن ملتزمون بتقديم أفضل خدمة عملاء ممكنة. لا تتردد في التواصل معنا في أي وقت، وسنكون سعداء لمساعدتك."
		},
		en: {
			title: "Help & Support",
			subtitle: "We are here to help you whenever you need us",
			intro: "Shilla's technical support team is available 24/7 to help you solve any problem you may encounter. We are committed to providing the best possible user experience.",
			contactMethodsTitle: "Contact Methods",
			contactMethodsText: "You can contact us through the following methods for immediate assistance.",
			contactMethodsItems: [
				"Phone: Available 24/7 for urgent inquiries",
				"Email: For detailed inquiries",
				"App: Direct chat with support team",
				"Website: Comprehensive help center"
			],
			responseTimeTitle: "Response Times",
			responseTimeText: "We are committed to responding to you as quickly as possible.",
			responseTimeItems: [
				"Phone: Immediate during business hours",
				"Email: Within 24 hours",
				"Live chat: Within minutes",
				"General inquiries: Within 4 hours"
			],
			technicalSupportTitle: "Technical Support",
			technicalSupportText: "Our technical team specializes in solving complex technical problems.",
			technicalSupportItems: [
				"App troubleshooting",
				"System error diagnosis",
				"Performance optimization",
				"Updates and security"
			],
			contactInfoTitle: "Contact Information",
			contactInfoText: "Contact us through the following channels:",
			contactInfoItems: [
				"Phone: 920000000",
				"Email: support@shilla.com",
				"Address: KSA, Saudi Arabia, Umm Al Hammam",
			
			],
			noticeTitle: "Important Note:",
			noticeText: "We are committed to providing the best possible customer service. Don't hesitate to contact us anytime, and we'll be happy to help you."
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
								<FaHeadset className="text-green-600 dark:text-green-400 text-lg" />
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

					{/* Contact Methods */}
					<PolicySection
						icon={<FaPhone className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.contactMethodsTitle}
						description={currentContent.contactMethodsText}
						items={currentContent.contactMethodsItems}
						isArabic={isArabic}
					/>

					{/* Response Time */}
					<PolicySection
						icon={<FaClock className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.responseTimeTitle}
						description={currentContent.responseTimeText}
						items={currentContent.responseTimeItems}
						isArabic={isArabic}
					/>

					{/* Technical Support */}
					<PolicySection
						icon={<FaDesktop className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.technicalSupportTitle}
						description={currentContent.technicalSupportText}
						items={currentContent.technicalSupportItems}
						isArabic={isArabic}
					/>

					{/* Contact Information */}
					<ContactInfo
						icon={<FaUserFriends className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.contactInfoTitle}
						description={currentContent.contactInfoText}
						contactItems={currentContent.contactInfoItems}
						isArabic={isArabic}
					/>

					{/* Important Notice */}
					<NoticeSection
						icon={<FaComments className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.noticeTitle}
						text={currentContent.noticeText}
						isArabic={isArabic}
					/>
				</div>
			</div>
		</div>
	);
}
