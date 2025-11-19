import { Metadata } from "next";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import OrderSummaryPage from "@/components/PickAndOrder/Order/OrderSummaryPage";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ transportType: string }>;
}): Promise<Metadata> {
	const { transportType } = await params;
	const isMotorbike = transportType === "motorbike";

	return {
		title: isMotorbike
			? "ملخص الطلب - دراجة نارية | شلة فود"
			: "ملخص الطلب - شاحنة | شلة فود",
		description: isMotorbike
			? "راجع ملخص طلب التوصيل بالدراجة النارية قبل المتابعة إلى الدفع"
			: "راجع ملخص طلب التوصيل بالشاحنة قبل المتابعة إلى الدفع",
		robots: { index: false, follow: true },
	};
}

export default async function SummaryPage({
	params,
	searchParams,
}: {
	params: Promise<{ transportType: string }>;
	searchParams: Promise<{ type?: string }>;
}) {
	const { transportType } = await params;
	const { type } = await searchParams;

	return (
		<>
			<NavBarCondition />
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<OrderSummaryPage transportType={transportType} orderType={type || "one-way"} />
			</main>
			<ShellaFooter />
		</>
	);
}
