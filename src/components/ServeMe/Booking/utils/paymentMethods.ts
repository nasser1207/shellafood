/**
 * Payment Methods Constants
 * Centralized payment method definitions
 */

import { CreditCard, Wallet, Wallet2, Smartphone } from "lucide-react";

export interface PaymentMethod {
	id: string;
	icon: React.ComponentType<{ className?: string }>;
	titleEn: string;
	titleAr: string;
	descriptionEn: string;
	descriptionAr: string;
	buttonTextEn: string;
	buttonTextAr: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
	{
		id: "card",
		icon: CreditCard,
		titleEn: "Pay with Credit / Mada Card",
		titleAr: "الدفع ببطاقة مدى / الائتمان",
		descriptionEn: "Secure payment using Visa, MasterCard, or Mada.",
		descriptionAr: "دفع آمن باستخدام فيزا، ماستركارد، أو مدى.",
		buttonTextEn: "Complete Payment via Credit Card",
		buttonTextAr: "إتمام الدفع ببطاقة الائتمان",
	},
	{
		id: "cash",
		icon: Wallet,
		titleEn: "Pay on Completion / Delivery (COD)",
		titleAr: "الدفع عند الإنجاز / الاستلام",
		descriptionEn: "Pay directly after the technician completes the service.",
		descriptionAr: "ادفع مباشرة بعد انتهاء الفني من الخدمة.",
		buttonTextEn: "Complete Payment on Delivery",
		buttonTextAr: "إتمام الدفع عند الاستلام",
	},
	{
		id: "apple-pay",
		icon: Wallet2,
		titleEn: "Standard Wallet",
		titleAr: "المحفظة العادية",
		descriptionEn: "Use your regular in-app wallet balance.",
		descriptionAr: "استخدم رصيد محفظتك العادية في التطبيق.",
		buttonTextEn: "Complete Payment via Standard Wallet",
		buttonTextAr: "إتمام الدفع من المحفظة العادية",
	},
	{
		id: "qaydha-wallet",
		icon: Smartphone,
		titleEn: "Qaydha Wallet",
		titleAr: "محفظة قيدها",
		descriptionEn: "Secure payment through your registered Qaydha account wallet.",
		descriptionAr: "ادفع بأمان من خلال محفظة حسابك المسجلة في قيدها.",
		buttonTextEn: "Complete Payment via Qaydha Wallet",
		buttonTextAr: "إتمام الدفع من محفظة قيدها",
	},
] as const;

export type PaymentMethodId = typeof PAYMENT_METHODS[number]["id"];

