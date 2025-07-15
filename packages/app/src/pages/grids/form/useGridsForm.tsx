import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { postJson } from "../../../commons/http.js";
import { uploadFiles } from "../../../commons/s3.js";
import { ConfigurationInput } from "../input/ConfigurationInput.js";
import { FileListInput } from "../input/FileListInput.js";
import { TextInput } from "../input/TextInput.js";
import {
	type GridsFormResultSchema,
	type GridsFormSchema,
	gridsFormSchema,
} from "./gridsFormSchema.js";

export const { fieldContext, formContext, useFieldContext } =
	createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		ConfigurationInput,
		FileListInput,
		TextInput,
	},
	formComponents: {},
	fieldContext,
	formContext,
});

export function useGridsForm() {
	const navigate = useNavigate();

	const { isPending, mutate } = useMutation<
		GridsFormResultSchema,
		Error,
		GridsFormSchema
	>({
		async mutationFn({ files, ...rest }) {
			const pathToFiles = await uploadFiles(files);
			return postJson(`${import.meta.env.VITE_API_ENDPOINT}/grids`, {
				...rest,
				pathToFiles,
			});
		},
		onSuccess: ({ executionArn }) => {
			navigate(`/grids/${executionArn}`);
		},
		onError: (error) => {
			console.error("Form submission failed:", error);
			toast.error(
				"Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer plus tard.",
			);
		},
	});

	const form = useAppForm({
		defaultValues: {
			jobName: "",
			email: "",
			files: [],
			nbJobQuestions: 3,
			nbTechSkills: 3,
			techNbExperienceQuestions: 2,
			techNbSituationQuestions: 1,
			nbBehavioralSkills: 3,
			behavioralNbExperienceQuestions: 2,
			behavioralNbSituationQuestions: 1,
		} as GridsFormSchema,
		validators: {
			onSubmit: gridsFormSchema,
		},
		onSubmit({ value }) {
			return mutate(value);
		},
	});

	return useMemo(() => {
		return {
			isPending,
			form,
		};
	}, [isPending, form]);
}
