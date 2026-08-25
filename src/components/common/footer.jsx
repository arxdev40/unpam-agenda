import { useAgenda } from "../../context/agenda-context.jsx";
import { ExternalLink, CalendarDays } from "lucide-preact";

export function Footer() {
	const { semesterName } = useAgenda();
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 mt-16 text-slate-800 dark:text-slate-200 transition-colors">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
					{/* Brand column */}
					<div className="space-y-3">
						<div className="flex items-center gap-2.5">
							<div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
								<img
									src="./icon.png"
									alt="Logo UNPAM"
									className="w-full h-full object-contain"
									width="32"
									height="32"
									loading="lazy"
									decoding="async"
								/>
							</div>
							<span className="font-bold text-base text-slate-900 dark:text-white">
								UNPAM Agenda
							</span>
						</div>
						<p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-sm font-medium">
							Platform visualisasi kalender akademik interaktif
							Universitas Pamulang. Membantu mahasiswa dan dosen
							memantau jadwal penting perkuliahan secara cerdas.
						</p>
					</div>

					{/* UNPAM Systems Portal Links */}
					<div className="space-y-3">
						<h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
							Portal & Layanan UNPAM
						</h2>
						<ul className="space-y-2 text-xs">
							<li>
								<a
									href="https://unpam.ac.id"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-slate-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400 transition-colors focus:outline-none focus-visible:underline font-semibold"
								>
									<span>Website Utama UNPAM</span>
									<ExternalLink className="w-3 h-3 opacity-80" />
								</a>
							</li>
							<li>
								<a
									href="https://mentari.unpam.ac.id"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-slate-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400 transition-colors focus:outline-none focus-visible:underline font-semibold"
								>
									<span>E-Learning Mentari UNPAM</span>
									<ExternalLink className="w-3 h-3 opacity-80" />
								</a>
							</li>
							<li>
								<a
									href="https://pmb.unpam.ac.id"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1.5 text-slate-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-400 transition-colors focus:outline-none focus-visible:underline font-semibold"
								>
									<span>Penerimaan Mahasiswa Baru (PMB)</span>
									<ExternalLink className="w-3 h-3 opacity-80" />
								</a>
							</li>
						</ul>
					</div>

					{/* Campus Information */}
					<div className="space-y-3 text-xs">
						<h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
							Kampus Universitas Pamulang
						</h2>
						<p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
							Jl. Surya Kencana No. 1, Pamulang Barat, Kec.
							Pamulang, Kota Tangerang Selatan, Banten 15417
						</p>
						<div className="pt-1 flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
							<CalendarDays className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
							<span>
								{semesterName.value ||
									"Semester Ganjil 2026/2027"}
							</span>
						</div>
					</div>
				</div>

				<div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
					<p>
						© {currentYear} Universitas Pamulang. Hak Cipta
						Dilindungi.
					</p>
					<p className="flex items-center gap-1">
						<span>
							Dibuat dengan dedikasi untuk Civitas Academica UNPAM
						</span>
					</p>
				</div>
			</div>
		</footer>
	);
}
