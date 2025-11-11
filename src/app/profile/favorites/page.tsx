import { FavoritesPage } from "@/components/Profile/Favorites";
import { Metadata } from "next";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "المفضلة | شلة فود",
	description:
		"عرض وإدارة المنتجات والمتاجر والمطاعم المفضلة في منصة شلة فود. احفظ منتجاتك ومتاجرك المفضلة للوصول السريع إليها.",
	keywords: [
		"المفضلة",
		"شلة فود",
		"منتجات مفضلة",
		"متاجر مفضلة",
		"مطاعم مفضلة",
		"قائمة المفضلة",
		"حفظ المنتجات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "المفضلة | شلة فود",
		description:
			"عرض وإدارة المنتجات والمتاجر والمطاعم المفضلة في منصة شلة فود.",
		type: "website",
		url: "https://shellafood.com/profile/favorites",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-profile.jpg",
				width: 1200,
				height: 630,
				alt: "المفضلة - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "المفضلة | شلة فود",
		description:
			"عرض وإدارة المنتجات والمتاجر والمطاعم المفضلة في منصة شلة فود.",
		images: ["/og-profile.jpg"],
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
		canonical: "https://shellafood.com/profile/favorites",
		languages: {
			"ar-SA": "https://shellafood.com/profile/favorites",
			"en-US": "https://shellafood.com/profile/favorites",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};


export default function FavoritesRoute() {
  return <FavoritesPage />;
}