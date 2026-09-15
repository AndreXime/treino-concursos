import type { ConcursoConfig } from "./types";

export const caixa2024: ConcursoConfig = {
	slug: "caixa-2024",
	parser: "cesgranrio",
	tipo: "multipla",
	expectedCount: 60,
	prova: {
		id: "caixa-2024-tbn-g1",
		titulo: "Caixa – Técnico Bancário Novo (Gabarito 1)",
		orgao: "Caixa Econômica Federal",
		cargo: "Técnico Bancário Novo",
		area: "Bancário",
		banca: "CESGRANRIO",
		ano: 2024,
		edital: "Edital nº 01/2024/NM de 22 de fevereiro de 2024",
		jsonFileName: "Caixa - 2024 - Tecnico Bancario Novo.json",
	},
	provaPdfs: [{ fileName: "Caixa - 2024 - Tecnico Bancario Novo - Prova.pdf" }],
	gabaritos: [
		{
			fileName: "Caixa - 2024 - Tecnico Bancario Novo - Gabarito.pdf",
			gabaritoNumero: 1,
			blockMarker: "PROVA 1 - TÉCNICO BANCÁRIO NOVO - GABARITO 1",
		},
	],
	disciplinas: [
		{ nome: "Língua Portuguesa", de: 1, ate: 5 },
		{ nome: "Língua Inglesa", de: 6, ate: 10 },
		{ nome: "Matemática Financeira", de: 11, ate: 15 },
		{ nome: "Noções de Probabilidade e Estatística", de: 16, ate: 20 },
		{ nome: "Comportamentos Éticos e Compliance", de: 21, ate: 25 },
		{ nome: "Conhecimentos Bancários", de: 26, ate: 40 },
		{
			nome: "Conhecimentos de Tecnologia da Informação e Comunicação",
			de: 41,
			ate: 45,
		},
		{ nome: "Conhecimentos e Comportamentos Digitais", de: 46, ate: 50 },
		{ nome: "Atendimento Bancário", de: 51, ate: 60 },
	],
	pageNoisePatterns: [
		/^\s*CAIXA ECON[OÔ]MICA FEDERAL\s*$/gim,
		/^\s*PROVA 1\s*-\s*T[EÉ]CNICO BANC[AÁ]RIO NOVO\s*$/gim,
		/^\s*RASCUNHO\s*$/gim,
	],
};
