import { Metadata } from "next";
import CategoriesPageComponent from "@/components/Categories/CategoriesPage/index";
import { TEST_CATEGORIES } from "@/lib/data/categories/testData";

// Remove static forcing to allow proper rendering
// export const dynamic = 'force-static';
// export const revalidate = false;

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

export default function CategoriesPageRoute() {
	// Ensure we have categories data
	const categories = TEST_CATEGORIES || [];
	
	if (categories.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<p className="text-gray-600 dark:text-gray-400">No categories available</p>
			</div>
		);
	}

	return <CategoriesPageComponent categories={categories} />;
}


