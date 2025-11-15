import { Metadata } from "next";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import OrderPaymentPage from "@/components/PickAndOrder/Order/OrderPaymentPage";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ transportType: string }>;
}): Promise<Metadata> {
	const { transportType } = await params;
	const isMotorbike = transportType === "motorbike";

	return {
		title: isMotorbike
			? "الدفع - دراجة نارية | شلة فود"
			: "الدفع - شاحنة | شلة فود",
		description: isMotorbike
			? "اختر طريقة الدفع لإتمام طلب التوصيل بالدراجة النارية"
			: "اختر طريقة الدفع لإتمام طلب التوصيل بالشاحنة",
	};
}

export default async function PaymentPage({
	params,
}: {
	params: Promise<{ transportType: string }>;
}) {
	const { transportType } = await params;

	return (
		<>
			<NavBarCondition />
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<OrderPaymentPage transportType={transportType} />
			</main>
			<ShellaFooter />
		</>
	);
}

