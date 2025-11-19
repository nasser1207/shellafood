// app/driver/page.tsx
import { Metadata } from "next";
import { DriverPage } from "@/components/Driver";
import Navbar from "@/components/navbar";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "التسجيل كسائق | شلة فود",
	description:
		"انضم إلى فريق سائقي شلة فود وابدأ رحلتك في عالم التوصيل. سجل الآن كسائق توصيل واكسب دخل إضافي مع مرونة في العمل. فرص عمل ممتازة مع دخل جيد.",
	keywords: [
		"سائق توصيل",
		"شلة فود",
		"تسجيل سائق",
		"توصيل طلبات",
		"دخل إضافي",
		"عمل مرن",
		"وظائف توصيل",
		"عمل سائق",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
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
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://shellafood.com/driver",
		languages: {
			"ar-SA": "https://shellafood.com/driver",
			"en-US": "https://shellafood.com/driver",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function DriverPageRoute() {
	return(
	<>
	<Navbar />	
	<main className="min-h-screen bg-white dark:bg-gray-900">
		<DriverPage />
	</main>
	</>
	)
}
