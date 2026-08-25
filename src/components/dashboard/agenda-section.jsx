import { useState } from "preact/hooks";
import { AgendaCard } from "./agenda-card.jsx";
import { Show, For } from "../common/control-flow.jsx";
import {
	PlayCircle,
	CalendarClock,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
} from "lucide-preact";

/**
 * AgendaSection Component
 * @param {{
 *   id: string,
 *   title: string,
 *   description?: string,
 *   agendas: Array<{ id?: string, dates: string[], event: string, category: string }>,
 *   variant: 'active' | 'upcoming' | 'past',
 *   collapsible?: boolean,
 *   defaultOpen?: boolean
 * }} props
 */
export function AgendaSection({
	id,
	title,
	description,
	agendas = [],
	variant = "upcoming",
	collapsible = false,
	defaultOpen = true,
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const getIcon = () => {
		switch (variant) {
			case "active":
				return (
					<PlayCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
				);
			case "upcoming":
				return (
					<CalendarClock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
				);
			case "past":
				return (
					<CheckCircle2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
				);
			default:
				return null;
		}
	};

	const getBadgeClass = () => {
		switch (variant) {
			case "active":
				return "bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700";
			case "upcoming":
				return "bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-700";
			case "past":
				return "bg-slate-200 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700";
			default:
				return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200";
		}
	};

	return (
		<section
			id={id}
			className="scroll-mt-24 space-y-4 pt-4"
			aria-labelledby={`${id}-heading`}
		>
			{/* Section Header */}
			<div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
						{getIcon()}
					</div>
					<div>
						<div className="flex items-center gap-2.5">
							<h2
								id={`${id}-heading`}
								className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white"
							>
								{title}
							</h2>
							<span
								className={`inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold rounded-full border ${getBadgeClass()}`}
							>
								{agendas.length}
							</span>
						</div>
						<Show when={description}>
							<p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
								{description}
							</p>
						</Show>
					</div>
				</div>

				{/* Collapsible toggle button */}
				<Show when={collapsible && agendas.length > 0}>
					<button
						type="button"
						onClick={() => setIsOpen(!isOpen)}
						className="btn btn-ghost btn-sm gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white font-bold"
						aria-expanded={isOpen}
						aria-label={
							isOpen
								? `Tutup seksi ${title}`
								: `Buka seksi ${title}`
						}
					>
						<span>{isOpen ? "Sembunyikan" : "Tampilkan"}</span>
						<Show
							when={isOpen}
							fallback={<ChevronDown className="w-4 h-4" />}
						>
							<ChevronUp className="w-4 h-4" />
						</Show>
					</button>
				</Show>
			</div>

			{/* Section Cards Grid */}
			<Show when={isOpen}>
				<Show
					when={agendas.length > 0}
					fallback={
						<div className="p-8 text-center rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold">
							Tidak ada agenda untuk kategori ini pada seksi{" "}
							{title.toLowerCase()}.
						</div>
					}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
						<For each={agendas}>
							{(item, index) => (
								<AgendaCard
									key={item.id || `${item.event}-${index}`}
									agenda={item}
									variant={variant}
								/>
							)}
						</For>
					</div>
				</Show>
			</Show>
		</section>
	);
}
