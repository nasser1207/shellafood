import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "التسجيل كسائق | شلة فود",
	description:
		"انضم إلى فريق سائقي شلة فود وابدأ رحلتك في عالم التوصيل. سجل الآن كسائق توصيل واكسب دخل إضافي مع مرونة في العمل.",
	keywords: [
		"سائق توصيل",
		"شلة فود",
		"تسجيل سائق",
		"توصيل طلبات",
		"دخل إضافي",
		"عمل مرن",
		"وظائف توصيل",
	],
	openGraph: {
		title: "التسجيل كسائق | شلة فود",
		description:
			"انضم إلى فريق سائقي شلة فود وابدأ رحلتك في عالم التوصيل. سجل الآن كسائق توصيل واكسب دخل إضافي مع مرونة في العمل.",
		type: "website",
		url: "https://shellafood.com/driver",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-driver.jpg",
				width: 1200,
				height: 630,
				alt: "التسجيل كسائق - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "التسجيل كسائق | شلة فود",
		description:
			"انضم إلى فريق سائقي شلة فود وابدأ رحلتك في عالم التوصيل. سجل الآن كسائق توصيل واكسب دخل إضافي.",
		images: ["/og-driver.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function DriverLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Navigation - Server Component by default */}
			<Navbar />
			{/* Main Content */}
			<main className="min-h-screen bg-white dark:bg-gray-900">
				{children}
			</main>
			{/* Footer - Server Component by default */}
			<ShellaFooter />
		</>
	);
}
