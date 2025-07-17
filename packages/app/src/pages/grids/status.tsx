import { CircleCheck, CircleX } from "lucide-react";
import { Link, useParams } from "react-router";
import { useGetStatus } from "../../components/useGetStatus.js";

export function GridStatusPage() {
	const { executionArn } = useParams();
	const { status } = useGetStatus(executionArn ?? "");

	return (
		<div className="flex flex-col items-center justify-center flex-1">
			<div className="card card-border max-w-96">
				<div className="card-body flex flex-col items-center justify-center gap-4">
					<h1 aria-label="Exécution en cours">Générer une grille</h1>
					{status === "running" && (
						<>
							<span className="loading loading-spinner w-12 text-primary" />
							<h2>En cours de création...</h2>
							<p className="text-center">
								Plus que quelques minutes et vous recevrez la grille par mail
							</p>
						</>
					)}
					{status === "succeeded" && (
						<>
							<CircleCheck size={48} className="text-green-700" />
							<h2>Génération de grille réussie</h2>
							<p className="text-center">
								Vous pouvez consulter la grille générée dans votre boite mail
							</p>
							<Link to="/" className="btn btn-primary">
								Aller à l'accueil
							</Link>
						</>
					)}
					{status === "failed" && (
						<>
							<CircleX size={48} className="text-red-700" />
							<h2>Échec de la génération de la grille</h2>
							<p className="text-center">
								Veuillez réessayer plus tard ou contacter le support si le
								problème persiste.
							</p>
							<Link to="/" className="btn btn-primary">
								Aller à l'accueil
							</Link>
						</>
					)}
					{status === "error" && (
						<>
							<CircleX size={48} className="text-red-700" />
							<h2>Échec de la récupération du statut de la grille</h2>
							<p className="text-center">
								Veuillez réessayer plus tard ou contacter le support si le
								problème persiste.
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
