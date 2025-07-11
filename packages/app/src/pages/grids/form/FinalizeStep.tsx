export const FinalizeStep = () => (
	<>
		<legend className="fieldset-legend">
			<h2>Étape 3/3 : Finalisez la grille</h2>
		</legend>

		<input
			type="text"
			className="input mt-4"
			name="job-name"
			placeholder="Nom du poste *"
		/>
		<input
			type="email"
			className="input mt-4"
			name="email"
			placeholder="Email (pour recevoir la grille) *"
		/>
	</>
);
