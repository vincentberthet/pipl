import path from "node:path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	root: __dirname,
	cacheDir: `${__dirname}/../../node_modules/.vite/packages/analytics-extract-questions`,
	plugins: [tsConfigPaths()],
	esbuild: {
		minifyWhitespace: true,
	},
	build: {
		minify: true,
		lib: {
			entry: path.resolve(__dirname, "src/main.js"),
			name: "analytics-extract-questions",
			fileName: "main",
			formats: ["es"],
		},
		rollupOptions: {
			external: [
				"aws-lambda",
				"@aws-sdk/client-s3",
				"node:crypto",
				"node:fs/promises",
			],
		},
	},
});
