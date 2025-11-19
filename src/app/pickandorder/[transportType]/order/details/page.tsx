import { Metadata } from "next";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import OrderDetailsPage from "@/components/PickAndOrder/Order/OrderDetailsPage";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ transportType: string }>;
}): Promise<Metadata> {
	const { transportType } = await params;
	const isMotorbike = transportType === "motorbike";

	return {
		title: isMotorbike
			? "تفاصيل الطلب - دراجة نارية | شلة فود"
			: "تفاصيل الطلب - شاحنة | شلة فود",
		description: isMotorbike
			? "أدخل تفاصيل طلب التوصيل بالدراجة النارية"
			: "أدخل تفاصيل طلب التوصيل بالشاحنة",
	};
}

export default async function DetailsPage({
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
			<OrderDetailsPage transportType={transportType} orderType={type || "one-way"} />
		</main>
		<ShellaFooter />
		</>
	);
}

