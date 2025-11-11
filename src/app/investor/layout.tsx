import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "المستثمرين | شلة فود",
	description:
		"انضم إلى برنامج الاستثمار في شلة فود واستفد من الفرص الاستثمارية المتميزة. استثمر في مستقبل توصيل الطعام والتسوق الإلكتروني.",
	keywords: [
		"المستثمرين",
		"شلة فود",
		"استثمار",
		"فرص استثمارية",
		"برنامج الاستثمار",
		"توصيل الطعام",
		"تسوق إلكتروني",
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

export default function InvestorLayout({
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
