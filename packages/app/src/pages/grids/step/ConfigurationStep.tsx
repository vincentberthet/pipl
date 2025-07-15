import { useStore } from "@tanstack/react-form";
import { useMemo } from "react";
import { FormStep } from "../../../components/FormStep.js";
import {
	behavioralNbExperienceQuestionsSchema,
	behavioralNbSituationQuestionsSchema,
	type GridsFormSchema,
	nbBehavioralSkillsSchema,
	nbJobQuestionsSchema,
	nbTechSkillsSchema,
	techNbExperienceQuestionsSchema,
	techNbSituationQuestionsSchema,
} from "../form/gridsFormSchema.js";
import { withForm } from "../form/useGridsForm.js";

const MAX_QUESTION = 40;

const KEYS: (keyof GridsFormSchema)[] = [
	"nbJobQuestions",
	"nbTechSkills",
	"techNbExperienceQuestions",
	"techNbSituationQuestions",
	"nbBehavioralSkills",
	"behavioralNbExperienceQuestions",
	"behavioralNbSituationQuestions",
];

export const ConfigurationStep = withForm({
	defaultValues: {} as GridsFormSchema,
	render({ form }) {
		const values = useStore(form.store, ({ values }) => {
			return values;
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

		const isStepValid = useStore(form.store, (state) => {
			for (const key of KEYS) {
				const meta = state.fieldMeta[key];
				if (!meta?.isValid) {
					return false;
				}
			}
			return true;
		});

		return (
			<FormStep
				isStepValid={isStepValid && totalQuestions <= MAX_QUESTION}
				label="Etape 2/3 : Personnalisez la grille d'entretien "
				tooltip={
					<>
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
						<p>- de poser 2 à 3 questions au total par compétence </p>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<div>
						<h3 className="pt-2">Connaissances liées au poste</h3>
						<form.AppField
							name="nbJobQuestions"
							validators={{
								onChange: nbJobQuestionsSchema,
							}}
						>
							{(field) => (
								<field.ConfigurationInput
									label="questions de connaissances liées au poste"
									required
								/>
							)}
						</form.AppField>
					</div>
					<div>
						<h3 className="pt-2">Compétences techniques</h3>

						<form.AppField
							name="nbTechSkills"
							validators={{
								onChange: nbTechSkillsSchema,
							}}
						>
							{(field) => (
								<field.ConfigurationInput
									label="comptétences techniques à évaluer"
									required
								/>
							)}
						</form.AppField>
					</div>
					<div className="px-12">
						<h4>Questions pour chaque compétence technique évaluée</h4>
						<div className="flex flex-col gap-2">
							<form.AppField
								name="techNbExperienceQuestions"
								validators={{
									onChange: techNbExperienceQuestionsSchema,
								}}
							>
								{(field) => (
									<field.ConfigurationInput
										label="questions d'expérience"
										required
									/>
								)}
							</form.AppField>

							<form.AppField
								name="techNbSituationQuestions"
								validators={{
									onChange: techNbSituationQuestionsSchema,
								}}
							>
								{(field) => (
									<field.ConfigurationInput
										label="questions de mise en situation"
										required
									/>
								)}
							</form.AppField>
						</div>
					</div>
					<div>
						<h3 className="pt-2">Compétences comportementales</h3>

						<form.AppField
							name="nbBehavioralSkills"
							validators={{
								onChange: nbBehavioralSkillsSchema,
							}}
						>
							{(field) => (
								<field.ConfigurationInput
									label="comptétences comportementales à évaluer"
									required
								/>
							)}
						</form.AppField>
					</div>
					<div className="px-12">
						<div className="flex flex-col gap-2">
							<h4>Questions pour chaque compétence comportementale évaluée</h4>
							<form.AppField
								name="behavioralNbExperienceQuestions"
								validators={{
									onChange: behavioralNbExperienceQuestionsSchema,
								}}
							>
								{(field) => (
									<field.ConfigurationInput
										label="questions d'expérience"
										required
									/>
								)}
							</form.AppField>

							<form.AppField
								name="behavioralNbSituationQuestions"
								validators={{
									onChange: behavioralNbSituationQuestionsSchema,
								}}
							>
								{(field) => (
									<field.ConfigurationInput
										label="questions de mise en situation"
										required
									/>
								)}
							</form.AppField>
						</div>
					</div>
					<div
						className={`mt-4${totalQuestions > MAX_QUESTION ? " text-error font-semibold" : ""}`}
					>
						Total: {totalQuestions} / {MAX_QUESTION} questions
					</div>
				</div>
			</FormStep>
		);
	},
});
