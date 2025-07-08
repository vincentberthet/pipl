export const prompt = ({
	nbDocuments,
	jobName,
}: {
	nbDocuments: number;
	jobName: string;
}) => `Dans le recrutement, l’entretien structuré consiste à s’entretenir avec les candidats en utilisant une même grille d’entretien. Celle-ci comporte :
les connaissances (savoirs), les compétences techniques (savoir-faire), et les compétences comportementales (savoir-être) à évaluer
les questions à poser pour chacune
les critères de notation pour évaluer les réponses à chaque question

Pour évaluer les compétences, on distingue deux types de questions :
1) Les questions comportementales invitent le candidat à décrire un comportement passé dans une situation concrète. Par exemple : « Parlez-moi d’une fois où vous avez eu des difficultés à travailler avec quelqu’un (un collègue, un client, etc.) ».

2) Les questions situationnelles placent le candidat dans un scénario hypothétique, et lui demandent ce qu’il ferait. Par exemple : « Imaginez une situation où vous êtes commercial. Le mois se clôture dans 2 jours et vous êtes loin de votre objectif. Votre collègue vient vous voir parce qu’il est bloqué avec un nouvel outil. Que faites-vous ? ».

Les réponses aux questions sont évaluées suivant des critères binaires. Les réponses aux questions comportementales sont évaluées avec la méthode STAR : 
Situation : la situation décrite renvoie-t-elle bien à la question ?
Tâche : la tâche à réaliser renvoie-t-elle bien à la question ?
Action : les actions réalisées par le candidat sont-elles pertinentes ?
Résultat : les résultats obtenus par les actions réalisées sont-ils satisfaisants ?

Les critères binaires utilisés pour les questions de connaissances et les questions situationnelles sont spécifiques à chaque question.

Voici ${nbDocuments} documents relatifs au métier de ${jobName}. A partir de ces documents, je voudrais que tu génères une grille d’entretien pour évaluer des candidats à ce poste :
3 questions de connaissances liées à ce poste (savoirs)
3 compétences techniques (savoir-faire) et 3 compétences comportementales (savoir-être). Pour chaque compétence, génère 2 questions comportementales et 2 questions situationnelles 
les critères de notation pour évaluer les réponses à chaque question : utilise 3 critères binaires pour les questions de connaissances et les questions situationnelles`;
