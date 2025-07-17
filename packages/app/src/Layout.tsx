import { Link, useOutlet } from "react-router";
import { ToastContainer } from "react-toastify";

export function Layout() {
	const children = useOutlet();
	return (
		<>
			<header>
				<Link to="/" className="flex flex-row items-center">
					Sia
					<span className="hidden lg:inline">
						&nbsp;–&nbsp;Structured Interview Assistant by
					</span>
					<img
						src="./assets/logo_white.svg"
						alt="Pipl Analytics Logo"
						className="logo h-6 ml-2"
					/>
				</Link>

				<nav className="hidden md:flex flex-row items-center gap-4 font-normal">
					<Link to="/grids">Générer une grille</Link>
					<Link to="/analytics">Analyser un entretien</Link>
				</nav>
			</header>
			<main className="container">{children}</main>

			<ToastContainer position="bottom-left" />
		</>
	);
}
