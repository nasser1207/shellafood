import { Metadata } from "next";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import DriverChatPage from "@/components/PickAndOrder/Driver/DriverChatPage";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ driverId: string }>;
}): Promise<Metadata> {
	const { driverId } = await params;

	return {
		title: `محادثة مع السائق | شلة فود`,
		description: `تواصل مع السائق مباشرة`,
		robots: { index: false, follow: true },
	};
}

export default async function ChatPageRoute({
	params,
}: {
	params: Promise<{ driverId: string }>;
}) {
	const { driverId } = await params;

	return (
		<>
			<NavBarCondition />
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<DriverChatPage driverId={driverId} />
			</main>
			<ShellaFooter />
		</>
	);
}

