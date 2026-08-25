import { useEffect } from "preact/hooks";
import { useAgenda } from "../../context/agenda-context.jsx";
import { exportAllAgendasToIcs } from "../../utils/calendar-export.js";
import {
	X,
	CalendarDays,
	Download,
	ExternalLink,
	Info,
	Sparkles,
} from "lucide-preact";

export function ExportCalendarModal() {
	const {
		isExportModalOpen,
		setIsExportModalOpen,
		rawAgendaList,
		semesterName,
	} = useAgenda();

	useEffect(() => {
		if (isExportModalOpen.value) {
			document.body.classList.add("modal-open");
		} else {
			document.body.classList.remove("modal-open");
		}

		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isExportModalOpen.value) {
				setIsExportModalOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.classList.remove("modal-open");
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isExportModalOpen.value, setIsExportModalOpen]);

	if (!isExportModalOpen.value) return null;

	const handleDownloadAllIcs = () => {
		exportAllAgendasToIcs(rawAgendaList.value, semesterName.value);
	};

	const closeModal = () => {
		setIsExportModalOpen(false);
	};

	const totalCount = rawAgendaList.value.length;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-modal-backdrop"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-export-title"
		>
			{/* Backdrop */}
			<div
				className="fixed inset-0 -z-10"
				onClick={closeModal}
				aria-hidden="true"
			></div>

			{/* Modal Card */}
			<div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-modal-box">
				{/* Top Accent bar */}
				<div className="h-2 w-full bg-gradient-to-r from-sky-500 via-blue-600 to-primary"></div>

				<div className="p-6 sm:p-8 space-y-6">
					{/* Header */}
					<div className="flex items-start justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="p-2.5 rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 shadow-2xs">
								<CalendarDays className="w-5 h-5" />
							</div>
							<div>
								<h3
									id="modal-export-title"
									className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white"
								>
									Ekspor Seluruh Agenda
								</h3>
								<p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
									Sinkronisasi {totalCount} agenda ke kalender
									pribadi Anda
								</p>
							</div>
						</div>

						<button
							type="button"
							onClick={closeModal}
							className="btn btn-ghost btn-circle btn-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
							aria-label="Tutup modal ekspor"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Primary 1-Click Action */}
					<div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
								<Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
								<span>Unduh Berkas Kalender</span>
							</span>
							<span className="badge badge-sm font-bold bg-sky-100 text-sky-950 border border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-700">
								Format .ICS
							</span>
						</div>

						<p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
							Format <strong>.ICS</strong> adalah standar
							universal yang kompatibel langsung dengan{" "}
							<strong>Google Calendar</strong>,{" "}
							<strong>Apple Calendar (iPhone/Mac)</strong>, dan{" "}
							<strong>Microsoft Outlook</strong>.
						</p>

						<button
							type="button"
							onClick={handleDownloadAllIcs}
							className="btn btn-primary w-full gap-2 rounded-xl shadow-xs font-bold"
						>
							<Download className="w-4 h-4" />
							<span>
								Unduh Seluruh Agenda ({totalCount} Agenda)
							</span>
						</button>
					</div>

					{/* Step-by-Step Google Calendar Import Guide */}
					<div className="space-y-3">
						<h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
							<Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
							<span>Cara Impor ke Google Calendar:</span>
						</h4>

						<ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
							<li className="flex items-start gap-2">
								<span className="flex items-center justify-center w-4 h-4 rounded-full bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 font-bold text-[10px] shrink-0 mt-0.5">
									1
								</span>
								<span>
									Klik tombol{" "}
									<strong>Unduh Seluruh Agenda</strong> di
									atas untuk menyimpan file <code>.ics</code>.
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="flex items-center justify-center w-4 h-4 rounded-full bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 font-bold text-[10px] shrink-0 mt-0.5">
									2
								</span>
								<span>
									Buka halaman{" "}
									<a
										href="https://calendar.google.com/calendar/u/0/r/settings/export"
										target="_blank"
										rel="noopener noreferrer"
										className="text-sky-600 dark:text-sky-400 font-bold underline inline-flex items-center gap-0.5"
									>
										Impor &amp; Ekspor Google Calendar
										<ExternalLink className="w-3 h-3" />
									</a>
									.
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="flex items-center justify-center w-4 h-4 rounded-full bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 font-bold text-[10px] shrink-0 mt-0.5">
									3
								</span>
								<span>
									Pilih berkas yang baru diunduh dan klik{" "}
									<strong>Impor</strong>. Seluruh agenda
									langsung tersimpan!
								</span>
							</li>
						</ol>
					</div>

					{/* Modal Close Action Button */}
					<div className="pt-2">
						<button
							type="button"
							onClick={closeModal}
							className="btn btn-neutral btn-block rounded-xl font-bold"
						>
							Tutup
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
