import { Metadata } from "next";
import { RegisterForm } from "@/components/Register";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "التسجيل | شلة فود - إنشاء حساب جديد",
	description:
		"سجل حسابك الجديد في شلة فود واستمتع بخدمات التوصيل والتسوق المتنوعة. إنشاء حساب جديد بخطوات سهلة وآمنة مع حماية كاملة لبياناتك الشخصية.",
	keywords: [
		"التسجيل",
		"شلة فود",
		"حساب جديد",
		"تسجيل",
		"إنشاء حساب",
		"تسوق",
		"توصيل",
		"خدمات",
		"أمان",
		"حماية البيانات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "التسجيل | شلة فود",
		description:
			"سجل حسابك الجديد في شلة فود واستمتع بخدمات التوصيل والتسوق المتنوعة. إنشاء حساب جديد بخطوات سهلة وآمنة.",
		type: "website",
		url: "https://shellafood.com/register",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-register.jpg",
				width: 1200,
				height: 630,
				alt: "التسجيل - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "التسجيل | شلة فود",
		description:
			"سجل حسابك الجديد في شلة فود واستمتع بخدمات التوصيل والتسوق المتنوعة.",
		images: ["/og-register.jpg"],
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
		canonical: "https://shellafood.com/register",
		languages: {
			"ar-SA": "https://shellafood.com/register",
			"en-US": "https://shellafood.com/register",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

/**
 * Register Page
 * User registration with clean modular structure
 */
export default function RegisterPage() {
	return <RegisterForm  />;
}
