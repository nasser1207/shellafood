import { Metadata } from "next";
import { InvestorPage } from "@/components/Investor";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "المستثمرين | شلة فود - برنامج الاستثمار المتميز",
	description:
		"انضم إلى برنامج الاستثمار في شلة فود واستفد من الفرص الاستثمارية المتميزة. استثمر في مستقبل توصيل الطعام والتسوق الإلكتروني مع عوائد مجزية وفرص نمو مستدامة.",
	keywords: [
		"المستثمرين",
		"شلة فود",
		"استثمار",
		"فرص استثمارية",
		"برنامج الاستثمار",
		"توصيل الطعام",
		"تسوق إلكتروني",
		"استثمار ذكي",
		"عوائد استثمارية",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "المستثمرين | شلة فود",
		description:
			"انضم إلى برنامج الاستثمار في شلة فود واستفد من الفرص الاستثمارية المتميزة. استثمر في مستقبل توصيل الطعام والتسوق الإلكتروني.",
		type: "website",
		url: "https://shellafood.com/investor",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-investor.jpg",
				width: 1200,
				height: 630,
				alt: "برنامج المستثمرين - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "المستثمرين | شلة فود",
		description:
			"انضم إلى برنامج الاستثمار في شلة فود واستفد من الفرص الاستثمارية المتميزة.",
		images: ["/og-investor.jpg"],
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
		canonical: "https://shellafood.com/investor",
		languages: {
			"ar-SA": "https://shellafood.com/investor",
			"en-US": "https://shellafood.com/investor",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function InvestorPageRoute() {
	return <InvestorPage />;
}	