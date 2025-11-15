
import LandingPage from "@/components/LandingPage/page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "شلة - منصة التوصيل والخدمات الشاملة | Shella Delivery Platform",
	description:
		"احصل على توصيل سريع وموثوق لجميع احتياجاتك من المطاعم والمتاجر في السعودية. أكثر من 2 مليون طلب، تقييم 4.8 نجوم. انضم إلينا كسائق، شريك، أو عامل.",
	keywords: [
		"شلة",
		"توصيل",
		"طعام",
		"مطاعم",
		"متاجر",
		"السعودية",
		"delivery",
		"food",
		"restaurants",
		"سائق",
		"شريك",
		"عامل",
		"قيدها",
	],
	authors: [{ name: "Shella Team" }],
	openGraph: {
		title: "شلة - منصة التوصيل الأولى في السعودية",
		description:
			"توصيل سريع من آلاف المطاعم والمتاجر. أكثر من 2 مليون طلب مكتمل، تقييم 4.8 نجوم.",
		url: "https://shella.app",
		siteName: "Shella",
		images: [
			{
				url: "/lanfingpage.jpg",
				width: 1200,
				height: 630,
				alt: "Shella Delivery Platform",
			},
		],
		locale: "ar_SA",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "شلة - منصة التوصيل والخدمات",
		description: "توصيل سريع وموثوق من آلاف المطاعم والمتاجر",
		images: ["/lanfingpage.jpg"],
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
		canonical: "https://shella.app",
		languages: {
			"ar-SA": "https://shella.app",
			"en-US": "https://shella.app/en",
		},
	},
};

export default function Home() {
	return (
		<>
			{/* Structured Data for SEO */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Organization",
						name: "Shella",
						url: "https://shella.app",
						logo: "https://shella.app/logous.png",
						description:
							"منصة توصيل شاملة للطعام والمنتجات في السعودية",
						address: {
							"@type": "PostalAddress",
							addressCountry: "SA",
						},
						aggregateRating: {
							"@type": "AggregateRating",
							ratingValue: "4.8",
							reviewCount: "10000",
							bestRating: "5",
							worstRating: "1",
						},
					}),
				}}
			/>
			<LandingPage />
		</>
	);
}
