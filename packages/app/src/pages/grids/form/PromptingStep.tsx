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
					<h3 className="pt-2">Connaissances liées au poste</h3>
					<Input
						name="nb-questions-poste"
						label="questions de connaissances relatives au poste"
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
					<h4>Questions pour chaque compétences techniques à évaluer</h4>
					<div className="flex flex-col gap-2">
						<Input
							name="tech-nb-questions-experience"
							label="questions d'expérience"
						/>
						<Input
							name="tech-nb-questions-situation"
							label="questions de mise en situation"
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
						<h4>
							Questions pour chaque compétences comportementales à évaluer
						</h4>
						<Input
							name="comportementale-nb-questions-experience"
							label="questions d'expérience"
						/>
						<Input
							name="comportementale-nb-questions-situation"
							label="questions de mise en situation"
						/>
					</div>
				</div>
				Total: {totalQuestions} / 40 questions
			</div>
		</>
	);
};
