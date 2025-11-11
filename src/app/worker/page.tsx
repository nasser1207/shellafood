import { Metadata } from "next";
import { WorkerPage } from "@/components/Worker";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "التسجيل كعامل | شلة فود - انضم إلى فريق العمل",
	description:
		"انضم إلى فريق عمال شلة فود وابدأ مسيرتك المهنية في مجال الخدمات والتوصيل. سجل الآن كعامل واكسب دخل مستقر مع فرص نمو مميزة ودعم متكامل.",
	keywords: [
		"التسجيل كعامل",
		"شلة فود",
		"تسجيل عامل",
		"وظائف",
		"خدمات",
		"توصيل",
		"دخل مستقر",
		"عمل",
		"فرص عمل",
		"وظائف توصيل",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "التسجيل كعامل | شلة فود",
		description:
			"انضم إلى فريق عمال شلة فود وابدأ مسيرتك المهنية في مجال الخدمات والتوصيل. سجل الآن كعامل واكسب دخل مستقر.",
		type: "website",
		url: "https://shellafood.com/worker",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-worker.jpg",
				width: 1200,
				height: 630,
				alt: "التسجيل كعامل - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "التسجيل كعامل | شلة فود",
		description:
			"انضم إلى فريق عمال شلة فود وابدأ مسيرتك المهنية في مجال الخدمات والتوصيل. سجل الآن كعامل واكسب دخل مستقر.",
		images: ["/og-worker.jpg"],
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
		canonical: "https://shellafood.com/worker",
		languages: {
			"ar-SA": "https://shellafood.com/worker",
			"en-US": "https://shellafood.com/worker",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function WorkerPageRoute() {
	return <WorkerPage />;
}
