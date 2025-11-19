import { Metadata } from "next";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import ChooseDriverPage from "@/components/PickAndOrder/Order/ChooseDriverPage";

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: Promise<{ transportType: string }>;
	searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
	const { transportType } = await params;
	const { type } = await searchParams;
	const isMotorbike = transportType === "motorbike";
	const isMultiDirection = type === "multi-direction";

	return {
		title: isMotorbike
			? `اختيار السائق - دراجة نارية${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`
			: `اختيار السائق - شاحنة${isMultiDirection ? " (متعدد الاتجاهات)" : ""} | شلة فود`,
		description: isMotorbike
			? "اختر السائق الأنسب لتوصيل طلبك بالدراجة النارية"
			: "اختر السائق الأنسب لتوصيل طلبك بالشاحنة",
		robots: { index: false, follow: true },
	};
}

export default async function ChooseDriverPageRoute({
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
			<main className="min-h-screen bg-white dark:bg-gray-900">
				<ChooseDriverPage transportType={transportType} orderType={type || "one-way"} />
			</main>
			<ShellaFooter />
		</>
	);
}

