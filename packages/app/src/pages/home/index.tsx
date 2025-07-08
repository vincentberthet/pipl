import { Link } from "react-router";

export function HomePage() {
	return (
		<div className="flex flex-col items-center justify-center grow">
			<div className="grid grid-cols-1 md:grid-cols-2 auto-rows-auto gap-4">
				<div className="card card-border">
					<div className="card-body">
						<h2 className="card-title">Génération de grille</h2>
						<p>
							Importez les documents du poste (fiche de posten de compétence,
							offre d'emploi...) pour générer une grille d'entretien structuré.
						</p>
						<div className="card-actions stretch">
							<Link to="/grids" className="btn btn-primary w-full">
								Générer une grille
							</Link>
						</div>
					</div>
				</div>
				<div className="card card-border">
					<div className="card-body">
						<h2 className="card-title">Analyse d'entretien</h2>
						<p>
							Importez la grille d'valuation et l'enregistrement de l'entretien
							pour la faire compléter par les réponses du candidat.
						</p>
						<div className="card-actions stretch">
							<Link to="/analytics" className="btn btn-primary w-full">
								Faire une analyse
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
