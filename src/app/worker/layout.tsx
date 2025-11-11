import { Metadata } from "next";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "التسجيل كعامل | شلة فود",
	description:
		"انضم إلى فريق عمال شلة فود وابدأ مسيرتك المهنية في مجال الخدمات والتوصيل. سجل الآن كعامل واكسب دخل مستقر مع فرص نمو مميزة.",
	keywords: [
		"التسجيل كعامل",
		"شلة فود",
		"تسجيل عامل",
		"وظائف",
		"خدمات",
		"توصيل",
		"دخل مستقر",
		"عمل",
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

export default function WorkerLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Navigation - Server Component by default */}
			<Navbar />
			{/* Main Content */}
			<main className="min-h-screen bg-white dark:bg-gray-900">
				{children}
			</main>
			{/* Footer - Server Component by default */}
			<ShellaFooter />
		</>
	);
}

