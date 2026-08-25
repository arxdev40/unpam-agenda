import { render } from "preact";
import "./index.css";
import { App } from "./app.jsx";

render(<App />, document.getElementById("app"));

// Register Progressive Web App (PWA) Service Worker with dynamic base url
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		const swPath = `${import.meta.env.BASE_URL || "./"}sw.js`.replace(
			/\/+/g,
			"/",
		);
		navigator.serviceWorker
			.register(swPath)
			.then((registration) => {
				console.log(
					"PWA Service Worker terdaftar:",
					registration.scope,
				);
			})
			.catch((error) => {
				console.warn("PWA Service Worker gagal didaftarkan:", error);
			});
	});
}
