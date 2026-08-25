import { LocationProvider, ErrorBoundary, Router, Route } from "preact-iso";

import { ThemeProvider } from "./context/theme-context.jsx";
import { AgendaProvider } from "./context/agenda-context.jsx";
import { Header } from "./components/common/header.jsx";
import { Footer } from "./components/common/footer.jsx";
import { FloatingActionButton } from "./components/common/floating-action-button.jsx";
import { HomeView } from "./components/views/home-view.jsx";
import { NotFoundView } from "./components/views/not-found-view.jsx";

/**
 * Determine dynamic base router scope for GitHub Pages, XAMPP subdirectory, and Local Dev
 * @returns {string}
 */
function getRouterScope() {
	if (typeof window === "undefined") return "/";
	const pathname = window.location.pathname;
	if (pathname.includes("/unpam-agenda")) {
		return "/unpam-agenda";
	}
	return "/";
}

export function App() {
	const routerScope = getRouterScope();

	return (
		<LocationProvider scope={routerScope}>
			<ThemeProvider>
				<AgendaProvider>
					<div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
						{/* Semantic Header */}
						<Header />

						{/* Routed Main View protected by ErrorBoundary */}
						<div className="flex-1">
							<ErrorBoundary
								onError={(error) =>
									console.error(
										"Unhandled UI error in router:",
										error,
									)
								}
							>
								<Router>
									<Route path="/" component={HomeView} />
									<Route
										path="/index.html"
										component={HomeView}
									/>
									<Route default component={NotFoundView} />
								</Router>
							</ErrorBoundary>
						</div>

						{/* Semantic Footer */}
						<Footer />

						{/* Floating Action Button (Scroll to top) */}
						<FloatingActionButton />
					</div>
				</AgendaProvider>
			</ThemeProvider>
		</LocationProvider>
	);
}
