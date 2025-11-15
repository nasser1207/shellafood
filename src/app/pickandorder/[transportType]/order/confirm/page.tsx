import { Metadata } from "next";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import OrderConfirmationPage from "@/components/PickAndOrder/Order/OrderConfirmationPage";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ transportType: string }>;
}): Promise<Metadata> {
	const { transportType } = await params;
	const isMotorbike = transportType === "motorbike";

	return {
		title: isMotorbike
			? "تأكيد الطلب - دراجة نارية | شلة فود"
			: "تأكيد الطلب - شاحنة | شلة فود",
		description: isMotorbike
			? "تم تأكيد طلب التوصيل بالدراجة النارية بنجاح"
			: "تم تأكيد طلب التوصيل بالشاحنة بنجاح",
		robots: { index: false, follow: true },
	};
}

export default async function ConfirmPage({
	params,
}: {
	params: Promise<{ transportType: string }>;
}) {
	const { transportType } = await params;

	return (
		<>
			<NavBarCondition />
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<OrderConfirmationPage transportType={transportType} />
			</main>
			<ShellaFooter />
		</>
	);
}

