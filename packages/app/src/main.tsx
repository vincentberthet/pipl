import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";

const root = createRoot(document.body);
root.render(
	<StrictMode>
		<App />
	</StrictMode>,
);
