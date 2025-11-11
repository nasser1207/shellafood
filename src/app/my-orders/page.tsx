import type { Metadata } from "next";
import MyOrdersPage from "@/components/MyOrders/MyOrdersPage";

export const dynamic = "force-dynamic";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "طلباتي | شلة فود - إدارة الطلبات والتتبع",
	description:
		"عرض وإدارة جميع طلباتك وطلبات الخدمة في مكان واحد. تتبع طلباتك وقيم تجربتك. متابعة شاملة لجميع طلباتك مع تحديثات فورية لحالة الطلب.",
	keywords: [
		"طلباتي",
		"شلة فود",
		"تتبع الطلب",
		"تاريخ الطلبات",
		"طلبات الخدمة",
		"إدارة الطلبات",
		"طلبات المنتجات",
		"متابعة الطلبات",
		"تقييم الطلبات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "طلباتي | شلة فود",
		description:
			"عرض وإدارة جميع طلباتك وطلبات الخدمة في مكان واحد. تتبع طلباتك وقيم تجربتك.",
		type: "website",
		url: "https://shellafood.com/my-orders",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-my-orders.jpg",
				width: 1200,
				height: 630,
				alt: "طلباتي - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "طلباتي | شلة فود",
		description:
			"عرض وإدارة جميع طلباتك وطلبات الخدمة في مكان واحد. تتبع طلباتك وقيم تجربتك.",
		images: ["/og-my-orders.jpg"],
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
		canonical: "https://shellafood.com/my-orders",
		languages: {
			"ar-SA": "https://shellafood.com/my-orders",
			"en-US": "https://shellafood.com/my-orders",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function MyOrdersRoute() {
	return <MyOrdersPage />;
}


