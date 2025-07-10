import { useOutlet } from "react-router";

export function Layout() {
	const children = useOutlet();
	return (
		<>
			<header>
				<div className="container items-start">
					<img
						src="./assets/logo_white.svg"
						alt="Pipl Analytics Logo"
						className="logo h-8"
					/>
				</div>
			</header>
			<main className="container">{children}</main>
		</>
	);
}
