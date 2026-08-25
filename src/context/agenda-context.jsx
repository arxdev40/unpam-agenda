import { createContext } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { signal, computed, effect } from "@preact/signals";
import axios from "redaxios";
import initialCalendarData from "../data/kalender-akademik.json";
import {
	getEventStatus,
	getEventTimeInfo,
	formatDateRange,
	getEventDurationDays,
	getCategoryConfig,
	normalizeCategory,
	dayjs,
} from "../utils/date-helpers.js";

const BOOKMARKS_STORAGE_KEY = "UNPAM_AGENDA_BOOKMARKS";

/**
 * Generate a deterministic ID for an agenda
 * @param {{ event: string, dates: string[] }} agenda
 * @returns {string}
 */
export function getAgendaId(agenda) {
	if (!agenda) return "";
	return `${agenda.event}_${agenda.dates?.join("_")}`;
}

// 1. Reactive Core Signals
export const agendaListSignal = signal(initialCalendarData?.agenda || []);
export const semesterNameSignal = signal(
	initialCalendarData?.semester || "Semester Ganjil 2026/2027",
);
export const isLoadingSignal = signal(false);
export const errorMessageSignal = signal(null);
export const searchQuerySignal = signal("");
export const debouncedSearchSignal = signal("");
export const selectedCategorySignal = signal("Semua");
export const onlyBookmarkedSignal = signal(false);
export const activeModalAgendaSignal = signal(null);
export const isExportModalOpenSignal = signal(false);
export const currentTimeSignal = signal(dayjs());

// Initial Bookmarks retrieval
function getInitialBookmarks() {
	try {
		const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed)) return parsed;
		}
	} catch (error) {
		console.warn("Gagal membaca bookmark:", error);
	}
	return [];
}

export const bookmarkedIdsSignal = signal(getInitialBookmarks());
export const bookmarkedCountSignal = computed(
	() => bookmarkedIdsSignal.value.length,
);

// Synchronize Bookmarks to localStorage automatically with signal effect
if (typeof window !== "undefined") {
	effect(() => {
		try {
			localStorage.setItem(
				BOOKMARKS_STORAGE_KEY,
				JSON.stringify(bookmarkedIdsSignal.value),
			);
		} catch (error) {
			console.warn("Gagal menyimpan bookmark:", error);
		}
	});
}

// 2. Computed Reactive Signals (Fine-Grained Derivations)
export const processedAgendasSignal = computed(() => {
	const rawList = agendaListSignal.value;
	const current = currentTimeSignal.value;

	return rawList.map((item) => {
		const id = getAgendaId(item);
		const normalizedCategory = normalizeCategory(item.category);
		const status = getEventStatus(item.dates, current);
		const timeInfo = getEventTimeInfo(item.dates, current);
		const categoryConfig = getCategoryConfig(item.category);
		const formattedDate = formatDateRange(item.dates);
		const durationText = getEventDurationDays(item.dates);

		return {
			...item,
			id,
			normalizedCategory,
			status,
			timeInfo,
			categoryConfig,
			formattedDate,
			durationText,
		};
	});
});

export const categoryCountsSignal = computed(() => {
	const all = processedAgendasSignal.value;
	const counts = { Semua: all.length };
	for (const item of all) {
		counts[item.normalizedCategory] =
			(counts[item.normalizedCategory] || 0) + 1;
	}
	return counts;
});

export const filteredAgendasSignal = computed(() => {
	const all = processedAgendasSignal.value;
	const selected = selectedCategorySignal.value;
	const search = debouncedSearchSignal.value;
	const onlyFav = onlyBookmarkedSignal.value;
	const favIds = bookmarkedIdsSignal.value;

	return all.filter((item) => {
		if (onlyFav && !favIds.includes(item.id)) {
			return false;
		}

		const categoryMatches =
			selected === "Semua" || item.normalizedCategory === selected;
		if (!categoryMatches) return false;

		if (!search) return true;
		const eventMatches = item.event.toLowerCase().includes(search);
		const catMatches = item.normalizedCategory
			.toLowerCase()
			.includes(search);
		return eventMatches || catMatches;
	});
});

export const activeAgendasSignal = computed(() => {
	return filteredAgendasSignal.value
		.filter((item) => item.status === "active")
		.sort((a, b) =>
			(a.dates[1] || a.dates[0]).localeCompare(b.dates[1] || b.dates[0]),
		);
});

export const upcomingAgendasSignal = computed(() => {
	return filteredAgendasSignal.value
		.filter((item) => item.status === "upcoming")
		.sort((a, b) => a.dates[0].localeCompare(b.dates[0]));
});

export const pastAgendasSignal = computed(() => {
	return filteredAgendasSignal.value
		.filter((item) => item.status === "past")
		.sort((a, b) =>
			(b.dates[1] || b.dates[0]).localeCompare(a.dates[1] || a.dates[0]),
		);
});

export const overallMetricsSignal = computed(() => {
	const all = processedAgendasSignal.value;
	let active = 0;
	let upcoming = 0;
	let past = 0;

	for (const item of all) {
		if (item.status === "active") active++;
		else if (item.status === "upcoming") upcoming++;
		else past++;
	}

	return {
		total: all.length,
		active,
		upcoming,
		past,
		bookmarked: bookmarkedIdsSignal.value.length,
	};
});

// Context setup
const AgendaContext = createContext(null);

export function AgendaProvider({ children }) {
	// Search input debouncing
	useEffect(() => {
		const timer = setTimeout(() => {
			debouncedSearchSignal.value = searchQuerySignal.value
				.trim()
				.toLowerCase();
		}, 250);
		return () => clearTimeout(timer);
	}, [searchQuerySignal.value]);

	// Live clock timer update (idle friendly)
	useEffect(() => {
		const timer = setInterval(() => {
			currentTimeSignal.value = dayjs();
		}, 60000);
		return () => clearInterval(timer);
	}, []);

	// Background revalidation
	const fetchCalendarData = async () => {
		try {
			const jsonUrl =
				`${import.meta.env.BASE_URL || "./"}kalender-akademik.json`.replace(
					/\/+/g,
					"/",
				);
			const response = await axios.get(jsonUrl);
			if (response.data && response.data.agenda) {
				if (
					response.data.agenda.length !==
						agendaListSignal.value.length ||
					response.data.semester !== semesterNameSignal.value
				) {
					agendaListSignal.value = response.data.agenda;
					if (response.data.semester) {
						semesterNameSignal.value = response.data.semester;
					}
				}
				errorMessageSignal.value = null;
			}
		} catch (error) {
			if (agendaListSignal.value.length === 0) {
				errorMessageSignal.value =
					"Tidak dapat memuat data kalender akademik.";
			}
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined" && "requestIdleCallback" in window) {
			window.requestIdleCallback(() => fetchCalendarData());
		} else {
			setTimeout(fetchCalendarData, 1000);
		}
	}, []);

	// Toggle bookmark helper
	const toggleBookmark = (agenda) => {
		if (!agenda) return;
		const id = agenda.id || getAgendaId(agenda);
		const currentList = bookmarkedIdsSignal.value;
		if (currentList.includes(id)) {
			bookmarkedIdsSignal.value = currentList.filter(
				(item) => item !== id,
			);
		} else {
			bookmarkedIdsSignal.value = [...currentList, id];
		}
	};

	const isBookmarked = (agenda) => {
		if (!agenda) return false;
		const id = agenda.id || getAgendaId(agenda);
		return bookmarkedIdsSignal.value.includes(id);
	};

	const value = {
		// Signals for direct reactive JSX binding
		agendaList: processedAgendasSignal,
		rawAgendaList: agendaListSignal,
		semesterName: semesterNameSignal,
		isLoading: isLoadingSignal,
		errorMessage: errorMessageSignal,
		searchQuery: searchQuerySignal,
		debouncedSearch: debouncedSearchSignal,
		selectedCategory: selectedCategorySignal,
		onlyBookmarked: onlyBookmarkedSignal,
		bookmarkedIds: bookmarkedIdsSignal,
		activeModalAgenda: activeModalAgendaSignal,
		isExportModalOpen: isExportModalOpenSignal,
		currentTime: currentTimeSignal,
		categoryCounts: categoryCountsSignal,
		filteredAgendas: filteredAgendasSignal,
		activeAgendas: activeAgendasSignal,
		upcomingAgendas: upcomingAgendasSignal,
		pastAgendas: pastAgendasSignal,
		overallMetrics: overallMetricsSignal,

		// Setters and action handlers
		setSearchQuery: (val) => {
			searchQuerySignal.value = val;
		},
		setSelectedCategory: (cat) => {
			selectedCategorySignal.value = cat;
		},
		setOnlyBookmarked: (val) => {
			onlyBookmarkedSignal.value = val;
		},
		setActiveModalAgenda: (agenda) => {
			activeModalAgendaSignal.value = agenda;
		},
		setIsExportModalOpen: (isOpen) => {
			isExportModalOpenSignal.value = isOpen;
		},
		toggleBookmark,
		isBookmarked,
		refetch: fetchCalendarData,
	};

	return (
		<AgendaContext.Provider value={value}>
			{children}
		</AgendaContext.Provider>
	);
}

export function useAgenda() {
	const context = useContext(AgendaContext);
	if (!context) {
		throw new Error("useAgenda must be used within an AgendaProvider");
	}
	return context;
}
