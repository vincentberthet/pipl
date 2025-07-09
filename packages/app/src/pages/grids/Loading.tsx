export const Loading = ({ submit }: { submit: () => void }) => {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<h1 className="text-2xl font-bold mb-4">Loading...</h1>
			<p className="text-gray-600">
				Please wait while we load the necessary data for the grid.
			</p>
			<button type="button" onClick={submit} className="btn">
				next step
			</button>
		</div>
	);
};
