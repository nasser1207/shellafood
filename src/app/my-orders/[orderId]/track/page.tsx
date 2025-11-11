import type { Metadata } from "next";
import TrackOrderPage from "@/components/OrderTracking/TrackOrderPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
	const { orderId } = await params;
	
	return {
		title: `تتبع الطلب ${orderId} | شلة فود`,
		description: `تتبع طلبك ${orderId} في الوقت الفعلي. عرض حالة التوصيل، الخط الزمني، والخريطة المباشرة.`,
		keywords: [
			"تتبع الطلب",
			"تتبع الطلبات",
			"حالة التوصيل",
			"تتبع الشحنة",
			"شلة فود",
			`الطلب ${orderId}`,
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `تتبع الطلب ${orderId} | شلة فود`,
			description: `تتبع طلبك ${orderId} في الوقت الفعلي. عرض حالة التوصيل والخط الزمني.`,
			type: "website",
			url: `https://shellafood.com/my-orders/${orderId}/track`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `تتبع الطلب ${orderId} | شلة فود`,
			description: `تتبع طلبك ${orderId} في الوقت الفعلي.`,
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
			canonical: `https://shellafood.com/my-orders/${orderId}/track`,
			languages: {
				"ar-SA": `https://shellafood.com/my-orders/${orderId}/track`,
				"en-US": `https://shellafood.com/my-orders/${orderId}/track`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

interface TrackOrderPageRouteProps {
	params: Promise<{ orderId: string }>;
}

export default async function TrackOrderPageRoute({ params }: TrackOrderPageRouteProps) {
	const { orderId } = await params;

	return <TrackOrderPage orderId={orderId} />;
}

