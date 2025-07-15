import { Link, useOutlet } from "react-router";
import { ToastContainer } from "react-toastify";

export function Layout() {
	const children = useOutlet();
	return (
		<>
			<header>
				<div className="container items-start">
					<Link to="/">
						<img
							src="./assets/logo_white.svg"
							alt="Pipl Analytics Logo"
							className="logo h-8"
						/>
					</Link>
				</div>
			</header>
			<main className="container">{children}</main>

			<ToastContainer position="bottom-left" />
		</>
	);
}
