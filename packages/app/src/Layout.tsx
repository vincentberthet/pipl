import { useOutlet } from "react-router";

export function Layout() {
	const children = useOutlet();
	return (
		<>
			<header>
				<div className="container">Pipl Analytics</div>
			</header>
			<main className="container">{children}</main>
		</>
	);
}
