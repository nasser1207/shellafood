"use client";

import { ReactNode } from "react";

interface NoticeSectionProps {
	icon: ReactNode;
	title: string;
	text: string;
	isArabic?: boolean;
}

export default function NoticeSection({
	icon,
	title,
	text,
	isArabic = false
}: NoticeSectionProps) {
	return (
		<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 sm:p-6">
			<div className={`flex items-start gap-3 ${isArabic ? 'flex-row' : 'flex-row'}`}>
				<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
					{icon}
				</div>
				<div>
					<p className="text-green-800 dark:text-green-300 font-medium text-sm sm:text-base leading-relaxed">
						<strong>{title}</strong> {text}
					</p>
				</div>
			</div>
		</div>
	);
}
