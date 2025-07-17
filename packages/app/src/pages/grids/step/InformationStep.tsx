import { useStore } from "@tanstack/react-form";
import { FormStep } from "../../../components/FormStep.js";
import {
	emailValidator,
	jobNameValidator,
} from "../../analytics/form/analyticsFormSchema.js";
import type { GridsFormSchema } from "../form/gridsFormSchema.js";
import { withForm } from "../form/useGridsForm.js";

const KEYS: (keyof GridsFormSchema)[] = ["jobName", "email"];

export const InformationStep = withForm({
	defaultValues: {} as GridsFormSchema,
	render({ form }) {
		const isStepValid = useStore(form.store, (state) => {
			for (const key of KEYS) {
				const meta = state.fieldMeta[key];
				if (!meta?.isTouched || !meta?.isValid) {
					return false;
				}
			}
			return true;
		});
		return (
			<FormStep
				isStepValid={isStepValid}
				label="Étape 3/3 : Finalisez la grille"
			>
				<form.AppField
					name="jobName"
					validators={{
						onChange: jobNameValidator,
					}}
				>
					{(field) => (
						<field.TextInput
							label="Nom du poste"
							placeholder="Ex. Maçon"
							required
						/>
					)}
				</form.AppField>

				<form.AppField
					name="email"
					validators={{
						onChange: emailValidator,
					}}
				>
					{(field) => (
						<field.TextInput
							label="Email (pour recevoir les résultats)"
							placeholder="Ex. jeanne.martin@example.com"
							required
						/>
					)}
				</form.AppField>
			</FormStep>
		);
	},
});
