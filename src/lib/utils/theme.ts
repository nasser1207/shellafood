/**
 * Theme Utility Functions
 * Helper functions for manual theme manipulation
 */

/**
 * Toggle dark mode manually
 * Adds or removes the 'dark' class from the document element
 */
export function toggleDarkMode(): void {
	if (typeof window !== "undefined") {
		document.documentElement.classList.toggle("dark");
	}
}

/**
 * Enable dark mode
 */
export function enableDarkMode(): void {
	if (typeof window !== "undefined") {
		document.documentElement.classList.add("dark");
	}
}

/**
 * Disable dark mode (enable light mode)
 */
export function disableDarkMode(): void {
	if (typeof window !== "undefined") {
		document.documentElement.classList.remove("dark");
	}
}

/**
 * Check if dark mode is currently enabled
 */
export function isDarkMode(): boolean {
	if (typeof window !== "undefined") {
		return document.documentElement.classList.contains("dark");
	}
	return false;
}

/**
 * Set theme based on string value
 * @param theme - 'dark', 'light', or 'system'
 */
export function setTheme(theme: "dark" | "light" | "system"): void {
	if (typeof window !== "undefined") {
		if (theme === "dark") {
			enableDarkMode();
		} else if (theme === "light") {
			disableDarkMode();
		} else {
			// System theme - follow OS preference
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			if (prefersDark) {
				enableDarkMode();
			} else {
				disableDarkMode();
			}
		}
	}
}

