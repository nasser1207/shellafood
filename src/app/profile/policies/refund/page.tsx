import { RefundPolicy } from "@/components/Profile/Policies";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "سياسة الاسترداد | شلة فود",
	description:
		"سياسة الاسترداد والاسترجاع في منصة شلة فود. تعرف على كيفية استرداد أموالك أو إرجاع المنتجات.",
	keywords: [
		"سياسة الاسترداد",
		"شلة فود",
		"استرجاع",
		"استرداد",
		"إرجاع المنتجات",
		"خدمة العملاء",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "سياسة الاسترداد | شلة فود",
		description:
			"سياسة الاسترداد والاسترجاع في منصة شلة فود. تعرف على كيفية استرداد أموالك أو إرجاع المنتجات.",
		type: "website",
		url: "https://shellafood.com/profile/policies/refund",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "سياسة الاسترداد - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "سياسة الاسترداد | شلة فود",
		description:
			"سياسة الاسترداد والاسترجاع في منصة شلة فود. تعرف على كيفية استرداد أموالك أو إرجاع المنتجات.",
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
		canonical: "https://shellafood.com/profile/policies/refund",
		languages: {
			"ar-SA": "https://shellafood.com/profile/policies/refund",
			"en-US": "https://shellafood.com/profile/policies/refund",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function RefundPolicyPage() {
	return <RefundPolicy />;
}
