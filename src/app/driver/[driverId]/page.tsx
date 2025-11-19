import { Metadata } from "next";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import DriverProfilePage from "@/components/PickAndOrder/Driver/DriverProfilePage";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ driverId: string }>;
}): Promise<Metadata> {
	const { driverId } = await params;

	return {
		title: `ملف السائق | شلة فود`,
		description: `عرض ملف السائق والتواصل معه`,
		keywords: ["سائق", "توصيل", "شلة فود"],
		robots: { index: true, follow: true },
	};
}

export default async function DriverProfilePageRoute({
	params,
	searchParams,
}: {
	params: Promise<{ driverId: string }>;
	searchParams: Promise<{ returnUrl?: string; transportType?: string; orderType?: string }>;
}) {
	const { driverId } = await params;
	const { returnUrl, transportType, orderType } = await searchParams;

	return (
		<>
			<NavBarCondition />
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<DriverProfilePage 
					driverId={driverId} 
					returnUrl={returnUrl}
					transportType={transportType}
					orderType={orderType}
				/>
			</main>
			<ShellaFooter />
		</>
	);
}

