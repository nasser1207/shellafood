import { KaidhaWallet } from "@/components/Profile/KaidhaWallet";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "محفظة قيدها | شلة فود",
	description:
		"إدارة محفظة قيدها المالية في شلة فود. عرض الرصيد، سجل المعاملات، وإدارة تمويل قيدها.",
	keywords: [
		"قيدها",
		"شلة فود",
		"محفظة قيدها",
		"تمويل",
		"رصيد",
		"معاملات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "محفظة قيدها | شلة فود",
		description:
			"إدارة محفظة قيدها المالية في شلة فود. عرض الرصيد، سجل المعاملات، وإدارة تمويل قيدها.",
		type: "website",
		url: "https://shellafood.com/profile/kaidha-wallet",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "محفظة قيدها - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "محفظة قيدها | شلة فود",
		description: "إدارة محفظة قيدها المالية في شلة فود.",
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
		canonical: "https://shellafood.com/profile/kaidha-wallet",
		languages: {
			"ar-SA": "https://shellafood.com/profile/kaidha-wallet",
			"en-US": "https://shellafood.com/profile/kaidha-wallet",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function KaidhaWalletPage() {
	return <KaidhaWallet />;
}
