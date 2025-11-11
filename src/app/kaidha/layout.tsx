import { Metadata } from "next";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "قيدها | شلة فود",
	description:
		"انضم إلى برنامج قيدها المالي في شلة فود واحصل على تمويل قصير الأجل بسيط ومرن. إدارة شؤونك المالية بفعالية وتحقيق الاستقرار المالي.",
	keywords: [
		"قيدها",
		"شلة فود",
		"تمويل قصير الأجل",
		"تمويل شخصي",
		"استقرار مالي",
		"برنامج مالي",
		"قروض",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "قيدها | شلة فود",
		description:
			"انضم إلى برنامج قيدها المالي في شلة فود واحصل على تمويل قصير الأجل بسيط ومرن. إدارة شؤونك المالية بفعالية.",
		type: "website",
		url: "https://shellafood.com/kaidha",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-kaidha.jpg",
				width: 1200,
				height: 630,
				alt: "برنامج قيدها - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "قيدها | شلة فود",
		description:
			"انضم إلى برنامج قيدها المالي في شلة فود واحصل على تمويل قصير الأجل بسيط ومرن.",
		images: ["/og-kaidha.jpg"],
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
		canonical: "https://shellafood.com/kaidha",
		languages: {
			"ar-SA": "https://shellafood.com/kaidha",
			"en-US": "https://shellafood.com/kaidha",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function KaidhaLayout({
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

