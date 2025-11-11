import { AccountInfoPage } from "@/components/Profile/AccountInfo";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "معلومات الحساب | شلة فود",
	description:
		"إدارة معلوماتك الشخصية وإعدادات الحساب في منصة شلة فود. عرض وتعديل بياناتك الشخصية، إعدادات الأمان، والإشعارات.",
	keywords: [
		"معلومات الحساب",
		"شلة فود",
		"الملف الشخصي",
		"تعديل البيانات",
		"إعدادات الحساب",
		"الأمان",
		"الخصوصية",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "معلومات الحساب | شلة فود",
		description:
			"إدارة معلوماتك الشخصية وإعدادات الحساب في منصة شلة فود. عرض وتعديل بياناتك الشخصية، إعدادات الأمان، والإشعارات.",
		type: "website",
		url: "https://shellafood.com/profile/account-info",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "معلومات الحساب - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "معلومات الحساب | شلة فود",
		description:
			"إدارة معلوماتك الشخصية وإعدادات الحساب في منصة شلة فود.",
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
		canonical: "https://shellafood.com/profile/account-info",
		languages: {
			"ar-SA": "https://shellafood.com/profile/account-info",
			"en-US": "https://shellafood.com/profile/account-info",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function AccountInfoRoute() {
	return <AccountInfoPage />;
}
