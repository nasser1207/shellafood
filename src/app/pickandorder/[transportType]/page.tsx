import { Metadata } from "next";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import HeroSection from "@/components/PickAndOrder/TransportTypePage/HeroSection";
import FeaturesSection from "@/components/PickAndOrder/TransportTypePage/FeaturesSection";
import InfoSection from "@/components/PickAndOrder/TransportTypePage/InfoSection";
import AdditionalSection from "@/components/PickAndOrder/TransportTypePage/AdditionalSection";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ transportType: string }>;
}): Promise<Metadata> {
	const { transportType } = await params;
	const isMotorbike = transportType === "motorbike";

	return {
		title: isMotorbike
			? "Motorbike Delivery | شلة فود - خدمة التوصيل السريع"
			: "Truck Delivery | شلة فود - خدمة التوصيل السريع",
		description: isMotorbike
			? "خدمة توصيل سريعة بالدراجة النارية. توصيل سريع وآمن مع تتبع مباشر للشحنة."
			: "خدمة توصيل بالشاحنة للشحنات الكبيرة. خدمة آمنة ومضمونة للمسافات الطويلة.",
		keywords: [
			"توصيل",
			"خدمة توصيل",
			transportType,
			isMotorbike ? "دراجة نارية" : "شاحنة",
			"delivery service",
		],
	};
}

export default async function TransportTypePage({
	params,
}: {
	params: Promise<{ transportType: string }>;
}) {
	const { transportType } = await params;
	
	return (
		<>
			<NavBarCondition />
			<main className="min-h-screen bg-white dark:bg-gray-900">
				<HeroSection transportType={transportType} />
				<FeaturesSection transportType={transportType} />
				<InfoSection transportType={transportType} />
				<AdditionalSection transportType={transportType} />
			</main>
			<ShellaFooter />
		</>
	);
}
