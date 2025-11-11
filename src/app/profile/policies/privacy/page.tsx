import { PrivacyPolicy } from "@/components/Profile/Policies";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "سياسة الخصوصية | شلة فود",
	description:
		"سياسة الخصوصية وحماية البيانات في شلة فود. تعرف على كيفية حماية بياناتك الشخصية وخصوصيتك.",
	keywords: [
		"سياسة الخصوصية",
		"شلة فود",
		"حماية البيانات",
		"الخصوصية",
		"حماية المعلومات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "سياسة الخصوصية | شلة فود",
		description:
			"سياسة الخصوصية وحماية البيانات في شلة فود. تعرف على كيفية حماية بياناتك الشخصية وخصوصيتك.",
		type: "website",
		url: "https://shellafood.com/profile/policies/privacy",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "سياسة الخصوصية - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "سياسة الخصوصية | شلة فود",
		description: "سياسة الخصوصية وحماية البيانات في شلة فود.",
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
		canonical: "https://shellafood.com/profile/policies/privacy",
		languages: {
			"ar-SA": "https://shellafood.com/profile/policies/privacy",
			"en-US": "https://shellafood.com/profile/policies/privacy",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function PrivacyPolicyPage() {
	return <PrivacyPolicy />;
}
