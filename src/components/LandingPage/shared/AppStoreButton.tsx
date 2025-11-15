"use client";
import { motion } from "framer-motion";
import { Apple, Play, Smartphone } from "lucide-react";
import Image from "next/image";

interface AppStoreButtonProps {
	store: "apple" | "google" | "huawei";
}

export default function AppStoreButton({ store }: AppStoreButtonProps) {
	const configs = {
		apple: {
			url: "https://apps.apple.com/us/app/%D8%B4%D9%84%D9%87/id6739772273",
			icon: Apple,
			label: "App Store",
			sublabel: "Download on the",
			image: "/appstore.png",
		},
		google: {
			url: "https://play.google.com/store/apps/details?id=com.food.shala",
			icon: Play,
			label: "Google Play",
			sublabel: "GET IT ON",
			image: "/googleplay.png",
		},
		huawei: {
			url: "https://appgallery.huawei.com",
			icon: Smartphone,
			label: "AppGallery",
			sublabel: "EXPLORE IT ON",
			image: "/appgalary.png",
		},
	};

	const config = configs[store];

	return (
		<motion.a
			href={config.url}
			target="_blank"
			rel="noopener noreferrer"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.98 }}
			className="block h-12 w-36 sm:h-14 sm:w-40 overflow-hidden rounded-lg sm:rounded-xl shadow-lg dark:shadow-gray-900/50 transition-all hover:shadow-2xl min-h-[44px] relative"
			aria-label={`Download from ${config.label}`}
		>
			<Image
				src={config.image}
				alt={config.label}
				width={160}
				height={56}
				quality={90}
				className="h-full w-full object-contain dark:opacity-90 transition-opacity duration-300"
				sizes="(max-width: 640px) 144px, 160px"
			/>
		</motion.a>
	);
}

