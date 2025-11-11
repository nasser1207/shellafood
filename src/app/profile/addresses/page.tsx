import { AddressesPage } from "@/components/Profile/Addresses";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "العناوين المحفوظة | شلة فود",
	description:
		"إدارة عناوين التوصيل والاستلام المحفوظة في منصة شلة فود. حفظ وتعديل عناوينك المفضلة لتسهيل عملية التوصيل.",
	keywords: [
		"العناوين المحفوظة",
		"شلة فود",
		"إدارة العناوين",
		"عناوين التوصيل",
		"عناوين الاستلام",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "العناوين المحفوظة | شلة فود",
		description:
			"إدارة عناوين التوصيل والاستلام المحفوظة في منصة شلة فود. حفظ وتعديل عناوينك المفضلة لتسهيل عملية التوصيل.",
		type: "website",
		url: "https://shellafood.com/profile/addresses",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "العناوين المحفوظة - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "العناوين المحفوظة | شلة فود",
		description:
			"إدارة عناوين التوصيل والاستلام المحفوظة في منصة شلة فود.",
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
		canonical: "https://shellafood.com/profile/addresses",
		languages: {
			"ar-SA": "https://shellafood.com/profile/addresses",
			"en-US": "https://shellafood.com/profile/addresses",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function AddressesRoute() {
	return <AddressesPage />;
}
