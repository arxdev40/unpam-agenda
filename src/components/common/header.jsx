import { useTheme } from "../../context/theme-context.jsx";
import { useAgenda } from "../../context/agenda-context.jsx";
import { Show } from "./control-flow.jsx";
import { Sun, Moon, Calendar, Clock, GraduationCap } from "lucide-preact";
import { formatFullDate } from "../../utils/date-helpers.js";

export function Header() {
	const { isDark, toggleTheme } = useTheme();
	const { semesterName, currentTime } = useAgenda();

	return (
		<header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors duration-150 shadow-2xs">
			<div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8">
				<div className="flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-4">
					{/* Brand & Academic Year */}
					<div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
						<a
							href={import.meta.env.BASE_URL || "./"}
							className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl p-1"
							aria-label="Kembali ke beranda UNPAM Agenda"
						>
							<div className="relative flex-shrink-0 w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-slate-50 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center transition-transform group-hover:scale-105">
								<img
									src="./icon.png"
									alt="Logo Universitas Pamulang"
									className="w-full h-full object-contain"
									width="48"
									height="48"
									loading="eager"
									decoding="async"
									fetchpriority="high"
								/>
							</div>
							<div className="flex flex-col min-w-0">
								<div className="flex items-center gap-2">
									<h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
										UNPAM Agenda
									</h1>
									<span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-100 text-sky-950 border border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-700">
										<GraduationCap className="w-3.5 h-3.5" />
										{semesterName.value}
									</span>
								</div>

								{/* Mobile Semester Full Text */}
								<div className="flex items-center gap-1 sm:hidden">
									<span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-900 dark:text-sky-300 leading-tight">
										<GraduationCap className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
										<span>{semesterName.value}</span>
									</span>
								</div>

								{/* Desktop Subtitle */}
								<p className="text-xs text-slate-700 dark:text-slate-300 hidden sm:block truncate font-medium">
									Kalender Akademik Universitas Pamulang
								</p>
							</div>
						</a>
					</div>

					{/* Right Side: Current Date & Theme Switcher */}
					<div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
						{/* Live Date display (Desktop / Tablet) */}
						<div className="hidden md:flex flex-col items-end text-right">
							<div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
								<Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
								<span>{formatFullDate(currentTime.value)}</span>
							</div>
							<div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
								<Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
								<span className="font-mono">
									{currentTime.value.format("HH:mm")} WIB
								</span>
							</div>
						</div>

						{/* Theme Toggle Button */}
						<button
							type="button"
							onClick={toggleTheme}
							className="btn btn-circle btn-ghost btn-sm sm:btn-md border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
							aria-label={
								isDark
									? "Ganti ke tema terang"
									: "Ganti ke tema gelap"
							}
							title={isDark ? "Tema Terang" : "Tema Gelap"}
						>
							<Show
								when={isDark}
								fallback={
									<Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800 dark:text-slate-200 transition-transform hover:-rotate-12" />
								}
							>
								<Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform hover:rotate-45" />
							</Show>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
