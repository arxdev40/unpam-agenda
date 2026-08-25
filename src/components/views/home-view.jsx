import { useAgenda } from "../../context/agenda-context.jsx";
import { SeoHead } from "../common/seo-head.jsx";
import { MetricsOverview } from "../dashboard/metrics-overview.jsx";
import { SearchFilterBar } from "../dashboard/search-filter-bar.jsx";
import { AgendaSection } from "../dashboard/agenda-section.jsx";
import { AgendaModal } from "../dashboard/agenda-modal.jsx";
import { ExportCalendarModal } from "../dashboard/export-calendar-modal.jsx";
import { EmptyState } from "../dashboard/empty-state.jsx";
import { Show } from "../common/control-flow.jsx";
import { AlertCircle, RotateCw } from "lucide-preact";

export function HomeView() {
	const {
		isLoading,
		errorMessage,
		refetch,
		activeAgendas,
		upcomingAgendas,
		pastAgendas,
		filteredAgendas,
		semesterName,
	} = useAgenda();

	return (
		<>
			<SeoHead
				title={`UNPAM Agenda - ${semesterName.value}`}
				description={`Jadwal dan Kalender Akademik Interaktif Universitas Pamulang ${semesterName.value}. Pantau UTS, UAS, PMB, Perkuliahan, dan batas waktu akademik.`}
			/>

			<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-[calc(100vh-280px)]">
				{/* Hero Introduction */}
				<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-blue-50/60 dark:from-sky-950/40 dark:via-base-100 dark:to-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xs">
					<div className="relative z-10 max-w-3xl space-y-3">
						<h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
							Agenda &amp; Jadwal Akademik
						</h2>

						<p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
							Selamat datang di{" "}
							<span className="font-bold text-slate-900 dark:text-white">
								UNPAM Agenda
							</span>
							. Pantau seluruh timeline perkuliahan, pembayaran
							biaya kuliah, masa registrasi, pekan ujian, hingga
							hari libur pada{" "}
							<span className="font-bold text-sky-700 dark:text-sky-300">
								{semesterName.value}
							</span>{" "}
							secara interaktif.
						</p>
					</div>

					{/* Background decorative shape */}
					<div
						className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-sky-500/10 dark:bg-sky-400/5 blur-3xl pointer-events-none"
						aria-hidden="true"
					></div>
				</div>

				{/* Declarative Loading State */}
				<Show when={isLoading}>
					<div
						className="space-y-6 my-8"
						aria-busy="true"
						aria-live="polite"
					>
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="h-24 rounded-2xl bg-white dark:bg-base-200 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
							<div className="h-24 rounded-2xl bg-white dark:bg-base-200 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
							<div className="h-24 rounded-2xl bg-white dark:bg-base-200 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
							<div className="h-24 rounded-2xl bg-white dark:bg-base-200 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
						</div>
					</div>
				</Show>

				{/* Declarative Error State */}
				<Show when={errorMessage}>
					{(msg) => (
						<div
							className="my-8 p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center max-w-lg mx-auto space-y-4"
							role="alert"
						>
							<AlertCircle className="w-12 h-12 text-rose-600 dark:text-rose-400 mx-auto" />
							<div className="space-y-1">
								<h3 className="text-base font-bold text-slate-900 dark:text-white">
									Gagal Memuat Data
								</h3>
								<p className="text-xs text-slate-700 dark:text-slate-200">
									{msg}
								</p>
							</div>
							<button
								type="button"
								onClick={refetch}
								className="btn btn-error btn-sm rounded-xl gap-2 text-white font-bold"
							>
								<RotateCw className="w-4 h-4" />
								<span>Coba Lagi</span>
							</button>
						</div>
					)}
				</Show>

				{/* Main Content Dashboard */}
				<Show when={!isLoading.value && !errorMessage.value}>
					{/* Key Metrics Overview */}
					<MetricsOverview />

					{/* Search & Filter Controls */}
					<SearchFilterBar />

					{/* If No Agendas match search/filter */}
					<Show
						when={filteredAgendas.value.length > 0}
						fallback={<EmptyState />}
					>
						<div className="space-y-10 my-8">
							{/* 1. Active Agendas (Sedang Berlangsung) */}
							<Show when={activeAgendas.value.length > 0}>
								<AgendaSection
									id="section-active"
									title="Agenda Sedang Berlangsung"
									description="Agenda akademik yang saat ini sedang aktif dan berjalan"
									agendas={activeAgendas.value}
									variant="active"
								/>
							</Show>

							{/* 2. Upcoming Agendas (Akan Datang) */}
							<Show when={upcomingAgendas.value.length > 0}>
								<AgendaSection
									id="section-upcoming"
									title="Agenda Akan Datang"
									description="Jadwal akademik mendatang yang terstruktur sesuai timeline semester"
									agendas={upcomingAgendas.value}
									variant="upcoming"
								/>
							</Show>

							{/* 3. Past Agendas (Telah Selesai) */}
							<Show when={pastAgendas.value.length > 0}>
								<AgendaSection
									id="section-past"
									title="Agenda Telah Terlewat / Selesai"
									description="Riwayat kegiatan dan batas waktu akademik yang sudah berakhir"
									agendas={pastAgendas.value}
									variant="past"
									collapsible={true}
									defaultOpen={true}
								/>
							</Show>
						</div>
					</Show>
				</Show>
			</main>

			{/* Agenda Detail Modal */}
			<AgendaModal />

			{/* Bulk Export Calendar Modal */}
			<ExportCalendarModal />
		</>
	);
}
