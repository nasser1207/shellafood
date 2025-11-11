
import LandingPage from "@/components/LandingPage/page";
import { Metadata } from "next";
export const metadata: Metadata = {
	title: "شلة - منصة التوصيل والخدمات الشاملة",
	description:
		"منصة شلة للتوصيل والخدمات الشاملة - تسوق، توصيل، مطاعم، سوبرماركت، صيدليات، خدمات منزلية وأكثر. انضم إلينا كسائق، شريك، أو عامل.",
	keywords:
		"شلة, توصيل, تسوق, مطاعم, سوبرماركت, صيدليات, خدمات منزلية, سائق, شريك, عامل",
	openGraph: {
		title: "شلة - منصة التوصيل والخدمات الشاملة",
		description:
			"منصة شلة للتوصيل والخدمات الشاملة - تسوق، توصيل، مطاعم، سوبرماركت، صيدليات، خدمات منزلية وأكثر",
		type: "website",
		locale: "ar_SA",
	},
	twitter: {
		card: "summary_large_image",
		title: "شلة - منصة التوصيل والخدمات الشاملة",
		description:
			"منصة شلة للتوصيل والخدمات الشاملة - تسوق، توصيل، مطاعم، سوبرماركت، صيدليات، خدمات منزلية وأكثر",
	},
	robots: {
		index: true,
		follow: true,
	},
};
export default function Home() {
	return (
<LandingPage/>
	);
}
