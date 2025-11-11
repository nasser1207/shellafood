import { MyWallet } from "@/components/Profile/Wallet";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "محفظتي | شلة فود",
	description:
		"إدارة رصيدك المالي في شلة فود. عرض الرصيد، سجل المعاملات، إضافة الأموال، وسحب الأموال من محفظتك.",
	keywords: [
		"محفظة",
		"شلة فود",
		"رصيد",
		"مالي",
		"إدارة الأموال",
		"معاملات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "محفظتي | شلة فود",
		description:
			"إدارة رصيدك المالي في شلة فود. عرض الرصيد، سجل المعاملات، إضافة الأموال، وسحب الأموال من محفظتك.",
		type: "website",
		url: "https://shellafood.com/profile/wallet",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "محفظتي - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "محفظتي | شلة فود",
		description: "إدارة رصيدك المالي في شلة فود.",
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
		canonical: "https://shellafood.com/profile/wallet",
		languages: {
			"ar-SA": "https://shellafood.com/profile/wallet",
			"en-US": "https://shellafood.com/profile/wallet",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function WalletPage() {
	return <MyWallet />;
}
