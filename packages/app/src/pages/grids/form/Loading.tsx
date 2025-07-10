import { LoaderCircle } from "lucide-react";

export const Loading = () => (
	<div className="flex flex-col items-center justify-center">
		<LoaderCircle className="animate-spin w-12 h-12 text-primary mt-3" />
		<h2 className="my-3">En cours de création...</h2>
		<p>Plus que quelques minutes et vous recevrez la grille par mail</p>
	</div>
);
