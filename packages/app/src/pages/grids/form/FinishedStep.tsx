import { Link } from "react-router";

export const FinishedStep = () => {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<h1 className="text-2xl font-bold mb-4">Finished Step</h1>
			<p className="text-gray-600">
				This is the final step of the grid creation process. You can review your
				grid and proceed to the next steps.
			</p>
			<Link to="/" className="btn btn-primary w-full">
				Go to Home
			</Link>
		</div>
	);
};
