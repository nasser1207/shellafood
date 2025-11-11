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
const ConfirmationPage = dynamic(
	() => import("@/components/ServeMe/Booking/ConfirmationPage"),
	{
		loading: () => <ConfirmationLoader />,
		ssr: true,
	}
);

// Loading component for ConfirmationPage
function ConfirmationLoader() {
	return (
		<div className="min-h-screen bg-gray-50" dir="rtl">
			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="bg-white rounded-lg shadow p-6 animate-pulse text-center">
					<div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
					<div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
					<div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
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
			title: "تأكيد الحجز | اخدمني - شلة فود",
			description: "تم تأكيد حجزك بنجاح",
			robots: { index: false, follow: true },
		};
	}

	const titleEn = serviceData.titleEn;
	const titleAr = serviceData.titleAr;

	return {
		title: `تم تأكيد الحجز - ${titleAr} | اخدمني - شلة فود`,
		description: `تم تأكيد حجزك لخدمة ${titleAr} بنجاح. شكراً لاختيارك خدمتنا.`,
		keywords: [
			titleAr,
			titleEn,
			"تأكيد الحجز",
			"تم الحجز",
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `تم تأكيد الحجز - ${titleAr} | اخدمني - شلة فود`,
			description: `تم تأكيد حجزك لخدمة ${titleAr}`,
			type: "website",
			url: `https://shellafood.com/serve-me/${service}/${serviceType}/book/confirmation`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `تم تأكيد الحجز - ${titleAr} | اخدمني - شلة فود`,
			description: `تم تأكيد حجزك بنجاح`,
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
			canonical: `https://shellafood.com/serve-me/${service}/${serviceType}/book/confirmation`,
			languages: {
				"ar-SA": `https://shellafood.com/serve-me/${service}/${serviceType}/book/confirmation`,
				"en-US": `https://shellafood.com/serve-me/${service}/${serviceType}/book/confirmation`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

export default async function ConfirmationPageRoute({ params }: PageProps) {
	return (
		<Suspense fallback={<ConfirmationLoader />}>
			<ConfirmationPage />
		</Suspense>
	);
}
