import { PointsPage } from "@/components/Profile/Points";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "نقاطي | شلة فود",
	description:
		"عرض وإدارة نقاطك المكتسبة في شلة فود. احصل على نقاط عند كل عملية شراء واستخدمها للحصول على خصومات حصرية.",
	keywords: [
		"نقاط",
		"شلة فود",
		"نقاط مكافآت",
		"عروض",
		"خصومات",
		"مكافآت",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "نقاطي | شلة فود",
		description:
			"عرض وإدارة نقاطك المكتسبة في شلة فود. احصل على نقاط عند كل عملية شراء واستخدمها للحصول على خصومات حصرية.",
		type: "website",
		url: "https://shellafood.com/profile/points",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "نقاطي - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "نقاطي | شلة فود",
		description:
			"عرض وإدارة نقاطك المكتسبة في شلة فود. احصل على نقاط عند كل عملية شراء واستخدمها للحصول على خصومات حصرية.",
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
		canonical: "https://shellafood.com/profile/points",
		languages: {
			"ar-SA": "https://shellafood.com/profile/points",
			"en-US": "https://shellafood.com/profile/points",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function PointsPageRoute() {
	return <PointsPage />;
}
