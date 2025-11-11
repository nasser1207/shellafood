import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "التسجيل كشريك | شلة فود",
	description:
		"انضم إلى شبكة شركاء شلة فود ووسع عملك. سجل متجرك أو مطعمك معنا ووصل لعملاء جدد في منطقتك. فرص نمو وشراكة تجارية مميزة.",
	keywords: [
		"التسجيل كشريك",
		"شلة فود",
		"تسجيل متجر",
		"تسجيل مطعم",
		"شراكة تجارية",
		"توسيع العمل",
		"عملاء جدد",
		"شراكة",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "التسجيل كشريك | شلة فود",
		description:
			"انضم إلى شبكة شركاء شلة فود ووسع عملك. سجل متجرك أو مطعمك معنا ووصل لعملاء جدد في منطقتك.",
		type: "website",
		url: "https://shellafood.com/partner",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-partner.jpg",
				width: 1200,
				height: 630,
				alt: "التسجيل كشريك - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "التسجيل كشريك | شلة فود",
		description:
			"انضم إلى شبكة شركاء شلة فود ووسع عملك. سجل متجرك أو مطعمك معنا ووصل لعملاء جدد في منطقتك.",
		images: ["/og-partner.jpg"],
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
		canonical: "https://shellafood.com/partner",
		languages: {
			"ar-SA": "https://shellafood.com/partner",
			"en-US": "https://shellafood.com/partner",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function PartnerLayout({
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

