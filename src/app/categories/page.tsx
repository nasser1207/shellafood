import { Metadata } from "next";
import CategoriesPage from "@/components/Categories/CategoriesPage";
import { TEST_CATEGORIES } from "@/lib/data/categories/testData";

export const metadata: Metadata = {
	title: "الأقسام | شلة فود",
	description:
		"تصفح جميع أقسام شلة فود: مطاعم، سوبرماركت، صيدليات، العناية بالحيوانات، هايبر شلة وأكثر. اكتشف أفضل المتاجر في كل قسم واحصل على توصيل سريع.",
	keywords: [
		"أقسام شلة فود",
		"مطاعم",
		"سوبرماركت",
		"صيدليات",
		"العناية بالحيوانات",
		"هايبر شلة",
		"متاجر",
		"تسوق",
		"توصيل الطعام",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "الأقسام | شلة فود",
		description:
			"تصفح جميع أقسام شلة فود: مطاعم، سوبرماركت، صيدليات، العناية بالحيوانات، هايبر شلة وأكثر. اكتشف أفضل المتاجر في كل قسم.",
		type: "website",
		url: "https://shellafood.com/categories",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-categories.jpg",
				width: 1200,
				height: 630,
				alt: "أقسام شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "الأقسام | شلة فود",
		description:
			"تصفح جميع أقسام شلة فود: مطاعم، سوبرماركت، صيدليات، العناية بالحيوانات، هايبر شلة وأكثر.",
		images: ["/og-categories.jpg"],
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
		canonical: "https://shellafood.com/categories",
		languages: {
			"ar-SA": "https://shellafood.com/categories",
			"en-US": "https://shellafood.com/categories",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default async function CategoriesPageRoute() {
	
	
	return <CategoriesPage categories={TEST_CATEGORIES} />;
}


