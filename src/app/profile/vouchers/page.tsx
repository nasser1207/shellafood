import { VouchersPage } from "@/components/Profile/Vouchers";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "قسائمي | شلة فود",
	description:
		"عرض وإدارة القسائم والكوبونات المتاحة لديك في شلة فود. استخدم خصوماتك وكوبوناتك للحصول على أفضل الأسعار.",
	keywords: [
		"قسائم",
		"شلة فود",
		"كوبونات",
		"خصومات",
		"عروض",
		"توفير",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "قسائمي | شلة فود",
		description:
			"عرض وإدارة القسائم والكوبونات المتاحة لديك في شلة فود.",
		type: "website",
		url: "https://shellafood.com/profile/vouchers",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "قسائمي - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "قسائمي | شلة فود",
		description: "عرض وإدارة القسائم والكوبونات المتاحة لديك في شلة فود.",
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
		canonical: "https://shellafood.com/profile/vouchers",
		languages: {
			"ar-SA": "https://shellafood.com/profile/vouchers",
			"en-US": "https://shellafood.com/profile/vouchers",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function VouchersPageRoute() {
	return <VouchersPage />;
}
