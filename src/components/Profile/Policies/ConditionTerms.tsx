"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaShieldAlt, FaFileContract, FaUserCheck, FaCreditCard, FaLock, FaGavel, FaEdit, FaTimes, FaExclamationTriangle, FaBalanceScale, FaPhone } from "react-icons/fa";
import { PolicySection, ContactInfo, NoticeSection } from "../UI";

export default function ConditionTerms() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const content = {
		ar: {
			title: "الشروط والأحكام",
			subtitle: "اتفاقية قانونية ملزمة تحكم العلاقة بين شلة التجارية وعملائها",
			intro: "تُعد الشروط والأحكام المقدمة بمثابة اتفاقية قانونية ملزمة تحكم العلاقة بين منشأة شلة التجارية وعملائها. وتهدف هذه الوثيقة إلى توضيح حقوق والتزامات كل طرف، وضمان الشفافية والوضوح في التعاملات بينهما.",
			companyInfoTitle: "معلومات الشركة",
			companyInfoText: "شلة التجارية مؤسسة مرخصة في المملكة العربية السعودية، تعمل في مجال التجارة الإلكترونية وتقديم الخدمات الرقمية.",
			companyInfoItems: [
				"مؤسسة مرخصة في المملكة العربية السعودية",
				"تعمل في مجال التجارة الإلكترونية",
				"تقدم الخدمات الرقمية",
				"تلتزم بالقوانين واللوائح المحلية والدولية"
			],
			serviceScopeTitle: "نطاق الخدمة",
			serviceScopeText: "تشمل خدمات شلة التجارية مجموعة واسعة من الخدمات الرقمية والتجارية.",
			serviceScopeItems: [
				"منصة إلكترونية للبيع والشراء",
				"خدمات الدفع الإلكتروني",
				"خدمات التوصيل",
				"خدمات الدعم الفني"
			],
			userResponsibilitiesTitle: "مسؤوليات المستخدم",
			userResponsibilitiesText: "يتحمل المستخدم مسؤوليات محددة عند استخدام خدمات شلة التجارية.",
			userResponsibilitiesItems: [
				"إنشاء حساب شخصي بمعلومات دقيقة",
				"حماية معلومات الحساب",
				"عدم مشاركة البيانات مع طرف ثالث",
				"الالتزام بشروط الاستخدام"
			],
			paymentTitle: "الدفع والفواتير",
			paymentText: "نوفر أنظمة دفع آمنة ومتعددة الخيارات مع فواتير مفصلة.",
			paymentItems: [
				"أنظمة دفع آمنة ومتعددة",
				"فواتير مفصلة وقانونية",
				"قابلة للطباعة والتحميل",
				"شفافية في الرسوم والعمولات"
			],
			privacyTitle: "الخصوصية وحماية البيانات",
			privacyText: "نلتزم بحماية خصوصية عملائنا وبياناتهم الشخصية وفقاً للقوانين المحلية.",
			privacyItems: [
				"حماية البيانات الشخصية",
				"عدم المشاركة مع طرف ثالث",
				"الامتثال لنظام حماية البيانات",
				"شفافية في استخدام البيانات"
			],
			liabilityTitle: "المسؤولية والضمانات",
			liabilityText: "نقدم ضمانات مناسبة للمنتجات والخدمات مع مراعاة القيود القانونية.",
			liabilityItems: [
				"ضمانات مناسبة للمنتجات",
				"مسؤولية عن الأضرار الناتجة عن الإهمال",
				"التزام بمعايير الجودة",
				"حماية حقوق المستهلك"
			],
			disputesTitle: "حل النزاعات",
			disputesText: "نلتزم بحل النزاعات بطريقة عادلة ومناسبة وفقاً للقوانين المحلية.",
			disputesItems: [
				"اللجوء للتحكيم أو القضاء",
				"تطبيق القوانين المحلية",
				"محاكم المملكة المختصة",
				"حل سلمي للنزاعات"
			],
			modificationsTitle: "التعديلات",
			modificationsText: "نحتفظ بالحق في تعديل الشروط والأحكام مع إشعار العملاء بالتغييرات.",
			modificationsItems: [
				"حق التعديل في أي وقت",
				"إشعار العملاء بالتغييرات",
				"التواصل عبر المنصة أو البريد",
				"موافقة ضمنية بالاستمرار"
			],
			terminationTitle: "الإلغاء والإنهاء",
			terminationText: "يحق لأي من الطرفين إنهاء الاتفاقية مع مراعاة الالتزامات المالية.",
			terminationItems: [
				"حق الإنهاء لأي من الطرفين",
				"مراعاة الالتزامات المالية",
				"إجراءات الإنهاء المناسبة",
				"حماية حقوق الطرفين"
			],
			forceMajeureTitle: "القوة القاهرة",
			forceMajeureText: "لا نتحمل مسؤولية عن عدم القدرة على تقديم الخدمة بسبب ظروف خارجة عن إرادتنا.",
			forceMajeureItems: [
				"الكوارث الطبيعية",
				"الأزمات الاقتصادية",
				"الأحداث السياسية",
				"أي ظروف خارجة عن الإرادة"
			],
			governingLawTitle: "القانون الحاكم",
			governingLawText: "تخضع هذه الاتفاقية للقوانين واللوائح المعمول بها في المملكة العربية السعودية.",
			governingLawItems: [
				"القوانين السعودية",
				"اللوائح المحلية",
				"محاكم المملكة المختصة",
				"الامتثال للأنظمة المحلية"
			],
			contactTitle: "معلومات الاتصال",
			contactText: "للاستفسارات حول الشروط والأحكام، يمكنك التواصل معنا عبر:",
			contactItems: [
				"البريد الإلكتروني: legal@shilla.com",
				"الهاتف: 920000000",
			],
			noticeTitle: "إشعار مهم:",
			noticeText: "تُشكل هذه الشروط والأحكام إطاراً قانونياً شاملاً يحكم العلاقة بين شلة التجارية وعملائها، ويهدف إلى ضمان حقوق جميع الأطراف وخلق بيئة عمل آمنة وشفافة."
		},
		en: {
			title: "Terms and Conditions",
			subtitle: "Legal binding agreement governing the relationship between Shilla Commercial and its customers",
			intro: "The terms and conditions presented constitute a legally binding agreement that governs the relationship between Shilla Commercial establishment and its customers. This document aims to clarify the rights and obligations of each party, and ensure transparency and clarity in dealings between them.",
			companyInfoTitle: "Company Information",
			companyInfoText: "Shilla Commercial is a licensed institution in the Kingdom of Saudi Arabia, operating in the field of e-commerce and providing digital services.",
			companyInfoItems: [
				"Licensed institution in Saudi Arabia",
				"Operating in e-commerce field",
				"Providing digital services",
				"Compliant with local and international laws"
			],
			serviceScopeTitle: "Service Scope",
			serviceScopeText: "Shilla Commercial services include a wide range of digital and commercial services.",
			serviceScopeItems: [
				"Electronic platform for buying and selling",
				"Electronic payment services",
				"Delivery services",
				"Technical support services"
			],
			userResponsibilitiesTitle: "User Responsibilities",
			userResponsibilitiesText: "Users have specific responsibilities when using Shilla Commercial services.",
			userResponsibilitiesItems: [
				"Create personal account with accurate information",
				"Protect account information",
				"Do not share data with third parties",
				"Comply with terms of use"
			],
			paymentTitle: "Payment and Invoices",
			paymentText: "We provide secure and multiple payment systems with detailed invoices.",
			paymentItems: [
				"Secure and multiple payment systems",
				"Detailed and legal invoices",
				"Printable and downloadable",
				"Transparency in fees and commissions"
			],
			privacyTitle: "Privacy and Data Protection",
			privacyText: "We are committed to protecting our customers' privacy and personal data in accordance with local laws.",
			privacyItems: [
				"Protect personal data",
				"No sharing with third parties",
				"Compliance with data protection system",
				"Transparency in data usage"
			],
			liabilityTitle: "Liability and Warranties",
			liabilityText: "We provide appropriate warranties for products and services while considering legal limitations.",
			liabilityItems: [
				"Appropriate product warranties",
				"Liability for damages due to negligence",
				"Commitment to quality standards",
				"Consumer rights protection"
			],
			disputesTitle: "Dispute Resolution",
			disputesText: "We are committed to resolving disputes fairly and appropriately in accordance with local laws.",
			disputesItems: [
				"Resort to arbitration or judiciary",
				"Apply local laws",
				"Competent courts of the Kingdom",
				"Peaceful dispute resolution"
			],
			modificationsTitle: "Modifications",
			modificationsText: "We reserve the right to modify terms and conditions while notifying customers of changes.",
			modificationsItems: [
				"Right to modify at any time",
				"Notify customers of changes",
				"Communication via platform or email",
				"Implied consent by continuation"
			],
			terminationTitle: "Cancellation and Termination",
			terminationText: "Either party has the right to terminate the agreement while considering financial obligations.",
			terminationItems: [
				"Right of termination for either party",
				"Consideration of financial obligations",
				"Appropriate termination procedures",
				"Protection of both parties' rights"
			],
			forceMajeureTitle: "Force Majeure",
			forceMajeureText: "We are not responsible for inability to provide service due to circumstances beyond our control.",
			forceMajeureItems: [
				"Natural disasters",
				"Economic crises",
				"Political events",
				"Any circumstances beyond control"
			],
			governingLawTitle: "Governing Law",
			governingLawText: "This agreement is subject to the laws and regulations in force in the Kingdom of Saudi Arabia.",
			governingLawItems: [
				"Saudi laws",
				"Local regulations",
				"Competent courts of the Kingdom",
				"Compliance with local systems"
			],
			contactTitle: "Contact Information",
			contactText: "For inquiries about terms and conditions, you can contact us via:",
			contactItems: [
				"Email: legal@shilla.com",
				"Phone: 920000000",
			],
			noticeTitle: "Important Notice:",
			noticeText: "These terms and conditions form a comprehensive legal framework that governs the relationship between Shilla Commercial and its customers, aiming to ensure the rights of all parties and create a safe and transparent work environment."
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
								<FaFileContract className="text-green-600 dark:text-green-400 text-lg" />
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

					{/* Company Information */}
					<PolicySection
						icon={<FaShieldAlt className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.companyInfoTitle}
						description={currentContent.companyInfoText}
						items={currentContent.companyInfoItems}
						isArabic={isArabic}
					/>

					{/* Service Scope */}
					<PolicySection
						icon={<FaFileContract className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.serviceScopeTitle}
						description={currentContent.serviceScopeText}
						items={currentContent.serviceScopeItems}
						isArabic={isArabic}
					/>

					{/* User Responsibilities */}
					<PolicySection
						icon={<FaUserCheck className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.userResponsibilitiesTitle}
						description={currentContent.userResponsibilitiesText}
						items={currentContent.userResponsibilitiesItems}
						isArabic={isArabic}
					/>

					{/* Payment */}
					<PolicySection
						icon={<FaCreditCard className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.paymentTitle}
						description={currentContent.paymentText}
						items={currentContent.paymentItems}
						isArabic={isArabic}
					/>

					{/* Privacy */}
					<PolicySection
						icon={<FaLock className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.privacyTitle}
						description={currentContent.privacyText}
						items={currentContent.privacyItems}
						isArabic={isArabic}
					/>

					{/* Liability */}
					<PolicySection
						icon={<FaGavel className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.liabilityTitle}
						description={currentContent.liabilityText}
						items={currentContent.liabilityItems}
						isArabic={isArabic}
					/>

					{/* Disputes */}
					<PolicySection
						icon={<FaBalanceScale className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.disputesTitle}
						description={currentContent.disputesText}
						items={currentContent.disputesItems}
						isArabic={isArabic}
					/>

					{/* Modifications */}
					<PolicySection
						icon={<FaEdit className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.modificationsTitle}
						description={currentContent.modificationsText}
						items={currentContent.modificationsItems}
						isArabic={isArabic}
					/>

					{/* Termination */}
					<PolicySection
						icon={<FaTimes className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.terminationTitle}
						description={currentContent.terminationText}
						items={currentContent.terminationItems}
						isArabic={isArabic}
					/>

					{/* Force Majeure */}
					<PolicySection
						icon={<FaExclamationTriangle className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.forceMajeureTitle}
						description={currentContent.forceMajeureText}
						items={currentContent.forceMajeureItems}
						isArabic={isArabic}
					/>

					{/* Governing Law */}
					<PolicySection
						icon={<FaBalanceScale className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.governingLawTitle}
						description={currentContent.governingLawText}
						items={currentContent.governingLawItems}
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
						icon={<FaShieldAlt className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.noticeTitle}
						text={currentContent.noticeText}
						isArabic={isArabic}
					/>
				</div>
			</div>
		</div>
	);
}
