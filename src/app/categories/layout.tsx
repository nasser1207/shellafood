import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";

export const metadata: Metadata = {
	title: "الأقسام | شلة فود",
	description:
		"تصفح جميع أقسام شلة فود: مطاعم، سوبرماركت، صيدليات، العناية بالحيوانات، هايبر شلة وأكثر. اكتشف أفضل المتاجر في كل قسم.",
	keywords: [
		"أقسام شلة فود",
		"مطاعم",
		"سوبرماركت",
		"صيدليات",
		"العناية بالحيوانات",
		"هايبر شلة",
		"متاجر",
		"تسوق",
	],
	openGraph: {
		title: "الأقسام | شلة فود",
		description:
			"تصفح جميع أقسام شلة فود: مطاعم، سوبرماركت، صيدليات، العناية بالحيوانات، هايبر شلة وأكثر.",
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
	},
};

export default function CategoriesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Navigation - Server Component by default */}
			<NavBarCondition />
			{/* Main Content */}
			<main className="min-h-screen bg-white dark:bg-gray-900">
				{children}
			</main>
			{/* Footer - Server Component by default */}
			<ShellaFooter />
		</>
	);
}
