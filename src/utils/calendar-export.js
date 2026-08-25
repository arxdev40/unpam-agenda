import dayjs from "dayjs";
import { formatDateRange } from "./date-helpers.js";

/**
 * Export all agendas (or a list of agendas) into a single standard iCalendar (.ics) file
 * Compatible with Google Calendar, Apple Calendar, Microsoft Outlook, etc.
 * @param {Array<{ event: string, dates: string[], category: string }>} agendaList
 * @param {string} semesterName
 */
export function exportAllAgendasToIcs(
	agendaList = [],
	semesterName = "Semester Ganjil 2026/2027",
) {
	if (!agendaList || agendaList.length === 0) return;

	try {
		const nowFormatted = dayjs().format("YYYYMMDDTHHmmss[Z]");

		const lines = [
			"BEGIN:VCALENDAR",
			"VERSION:2.0",
			"PRODID:-//Universitas Pamulang//UNPAM Agenda//ID",
			"CALSCALE:GREGORIAN",
			`X-WR-CALNAME:UNPAM Agenda - ${semesterName}`,
			`X-WR-CALDESC:Kalender Akademik Universitas Pamulang ${semesterName}`,
			"X-WR-TIMEZONE:Asia/Jakarta",
		];

		agendaList.forEach((agenda, index) => {
			const startDate = dayjs(agenda.dates[0]).format("YYYYMMDD");
			const endDate = dayjs(agenda.dates[1] || agenda.dates[0])
				.add(1, "day")
				.format("YYYYMMDD");
			const uid = `unpam-agenda-${index}-${agenda.dates[0]}-${Date.now()}@unpam.ac.id`;
			const cleanSummary = agenda.event
				.replace(/,/g, "\\,")
				.replace(/;/g, "\\;");
			const cleanDescription = `Kategori: ${agenda.category} | Jadwal: ${formatDateRange(agenda.dates)} | Kalender Akademik UNPAM ${semesterName}`;

			lines.push(
				"BEGIN:VEVENT",
				`UID:${uid}`,
				`DTSTAMP:${nowFormatted}`,
				`DTSTART;VALUE=DATE:${startDate}`,
				`DTEND;VALUE=DATE:${endDate}`,
				`SUMMARY:[UNPAM] ${cleanSummary}`,
				`DESCRIPTION:${cleanDescription}`,
				"LOCATION:Universitas Pamulang",
				"STATUS:CONFIRMED",
				"END:VEVENT",
			);
		});

		lines.push("END:VCALENDAR");

		const icsContent = lines.join("\r\n");
		const blob = new Blob([icsContent], {
			type: "text/calendar;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute(
			"download",
			`kalender-akademik-unpam-${semesterName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Gagal mengekspor seluruh kalender:", error);
	}
}
