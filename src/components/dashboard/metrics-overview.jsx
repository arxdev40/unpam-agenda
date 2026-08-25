import { useAgenda } from "../../context/agenda-context.jsx";
import { Show, For } from "../common/control-flow.jsx";
import { CalendarDays, PlayCircle, Clock, CheckCircle2 } from "lucide-preact";

export function MetricsOverview() {
	const { overallMetrics } = useAgenda();
	const metrics = overallMetrics.value;

	const scrollToSection = (id) => {
		const el = document.getElementById(id);
		if (el) {
			const yOffset = -90;
			const y =
				el.getBoundingClientRect().top + window.pageYOffset + yOffset;
			window.scrollTo({ top: y, behavior: "smooth" });
		}
	};

	const cards = [
		{
			id: "all",
			label: "Total Agenda",
			count: metrics.total,
			icon: CalendarDays,
			iconClass:
				"bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300 dark:border-sky-700",
			targetId: null,
		},
		{
			id: "active",
			label: "Sedang Berlangsung",
			count: metrics.active,
			icon: PlayCircle,
			iconClass:
				"bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
			targetId: "section-active",
			isLive: metrics.active > 0,
		},
		{
			id: "upcoming",
			label: "Akan Datang",
			count: metrics.upcoming,
			icon: Clock,
			iconClass:
				"bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-700",
			targetId: "section-upcoming",
		},
		{
			id: "past",
			label: "Telah Selesai",
			count: metrics.past,
			icon: CheckCircle2,
			iconClass:
				"bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700",
			targetId: "section-past",
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
			<For each={cards}>
				{(card) => {
					const IconComponent = card.icon;
					const isClickable = !!card.targetId;

					return (
						<div
							key={card.id}
							onClick={() =>
								card.targetId && scrollToSection(card.targetId)
							}
							className={`relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-base-100 shadow-xs transition-all duration-150 ${
								isClickable
									? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-sky-500"
									: ""
							}`}
							role={isClickable ? "button" : "region"}
							tabIndex={isClickable ? 0 : undefined}
							onKeyDown={(e) => {
								if (
									isClickable &&
									(e.key === "Enter" || e.key === " ")
								) {
									e.preventDefault();
									scrollToSection(card.targetId);
								}
							}}
							aria-label={`${card.label}: ${card.count} agenda`}
						>
							<div className="flex items-center justify-between gap-2">
								<span className="text-xs font-bold text-slate-800 dark:text-slate-200">
									{card.label}
								</span>
								<div
									className={`p-1.5 rounded-lg border ${card.iconClass}`}
								>
									<IconComponent className="w-4 h-4" />
								</div>
							</div>

							<div className="mt-3 flex items-baseline justify-between">
								<span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
									{card.count}
								</span>

								<Show when={card.isLive}>
									<span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-400 dark:border-emerald-700">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
										AKTIF
									</span>
								</Show>
							</div>
						</div>
					);
				}}
			</For>
		</div>
	);
}
