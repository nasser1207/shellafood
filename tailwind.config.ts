// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class", // Enable class-based dark mode
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			keyframes: {
				'marquee-ltr': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-25%)' },
				},
				'marquee-rtl': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(25%)' },
				},
			},
			animation: {
				'marquee-ltr': 'marquee-ltr 40s linear infinite',
				'marquee-rtl': 'marquee-rtl 40s linear infinite',
			},
		},
	},
	plugins: [],
};
