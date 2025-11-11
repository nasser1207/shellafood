"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * ThemeProvider Component
 * 
 * Wraps the application with next-themes provider to manage dark mode.
 * Automatically applies the 'dark' class to the <html> element when dark mode is enabled.
 * 
 * Configuration:
 * - attribute="class": Uses class-based dark mode (applies 'dark' class to html)
 * - defaultTheme="system": Follows OS preference by default
 * - enableSystem: Allows system theme detection
 * - disableTransitionOnChange: Prevents flash during theme changes
 * 
 * The dark class is automatically added/removed from <html> element:
 * - Light mode: <html lang="ar" dir="rtl">
 * - Dark mode: <html lang="ar" dir="rtl" class="dark">
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}

