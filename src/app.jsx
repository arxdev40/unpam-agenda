import { LocationProvider, ErrorBoundary, Router, Route } from "preact-iso";

import { ThemeProvider } from "./context/theme-context.jsx";
import { AgendaProvider } from "./context/agenda-context.jsx";
import { Header } from "./components/common/header.jsx";
import { Footer } from "./components/common/footer.jsx";
import { FloatingActionButton } from "./components/common/floating-action-button.jsx";
import { HomeView } from "./components/views/home-view.jsx";
import { NotFoundView } from "./components/views/not-found-view.jsx";

export function App() {
	return (
		<LocationProvider>
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
									{/* Root / Development & Custom Domain routes */}
									<Route path="/" component={HomeView} />
									<Route
										path="/index.html"
										component={HomeView}
									/>

									{/* GitHub Pages & Subdirectory routes */}
									<Route
										path="/unpam-agenda"
										component={HomeView}
									/>
									<Route
										path="/unpam-agenda/index.html"
										component={HomeView}
									/>
									<Route
										path="/unpam-agenda/dist"
										component={HomeView}
									/>
									<Route
										path="/unpam-agenda/dist/index.html"
										component={HomeView}
									/>

									{/* Fallback 404 for unknown routes */}
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
