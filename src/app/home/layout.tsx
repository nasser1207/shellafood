import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";

export const metadata: Metadata = {
	title: "الصفحة الرئيسية | شلة فود",
	description:
		"اكتشف أفضل المتاجر والمطاعم في منطقتك مع شلة فود. تسوق من سوبرماركت، مطاعم، صيدليات وأكثر. توصيل سريع وموثوق إلى باب منزلك.",
	keywords: [
		"شلة فود",
		"تسوق أونلاين",
		"توصيل طعام",
		"توصيل سريع",
		"مطاعم",
		"سوبرماركت",
		"صيدليات",
		"متاجر قريبة",
	],
	openGraph: {
		title: "الصفحة الرئيسية | شلة فود",
		description:
			"اكتشف أفضل المتاجر والمطاعم في منطقتك مع شلة فود. تسوق من سوبرماركت، مطاعم، صيدليات وأكثر.",
		type: "website",
		url: "https://shellafood.com/home",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-home.jpg",
				width: 1200,
				height: 630,
				alt: "شلة فود - الصفحة الرئيسية",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "الصفحة الرئيسية | شلة فود",
		description:
			"اكتشف أفضل المتاجر والمطاعم في منطقتك مع شلة فود. توصيل سريع وموثوق إلى باب منزلك.",
		images: ["/og-home.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function HomeLayout({
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
