import React from "react";

/**
 * Loading component for chat page
 * Matches the actual ChatInterface component design
 */
export default function ChatLoading() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header Skeleton */}
			<div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
				<div className="px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
								<div>
									<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-1"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Chat Container Skeleton */}
			<div className="flex flex-col h-[calc(100vh-80px)]">
				{/* Messages Area Skeleton */}
				<div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="max-w-4xl mx-auto">
						{/* Service Info Banner Skeleton */}
						<div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
							<div className="flex items-center justify-between">
								<div>
									<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-2"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
								</div>
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<div key={i} className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									))}
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse ml-1"></div>
								</div>
							</div>
						</div>

						{/* Messages Skeleton */}
						<div className="space-y-4">
							{[...Array(5)].map((_, index) => (
								<div key={index} className={`flex ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
									<div className="flex items-end gap-2 max-w-xs sm:max-w-md">
										{index % 2 === 1 && (
											<div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
										)}
										<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 shadow-sm">
											<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-2"></div>
											<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Message Input Skeleton */}
				<div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
					<div className="max-w-4xl mx-auto">
						<div className="flex items-end gap-3">
							<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
							<div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
							<div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

