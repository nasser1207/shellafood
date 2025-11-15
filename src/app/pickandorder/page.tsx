import { Metadata } from "next";
import { PickAndOrder } from "@/components/PickAndOrder";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";

export const metadata: Metadata = {
	title: "Pick & Order | شلة فود - خدمة التوصيل السريع",
	description:
		"خدمة توصيل سريعة وموثوقة. اختر نوع النقل المناسب واترك الباقي علينا. توصيل سريع وآمن مع تتبع مباشر للشحنة.",
	keywords: [
		"توصيل",
		"خدمة توصيل",
		"توصيل سريع",
		"دراجة نارية",
		"شاحنة",
		"pick and order",
		"delivery service",
	],
};

export default function PickAndOrderPage()
 {
	return (
		<>
	<NavBarCondition/>
	<main className="min-h-screen bg-white dark:bg-gray-900">
	 <PickAndOrder />
	 </main>
	 <ShellaFooter />
	 </>
	)

}


