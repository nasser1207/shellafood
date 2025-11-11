import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";

export const metadata: Metadata = {
	title: "طلباتي | شلة فود",
	description:
		"عرض وإدارة جميع طلباتك وطلبات الخدمة في مكان واحد. تتبع طلباتك وقيم تجربتك. متابعة شاملة لجميع طلباتك.",
	keywords: [
		"طلباتي",
		"شلة فود",
		"تتبع الطلب",
		"تاريخ الطلبات",
		"طلبات الخدمة",
		"إدارة الطلبات",
		"طلبات المنتجات",
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

export default function MyOrdersLayout({
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
