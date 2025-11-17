import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";

export const metadata: Metadata = {
	title: "المتاجر الشائعة | شلة فود",
	description:
		"اكتشف أكثر المتاجر شعبية على شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات الأكثر طلباً. تصفية وترتيب حسب التقييم، وقت التوصيل والمزيد.",
	keywords: [
		"متاجر شائعة",
		"شلة فود",
		"مطاعم شائعة",
		"متاجر رائجة",
		"توصيل سريع",
		"متاجر",
		"تسوق أونلاين",
	],
	openGraph: {
		title: "المتاجر الشائعة | شلة فود",
		description:
			"اكتشف أكثر المتاجر شعبية على شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات الأكثر طلباً.",
		type: "website",
		url: "https://shellafood.com/popular-stores",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-popular-stores.jpg",
				width: 1200,
				height: 630,
				alt: "المتاجر الشائعة - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "المتاجر الشائعة | شلة فود",
		description:
			"اكتشف أكثر المتاجر شعبية على شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات الأكثر طلباً.",
		images: ["/og-popular-stores.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function PopularStoresLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Navigation - Server Component by default */}
			<NavBarCondition />
			{/* Main Content */}
			<main className="min-h-screen bg-white dark:bg-gray-900">
				{children}
			</main>
			{/* Footer - Server Component by default */}
			<ShellaFooter />
		</>
	);
}

