import type { ConcursoConfig } from "./types";

export const cnu2024b8: ConcursoConfig = {
	slug: "cnu-2024-b8",
	parser: "cesgranrio",
	tipo: "multipla",
	expectedCount: 15,
	prova: {
		id: "cnu-2024-b8-manha-g1",
		titulo: "CNU 2024 – Bloco 8 Nível Intermediário (Manhã · Gabarito 1)",
		orgao: "Governo Federal",
		cargo: "Nível Intermediário – Bloco 8",
		banca: "CESGRANRIO",
		ano: 2024,
		edital: "Edital nº 08/2024 de 10 de janeiro de 2024",
		jsonFileName: "CNU - 2024 - Bloco 8 Nivel Intermediario.json",
	},
	provaPdfs: [
		{ fileName: "CNU - 2024 - Bloco 8 Nivel Intermediario - Prova.pdf" },
	],
	gabaritos: [
		{
			fileName: "CNU - 2024 - Gabaritos Finais Manha.pdf",
			gabaritoNumero: 1,
			blockMarker:
				"BLOCO 8 – NÍVEL INTERMEDIÁRIO – LÍNGUA PORTUGUESA – MANHÃ – GABARITO 1",
		},
	],
	disciplinas: [{ nome: "Língua Portuguesa", de: 1, ate: 15 }],
	pageNoisePatterns: [
		/^\s*CONCURSO P[UÚ]BLICO\s*$/gim,
		/^\s*NACIONAL UNIFICADO\s*$/gim,
		/^\s*PROVA\s*$/gim,
		/^\s*RASCUNHO\s*$/gim,
	],
};
