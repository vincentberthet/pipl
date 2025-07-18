import { Link } from "react-router";

export function HomePage() {
	return (
		<div className="flex flex-col justify-center items-center grow">
			<div className="grid grid-cols-1 md:grid-cols-2 auto-rows-auto gap-6">
				<h1 className="md:col-span-2 text-center !text-[1.72rem]">
					Bienvenue dans la version beta de Sia
				</h1>
				<p className="md:col-span-2">
					Notre assistant IA vous accompagne dans vos{" "}
					<a
						className="link link-primary"
						href="https://www.piplanalytics.com/blog/entretien-structure"
					>
						entretiens structurés
					</a>{" "}
					et semi-structurés.{" "}
					<b>
						Sia vous aide à concevoir vos grilles d’entretien et à analyser vos
						entretiens, en quelques clics.
					</b>
				</p>
				<p className="pb-4 md:col-span-2 text-gray-600 ">
					Note : Si vous faites un entretien semi-structuré (comportant une
					partie structurée et une partie libre), nous vous conseillons
					d’enregistrer uniquement la partie structurée de l’entretien et
					d’uploader le fichier correspondant (dans "Analyser un entretien").
				</p>
				<div className="card card-border">
					<div className="card-body">
						<h2 className="card-title">Générer une grille d’entretien</h2>
						<p>
							Importez les documents liés au poste (fiche de poste, offre
							d'emploi, etc.) pour générer une grille d'entretien structuré.
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
						<h2 className="card-title">Analyser un entretien</h2>
						<p>
							Importez la grille d'entretien et l'enregistrement de l'entretien
							pour évaluer les réponses du candidat.
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
