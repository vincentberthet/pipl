import { useOutlet } from "react-router";

export function Layout() {
	const children = useOutlet();
	return <main>{children}</main>;
}
