import { Metadata } from "next";
import { LoginForm } from "@/components/Login";

// Metadata for SEO - Arabic
export const metadata: Metadata = {
	title: "تسجيل الدخول | شلة فود - تسجيل الدخول الآمن",
	description:
		"سجل دخولك إلى حسابك في شلة فود واستمتع بخدمات التوصيل والتسوق المتنوعة. وصول سريع وآمن لحسابك مع حماية كاملة لبياناتك الشخصية.",
	keywords: [
		"تسجيل دخول",
		"شلة فود",
		"حساب",
		"دخول",
		"تسوق",
		"توصيل",
		"خدمات",
		"تسجيل الدخول",
		"أمان",
		"حماية البيانات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	openGraph: {
		title: "تسجيل الدخول | شلة فود",
		description:
			"سجل دخولك إلى حسابك في شلة فود واستمتع بخدمات التوصيل والتسوق المتنوعة. وصول سريع وآمن لحسابك.",
		type: "website",
		url: "https://shellafood.com/login",
		siteName: "شلة فود",
		locale: "ar_SA",
		alternateLocale: ["en_US"],
		images: [
			{
				url: "/og-login.jpg",
				width: 1200,
				height: 630,
				alt: "تسجيل الدخول - شلة فود",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "تسجيل الدخول | شلة فود",
		description:
			"سجل دخولك إلى حسابك في شلة فود واستمتع بخدمات التوصيل والتسوق المتنوعة.",
		images: ["/og-login.jpg"],
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
		canonical: "https://shellafood.com/login",
		languages: {
			"ar-SA": "https://shellafood.com/login",
			"en-US": "https://shellafood.com/login",
		},
	},
	metadataBase: new URL("https://shellafood.com"),
};

/**
 * Login Page
 * User authentication with clean modular structure
 */
export default function LoginPage() {
	return <LoginForm  />;
}
