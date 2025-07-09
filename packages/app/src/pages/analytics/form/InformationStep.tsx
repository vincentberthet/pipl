export function InformationStep() {
	return (
		<>
			<legend className="fieldset-legend">
				<h2>Étape 2/2 : Précisez les informations sur l'entretien</h2>
			</legend>

			<label htmlFor="analytics-job-name">Nom du poste</label>
			<input
				type="text"
				className="input"
				name="job-name"
				id="analytics-job-name"
				placeholder="Ex. Maçon"
			/>
			<label htmlFor="analytics-candidate-name">Nom du candidat</label>
			<input
				type="text"
				className="input"
				name="candidate-name"
				id="analytics-candidate-name"
				placeholder="Ex. Jean Dupont"
			/>

			<label htmlFor="analytics-email">Email (pour recevoir la grille)</label>
			<input
				type="email"
				className="input"
				name="candidate-email"
				id="analytics-email"
				placeholder="Ex. jeanne.martin@example.com"
			/>
		</>
	);
}
