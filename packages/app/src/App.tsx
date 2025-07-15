import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createHashRouter, RouterProvider } from "react-router";
import { Layout } from "./Layout.js";
import { AnalyticsForm } from "./pages/analytics/index.js";
import { AnalyticsStatusPage } from "./pages/analytics/status.js";
import { GridsPage } from "./pages/grids/index.js";
import { GridStatusPage } from "./pages/grids/status.js";
import { HomePage } from "./pages/home/index.js";

const queryClient = new QueryClient();

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
				Component: AnalyticsForm,
			},
			{
				path: "/analytics/:executionArn",
				Component: AnalyticsStatusPage,
			},
			{
				path: "/grids",
				Component: GridsPage,
			},
			{
				path: "/grids/:executionArn",
				Component: GridStatusPage,
			},
		],
	},
]);

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}
