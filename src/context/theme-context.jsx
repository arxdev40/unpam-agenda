import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { signal } from "@preact/signals";

const THEME_STORAGE_KEY = "UNPAM_AGENDA_THEME";

// Signal state for direct reactive access
export const currentThemeSignal = signal("light");

const ThemeContext = createContext({
	theme: "light",
	toggleTheme: () => {},
	setTheme: () => {},
	isDark: false,
});

/**
 * Determine initial theme from DOM, localStorage, or system preference
 * @returns {'light' | 'dark'}
 */
function getInitialTheme() {
	if (typeof document !== "undefined") {
		const attr = document.documentElement.getAttribute("data-theme");
		if (attr === "light" || attr === "dark") {
			return attr;
		}
	}
	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (stored === "light" || stored === "dark") {
			return stored;
		}
		if (
			typeof window !== "undefined" &&
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			return "dark";
		}
	} catch (error) {
		console.warn("Gagal membaca tema:", error);
	}
	return "light";
}

/**
 * Apply theme to document without triggering layout thrashing
 * @param {'light' | 'dark'} nextTheme
 * @param {boolean} isUserAction
 */
function applyThemeToDocument(nextTheme, isUserAction = false) {
	if (typeof document === "undefined") return;

	if (isUserAction) {
		document.documentElement.classList.add("theme-transitioning");
	}

	document.documentElement.setAttribute("data-theme", nextTheme);

	try {
		localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
	} catch (error) {
		console.warn("Gagal menyimpan tema:", error);
	}

	if (isUserAction) {
		setTimeout(() => {
			document.documentElement.classList.remove("theme-transitioning");
		}, 200);
	}
}

/**
 * Theme Provider Component
 */
export function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState(getInitialTheme);

	useEffect(() => {
		currentThemeSignal.value = theme;
	}, [theme]);

	// Listen for system theme changes if user hasn't explicitly set a preference
	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = (e) => {
			const hasManualSetting = localStorage.getItem(THEME_STORAGE_KEY);
			if (!hasManualSetting) {
				const nextTheme = e.matches ? "dark" : "light";
				setThemeState(nextTheme);
				applyThemeToDocument(nextTheme, true);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const toggleTheme = () => {
		const nextTheme = theme === "dark" ? "light" : "dark";
		setThemeState(nextTheme);
		applyThemeToDocument(nextTheme, true);
	};

	const setTheme = (newTheme) => {
		if (newTheme === "light" || newTheme === "dark") {
			setThemeState(newTheme);
			applyThemeToDocument(newTheme, true);
		}
	};

	const value = {
		theme,
		toggleTheme,
		setTheme,
		isDark: theme === "dark",
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

/**
 * Hook to use theme context
 */
export function useTheme() {
	return useContext(ThemeContext);
}
