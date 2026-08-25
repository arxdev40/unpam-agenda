import { useAgenda } from "../../context/agenda-context.jsx";
import {
	formatDateRange,
	getEventTimeInfo,
	getCategoryConfig,
	getEventDurationDays,
} from "../../utils/date-helpers.js";
import {
	Calendar,
	Clock,
	CheckCircle2,
	ChevronRight,
	Bookmark,
} from "lucide-preact";

/**
 * Agenda Card Component
 * @param {{ agenda: { id?: string, dates: string[], event: string, category: string, timeInfo?: any, categoryConfig?: any, formattedDate?: string, durationText?: string }, variant: 'active' | 'upcoming' | 'past' }} props
 */
export function AgendaCard({ agenda, variant = "upcoming" }) {
	const { setActiveModalAgenda, toggleBookmark, isBookmarked } = useAgenda();

	// Use pre-computed memoized properties or fallback
	const timeInfo = agenda.timeInfo || getEventTimeInfo(agenda.dates);
	const categoryConfig =
		agenda.categoryConfig || getCategoryConfig(agenda.category);
	const formattedDate = agenda.formattedDate || formatDateRange(agenda.dates);
	const durationText =
		agenda.durationText || getEventDurationDays(agenda.dates);
	const bookmarked = isBookmarked(agenda);

	// Handle clicking card to open modal
	const handleCardClick = () => {
		setActiveModalAgenda(agenda);
	};

	// Handle clicking bookmark without triggering modal
	const handleBookmarkClick = (e) => {
		e.stopPropagation();
		toggleBookmark(agenda);
	};

	// 1. ACTIVE STATE (Sedang Berlangsung)
	if (variant === "active") {
		return (
			<article
				onClick={handleCardClick}
				className={`agenda-card group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-base-100 border ${categoryConfig.activeRing} ring-2 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-950 shadow-md hover:shadow-xl ${categoryConfig.hoverBorder} transition-all duration-150 cursor-pointer overflow-hidden`}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleCardClick();
					}
				}}
				aria-label={`Agenda aktif: ${agenda.event}. ${timeInfo.text}`}
			>
				{/* Top Accent Gradient Bar matching category */}
				<div
					className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${categoryConfig.accentGradient}`}
				></div>

				<div className="space-y-3">
					{/* Header badges & Bookmark Button */}
					<div className="flex items-center justify-between gap-2 flex-wrap">
						<div className="flex items-center gap-1.5 flex-wrap">
							<span
								className={`badge badge-sm font-bold border ${categoryConfig.badgeClass}`}
							>
								{categoryConfig.label}
							</span>

							<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700">
								<span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
								{timeInfo.text}
							</span>
						</div>

						<button
							type="button"
							onClick={handleBookmarkClick}
							className={`btn btn-ghost btn-circle btn-xs transition-colors ${
								bookmarked
									? "text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/60"
									: "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-base-200"
							}`}
							aria-label={
								bookmarked
									? "Hapus dari favorit"
									: "Tandai sebagai favorit"
							}
							title={
								bookmarked
									? "Tersimpan di favorit"
									: "Simpan ke favorit"
							}
						>
							<Bookmark
								className={`w-4 h-4 ${bookmarked ? "fill-amber-500" : ""}`}
							/>
						</button>
					</div>

					{/* Event Title */}
					<h3
						className={`text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 ${categoryConfig.hoverText} transition-colors leading-snug`}
					>
						{agenda.event}
					</h3>

					{/* Date Info (High Contrast Text) */}
					<div className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 font-semibold">
						<Calendar className="w-4 h-4 text-slate-700 dark:text-slate-300 flex-shrink-0" />
						<span>{formattedDate}</span>
					</div>

					{/* Multi-day progress bar */}
					{timeInfo.percent > 0 && (
						<div className="space-y-1 pt-1">
							<div className="flex justify-between text-[11px] text-slate-800 dark:text-slate-200 font-bold">
								<span>Progres Periode</span>
								<span>{timeInfo.percent}%</span>
							</div>
							<div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
								<div
									className="bg-emerald-600 dark:bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
									style={{ width: `${timeInfo.percent}%` }}
								></div>
							</div>
						</div>
					)}
				</div>

				{/* Card Footer Action */}
				<div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
					<span
						className={`font-bold flex items-center gap-1 group-hover:underline ${categoryConfig.hoverText}`}
					>
						<span>Lihat Rincian</span>
						<ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
					</span>
					<span className="text-slate-800 dark:text-slate-300 text-[11px] font-bold">
						{durationText}
					</span>
				</div>
			</article>
		);
	}

	// 2. UPCOMING STATE (Akan Datang)
	if (variant === "upcoming") {
		return (
			<article
				onClick={handleCardClick}
				className={`agenda-card group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-base-100 border border-slate-300 dark:border-slate-700 shadow-xs hover:shadow-md ${categoryConfig.hoverBorder} hover:-translate-y-0.5 transition-all duration-150 cursor-pointer`}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleCardClick();
					}
				}}
				aria-label={`Agenda mendatang: ${agenda.event}. ${timeInfo.text}`}
			>
				<div className="space-y-3">
					{/* Header badges & Bookmark Button */}
					<div className="flex items-center justify-between gap-2 flex-wrap">
						<div className="flex items-center gap-1.5 flex-wrap">
							<span
								className={`badge badge-sm font-bold border ${categoryConfig.badgeClass}`}
							>
								{categoryConfig.label}
							</span>

							<span
								className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${
									timeInfo.isUrgent
										? "bg-amber-100 text-amber-950 border border-amber-400 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700"
										: "bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
								}`}
							>
								<Clock className="w-3 h-3 text-slate-700 dark:text-slate-300" />
								{timeInfo.text}
							</span>
						</div>

						<button
							type="button"
							onClick={handleBookmarkClick}
							className={`btn btn-ghost btn-circle btn-xs transition-colors ${
								bookmarked
									? "text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/60"
									: "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-base-200"
							}`}
							aria-label={
								bookmarked
									? "Hapus dari favorit"
									: "Tandai sebagai favorit"
							}
							title={
								bookmarked
									? "Tersimpan di favorit"
									: "Simpan ke favorit"
							}
						>
							<Bookmark
								className={`w-4 h-4 ${bookmarked ? "fill-amber-500" : ""}`}
							/>
						</button>
					</div>

					{/* Event Title */}
					<h3
						className={`text-base font-bold text-slate-900 dark:text-slate-100 ${categoryConfig.hoverText} transition-colors leading-snug`}
					>
						{agenda.event}
					</h3>

					{/* Date Info (High Contrast Text) */}
					<div className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 font-semibold">
						<Calendar className="w-4 h-4 text-slate-700 dark:text-slate-300 flex-shrink-0" />
						<span>{formattedDate}</span>
					</div>
				</div>

				{/* Card Footer Action */}
				<div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
					<span
						className={`text-slate-800 dark:text-slate-200 ${categoryConfig.hoverText} transition-colors flex items-center gap-1 font-bold`}
					>
						<span>Lihat Rincian</span>
						<ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
					</span>
					<span className="text-slate-800 dark:text-slate-300 text-[11px] font-bold">
						{durationText}
					</span>
				</div>
			</article>
		);
	}

	// 3. PAST / COMPLETED STATE (Telah Selesai - Disabled & Strikethrough style)
	return (
		<article
			onClick={handleCardClick}
			className={`agenda-card group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-base-100/70 border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-base-100 ${categoryConfig.hoverBorder} transition-all duration-150 cursor-pointer shadow-2xs`}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleCardClick();
				}
			}}
			aria-label={`Agenda selesai: ${agenda.event}. ${timeInfo.text}`}
		>
			<div className="space-y-2.5">
				{/* Header badges & Bookmark Button */}
				<div className="flex items-center justify-between gap-2 flex-wrap">
					<div className="flex items-center gap-1.5 flex-wrap">
						<span
							className={`badge badge-sm font-bold border line-through ${categoryConfig.badgeClass}`}
						>
							{categoryConfig.label}
						</span>

						<span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-200 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
							<CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
							{timeInfo.text}
						</span>
					</div>

					<button
						type="button"
						onClick={handleBookmarkClick}
						className={`btn btn-ghost btn-circle btn-xs transition-colors ${
							bookmarked
								? "text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/60"
								: "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-base-200"
						}`}
						aria-label={
							bookmarked
								? "Hapus dari favorit"
								: "Tandai sebagai favorit"
						}
						title={
							bookmarked
								? "Tersimpan di favorit"
								: "Simpan ke favorit"
						}
					>
						<Bookmark
							className={`w-4 h-4 ${bookmarked ? "fill-amber-500" : ""}`}
						/>
					</button>
				</div>

				{/* Event Title (High contrast strike-through text) */}
				<h3 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 line-through leading-snug group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
					{agenda.event}
				</h3>

				{/* Date Info (High Contrast Text) */}
				<div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
					<Calendar className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
					<span>{formattedDate}</span>
				</div>
			</div>

			{/* Card Footer */}
			<div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-800 dark:text-slate-300 font-bold">
				<span>Status: Selesai</span>
				<span
					className={`transition-colors flex items-center gap-0.5 ${categoryConfig.hoverText}`}
				>
					<span>{durationText}</span>
				</span>
			</div>
		</article>
	);
}
