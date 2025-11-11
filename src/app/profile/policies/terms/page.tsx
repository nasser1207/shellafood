import { ConditionTerms } from "@/components/Profile/Policies";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "الشروط والأحكام | شلة فود",
	description:
		"الشروط والأحكام لاستخدام منصة شلة فود. اقرأ الشروط والأحكام التي تحكم استخدامك لمنصة شلة فود.",
	keywords: [
		"الشروط والأحكام",
		"شلة فود",
		"شروط الاستخدام",
		"قوانين",
		"أحكام",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "الشروط والأحكام | شلة فود",
		description:
			"الشروط والأحكام لاستخدام منصة شلة فود. اقرأ الشروط والأحكام التي تحكم استخدامك لمنصة شلة فود.",
		type: "website",
		url: "https://shellafood.com/profile/policies/terms",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "الشروط والأحكام - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "الشروط والأحكام | شلة فود",
		description: "الشروط والأحكام لاستخدام منصة شلة فود.",
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
		canonical: "https://shellafood.com/profile/policies/terms",
		languages: {
			"ar-SA": "https://shellafood.com/profile/policies/terms",
			"en-US": "https://shellafood.com/profile/policies/terms",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function TermsPage() {
	return <ConditionTerms />;
}
