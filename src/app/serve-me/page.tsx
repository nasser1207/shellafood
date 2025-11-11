import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic import for client component with loading fallback
const ServeMe = dynamic(() => import("@/components/ServeMe/Main/ServeMe"), {
	loading: () => <ServeMeLoader />,
	ssr: true,
});

// Loading component for ServeMe
function ServeMeLoader() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" dir="rtl">
			{/* Hero Section Skeleton */}
			<section className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse">
				<div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
					<div className="h-12 w-3/4 max-w-2xl bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
					<div className="h-6 w-1/2 max-w-xl bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
					<div className="h-14 w-full max-w-2xl bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
				</div>
			</section>

			{/* Main Content Skeleton */}
			<main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
				{/* Services Grid Skeleton */}
				<div className="mb-12 animate-pulse">
					<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8"></div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
								<div className="h-48 w-full bg-gray-200 dark:bg-gray-700"></div>
								<div className="p-4 space-y-3">
									<div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
									<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
									<div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Features Section Skeleton */}
				<div className="bg-white dark:bg-gray-800 py-12 rounded-lg shadow-md animate-pulse">
					<div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-8"></div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex flex-col items-center text-center">
								<div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
								<div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
								<div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "اخدمني | شلة فود - خدمات متنوعة على مدار الساعة",
	description:
		"خدمة اخدمني من شلة فود - احصل على خدمات التوصيل والمساعدة الفورية في جميع احتياجاتك اليومية. خدمات متنوعة ومتاحة على مدار الساعة مع عمال محترفين.",
	keywords: [
		"اخدمني",
		"شلة فود",
		"خدمات",
		"توصيل",
		"مساعدة",
		"خدمة العملاء",
		"خدمات متنوعة",
		"عمال محترفين",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "اخدمني | شلة فود",
		description:
			"خدمة اخدمني من شلة فود - احصل على خدمات التوصيل والمساعدة الفورية في جميع احتياجاتك اليومية.",
		type: "website",
		url: "https://shellafood.com/serve-me",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-serve-me.jpg",
				width: 1200,
				height: 630,
				alt: "اخدمني - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "اخدمني | شلة فود",
		description:
			"خدمة اخدمني من شلة فود - احصل على خدمات التوصيل والمساعدة الفورية في جميع احتياجاتك اليومية.",
		images: ["/og-serve-me.jpg"],
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
		canonical: "https://shellafood.com/serve-me",
		languages: {
			"ar-SA": "https://shellafood.com/serve-me",
			"en-US": "https://shellafood.com/serve-me",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

/**
 * Serve Me Page (اخدمني)
 * Main page for the serve-me service
 * Optimized with dynamic imports for better performance
 */
export default function ServeMePage() {
	return (
		<Suspense fallback={<ServeMeLoader />}>
			<ServeMe />
		</Suspense>
	);
}

