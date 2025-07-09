import { createHashRouter, RouterProvider } from "react-router";
import { Layout } from "./Layout.js";
import { AnalyticsPage } from "./pages/analytics/index.js";
import { GridsPage } from "./pages/grids/index.js";
import { HomePage } from "./pages/home/index.js";

const router = createHashRouter([
	{
		Component: Layout,
		children: [
			{
				path: "/",
				Component: HomePage,
			},
			{
				path: "/analytics",
				Component: AnalyticsPage,
			},
			{
				path: "/grids",
				Component: GridsPage,
			},
		],
	},
]);

export function App() {
	return <RouterProvider router={router} />;
}
