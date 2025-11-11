"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { FaShieldAlt, FaExclamationTriangle, FaPhone } from "react-icons/fa";
import { PolicySection, ContactInfo, NoticeSection } from "../UI";

export default function RefundPolicy() {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const content = {
		ar: {
			title: "سياسة الاسترداد",
			subtitle: "سياسة الاسترداد والاسترجاع لمنصة وتطبيق \"شلة\"",
			intro: "نحن ندرك أهمية رضا عملائنا، ونسعى دائمًا لتقديم تجربة تسوق سلسة وممتعة. ومع ذلك، ونظرًا لطبيعة منتجاتنا/خدماتنا، فإن سياسة الاسترداد والاسترجاع الخاصة بنا تخضع للشروط التالية:",
			noRefundTitle: "عدم الاسترداد والاسترجاع بعد الشراء",
			noRefundText: "بمجرد إتمام عملية الشراء، واستلام المنتج وفتحه، لا يمكن استبدال أو استرجاع المنتج أو الخدمة.",
			reviewText: "لذلك، نرجو منك التكرم بمراجعة التفاصيل التالية قبل إتمام عملية الشراء:",
			reviewItems: [
				"تأكد من صحة عنوان التوصيل قبل تأكيد الطلب",
				"راجع تفاصيل المنتج والمواصفات بعناية",
				"تأكد من أن المنتج مناسب لاحتياجاتك",
				"راجع سياسة التسعير والرسوم الإضافية"
			],
			exceptionsTitle: "حالات الاستثناء",
			exceptionsText: "في الحالات التالية فقط، قد ننظر في طلب الاسترداد:",
			exceptionsItems: [
				"إذا كان المنتج تالفًا عند الاستلام",
				"إذا كان المنتج مختلفًا عن المطلوب",
				"إذا لم يتم التسليم في الوقت المحدد"
			],
			proceduresTitle: "إجراءات طلب الاسترداد",
			proceduresText: "في حالة وجود مشكلة تستدعي النظر في الاسترداد:",
			proceduresItems: [
				"تواصل مع خدمة العملاء خلال 24 ساعة من الاستلام",
				"قدم صورًا واضحة للمشكلة",
				"احتفظ بالمنتج في حالته الأصلية",
				"انتظر مراجعة الطلب خلال 3-5 أيام عمل"
			],
			contactTitle: "معلومات الاتصال",
			contactText: "للاستفسارات أو طلبات الاسترداد، يرجى التواصل معنا عبر:",
			contactItems: [
				"البريد الإلكتروني: support@shilla.com",
				"الهاتف: 920000000",
				"تطبيق شلة - قسم خدمة العملاء"
			],
			warningTitle: "تنبيه مهم:",
			warningText: "هذه السياسة سارية المفعول من تاريخ الموافقة عليها وتطبق على جميع الطلبات. نحن نحتفظ بالحق في تعديل هذه السياسة في أي وقت مع إشعار العملاء مسبقًا."
		},
		en: {
			title: "Refund Policy",
			subtitle: "Refund and Return Policy for Shilla Platform and Application",
			intro: "We recognize the importance of customer satisfaction and always strive to provide a smooth and enjoyable shopping experience. However, due to the nature of our products/services, our refund and return policy is subject to the following conditions:",
			noRefundTitle: "No Refunds or Returns After Purchase",
			noRefundText: "Once the purchase is completed and the product is received and opened, the product or service cannot be exchanged or returned.",
			reviewText: "Therefore, we kindly ask you to review the following details before completing your purchase:",
			reviewItems: [
				"Verify the delivery address before confirming the order",
				"Carefully review product details and specifications",
				"Ensure the product meets your needs",
				"Review pricing policy and additional fees"
			],
			exceptionsTitle: "Exception Cases",
			exceptionsText: "Only in the following cases, we may consider a refund request:",
			exceptionsItems: [
				"If the product is damaged upon receipt",
				"If the product is different from what was ordered",
				"If delivery was not made on time"
			],
			proceduresTitle: "Refund Request Procedures",
			proceduresText: "In case of a problem that requires considering a refund:",
			proceduresItems: [
				"Contact customer service within 24 hours of receipt",
				"Provide clear photos of the problem",
				"Keep the product in its original condition",
				"Wait for request review within 3-5 business days"
			],
			contactTitle: "Contact Information",
			contactText: "For inquiries or refund requests, please contact us via:",
			contactItems: [
				"Email: support@shilla.com",
				"Phone: 920000000",
				"Shella App - Customer Service Section"
			],
			warningTitle: "Important Notice:",
			warningText: "This policy is effective from the date of approval and applies to all orders. We reserve the right to modify this policy at any time with prior notice to customers."
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

					{/* No Refund Policy */}
					<PolicySection
						icon={<FaExclamationTriangle className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.noRefundTitle}
						description={`${currentContent.noRefundText} ${currentContent.reviewText}`}
						items={currentContent.reviewItems}
						isArabic={isArabic}
					/>

					{/* Exception Cases */}
					<PolicySection
						icon={<FaShieldAlt className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.exceptionsTitle}
						description={currentContent.exceptionsText}
						items={currentContent.exceptionsItems}
						isArabic={isArabic}
					/>

					{/* Procedures */}
					<PolicySection
						icon={<FaShieldAlt className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.proceduresTitle}
						description={currentContent.proceduresText}
						items={currentContent.proceduresItems}
						numbered={true}
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

					{/* Warning Notice */}
					<NoticeSection
						icon={<FaExclamationTriangle className="text-green-600 dark:text-green-400 text-sm" />}
						title={currentContent.warningTitle}
						text={currentContent.warningText}
						isArabic={isArabic}
					/>
				</div>
			</div>
		</div>
	);
}
