import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "../navbar";
import ShellaFooter from "../ShellaFooter/ShellaFooter";
import MainLandingPage from "./Main/MainLandingPage";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
			<Navbar />
			<SpeedInsights />
			<MainLandingPage />
			<ShellaFooter />
		</div>
	);
}