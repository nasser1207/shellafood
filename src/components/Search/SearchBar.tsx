"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, X, Loader2, Mic } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { getSearchSuggestions } from "@/lib/utils/searchUtils";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (value: string) => void;
	isLoading?: boolean;
	placeholder?: string;
	autoFocus?: boolean;
}

export default function SearchBar({
	value,
	onChange,
	onSubmit,
	isLoading = false,
	placeholder,
	autoFocus = false,
}: SearchBarProps) {
	const { language } = useLanguage();
	const isArabic = language === "ar";
	const inputRef = useRef<HTMLInputElement>(null);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const debouncedValue = useDebounce(value, 300);

	// Auto-focus on mount
	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus();
		}
	}, [autoFocus]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// "/" to focus search
			if (e.key === "/" && e.target !== inputRef.current) {
				e.preventDefault();
				inputRef.current?.focus();
			}
			// "Esc" to clear
			if (e.key === "Escape" && value) {
				onChange("");
				inputRef.current?.blur();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [value, onChange]);

	// Update suggestions
	useEffect(() => {
		if (debouncedValue.trim() && showSuggestions) {
			const newSuggestions = getSearchSuggestions(debouncedValue, 5);
			setSuggestions(newSuggestions);
		} else {
			setSuggestions([]);
		}
	}, [debouncedValue, showSuggestions]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			if (value.trim()) {
				onSubmit(value.trim());
				setShowSuggestions(false);
				inputRef.current?.blur();
			}
		},
		[value, onSubmit]
	);

	const handleClear = useCallback(() => {
		onChange("");
		inputRef.current?.focus();
		setShowSuggestions(false);
	}, [onChange]);

	const handleSuggestionClick = useCallback(
		(suggestion: string) => {
			onChange(suggestion);
			onSubmit(suggestion);
			setShowSuggestions(false);
			inputRef.current?.blur();
		},
		[onChange, onSubmit]
	);

	const defaultPlaceholder = isArabic
		? "ابحث عن المتاجر أو المطاعم أو المنتجات..."
		: "Search for stores, restaurants, or products...";

	return (
		<div className="relative mb-8">
			<form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.1 }}
					className="relative"
				>
					{/* Search Input */}
					<div className="relative group">
						{/* Search Icon */}
						<div
							className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "right-4" : "left-4"} z-10`}
						>
							{isLoading ? (
								<Loader2 className="w-5 h-5 text-gray-400 dark:text-gray-500 animate-spin" />
							) : (
								<Search className="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-green-600 dark:group-focus-within:text-green-400 transition-colors" />
							)}
						</div>

						{/* Input Field */}
						<input
							ref={inputRef}
							type="text"
							role="searchbox"
							aria-label={isArabic ? "بحث" : "Search"}
							placeholder={placeholder || defaultPlaceholder}
							value={value}
							onChange={(e) => {
								onChange(e.target.value);
								setShowSuggestions(true);
							}}
							onFocus={() => setShowSuggestions(true)}
							onBlur={() => {
								// Delay to allow suggestion click
								setTimeout(() => setShowSuggestions(false), 200);
							}}
							className={`w-full ${isArabic ? "pr-12 pl-20" : "pl-12 pr-20"} py-4 sm:py-5 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base sm:text-lg shadow-lg dark:shadow-gray-900/50 transition-all duration-200 backdrop-blur-sm group-hover:shadow-xl group-focus-within:shadow-2xl group-focus-within:scale-[1.01]`}
							dir={isArabic ? "rtl" : "ltr"}
						/>

						{/* Clear Button */}
						{value && (
							<motion.button
								type="button"
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0 }}
								onClick={handleClear}
								className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-16" : "right-16"} z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors`}
								aria-label={isArabic ? "مسح" : "Clear"}
							>
								<X className="w-5 h-5 text-gray-400 dark:text-gray-500" />
							</motion.button>
						)}

						{/* Submit Button */}
						<motion.button
							type="submit"
							disabled={!value.trim() || isLoading}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className={`absolute top-1/2 -translate-y-1/2 ${isArabic ? "left-3" : "right-3"} z-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
							aria-label={isArabic ? "بحث" : "Search"}
						>
							{isArabic ? "بحث" : "Search"}
						</motion.button>
					</div>

					{/* Search Suggestions Dropdown */}
					<AnimatePresence>
						{showSuggestions && suggestions.length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
							>
								<div className="py-2">
									{suggestions.map((suggestion, index) => (
										<button
											key={index}
											type="button"
											onClick={() => handleSuggestionClick(suggestion)}
											className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isArabic ? "text-right" : "text-left"}`}
										>
											<div className="flex items-center gap-3">
												<Search className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
												<span className="text-gray-900 dark:text-gray-100">{suggestion}</span>
											</div>
										</button>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</form>
		</div>
	);
}

