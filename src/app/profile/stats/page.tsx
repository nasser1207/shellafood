import { MyStats } from "@/components/Profile/Stats";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "إحصائياتي | شلة فود",
	description:
		"عرض إحصائياتك الشخصية ونشاطك في شلة فود. تتبع طلباتك، المشتريات، النقاط، والمزيد.",
	keywords: [
		"إحصائيات",
		"شلة فود",
		"نشاط المستخدم",
		"إحصائيات شخصية",
		"طلبات",
		"مشتريات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "إحصائياتي | شلة فود",
		description:
			"عرض إحصائياتك الشخصية ونشاطك في شلة فود. تتبع طلباتك، المشتريات، النقاط، والمزيد.",
		type: "website",
		url: "https://shellafood.com/profile/stats",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "إحصائياتي - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "إحصائياتي | شلة فود",
		description: "عرض إحصائياتك الشخصية ونشاطك في شلة فود.",
		images: ["/og-profile.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: false,
		follow: true,
		googleBot: {
			index: false,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://shellafood.com/profile/stats",
		languages: {
			"ar-SA": "https://shellafood.com/profile/stats",
			"en-US": "https://shellafood.com/profile/stats",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function StatsPage() {
	return <MyStats />;
}
