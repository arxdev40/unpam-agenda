import { useState, useEffect } from "preact/hooks";
import { ChevronUp } from "lucide-preact";

export function FloatingActionButton() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 280) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility, { passive: true });
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (!isVisible) return null;

	return (
		<div className="fixed bottom-6 right-6 z-30 fab-container transition-all duration-200 transform translate-y-0 opacity-100">
			<button
				type="button"
				onClick={scrollToTop}
				className="btn btn-circle btn-primary w-12 h-12 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
				aria-label="Gulir halaman kembali ke atas"
				title="Kembali ke atas"
			>
				<ChevronUp className="w-5 h-5 text-white" />
			</button>
		</div>
	);
}
