import { useEffect } from "preact/hooks";
import { useAgenda } from "../../context/agenda-context.jsx";
import { Show } from "../common/control-flow.jsx";
import {
	formatDateRange,
	getEventStatus,
	getEventTimeInfo,
	getCategoryConfig,
} from "../../utils/date-helpers.js";
import { X, Calendar, Clock, MapPin, Tag } from "lucide-preact";

export function AgendaModal() {
	const { activeModalAgenda, setActiveModalAgenda } = useAgenda();
	const agenda = activeModalAgenda.value;

	// Close on Escape key press & lock background scroll
	useEffect(() => {
		if (activeModalAgenda.value) {
			document.body.classList.add("modal-open");
		} else {
			document.body.classList.remove("modal-open");
		}

		const handleKeyDown = (e) => {
			if (e.key === "Escape" && activeModalAgenda.value) {
				setActiveModalAgenda(null);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.classList.remove("modal-open");
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeModalAgenda.value, setActiveModalAgenda]);

	if (!agenda) return null;

	const status = agenda.status || getEventStatus(agenda.dates);
	const timeInfo = agenda.timeInfo || getEventTimeInfo(agenda.dates);
	const categoryConfig =
		agenda.categoryConfig || getCategoryConfig(agenda.category);
	const formattedDate = agenda.formattedDate || formatDateRange(agenda.dates);

	const closeModal = () => {
		setActiveModalAgenda(null);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-modal-backdrop"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-agenda-title"
		>
			{/* Backdrop click listener */}
			<div
				className="fixed inset-0 -z-10"
				onClick={closeModal}
				aria-hidden="true"
			></div>

			{/* Modal Box Content */}
			<div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-modal-box">
				{/* Top Accent bar based on status */}
				<div
					className={`h-2 w-full ${
						status === "active"
							? "bg-emerald-500"
							: status === "upcoming"
								? "bg-sky-500"
								: "bg-slate-300 dark:bg-slate-700"
					}`}
				></div>

				<div className="p-6 sm:p-8 space-y-6">
					{/* Modal Header: Category badge & Close button */}
					<div className="flex items-start justify-between gap-4">
						<div className="flex items-center gap-2 flex-wrap">
							<span
								className={`badge badge-sm font-bold border ${categoryConfig.badgeClass}`}
							>
								{categoryConfig.label}
							</span>

							<Show when={status === "active"}>
								<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-700">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
									{timeInfo.text}
								</span>
							</Show>

							<Show when={status === "upcoming"}>
								<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-100 text-sky-950 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-700">
									<Clock className="w-3 h-3" />
									{timeInfo.text}
								</span>
							</Show>

							<Show when={status === "past"}>
								<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
									Selesai
								</span>
							</Show>
						</div>

						<button
							type="button"
							onClick={closeModal}
							className="btn btn-ghost btn-circle btn-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
							aria-label="Tutup rincian modal"
						>
							<X className="w-5 h-5" />
						</button>
					</div>

					{/* Event Title */}
					<div>
						<h3
							id="modal-agenda-title"
							className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white"
						>
							{agenda.event}
						</h3>
					</div>

					{/* Info Cards Grid */}
					<div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-sm">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs border border-slate-200 dark:border-slate-700">
								<Calendar className="w-4 h-4" />
							</div>
							<div>
								<p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
									Jadwal Tanggal
								</p>
								<p className="font-bold text-slate-900 dark:text-slate-100">
									{formattedDate}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs border border-slate-200 dark:border-slate-700">
								<MapPin className="w-4 h-4" />
							</div>
							<div>
								<p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
									Lokasi
								</p>
								<p className="font-bold text-slate-900 dark:text-slate-100">
									Universitas Pamulang
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs border border-slate-200 dark:border-slate-700">
								<Tag className="w-4 h-4" />
							</div>
							<div>
								<p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
									Kategori
								</p>
								<p className="font-bold text-slate-900 dark:text-slate-100">
									{categoryConfig.label}
								</p>
							</div>
						</div>
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
