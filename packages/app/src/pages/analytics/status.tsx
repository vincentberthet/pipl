import { CircleCheck, CircleX } from "lucide-react";
import { Link, useParams } from "react-router";
import { useGetStatus } from "../../components/useGetStatus.js";

export function AnalyticsStatusPage() {
	const { executionArn } = useParams();
	const { status } = useGetStatus(executionArn ?? "");

	return (
		<div className="flex flex-col items-center justify-center flex-1">
			<div className="card card-border max-w-96">
				<div className="card-body flex flex-col items-center justify-center gap-4">
					<h1 aria-label="Exécution en cours">Analyser un entretien</h1>
					{status === "running" && (
						<>
							<span className="loading loading-spinner w-12 text-primary" />
							<h2>En cours d'analyse...</h2>
							<p className="text-center">
								Plus que quelques minutes et vous recevrez les résultats par
								mail
							</p>
						</>
					)}
					{status === "succeeded" && (
						<>
							<CircleCheck size={48} className="text-green-700" />
							<h2>Analyse réussie</h2>
							<p className="text-center">
								Vous pouvez consulter le résultat de l'analyse dans votre boite
								mail.
							</p>
							<p className="text-center">
								En cas de problème, veuillez contacter le support (
								<a
									href="mailto:contact@piplanalytics.com"
									className="link link-primary"
								>
									contact@piplanalytics.com
								</a>
								).
							</p>
							<Link to="/" className="btn btn-primary">
								Aller à l'accueil
							</Link>
						</>
					)}
					{status === "failed" && (
						<>
							<CircleX size={48} className="text-red-700" />
							<h2>Échec de l'analyse</h2>
							<p className="text-center">
								Veuillez réessayer plus tard ou contacter le support (
								<a
									href="mailto:contact@piplanalytics.com"
									className="link link-primary"
								>
									contact@piplanalytics.com
								</a>
								) si le problème persiste.
							</p>
							<Link to="/" className="btn btn-primary">
								Aller à l'accueil
							</Link>
						</>
					)}
					{status === "error" && (
						<>
							<CircleX size={48} className="text-red-700" />
							<h2>Échec de la récupération du statut de l'analyse</h2>
							<p className="text-center">
								Veuillez réessayer plus tard ou contacter le support (
								<a
									href="mailto:contact@piplanalytics.com"
									className="link link-primary"
								>
									contact@piplanalytics.com
								</a>
								) si le problème persiste.
							</p>
							<Link to="/" className="btn btn-primary">
								Aller à l'accueil
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
