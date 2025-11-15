import { Metadata } from "next";
import KaidhaForm from "@/components/Kaidha/KaidhaForm";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "قيدها | شلة فود - برنامج التمويل المالي",
	description:
		"انضم إلى برنامج قيدها المالي في شلة فود واحصل على تمويل قصير الأجل بسيط ومرن. إدارة شؤونك المالية بفعالية وتحقيق الاستقرار المالي مع حلول تمويلية مبتكرة.",
	keywords: [
		"قيدها",
		"شلة فود",
		"تمويل قصير الأجل",
		"تمويل شخصي",
		"استقرار مالي",
		"برنامج مالي",
		"قروض",
		"تمويل ذكي",
		"إدارة مالية",
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

export default function KaidhaPage() {
	return <KaidhaForm />;
}
