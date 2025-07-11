import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createHashRouter, RouterProvider } from "react-router";
import { Layout } from "./Layout.js";
import { AnalyticsForm } from "./pages/analytics/index.js";
import { GridsPage } from "./pages/grids/index.js";
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
				path: "/grids",
				Component: GridsPage,
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
