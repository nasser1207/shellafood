import React from "react";

interface DynamicListItem {
	[key: string]: string;
}

interface DynamicListSectionProps {
	title: string;
	addButtonText: string;
	items: DynamicListItem[];
	onAddItem: () => void;
	onRemoveItem: (index: number) => void;
	onItemChange: (index: number, field: string, value: string) => void;
	fields: Array<{
		name: string;
		label: string;
		type?: string;
		maxWidth?: string;
	}>;
	isArabic: boolean;
}

/**
 * Reusable Dynamic List Section Component
 * Used for installments and additional income sections
 */
export const DynamicListSection: React.FC<DynamicListSectionProps> = ({
	title,
	addButtonText,
	items,
	onAddItem,
	onRemoveItem,
	onItemChange,
	fields,
	isArabic,
}) => {
	return (
		<div className="space-y-4 sm:space-y-6">
			<div className={`flex flex-col sm:flex-row sm:items-center ${isArabic ? 'sm:flex-row-reverse' : ''} sm:justify-between gap-3 sm:gap-4`}>
				<h3 className={`text-lg sm:text-xl font-medium text-gray-800 dark:text-gray-200 ${isArabic ? 'text-right' : 'text-left'}`}>
					{title}
				</h3>
				
				{/* Add Button - Responsive */}
				<button
					type="button"
					onClick={onAddItem}
					className={`flex h-12 sm:h-[57px] w-full sm:w-[140px] items-center justify-center gap-2 rounded-lg bg-[#31A342] dark:bg-green-600 px-3 sm:px-4 text-white shadow-sm dark:shadow-gray-900/50 transition-all duration-200 hover:bg-[#2a8f39] dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-[#31A342] dark:focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isArabic ? 'flex-row-reverse' : ''}`}
				>
					<svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
					<span className="text-xs sm:text-sm font-semibold">{addButtonText}</span>
				</button>
			</div>
			
			{/* Dynamic Items List - Responsive */}
			<div className="space-y-3 sm:space-y-4">
				{items.map((item, index) => (
					<div key={index} className={`flex flex-col gap-3 sm:gap-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 sm:flex-row sm:items-end ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
						{fields.map((field) => (
							<div key={field.name} className={`flex-1 ${field.maxWidth || ''}`}>
								<label className={`mb-1.5 sm:mb-2 block text-sm sm:text-base md:text-lg font-medium leading-[100%] text-gray-800 dark:text-gray-200 ${isArabic ? 'text-right' : 'text-left'}`}>
									{field.label}
								</label>
								<input
									type={field.type || 'text'}
									value={item[field.name] || ''}
									onChange={(e) => onItemChange(index, field.name, e.target.value)}
									placeholder={field.type === 'number' ? '0' : ''}
									className={`h-11 sm:h-[60px] w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 sm:px-4 text-sm sm:text-base text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-gray-900/50 transition-all duration-200 focus:border-[#31A342] dark:focus:border-green-400 focus:ring-2 focus:ring-[#31A342]/20 dark:focus:ring-green-400/20 focus:outline-none ${
										isArabic ? 'text-right' : 'text-left'
									}`}
								/>
							</div>
						))}

						{/* Remove Button - Responsive */}
						<button
							type="button"
							onClick={() => onRemoveItem(index)}
							className={`flex h-11 sm:h-[60px] w-full sm:w-auto sm:min-w-[100px] items-center justify-center gap-2 rounded-lg bg-[#BC7620] dark:bg-orange-600 px-3 sm:px-4 text-white shadow-sm dark:shadow-gray-900/50 transition-all duration-200 hover:bg-[#a56619] dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-[#BC7620] dark:focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isArabic ? 'flex-row-reverse' : ''}`}
						>
							<svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
							<span className="text-xs sm:text-sm font-semibold">{isArabic ? 'إزالة' : 'Remove'}</span>
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

