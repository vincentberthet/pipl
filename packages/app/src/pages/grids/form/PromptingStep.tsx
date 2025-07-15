import React, { useMemo } from "react";

export const PromptingStep = () => {
	const [values, setValues] = React.useState({
		nbJobQuestions: 3,
		nbTechSkills: 3,
		techNbExperienceQuestions: 2,
		techNbSituationQuestions: 1,
		nbBehavioralSkills: 3,
		behavioralNbExperienceQuestions: 2,
		behavioralNbSituationQuestions: 1,
	});

	const totalQuestions = useMemo(
		() =>
			values.nbJobQuestions +
			values.nbTechSkills *
				(values.techNbExperienceQuestions + values.techNbSituationQuestions) +
			values.nbBehavioralSkills *
				(values.behavioralNbExperienceQuestions +
					values.behavioralNbSituationQuestions),
		[values],
	);

	const Input = ({
		label,
		name,
	}: {
		label: string;
		name: keyof typeof values;
	}) => (
		<div className="flex items-center gap-2">
			<input
				type="number"
				className="input !w-10"
				name={name}
				defaultValue={values[name]}
				min={0}
				onChange={(e) => {
					setValues((prev) => ({ ...prev, [name]: parseInt(e.target.value) }));
				}}
			/>
			{label}
		</div>
	);

	return (
		<>
			<legend className="fieldset-legend">
				<h2>Étape 2/3 : Personnalisez la grille d'entretien</h2>
				<div className="tooltip tooltip-bottom">
					<div className="border rounded-full w-5 h-5 flex justify-center text-sm font-light cursor-default">
						?
					</div>
					<div className="tooltip-content text-start flex flex-col gap-1.5">
						<p>
							Questions d'expérience : elles consistent à interroger le candidat
							sur des situations réelles qu’il a vécues. Exemple : « Parlez-moi
							d’un cas où… »
						</p>
						<br />
						<p>
							Questions de mise en situation : elles placent le candidat dans un
							contexte hypothétique. Exemple : « Imaginez que… »
						</p>
						<br />
						<p>
							Les questions d’expérience sont à privilégier car elles reflètent
							les comportements réels du candidat. Les mises en situation sont
							plus adaptées aux profils avec moins d’expérience.
						</p>
						<br />
						<p>Il est recommandé : </p>
						<p>- d'évaluer 6 à 8 compétences</p>
						<p>- de poser 2 à 3 questions par compétences </p>
					</div>
				</div>
			</legend>
			<div className="flex flex-col gap-4">
				<div>
					<h3 className="pt-2">Connaissances liées au poste</h3>
					<Input
						name="nbJobQuestions"
						label="questions de connaissances liées au poste"
					/>
				</div>
				<div>
					<h3 className="pt-2">Compétences techniques</h3>
					<Input
						name="nbTechSkills"
						label="comptétences techniques à évaluer"
					/>
				</div>
				<div className="px-12">
					<h4>Questions pour chaque compétences techniques évaluées</h4>
					<div className="flex flex-col gap-2">
						<Input
							name="techNbExperienceQuestions"
							label="questions d'expérience"
						/>
						<Input
							name="techNbSituationQuestions"
							label="questions de mise en situation"
						/>
					</div>
				</div>
				<div>
					<h3 className="pt-2">Compétences comportementales</h3>
					<Input
						name="nbBehavioralSkills"
						label="comptétences comportementales à évaluer"
					/>
				</div>
				<div className="px-12">
					<div className="flex flex-col gap-2">
						<h4>Questions pour chaque compétences comportementales évaluées</h4>
						<Input
							name="behavioralNbExperienceQuestions"
							label="questions d'expérience"
						/>
						<Input
							name="behavioralNbSituationQuestions"
							label="questions de mise en situation"
						/>
					</div>
				</div>
				<div
					className={`mt-4${totalQuestions > 40 ? " text-error font-semibold" : ""}`}
				>
					Total: {totalQuestions} / 40 questions
				</div>
			</div>
		</>
	);
};
