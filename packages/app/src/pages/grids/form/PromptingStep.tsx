const Input = ({ name, label }: { name: string; label: string }) => (
	<div className="flex items-center gap-2">
		<input type="number" className="input !w-10" name={name} />
		{label}
	</div>
);

export const PromptingStep = () => {
	const totalQuestions = 21; // TODO: calculate this based on the inputs
	return (
		<>
			<legend className="fieldset-legend">
				<h2>Étape 2/3 : Personnalisez la grille d'entretien</h2>
			</legend>
			<div className="flex flex-col gap-4">
				<div>
					<h3 className="pt-2">Connaissances du poste</h3>
					<Input
						name="nb-questions-poste"
						label="questions de connaissance relatives au poste"
					/>
				</div>
				<div>
					<h3 className="pt-2">Compétences techniques</h3>
					<Input
						name="nb-competences-tech"
						label="comptétences techniques à évaluer"
					/>
				</div>
				<div className="px-12">
					<h4>Questions pour chaque compétences comportementales évaluées</h4>
					<div className="flex flex-col gap-2">
						<Input
							name="tech-nb-questions-competences"
							label="questions de compétences"
						/>
						<Input
							name="tech-nb-questions-comportementales"
							label="questions comportementales"
						/>
						<Input
							name="tech-nb-questions-situationnelles"
							label="questions situationnelles"
						/>
					</div>
				</div>
				<div>
					<h3 className="pt-2">Compétences comportementales</h3>
					<Input
						name="nb-competences-comportementales"
						label="comptétences comportementales à évaluer"
					/>
				</div>
				<div className="px-12">
					<div className="flex flex-col gap-2">
						<h4>Questions pour chaque compétences comportementales évaluées</h4>
						<Input
							name="comportementale-nb-questions-comportementales"
							label="questions comportementales"
						/>
						<Input
							name="comportementale-nb-questions-situationnelles"
							label="questions situationnelles"
						/>
					</div>
				</div>
				Total: {totalQuestions} questions
			</div>
		</>
	);
};
