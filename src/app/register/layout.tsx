import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "التسجيل | شلة فود",
	description:
		"سجل حسابك الجديد في شلة فود واستمتع بخدمات التوصيل والتسوق المتنوعة. إنشاء حساب جديد بخطوات سهلة وآمنة.",
	keywords: [
		"التسجيل",
		"شلة فود",
		"حساب جديد",
		"تسجيل",
		"إنشاء حساب",
		"تسوق",
		"توصيل",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "التسجيل | شلة فود",
		description:
			"سجل حسابك الجديد في شلة فود واستمتع بخدمات التوصيل والتسوق المتنوعة. إنشاء حساب جديد بخطوات سهلة وآمنة.",
		type: "website",
		url: "https://shellafood.com/register",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-register.jpg",
				width: 1200,
				height: 630,
				alt: "التسجيل - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "التسجيل | شلة فود",
		description:
			"سجل حسابك الجديد في شلة فود واستمتع بخدمات التوصيل والتسوق المتنوعة.",
		images: ["/og-register.jpg"],
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
		canonical: "https://shellafood.com/register",
		languages: {
			"ar-SA": "https://shellafood.com/register",
			"en-US": "https://shellafood.com/register",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function RegisterLayout({
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

