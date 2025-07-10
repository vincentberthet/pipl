import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
	console.log(event);
	return {
		statusCode: 200,
		body: JSON.stringify({
			email: "erwan@marmelab.com",
			jobName: "Chef de chantier Ferroviaire",
			grid: [
				{
					category: "Connaissance",
					questions: [
						{
							question:
								"Quelles sont les règles de sécurité et la législation sociale qu'un chef de chantier doit respecter?",
							category: "Connaissance",
							criterias: [
								"Mentionne les règles de sécurité.",
								"Mentionne la législation sociale.",
								"Mentionne la législation environnementale.",
							],
						},
						{
							question:
								"Expliquez le rôle du chef de chantier dans la budgétisation et le planning d'un projet.",
							category: "Connaissance",
							criterias: [
								"Décrit le rôle dans la budgétisation.",
								"Décrit le rôle dans le planning.",
								"Explique l'optimisation des modes opératoires.",
							],
						},
						{
							question:
								"Quelles sont les procédures qualité à suivre sur un chantier ferroviaire selon le manuel de l'agence?",
							category: "Connaissance",
							criterias: [
								"Mentionne le respect des procédures qualité.",
								"Décrit le contrôle qualité des travaux.",
								"Parle du manuel qualité de l'agence.",
							],
						},
					],
				},
				{
					category: "Savoir-faire",
					questions: [
						{
							question:
								"Parlez d'une situation où vous avez dû organiser un chantier complexe.",
							category: "Savoir-faire",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Décrivez comment vous avez optimisé le travail d'une équipe pour atteindre un objectif.",
							category: "Savoir-faire",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Votre planning est en retard. Comment réorganisez-vous les tâches pour rattraper le délai?",
							category: "Savoir-faire",
							criterias: [
								"Propose une méthode de réorganisation.",
								"Considère l'impact sur les ressources.",
								"Mentionne la communication d'équipe.",
							],
						},
						{
							question:
								"Vous devez lancer un nouveau chantier. Quelles sont vos premières étapes pour l'organiser?",
							category: "Savoir-faire",
							criterias: [
								"Identifie les étapes clés de démarrage.",
								"Mentionne la coordination des ressources.",
								"Précise la préparation du site.",
							],
						},
						{
							question:
								"Décrivez une situation où vous avez dû corriger un problème de qualité sur un chantier.",
							category: "Savoir-faire",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Parlez d'une fois où vous avez mis en place une nouvelle procédure de contrôle qualité.",
							category: "Savoir-faire",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Vous constatez un défaut majeur sur les travaux. Que faites-vous immédiatement?",
							category: "Savoir-faire",
							criterias: [
								"Identifie les mesures correctives.",
								"Décrit la communication aux parties prenantes.",
								"Met en place un suivi.",
							],
						},
						{
							question:
								"Comment assurez-vous la conformité des travaux réalisés avec les normes établies?",
							category: "Savoir-faire",
							criterias: [
								"Explique les méthodes de vérification.",
								"Mentionne les documents de référence.",
								"Décrit la gestion des non-conformités.",
							],
						},
						{
							question:
								"Décrivez comment vous avez géré les documents de facturation d'un chantier important.",
							category: "Savoir-faire",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Parlez d'une situation où vous avez dû rédiger un rapport complexe pour la direction.",
							category: "Savoir-faire",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Vous devez préparer le rapport hebdomadaire. Quels éléments clés incluez-vous?",
							category: "Savoir-faire",
							criterias: [
								"Cite les informations essentielles du rapport.",
								"Explique la fréquence de reporting.",
								"Mentionne l'analyse des résultats.",
							],
						},
						{
							question:
								"Un client demande un attachement détaillé. Comment procédez-vous pour le générer?",
							category: "Savoir-faire",
							criterias: [
								"Explique le processus d'attachement.",
								"Décrit la collecte des données.",
								"Mentionne la validation de l'information.",
							],
						},
					],
				},
				{
					category: "Savoir-être",
					questions: [
						{
							question:
								"Décrivez une fois où vous avez dû motiver une équipe face à un défi difficile.",
							category: "Savoir-être",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Parlez d'une situation où vous avez dû déléguer des tâches importantes à votre équipe.",
							category: "Savoir-être",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Un membre de votre équipe est démotivé. Comment le remotiver et le réengager?",
							category: "Savoir-être",
							criterias: [
								"Propose des actions concrètes de soutien.",
								"Explique l'importance de l'écoute.",
								"Mentionne l'adaptation de la communication.",
							],
						},
						{
							question:
								"Comment assurez-vous que votre équipe comprend les objectifs et les priorités du chantier?",
							category: "Savoir-être",
							criterias: [
								"Décrit les méthodes de communication.",
								"Parle de la fréquence des échanges.",
								"Mentionne la vérification de la compréhension.",
							],
						},
						{
							question:
								"Décrivez une situation où vous avez dû communiquer une mauvaise nouvelle à votre équipe.",
							category: "Savoir-être",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Parlez d'une fois où vous avez dû gérer un conflit entre des membres de votre équipe.",
							category: "Savoir-être",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Un riverain mécontent se présente sur le chantier. Comment gérez-vous la situation?",
							category: "Savoir-être",
							criterias: [
								"Fait preuve d'empathie.",
								"Propose des solutions ou des explications claires.",
								"Mentionne l'escalade si nécessaire.",
							],
						},
						{
							question:
								"Vous devez présenter l'avancement du chantier à des intervenants extérieurs. Comment préparez-vous cela?",
							category: "Savoir-être",
							criterias: [
								"Précise la préparation des informations.",
								"Explique l'adaptation du discours.",
								"Mentionne la gestion des questions.",
							],
						},
						{
							question:
								"Décrivez une situation où votre exemplarité a eu un impact positif sur la sécurité de l'équipe.",
							category: "Savoir-être",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Parlez d'une fois où vous avez pris une décision difficile dont vous étiez seul responsable.",
							category: "Savoir-être",
							criterias: ["Situation", "Tâche", "Action", "Résultat"],
						},
						{
							question:
								"Un ouvrier ne porte pas ses EPI. Que faites-vous pour assurer le respect des consignes?",
							category: "Savoir-être",
							criterias: [
								"Intervient immédiatement et fermement.",
								"Explique l'importance de l'EPI.",
								"Applique les procédures si non-conformité persiste.",
							],
						},
						{
							question:
								"Vous remarquez une pratique qui pourrait nuire à l'image de l'entreprise. Comment agissez-vous?",
							category: "Savoir-être",
							criterias: [
								"Prend des mesures immédiates.",
								"Communique l'importance de l'image.",
								"Propose des actions correctives.",
							],
						},
					],
				},
			],
		}),
	};
};
