import { Link, useOutlet } from "react-router";
import { ToastContainer } from "react-toastify";

export function Layout() {
	const children = useOutlet();
	return (
		<>
			<header>
				<div className="container items-start">
					<Link to="/" className="flex flex-row items-center">
						Sia
						<span className="hidden md:inline">
							&nbsp;–&nbsp;Structured Interview Assistant by
						</span>
						<img
							src="./assets/logo_white.svg"
							alt="Pipl Analytics Logo"
							className="logo h-8 ml-2"
						/>
					</Link>
				</div>
			</header>
			<main className="container">{children}</main>

			<ToastContainer position="bottom-left" />
		</>
	);
}
