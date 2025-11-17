"use client";

import {
	ClipboardList,
	Globe,
	Home,
	List,
	LogOut,
	Mail,
	MenuIcon,
	Search,
	ShoppingBag,
	User,
	X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HelpAndSupport from "./Support/HelpAndSupport";

const MobileMenu = ({
	onClose,
	activeTab,
	setActiveTab,
	openAterms,
	user,
	isLoggedIn,
	cartCount,
	isLoadingUser,
}: {
	onClose: () => void;
	activeTab: string;
	setActiveTab: (tab: string) => void;
	openAterms: () => void;
	user: { fullName: string; email: string } | null;
	isLoggedIn: boolean;
	cartCount: number;
	isLoadingUser: boolean;
}) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleClick = (tab: string, href: string) => {
		setActiveTab(tab);
		window.location.href = href;
		onClose();
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
			onClose();
		}
	};

	const menuItems = [
		{ id: "home", label: "الرئيسية", icon: Home, href: "/home" },
		{ id: "my-orders", label: "طلباتي", icon: ClipboardList, href: "/my-orders" },
		{ id: "cart", label: "السلة", icon: ShoppingBag, href: "/cart", badge: cartCount },
		{
		id: "profile",
			label: "الملف الشخصي",
			icon: User,
			href: "/profile" 
		},
		{ id: "categories", label: "الفئات", icon: List, href: "/categories" },
		{ id: "contact", label: "اتصل بنا", icon: Mail, href: "#", action: openAterms },
		{ id: "language", label: "عربية", icon: Globe, href: "/" },
		{ id: "logout", label: "تسجيل الخروج", icon: LogOut, href: "/logout" },
	];

	return (
		<>
			{/* Backdrop */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Sidebar */}
			<motion.div
				initial={{ x: "100%" }}
				animate={{ x: 0 }}
				exit={{ x: "100%" }}
				transition={{ type: "spring", damping: 25, stiffness: 200 }}
				className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl"
				dir="rtl"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
					<h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">القائمة</h2>
					<motion.button
						whileHover={{ scale: 1.1, rotate: 90 }}
						whileTap={{ scale: 0.9 }}
						onClick={onClose}
						className="rounded-full p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						aria-label="إغلاق القائمة"
					>
						<X size={24} />
					</motion.button>
				</div>

				{/* Search */}
				<div className="border-b border-gray-200 dark:border-gray-700 p-4">
					<form onSubmit={handleSearch} className="relative">
						<Search
							size={18}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
						/>
						<input
							type="text"
							placeholder="ابحث عن المتاجر أو المطاعم..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2.5 pr-10 pl-4 text-right text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-[#10b981] dark:focus:border-green-500 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 dark:focus:ring-green-500/20 transition-all"
							dir="rtl"
						/>
					</form>
				</div>

				{/* Menu Items */}
				<div className="overflow-y-auto p-4">
					<div className="space-y-1">
						{menuItems.map((item, index) => {
							const Icon = item.icon;
							const isActive = activeTab === item.id;
							const hasAction = item.action;

							return (
								<motion.button
									key={item.id}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.05 }}
									whileHover={{ x: -4, backgroundColor: "rgba(16, 185, 129, 0.08)" }}
									whileTap={{ scale: 0.98 }}
									onClick={() => {
										if (hasAction) {
											hasAction();
											onClose();
										} else {
											handleClick(item.id, item.href);
										}
									}}
									className={`group relative flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-right transition-all ${
										isActive
											? "bg-gradient-to-l from-[#10b981]/10 dark:from-green-500/20 to-transparent text-[#10b981] dark:text-green-400 shadow-sm"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
									}`}
								>
									{/* Active Indicator */}
									{isActive && (
										<motion.div
											layoutId="activeTabIndicator"
											className="absolute right-0 top-0 bottom-0 w-1 rounded-l-full bg-[#10b981] dark:bg-green-500"
										/>
									)}

									{/* Icon */}
									<div
										className={`rounded-lg p-2 transition-colors ${
											isActive
												? "bg-[#10b981]/20 dark:bg-green-500/20 text-[#10b981] dark:text-green-400"
												: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-[#10b981]/10 dark:group-hover:bg-green-500/20 group-hover:text-[#10b981] dark:group-hover:text-green-400"
										}`}
									>
										<Icon size={20} strokeWidth={2} />
									</div>

									{/* Label & Badge */}
									<div className="flex flex-1 items-center justify-between min-w-0">
										<span
											className={`font-semibold text-sm truncate ${
												isActive ? "text-[#10b981] dark:text-green-400" : "text-gray-900 dark:text-gray-100"
											} ${item.id === "login" ? "max-w-[140px]" : ""}`}
										>
											{item.label}
										</span>
										{item.badge !== undefined && item.badge > 0 && (
											<motion.span
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm"
											>
												{item.badge > 99 ? "99+" : item.badge}
											</motion.span>
										)}
									</div>
								</motion.button>
							);
						})}
					</div>
				</div>
			</motion.div>
		</>
	);
};

export default function NavBarCondition() {
	const pathname = usePathname();
	const [activeTab, setActiveTab] = useState("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showAterms, setShowAterms] = useState(false);
	const [cartCount, setCartCount] = useState(0);
	const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoadingUser, setIsLoadingUser] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	useEffect(() => {
		if (pathname.startsWith("/profile")) setActiveTab("login");
		else if (pathname.startsWith("/cart")) setActiveTab("cart");
		else if (pathname.startsWith("/my-orders")) setActiveTab("my-orders");
		else setActiveTab("home");
	}, [pathname]);

	const handleClick = (tab: string, href: string) => {
		setActiveTab(tab);
		window.location.href = href;
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchTerm.trim())}`;
		}
	};

	const navItems = [
		{ id: "home", label: "الرئيسية", icon: Home, href: "/home" },
		{ id: "my-orders", label: "طلباتي", icon: ClipboardList, href: "/my-orders" },
		{ id: "cart", label: "السلة", icon: ShoppingBag, href: "/cart", badge: cartCount },
		{
			id: "login",
			label: "الملف الشخصي",
			icon: User,
			href: "/profile" 
		},
		{ id: "contact", label: "اتصل بنا", icon: Mail, href: "#", action: () => setShowAterms(true) },
		{ id: "language", label: "عربية", icon: Globe, href: "/" },
	];

	return (
		<>
			{/* Main Navbar */}
			<nav className="sticky top-0 z-30 w-full border-b border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-4">
						{/* Mobile Menu Button */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setIsMenuOpen(true)}
							className="md:hidden rounded-xl p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							aria-label="فتح القائمة"
						>
							<MenuIcon size={24} strokeWidth={2} />
						</motion.button>

						{/* Search Bar */}
						<motion.form
							onSubmit={handleSearch}
							className="relative flex flex-1 items-center md:order-2 md:max-w-md"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.1 }}
						>
							<Search
								size={18}
								className={`absolute right-3 text-gray-400 dark:text-gray-500 transition-colors ${
									isSearchFocused ? "text-[#10b981] dark:text-green-400" : ""
								}`}
							/>
							<input
								type="text"
								placeholder="ابحث عن المتاجر أو المطاعم أو المنتجات الفريدة..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onFocus={() => setIsSearchFocused(true)}
								onBlur={() => setIsSearchFocused(false)}
								className={`h-10 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2 pr-10 pl-4 text-right text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all focus:border-[#10b981] dark:focus:border-green-500 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 dark:focus:ring-green-500/20 ${
									isSearchFocused ? "shadow-md" : "shadow-sm"
								}`}
								dir="rtl"
							/>
						</motion.form>

						{/* Desktop Navigation */}
						<div className="hidden flex-row-reverse items-center gap-2 md:order-1 md:flex">
							{navItems.map((item) => {
								const Icon = item.icon;
								const isActive = activeTab === item.id;
								const hasAction = item.action;

								return (
									<motion.div key={item.id} className="relative">
										<motion.button
											whileHover={{ y: -2 }}
											whileTap={{ scale: 0.95 }}
											onClick={() => {
												if (hasAction) {
													hasAction();
												} else {
													handleClick(item.id, item.href);
												}
											}}
											className={`group relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all min-w-0 ${
												isActive
													? "bg-gradient-to-l from-[#10b981]/10 dark:from-green-500/20 to-transparent text-[#10b981] dark:text-green-400"
													: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#10b981] dark:hover:text-green-400"
											}`}
											aria-label={item.label}
										>
											{/* Active Underline */}
											{isActive && (
												<motion.div
													layoutId="activeNavIndicator"
													className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#10b981] dark:bg-green-500"
												/>
											)}

											{/* Icon */}
											<Icon
												size={20}
												strokeWidth={2.5}
												className={isActive ? "text-[#10b981] dark:text-green-400" : "text-gray-600 dark:text-gray-400"}
											/>

											{/* Label */}
											<span
												className={`hidden lg:inline ${
													item.id === "login" ? "max-w-32 truncate" : ""
												}`}
											>
												{item.label}
											</span>

											{/* Cart Badge */}
											{item.badge !== undefined && item.badge > 0 && (
												<motion.span
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-md"
												>
													{item.badge > 99 ? "99+" : item.badge}
												</motion.span>
											)}
										</motion.button>
									</motion.div>
								);
							})}
						</div>

						{/* Mobile Cart Icon */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => handleClick("cart", "/cart")}
							className="relative md:hidden rounded-xl p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							aria-label="السلة"
						>
							<ShoppingBag size={22} strokeWidth={2} />
							{cartCount > 0 && (
								<motion.span
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-md"
								>
									{cartCount > 99 ? "99+" : cartCount}
								</motion.span>
							)}
						</motion.button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMenuOpen && (
					<MobileMenu
						onClose={() => setIsMenuOpen(false)}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						openAterms={() => setShowAterms(true)}
						user={user}
						isLoggedIn={isLoggedIn}
						cartCount={cartCount}
						isLoadingUser={isLoadingUser}
					/>
				)}
			</AnimatePresence>

			{/* Contact Modal */}
			<AnimatePresence>
				{showAterms && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
							onClick={() => setShowAterms(false)}
						>
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								transition={{ type: "spring", damping: 20, stiffness: 300 }}
								onClick={(e) => e.stopPropagation()}
								className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl md:p-8"
							>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => setShowAterms(false)}
									className="absolute top-4 right-4 rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"
									aria-label="إغلاق"
								>
									<X size={20} />
								</motion.button>
								<HelpAndSupport />
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
