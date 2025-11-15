"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaShieldAlt, FaHandHoldingUsd, FaUserCheck, FaCheckCircle, FaInfoCircle, FaPhone } from "react-icons/fa";
import { PolicySection, ContactInfo, NoticeSection } from "../UI";

export default function KaidhaTerms() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const content = {
		ar: {
			title: "شروط قيدها",
			subtitle: "تمويل قصير الأجل بسيط ومرن لتحقيق الاستقرار المالي",
			intro: "في ظلّ التغيرات الاقتصادية المتسارعة، وتزايد الضغوط المالية على الأفراد، أصبح من الضروري إعادة النظر في النظم الاستهلاكية التقليدية وإيجاد حلول مبتكرة تُساعد على تحقيق التوازن المالي وتلبية الاحتياجات الأساسية بفعالية. ويُمثّل التمويل قصير الأجل أحد أهمّ الأدوات التي تُساهم في تحقيق هذا الهدف.",
			benefitsTitle: "مزايا التمويل في تطبيق شلة",
			benefitsText: "نوفر حلول تمويلية مبتكرة ومتوافقة مع الشريعة الإسلامية.",
			benefitsItems: [
				"متوافق مع أحكام الشريعة الإسلامية",
				"تمويل مدور مع سهولة السداد",
				"موافقة فورية على الطلب",
				"لا توجد رسوم خفية",
				"خدمة عملاء متاحة على مدار الساعة"
			],
			eligibilityTitle: "شروط الاستحقاق",
			eligibilityText: "للتأهل للحصول على التمويل، يجب استيفاء الشروط التالية:",
			eligibilityItems: [
				"أن يكون المتقدم سعودي الجنسية أو مقيم في المملكة",
				"أن يكون عمره 18 عاماً أو أكثر",
				"أن يكون لديه دخل شهري ثابت",
				"أن يكون لديه حساب بنكي سعودي",
				"أن يكون لديه هوية وطنية سارية المفعول"
			],
			userObligationsTitle: "التزامات المستخدم",
			userObligationsText: "يتحمل المستخدم مسؤوليات محددة عند استخدام خدمات التمويل.",
			userObligationsItems: [
				"تقديم معلومات دقيقة وصحيحة",
				"الالتزام بمواعيد السداد المحددة",
				"إشعارنا بأي تغيير في البيانات الشخصية",
				"استخدام التمويل للأغراض المحددة فقط"
			],
			platformGuidelinesTitle: "إرشادات المنصة",
			platformGuidelinesText: "نطبق إرشادات واضحة لضمان الاستخدام الآمن والفعال للخدمة.",
			platformGuidelinesItems: [
				"مراجعة شاملة للطلبات",
				"حماية البيانات الشخصية",
				"شفافية في الرسوم والعمولات",
				"دعم فني متخصص"
			],
			contactTitle: "معلومات الاتصال",
			contactText: "للاستفسارات حول خدمات التمويل، يمكنك التواصل معنا عبر:",
			contactItems: [
				"البريد الإلكتروني: kaidha@shilla.com",
				"الهاتف: 920000000",
			
			],
			noticeTitle: "إشعار مهم:",
			noticeText: "يُرجى قراءة جميع الشروط والأحكام بعناية قبل الموافقة عليها. الموافقة على هذه الشروط تعني أنك توافق على جميع البنود المذكورة وتتحمل المسؤولية الكاملة عن التزاماتك المالية."
		},
		en: {
			title: "Kaidha Terms",
			subtitle: "Simple and flexible short-term financing to achieve financial stability",
			intro: "In light of rapid economic changes and increasing financial pressures on individuals, it has become necessary to reconsider traditional consumption systems and find innovative solutions that help achieve financial balance and effectively meet basic needs. Short-term financing represents one of the most important tools that contribute to achieving this goal.",
			benefitsTitle: "Financing Benefits in Shilla App",
			benefitsText: "We provide innovative financing solutions compatible with Islamic Sharia.",
			benefitsItems: [
				"Compatible with Islamic Sharia provisions",
				"Revolving financing with easy repayment",
				"Instant approval on requests",
				"No hidden fees",
				"24/7 customer service"
			],
			eligibilityTitle: "Eligibility Requirements",
			eligibilityText: "To qualify for financing, the following conditions must be met:",
			eligibilityItems: [
				"Applicant must be Saudi national or resident in the Kingdom",
				"Must be 18 years old or older",
				"Must have a stable monthly income",
				"Must have a Saudi bank account",
				"Must have a valid national ID"
			],
			userObligationsTitle: "User Obligations",
			userObligationsText: "Users have specific responsibilities when using financing services.",
			userObligationsItems: [
				"Provide accurate and correct information",
				"Commit to specified repayment schedules",
				"Notify us of any changes in personal data",
				"Use financing for specified purposes only"
			],
			platformGuidelinesTitle: "Platform Guidelines",
			platformGuidelinesText: "We apply clear guidelines to ensure safe and effective use of the service.",
			platformGuidelinesItems: [
				"Comprehensive review of applications",
				"Protection of personal data",
				"Transparency in fees and commissions",
				"Specialized technical support"
			],
			contactTitle: "Contact Information",
			contactText: "For inquiries about financing services, you can contact us via:",
			contactItems: [
				"Email: kaidha@shilla.com",
				"Phone: 920000000",
			],
			noticeTitle: "Important Notice:",
			noticeText: "Please read all terms and conditions carefully before agreeing to them. Agreeing to these terms means you agree to all mentioned clauses and bear full responsibility for your financial obligations."
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
								<FaHandHoldingUsd className="text-green-600 dark:text-green-400 text-lg" />
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

					{/* Benefits */}
					<PolicySection
						icon={<FaHandHoldingUsd className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.benefitsTitle}
						description={currentContent.benefitsText}
						items={currentContent.benefitsItems}
						isArabic={isArabic}
					/>

					{/* Eligibility */}
					<PolicySection
						icon={<FaUserCheck className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.eligibilityTitle}
						description={currentContent.eligibilityText}
						items={currentContent.eligibilityItems}
						isArabic={isArabic}
					/>

					{/* User Obligations */}
					<PolicySection
						icon={<FaCheckCircle className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.userObligationsTitle}
						description={currentContent.userObligationsText}
						items={currentContent.userObligationsItems}
						isArabic={isArabic}
					/>

					{/* Platform Guidelines */}
					<PolicySection
						icon={<FaInfoCircle className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.platformGuidelinesTitle}
						description={currentContent.platformGuidelinesText}
						items={currentContent.platformGuidelinesItems}
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
