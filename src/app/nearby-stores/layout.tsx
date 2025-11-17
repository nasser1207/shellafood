import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";

export const metadata: Metadata = {
	title: "المتاجر القريبة | شلة فود",
	description:
		"اكتشف جميع المتاجر القريبة منك مع شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات والمزيد. تصفية وترتيب حسب التقييم، وقت التوصيل والمزيد.",
	keywords: [
		"متاجر قريبة",
		"شلة فود",
		"مطاعم قريبة",
		"توصيل سريع",
		"متاجر",
		"تسوق أونلاين",
	],
	openGraph: {
		title: "المتاجر القريبة | شلة فود",
		description:
			"اكتشف جميع المتاجر القريبة منك مع شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات والمزيد.",
		type: "website",
		url: "https://shellafood.com/nearby-stores",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-nearby-stores.jpg",
				width: 1200,
				height: 630,
				alt: "المتاجر القريبة - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "المتاجر القريبة | شلة فود",
		description:
			"اكتشف جميع المتاجر القريبة منك مع شلة فود. تصفح المطاعم، السوبرماركت، الصيدليات والمزيد.",
		images: ["/og-nearby-stores.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function NearbyStoresLayout({
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

