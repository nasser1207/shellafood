import { Metadata } from "next";
import { cache } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getIndividualService, getAllIndividualServicePaths } from "@/lib/data/services";

export async function generateStaticParams() {
	const paths = getAllIndividualServicePaths();
	return paths.map(({ category, service }) => ({
		service: category,
		serviceType: service,
	}));
}

// Cache service data to prevent redundant lookups
const getCachedService = cache((service: string, serviceType: string) => {
	return getIndividualService(service, serviceType);
});

// Dynamic import for client component with loading fallback
const BookingSummaryPage = dynamic(
	() => import("@/components/ServeMe/Booking/BookingSummaryPage"),
	{
		loading: () => <BookingSummaryLoader />,
		ssr: true,
	}
);

// Loading component for BookingSummaryPage
function BookingSummaryLoader() {
	return (
		<div className="min-h-screen bg-gray-50" dir="rtl">
			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="bg-white rounded-lg shadow p-6 animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
					<div className="space-y-4">
						<div className="h-20 bg-gray-200 rounded"></div>
						<div className="h-20 bg-gray-200 rounded"></div>
						<div className="h-12 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

interface PageProps {
	params: Promise<{
		service: string;
		serviceType: string;
	}>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { service, serviceType } = await params;
	const serviceData = getCachedService(service, serviceType);

	if (!serviceData) {
		return {
			title: "ملخص الحجز | اخدمني - شلة فود",
			description: "راجع ملخص حجزك",
			robots: { index: false, follow: true },
		};
	}

	const titleEn = serviceData.titleEn;
	const titleAr = serviceData.titleAr;

	return {
		title: `ملخص الحجز - ${titleAr} | اخدمني - شلة فود`,
		description: `راجع ملخص حجزك لخدمة ${titleAr}. تحقق من تفاصيل الخدمة والأسعار والعنوان قبل المتابعة إلى الدفع.`,
		keywords: [
			titleAr,
			titleEn,
			"ملخص الحجز",
			"ملخص الطلب",
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `ملخص الحجز - ${titleAr} | اخدمني - شلة فود`,
			description: `راجع ملخص حجزك لخدمة ${titleAr}`,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/book/summary`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `ملخص الحجز - ${titleAr} | اخدمني - شلة فود`,
			description: `راجع ملخص حجزك`,
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
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/book/summary`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/book/summary`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/book/summary`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function BookingSummaryPageRoute({ params }: PageProps) {
	return (
		<Suspense fallback={<BookingSummaryLoader />}>
			<BookingSummaryPage />
		</Suspense>
	);
}
