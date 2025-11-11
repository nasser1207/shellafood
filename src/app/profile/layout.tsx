import { Metadata } from "next";
import NavBarCondition from "@/components/Profile/NavBarConditon";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "الملف الشخصي | شلة فود",
	description:
		"إدارة ملفك الشخصي في شلة فود. عرض معلوماتك، طلباتك، المفضلة، العناوين المحفوظة، وإعدادات الحساب.",
	keywords: [
		"الملف الشخصي",
		"شلة فود",
		"حساب",
		"طلبات",
		"مفضلة",
		"عناوين",
		"إعدادات",
	],
	authors: [{ name: "شلة فود" }],
	creator: "شلة فود",
	publisher: "شلة فود",
	robots: {
		index: false,
		follow: true,
	},
	metadataBase: new URL("https://shellafood.com"),
};

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Navigation - Server Component by default */}
			<Navbar />
			{/* Main Content */}
			<main className="min-h-screen bg-white dark:bg-gray-900">
				{children}
			</main>
			{/* Footer - Server Component by default */}
			<ShellaFooter />
		</>
	);
}
