import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic import for client component with loading fallback
const WorkerDetails = dynamic(
	() => import("@/components/ServeMe").then((mod) => ({ default: mod.WorkerDetails })),
	{
		loading: () => <WorkerDetailsLoader />,
		ssr: true,
	}
);

// Loading component for WorkerDetails
function WorkerDetailsLoader() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			{/* Header Skeleton */}
			<div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
				<div className="px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center gap-4">
						<div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
						<div className="space-y-2">
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content Skeleton */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Worker Profile Section Skeleton */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
					<div className="flex flex-col md:flex-row gap-6">
						{/* Worker Avatar Skeleton */}
						<div className="flex-shrink-0">
							<div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
						</div>

						{/* Worker Info Skeleton */}
						<div className="flex-1">
							<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-4"></div>
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-2"></div>
							<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-4"></div>
							
							{/* Rating Skeleton */}
							<div className="flex items-center gap-2 mb-4">
								<div className="flex gap-1">
									{[...Array(5)].map((_, i) => (
										<div key={i} className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									))}
								</div>
								<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
							</div>

							{/* Price Skeleton */}
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse"></div>
						</div>
					</div>
				</div>

				{/* Tabs Skeleton */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
					<div className="flex gap-4 mb-6">
						{[...Array(3)].map((_, index) => (
							<div key={index} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-24 animate-pulse"></div>
						))}
					</div>

					{/* Tab Content Skeleton */}
					<div className="space-y-6">
						<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-4"></div>
						<div className="space-y-3">
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
							<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
						</div>
					</div>
				</div>

				{/* Action Buttons Skeleton */}
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full sm:w-48 animate-pulse"></div>
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full sm:w-48 animate-pulse"></div>
				</div>
			</div>
		</div>
	);
}

interface WorkerDetailsPageProps {
	params: Promise<{
		workerId: string;
	}>;
}

/**
 * Generate metadata for worker details page
 */
export async function generateMetadata({ params }: WorkerDetailsPageProps): Promise<Metadata> {
	const { workerId } = await params;

	return {
		title: `تفاصيل الفني | شلة فود`,
		description: `عرض تفاصيل الفني من شلة فود.`,
		keywords: [
			"تفاصيل الفني",
			"اخدمني",
			"شلة فود",
			"خدمات",
		],
		authors: [{ name: "شلة فود" }],
		creator: "شلة فود",
		publisher: "شلة فود",
		openGraph: {
			title: `تفاصيل الفني | اخدمني - شلة فود`,
			description: `عرض تفاصيل الفني`,
			type: "website",
			url: `https://shellafood.com/worker/${workerId}`,
			siteName: "شلة فود",
			locale: "ar_SA",
			alternateLocale: ["en_US"],
		},
		twitter: {
			card: "summary_large_image",
			title: `تفاصيل الفني | اخدمني - شلة فود`,
			description: `عرض تفاصيل الفني`,
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
			canonical: `https://shellafood.com/worker/${workerId}`,
			languages: {
				"ar-SA": `https://shellafood.com/worker/${workerId}`,
				"en-US": `https://shellafood.com/worker/${workerId}`,
			},
		},
		metadataBase: new URL("https://shellafood.com"),
	};
}

/**
 * Worker Details Page
 * Dynamic page that displays detailed information about a specific worker
 * Path: /worker/[workerId]
 * Optimized with dynamic imports for better performance
 */
export default async function WorkerDetailsPage({ params }: WorkerDetailsPageProps) {
	const { workerId } = await params;

	// For the new route, we don't require service data - components can work without it
	// In a real app, you would fetch worker data and determine service from that
	return (
		<Suspense fallback={<WorkerDetailsLoader />}>
			<WorkerDetails workerId={workerId} />
		</Suspense>
	);
}

