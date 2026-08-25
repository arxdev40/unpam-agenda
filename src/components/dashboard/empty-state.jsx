import { useAgenda } from "../../context/agenda-context.jsx";
import { SearchX, RotateCcw } from "lucide-preact";

export function EmptyState() {
	const {
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
	} = useAgenda();

	const queryText = searchQuery.value;
	const catText = selectedCategory.value;

	const handleReset = () => {
		setSearchQuery("");
		setSelectedCategory("Semua");
	};

	return (
		<div className="py-16 px-4 text-center rounded-3xl bg-white dark:bg-base-100 border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto my-8 space-y-4">
			<div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center border border-slate-200 dark:border-slate-700">
				<SearchX className="w-8 h-8" />
			</div>

			<div className="space-y-1">
				<h3 className="text-lg font-bold text-slate-900 dark:text-white">
					Tidak Ada Agenda Ditemukan
				</h3>
				<p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-xs mx-auto font-medium">
					{queryText
						? `Tidak ada agenda yang cocok dengan kata kunci "${queryText}" pada kategori ${catText}.`
						: `Tidak ada agenda dalam kategori "${catText}".`}
				</p>
			</div>

			<div className="pt-2">
				<button
					type="button"
					onClick={handleReset}
					className="btn btn-primary btn-sm rounded-xl gap-2 shadow-xs font-bold"
				>
					<RotateCcw className="w-4 h-4" />
					<span>Reset Pencarian &amp; Filter</span>
				</button>
			</div>
		</div>
	);
}
