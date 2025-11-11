import { SupportPage } from "@/components/Profile/Support";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "المساعدة والدعم | شلة فود",
	description:
		"مركز المساعدة والدعم الفني في شلة فود. احصل على المساعدة في استخدام المنصة، حل المشاكل، والإجابة على أسئلتك.",
	keywords: [
		"المساعدة والدعم",
		"شلة فود",
		"دعم فني",
		"خدمة العملاء",
		"مساعدة",
		"دعم",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "المساعدة والدعم | شلة فود",
		description:
			"مركز المساعدة والدعم الفني في شلة فود. احصل على المساعدة في استخدام المنصة، حل المشاكل، والإجابة على أسئلتك.",
		type: "website",
		url: "https://shellafood.com/profile/support",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "المساعدة والدعم - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "المساعدة والدعم | شلة فود",
		description:
			"مركز المساعدة والدعم الفني في شلة فود. احصل على المساعدة في استخدام المنصة، حل المشاكل، والإجابة على أسئلتك.",
		images: ["/og-profile.jpg"],
		creator: "@shellafood",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "https://shellafood.com/profile/support",
		languages: {
			"ar-SA": "https://shellafood.com/profile/support",
			"en-US": "https://shellafood.com/profile/support",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function SupportPageRoute() {
	return <SupportPage />;
}
