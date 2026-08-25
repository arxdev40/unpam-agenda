import { SeoHead } from "../common/seo-head.jsx";
import { AlertTriangle, Home } from "lucide-preact";

export function NotFoundView() {
	const homeUrl = import.meta.env.BASE_URL || "./";

	return (
		<>
			<SeoHead
				title="Halaman Tidak Ditemukan - UNPAM Agenda"
				description="Halaman yang Anda tuju tidak ditemukan pada UNPAM Agenda."
			/>
			<main className="mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
				<div className="w-20 h-20 rounded-3xl bg-warning/15 text-warning mx-auto flex items-center justify-center border border-warning/30">
					<AlertTriangle className="w-10 h-10" />
				</div>

				<div className="space-y-2">
					<span className="text-sm font-bold uppercase tracking-wider text-primary">
						Error 404
					</span>
					<h1 className="text-2xl sm:text-3xl font-extrabold text-base-content">
						Halaman Tidak Ditemukan
					</h1>
					<p className="text-sm text-base-content/70 max-w-md mx-auto">
						Maaf, tautan atau halaman yang Anda cari tidak tersedia.
						Silakan kembali ke beranda kalender akademik UNPAM.
					</p>
				</div>

				<div className="pt-4">
					<a
						href={homeUrl}
						className="btn btn-primary rounded-xl gap-2 shadow-sm inline-flex items-center"
					>
						<Home className="w-4 h-4" />
						<span>Kembali ke Beranda</span>
					</a>
				</div>
			</main>
		</>
	);
}
