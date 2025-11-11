"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
	const { language, setLanguage, t } = useLanguage();
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// إغلاق القائمة عند النقر خارجها
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<nav className="flex w-full flex-row items-center justify-between border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 px-6 py-2 shadow-sm">
			{/* قسم اللغة */}
			<div className="flex items-center gap-3">
				<ThemeToggle />
				<div className="relative" ref={dropdownRef}>
				<div 
					className="flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-3 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				>
					<ChevronDown 
						className={`text-green-600 dark:text-green-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
						size={22} 
					/>
					<span className="font-medium text-gray-800 dark:text-gray-200">
						{language === 'ar' ? t('navbar.arabic') : t('navbar.english')}
					</span>
					<Image
						src={language === 'ar' ? "/saudiflag.png" : "/logous.svg"}
						alt={language === 'ar' ? "Saudi Flag" : "English Flag"}
						width={45}
						height={40}
						className="rounded-sm dark:opacity-80 transition-opacity duration-300"
					/>
				</div>

				{/* القائمة المنسدلة */}
				{isDropdownOpen && (
					<div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
						<div 
							className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
							onClick={() => {
								setLanguage('ar');
								setIsDropdownOpen(false);
							}}
						>
							<Image
								src="/saudiflag.png"
								alt="Saudi Flag"
								width={30}
								height={25}
								className="rounded-sm dark:opacity-80 transition-opacity duration-300"
							/>
							<span className="font-medium text-gray-800 dark:text-gray-200">{t('navbar.arabic')}</span>
						</div>
						<div 
							className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
							onClick={() => {
								setLanguage('en');
								setIsDropdownOpen(false);
							}}
						>
							<Image
								src="/logous.svg"
								alt="English Flag"
								width={30}
								height={25}
								className="rounded-sm dark:opacity-80 transition-opacity duration-300"
							/>
							<span className="font-medium text-gray-800 dark:text-gray-200">{t('navbar.english')}</span>
						</div>
					</div>
				)}
				</div>
			</div>

			{/* شعار شلة - تم تعديل الحجم ليكون متجاوبًا */}
			<Image
				onClick={() => {
					window.location.href = "/";
				}}
				src="/shellalogo.png"
				alt="logo"
				width={0}
				height={0}
				sizes="100vw"
				className="w-32 object-contain sm:w-44 lg:w-52 cursor-pointer dark:opacity-80 transition-opacity duration-300"
			/>
		</nav>
	);
}