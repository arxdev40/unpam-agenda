import { useRef, useEffect } from "preact/hooks";
import { useAgenda } from "../../context/agenda-context.jsx";
import { CATEGORY_OPTIONS } from "../../utils/date-helpers.js";
import { Show, For } from "../common/control-flow.jsx";
import { Search, X, Filter, Bookmark, CalendarDays } from "lucide-preact";

export function SearchFilterBar() {
	const {
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		onlyBookmarked,
		setOnlyBookmarked,
		bookmarkedIds,
		categoryCounts,
		setIsExportModalOpen,
	} = useAgenda();

	const searchInputRef = useRef(null);

	// Keyboard shortcut '/' to focus search input, 'Escape' to clear
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (
				e.key === "/" &&
				document.activeElement !== searchInputRef.current &&
				!["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
			) {
				e.preventDefault();
				searchInputRef.current?.focus();
			} else if (
				e.key === "Escape" &&
				document.activeElement === searchInputRef.current
			) {
				setSearchQuery("");
				searchInputRef.current?.blur();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [setSearchQuery]);

	const clearSearch = () => {
		setSearchQuery("");
		searchInputRef.current?.focus();
	};

	const getSelectedCategoryButtonClass = (category) => {
		switch (category) {
			case "PMB":
				return "bg-emerald-600 text-white border-emerald-600 shadow-xs";
			case "Pembayaran & Registrasi":
				return "bg-blue-600 text-white border-blue-600 shadow-xs";
			case "Awal Perkuliahan":
				return "bg-orange-600 text-white border-orange-600 shadow-xs";
			case "UTS/UAS":
				return "bg-yellow-400 text-slate-950 border-yellow-400 shadow-xs font-bold";
			case "Tugas Dosen":
				return "bg-fuchsia-600 text-white border-fuchsia-600 shadow-xs";
			case "Hari Libur":
				return "bg-rose-600 text-white border-rose-600 shadow-xs";
			case "Umum":
				return "bg-slate-700 text-white border-slate-700 dark:bg-slate-200 dark:text-slate-950 shadow-xs";
			case "Semua":
			default:
				return "bg-sky-600 text-white border-sky-600 shadow-xs";
		}
	};

	return (
		<div className="space-y-4 my-6 bg-white dark:bg-base-100 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
			{/* Top Bar: Search Box & Bulk Export Button */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				{/* Search Box Input */}
				<div className="relative flex-1">
					<label
						htmlFor="agenda-search-input"
						className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 focus-within:border-sky-500 dark:focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/25 dark:focus-within:ring-sky-400/25 focus-within:outline-none transition-all shadow-2xs cursor-text"
					>
						<Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 dark:text-slate-400 shrink-0 pointer-events-none" />

						<input
							ref={searchInputRef}
							id="agenda-search-input"
							type="text"
							value={searchQuery.value}
							onInput={(e) =>
								setSearchQuery(e.currentTarget.value)
							}
							placeholder="Cari agenda akademik (misal: UTS, KRS, SPMB, Wisuda)..."
							className="grow bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none border-none p-0 h-auto font-medium"
							role="searchbox"
							aria-label="Cari agenda akademik"
						/>

						<Show
							when={searchQuery.value}
							fallback={
								<kbd className="hidden sm:inline-block kbd kbd-sm text-[10px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 shrink-0">
									/
								</kbd>
							}
						>
							<button
								type="button"
								onClick={clearSearch}
								className="btn btn-ghost btn-circle btn-xs text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white shrink-0"
								aria-label="Hapus teks pencarian"
								title="Hapus pencarian"
							>
								<X className="w-4 h-4" />
							</button>
						</Show>
					</label>
				</div>

				{/* Quick Action: Bulk Export Modal Button */}
				<button
					type="button"
					onClick={() => setIsExportModalOpen(true)}
					className="btn btn-outline border-slate-300 hover:border-sky-500 hover:bg-sky-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl gap-2 text-xs sm:text-sm font-bold shrink-0 shadow-2xs"
					aria-label="Ekspor seluruh kalender akademik"
				>
					<CalendarDays className="w-4 h-4 text-sky-600 dark:text-sky-400" />
					<span>Ekspor Kalender</span>
				</button>
			</div>

			{/* Category Filter & Bookmark Tabs */}
			<div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
				<div className="flex items-center justify-between gap-2 px-1">
					<div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
						<Filter className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
						<span>Filter Kategori:</span>
					</div>

					{/* Favorit / Bookmark filter toggle button */}
					<button
						type="button"
						onClick={() => setOnlyBookmarked(!onlyBookmarked.value)}
						className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 border ${
							onlyBookmarked.value
								? "bg-amber-500 text-white border-amber-500 shadow-2xs scale-102"
								: "bg-slate-50 text-slate-800 border-slate-300 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
						}`}
						aria-pressed={onlyBookmarked.value}
						aria-label="Tampilkan hanya agenda yang dibookmark"
					>
						<Bookmark
							className={`w-3.5 h-3.5 ${onlyBookmarked.value ? "fill-white" : "text-amber-500"}`}
						/>
						<span>Favorit</span>
						<span
							className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
								onlyBookmarked.value
									? "bg-white/20 text-white"
									: "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
							}`}
						>
							{bookmarkedIds.value.length}
						</span>
					</button>
				</div>

				<div
					className="flex flex-wrap gap-2 pt-1"
					role="radiogroup"
					aria-label="Pilih kategori agenda"
				>
					<For each={CATEGORY_OPTIONS}>
						{(category) => {
							const isSelected =
								selectedCategory.value === category &&
								!onlyBookmarked.value;
							const count = categoryCounts.value[category] || 0;
							const activeClass =
								getSelectedCategoryButtonClass(category);

							return (
								<button
									key={category}
									type="button"
									role="radio"
									aria-checked={isSelected}
									onClick={() => {
										setSelectedCategory(category);
										if (onlyBookmarked.value)
											setOnlyBookmarked(false);
									}}
									className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
										isSelected
											? `${activeClass} scale-102`
											: "bg-slate-50 text-slate-900 border-slate-300 hover:border-sky-500 hover:bg-slate-100 dark:bg-base-100 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
									}`}
								>
									<span>{category}</span>
									<span
										className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold transition-colors ${
											isSelected
												? "bg-black/20 text-inherit"
												: "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
										}`}
									>
										{count}
									</span>
								</button>
							);
						}}
					</For>
				</div>
			</div>
		</div>
	);
}
