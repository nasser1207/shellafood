import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import SearchLoading from "./loading";

// Dynamic import for client component with loading fallback
const SearchPage = dynamic(() => import("@/components/Search/SearchPage"), {
	loading: () => <SearchLoading />,
});



// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "البحث | شلة فود - ابحث عن المتاجر والمطاعم والمنتجات",
	description:
		"ابحث عن المتاجر والمطاعم والمنتجات في شلة فود. اكتشف أفضل العروض والخصومات. ابحث عن الطعام، المنتجات، والمتاجر القريبة منك.",
	keywords: [
		"بحث",
		"متاجر",
		"مطاعم",
		"منتجات",
		"شلة فود",
		"عروض",
		"خصومات",
		"توصيل الطعام",
		"تسوق",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "البحث | شلة فود",
		description:
			"ابحث عن المتاجر والمطاعم والمنتجات في شلة فود. اكتشف أفضل العروض والخصومات.",
		type: "website",
		url: "https://shellafood.com/search",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-search.jpg",
				width: 1200,
				height: 630,
				alt: "البحث - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "البحث | شلة فود",
		description:
			"ابحث عن المتاجر والمطاعم والمنتجات في شلة فود. اكتشف أفضل العروض والخصومات.",
		images: ["/og-search.jpg"],
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
		canonical: "https://shellafood.com/search",
		languages: {
			"ar-SA": "https://shellafood.com/search",
			"en-US": "https://shellafood.com/search",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

/**
 * Search Page Route
 * Optimized with dynamic imports for better performance
 */
export default function SearchPageRoute() {
	return (
		<>
			{/* Navigation - Server Component by default */}
			<NavBarCondition />
			{/* Main Content with Suspense Boundary */}
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 font-sans md:p-8" dir="rtl">
				<Suspense fallback={<SearchLoading />}>
					<SearchPage />
				</Suspense>
			</main>
			{/* Footer - Server Component by default */}
			<ShellaFooter />
		</>
	);
}
