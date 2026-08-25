import { resolve } from "path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	base: "./",
	plugins: [preact(), tailwindcss()],
	build: {
		rollupOptions: {
			input: {
				main: resolve(import.meta.dirname, "index.html"),
				notFound: resolve(import.meta.dirname, "404.html"),
			},
		},
	},
});
