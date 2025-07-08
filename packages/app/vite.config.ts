import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	root: __dirname,
	cacheDir: `${__dirname}/../../node_modules/.vite/packages/app-service`,
	server: {
		port: 3000,
	},
	plugins: [
		tsConfigPaths(),
		// @ts-ignore
		devtoolsJson(),
	],
});
