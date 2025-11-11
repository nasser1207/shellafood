import { KaidhaTerms } from "@/components/Profile/Policies";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "شروط قيدها | شلة فود",
	description:
		"شروط وأحكام خدمة قيدها المالية في شلة فود. تعرف على الشروط والأحكام الخاصة بخدمة التمويل القيدها.",
	keywords: [
		"شروط قيدها",
		"شلة فود",
		"تمويل",
		"قيدها",
		"خدمة التمويل",
		"أحكام",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "شروط قيدها | شلة فود",
		description:
			"شروط وأحكام خدمة قيدها المالية في شلة فود. تعرف على الشروط والأحكام الخاصة بخدمة التمويل القيدها.",
		type: "website",
		url: "https://shellafood.com/profile/policies/kaidha-terms",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "شروط قيدها - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "شروط قيدها | شلة فود",
		description: "شروط وأحكام خدمة قيدها المالية في شلة فود.",
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
		canonical: "https://shellafood.com/profile/policies/kaidha-terms",
		languages: {
			"ar-SA": "https://shellafood.com/profile/policies/kaidha-terms",
			"en-US": "https://shellafood.com/profile/policies/kaidha-terms",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function KaidhaTermsPage() {
	return <KaidhaTerms />;
}
