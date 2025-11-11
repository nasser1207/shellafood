"use client";

import { ReactNode } from "react";

interface PolicySectionProps {
	icon: ReactNode;
	title: string;
	description?: string;
	items?: string[];
	numbered?: boolean;
	isArabic?: boolean;
}

export default function PolicySection({
	icon,
	title,
	description,
	items = [],
	numbered = false,
	isArabic = false
}: PolicySectionProps) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
			<div className={`flex items-center gap-3 mb-4 ${isArabic ? 'flex-row' : 'flex-row'}`}>
				<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
					{icon}
				</div>
				<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
					{title}
				</h3>
			</div>
			
			{description && (
				<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-4 leading-relaxed">
					{description}
				</p>
			)}
			
			{items.length > 0 && (
				<div className="space-y-3">
					{numbered ? (
						<ol className="space-y-3">
							{items.map((item, index) => (
								<li key={index} className={`flex items-start gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
									<div className="h-6 w-6 bg-green-500 dark:bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
										{index + 1}
									</div>
									<span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
										{item}
									</span>
								</li>
							))}
						</ol>
					) : (
						<ul className="space-y-3">
							{items.map((item, index) => (
								<li key={index} className={`flex items-start gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
									<div className="h-2 w-2 bg-green-500 dark:bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
									<span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
										{item}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}
