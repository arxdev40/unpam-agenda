import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";

dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.locale("id");

export { dayjs };

export const CATEGORY_OPTIONS = [
	"Semua",
	"PMB",
	"Pembayaran & Registrasi",
	"Awal Perkuliahan",
	"UTS/UAS",
	"Tugas Dosen",
	"Hari Libur",
	"Umum",
];

/**
 * Normalize and match categories cleanly
 * @param {string} rawCategory
 * @returns {string}
 */
export function normalizeCategory(rawCategory) {
	if (!rawCategory) return "Umum";
	const cat = rawCategory.trim();

	if (cat.includes("PMB")) return "PMB";
	if (
		cat.includes("Pembayaran") ||
		cat.includes("Registrasi") ||
		cat.includes("KRS")
	) {
		return "Pembayaran & Registrasi";
	}
	if (cat.includes("Awal Perkuliahan") || cat.includes("Perkuliahan")) {
		return "Awal Perkuliahan";
	}
	if (cat.includes("UTS") || cat.includes("UAS") || cat.includes("Ujian")) {
		return "UTS/UAS";
	}
	if (cat.includes("Tugas Dosen") || cat.includes("Dosen")) {
		return "Tugas Dosen";
	}
	if (cat.includes("Hari Libur") || cat.includes("Libur")) {
		return "Hari Libur";
	}
	return "Umum";
}

/**
 * Format date range into Indonesian localized string
 * @param {string[]} dates
 * @returns {string}
 */
export function formatDateRange(dates) {
	if (!dates || dates.length === 0) return "Tanggal belum ditentukan";

	const start = dayjs(dates[0]);
	if (dates.length === 1 || !dates[1] || dates[0] === dates[1]) {
		return start.format("D MMMM YYYY");
	}

	const end = dayjs(dates[1]);
	if (start.isSame(end, "month") && start.isSame(end, "year")) {
		return `${start.format("D")} - ${end.format("D MMMM YYYY")}`;
	}

	if (start.isSame(end, "year")) {
		return `${start.format("D MMMM")} - ${end.format("D MMMM YYYY")}`;
	}

	return `${start.format("D MMMM YYYY")} - ${end.format("D MMMM YYYY")}`;
}

/**
 * Calculate exact event duration in days (e.g. "1 Hari", "6 Hari", "20 Hari")
 * @param {string[]} dates
 * @returns {string}
 */
export function getEventDurationDays(dates) {
	if (!dates || dates.length === 0) return "1 Hari";
	const start = dayjs(dates[0]).startOf("day");
	const end = dates[1] ? dayjs(dates[1]).startOf("day") : start;
	const diffDays = end.diff(start, "day") + 1;
	return `${Math.max(1, diffDays)} Hari`;
}

/**
 * Format single date into full day name and date
 * @param {string|Date} date
 * @returns {string}
 */
export function formatFullDate(date) {
	return dayjs(date).format("dddd, D MMMM YYYY");
}

/**
 * Determine if event is 'active', 'upcoming', or 'past'
 * @param {string[]} dates
 * @param {Date|string} [referenceDate]
 * @returns {'active' | 'upcoming' | 'past'}
 */
export function getEventStatus(dates, referenceDate) {
	if (!dates || dates.length === 0) return "past";
	const today = referenceDate
		? dayjs(referenceDate).startOf("day")
		: dayjs().startOf("day");
	const start = dayjs(dates[0]).startOf("day");
	const end = dates[1] ? dayjs(dates[1]).endOf("day") : start.endOf("day");

	if (today.isSameOrAfter(start) && today.isSameOrBefore(end)) {
		return "active";
	}

	if (start.isAfter(today)) {
		return "upcoming";
	}

	return "past";
}

/**
 * Format days into Month & Day human text (e.g. "1 bulan 15 hari" or "20 hari")
 * @param {number} totalDays
 * @returns {string}
 */
function formatMonthAndDays(totalDays) {
	if (totalDays < 30) {
		return `${totalDays} hari`;
	}
	const months = Math.floor(totalDays / 30);
	const remainingDays = totalDays % 30;
	if (remainingDays === 0) {
		return `${months} bulan`;
	}
	return `${months} bulan ${remainingDays} hari`;
}

/**
 * Calculate countdown and human readable timing with Month & Day support
 * @param {string[]} dates
 * @param {Date|string} [referenceDate]
 * @returns {{ text: string, days: number, isUrgent: boolean, percent: number }}
 */
export function getEventTimeInfo(dates, referenceDate) {
	if (!dates || dates.length === 0) {
		return {
			text: "Tanggal tidak valid",
			days: 0,
			isUrgent: false,
			percent: 100,
		};
	}

	const today = referenceDate
		? dayjs(referenceDate).startOf("day")
		: dayjs().startOf("day");
	const start = dayjs(dates[0]).startOf("day");
	const end = dates[1] ? dayjs(dates[1]).endOf("day") : start.endOf("day");

	// Active State
	if (today.isSameOrAfter(start) && today.isSameOrBefore(end)) {
		const totalDays = end.diff(start, "day") + 1;
		const daysElapsed = today.diff(start, "day") + 1;
		const daysLeft = Math.max(0, end.diff(today, "day"));
		const percent = Math.min(
			100,
			Math.round((daysElapsed / totalDays) * 100),
		);

		if (daysLeft === 0) {
			return {
				text: "Berakhir hari ini",
				days: 0,
				isUrgent: true,
				percent,
			};
		}
		if (daysLeft === 1) {
			return {
				text: "Berakhir besok",
				days: 1,
				isUrgent: true,
				percent,
			};
		}
		const formattedLeft = formatMonthAndDays(daysLeft);
		return {
			text: `Berakhir dalam ${formattedLeft} lagi`,
			days: daysLeft,
			isUrgent: daysLeft <= 3,
			percent,
		};
	}

	// Upcoming State
	if (start.isAfter(today)) {
		const daysUntil = start.diff(today, "day");
		if (daysUntil === 1) {
			return {
				text: "Dimulai besok",
				days: 1,
				isUrgent: true,
				percent: 0,
			};
		}
		const formattedUntil = formatMonthAndDays(daysUntil);
		return {
			text: `Dalam ${formattedUntil} lagi`,
			days: daysUntil,
			isUrgent: daysUntil <= 7,
			percent: 0,
		};
	}

	// Past State
	const diffDays = today.diff(end, "day");
	if (diffDays === 0) {
		return {
			text: "Selesai hari ini",
			days: 0,
			isUrgent: false,
			percent: 100,
		};
	}
	if (diffDays === 1) {
		return {
			text: "Selesai kemarin",
			days: 1,
			isUrgent: false,
			percent: 100,
		};
	}

	const formattedElapsed = formatMonthAndDays(diffDays);
	return {
		text: `Selesai ${formattedElapsed} lalu`,
		days: diffDays,
		isUrgent: false,
		percent: 100,
	};
}

/**
 * Category styling metadata with WCAG AAA high-contrast colors in both themes
 * @param {string} category
 */
export function getCategoryConfig(category) {
	const normalized = normalizeCategory(category);
	switch (normalized) {
		case "PMB":
			return {
				label: "PMB",
				badgeClass:
					"bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700",
				bgLight:
					"bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700",
				hoverBorder:
					"hover:border-emerald-500 dark:hover:border-emerald-400",
				hoverText:
					"group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
				activeRing:
					"ring-emerald-500 border-emerald-400 dark:border-emerald-500",
				accentGradient: "from-emerald-600 via-teal-600 to-emerald-600",
				colorName: "emerald",
			};
		case "Pembayaran & Registrasi":
			return {
				label: "Pembayaran & Registrasi",
				badgeClass:
					"bg-blue-100 text-blue-950 border-blue-400 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-700",
				bgLight:
					"bg-blue-100 text-blue-950 border-blue-400 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-700",
				hoverBorder: "hover:border-blue-500 dark:hover:border-blue-400",
				hoverText:
					"group-hover:text-blue-700 dark:group-hover:text-blue-300",
				activeRing:
					"ring-blue-500 border-blue-400 dark:border-blue-500",
				accentGradient: "from-blue-600 via-sky-600 to-blue-600",
				colorName: "blue",
			};
		case "Awal Perkuliahan":
			return {
				label: "Awal Perkuliahan",
				badgeClass:
					"bg-orange-100 text-orange-950 border-orange-400 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-700",
				bgLight:
					"bg-orange-100 text-orange-950 border-orange-400 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-700",
				hoverBorder:
					"hover:border-orange-500 dark:hover:border-orange-400",
				hoverText:
					"group-hover:text-orange-700 dark:group-hover:text-orange-300",
				activeRing:
					"ring-orange-500 border-orange-400 dark:border-orange-500",
				accentGradient: "from-orange-600 via-amber-600 to-orange-600",
				colorName: "orange",
			};
		case "UTS/UAS":
			return {
				label: "UTS/UAS",
				badgeClass:
					"bg-yellow-100 text-yellow-950 border-yellow-400 dark:bg-yellow-950/80 dark:text-yellow-200 dark:border-yellow-700",
				bgLight:
					"bg-yellow-100 text-yellow-950 border-yellow-400 dark:bg-yellow-950/80 dark:text-yellow-200 dark:border-yellow-700",
				hoverBorder:
					"hover:border-yellow-500 dark:hover:border-yellow-400",
				hoverText:
					"group-hover:text-yellow-900 dark:group-hover:text-yellow-300",
				activeRing:
					"ring-yellow-500 border-yellow-400 dark:border-yellow-500",
				accentGradient: "from-yellow-500 via-amber-500 to-yellow-500",
				colorName: "yellow",
			};
		case "Tugas Dosen":
			return {
				label: "Tugas Dosen",
				badgeClass:
					"bg-fuchsia-100 text-fuchsia-950 border-fuchsia-400 dark:bg-fuchsia-950/80 dark:text-fuchsia-200 dark:border-fuchsia-700",
				bgLight:
					"bg-fuchsia-100 text-fuchsia-950 border-fuchsia-400 dark:bg-fuchsia-950/80 dark:text-fuchsia-200 dark:border-fuchsia-700",
				hoverBorder:
					"hover:border-fuchsia-500 dark:hover:border-fuchsia-400",
				hoverText:
					"group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-300",
				activeRing:
					"ring-fuchsia-500 border-fuchsia-400 dark:border-fuchsia-500",
				accentGradient: "from-fuchsia-600 via-pink-600 to-fuchsia-600",
				colorName: "fuchsia",
			};
		case "Hari Libur":
			return {
				label: "Hari Libur",
				badgeClass:
					"bg-rose-100 text-rose-950 border-rose-400 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700",
				bgLight:
					"bg-rose-100 text-rose-950 border-rose-400 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700",
				hoverBorder: "hover:border-rose-500 dark:hover:border-rose-400",
				hoverText:
					"group-hover:text-rose-700 dark:group-hover:text-rose-300",
				activeRing:
					"ring-rose-500 border-rose-400 dark:border-rose-500",
				accentGradient: "from-rose-600 via-red-600 to-rose-600",
				colorName: "rose",
			};
		case "Umum":
		default:
			return {
				label: "Umum",
				badgeClass:
					"bg-slate-200 text-slate-950 border-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600",
				bgLight:
					"bg-slate-200 text-slate-950 border-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600",
				hoverBorder:
					"hover:border-slate-500 dark:hover:border-slate-400",
				hoverText:
					"group-hover:text-slate-900 dark:group-hover:text-slate-200",
				activeRing:
					"ring-slate-500 border-slate-400 dark:border-slate-500",
				accentGradient: "from-slate-600 via-slate-500 to-slate-600",
				colorName: "slate",
			};
	}
}
