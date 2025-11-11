"use client";

import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import { usePathname } from "next/navigation";
export default function ServeMeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	// Check if pathname ends with '/chat' or includes '/chat/'
	const isChatPage = pathname.endsWith("/chat") || pathname.includes("/chat/");

	// For chat pages, render without navbar/footer for full-screen chat experience
	if (isChatPage) {
		return <>{children}</>;
	}

	return (
		<>
			{/* Navigation - Server Component by default */}
			<NavBarCondition />
			{/* Main Content */}
			<main className="min-h-screen bg-white dark:bg-gray-900">
				{children}
			</main>
			{/* Footer - Server Component by default */}
			<ShellaFooter />
		</>
	);
}