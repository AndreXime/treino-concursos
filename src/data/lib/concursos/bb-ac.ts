import type { ConcursoConfig, DisciplinaRange } from "./types";

export const DISCIPLINAS_BB_AC: DisciplinaRange[] = [
	{ nome: "Língua Portuguesa", de: 1, ate: 10 },
	{ nome: "Língua Inglesa", de: 11, ate: 15 },
	{ nome: "Matemática", de: 16, ate: 20 },
	{ nome: "Atualidades do Mercado Financeiro", de: 21, ate: 25 },
	{ nome: "Matemática Financeira", de: 26, ate: 30 },
	{ nome: "Conhecimentos Bancários", de: 31, ate: 40 },
	{ nome: "Conhecimentos de Informática", de: 41, ate: 55 },
	{ nome: "Vendas e Negociação", de: 56, ate: 70 },
];

export const bbAcA: ConcursoConfig = {
	slug: "bb-ac-a",
	parser: "cesgranrio",
	tipo: "multipla",
	expectedCount: 70,
	prova: {
		id: "bb-ac-2022-a-g1",
		titulo: "BB Escriturário – Agente Comercial (Prova A · Gabarito 1)",
		orgao: "Banco do Brasil",
		cargo: "Escriturário – Agente Comercial",
		banca: "CESGRANRIO",
		ano: 2023,
		edital: "Seleção Externa 2022/001 · Edital nº 01 – 2022/001 BB",
		jsonFileName: "PROVA A - AGENTE COMERCIAL - GABARITO 1.json",
	},
	provaPdfs: [{ fileName: "PROVA A - AGENTE COMERCIAL - GABARITO 1.pdf" }],
	gabaritos: [
		{
			fileName:
				"GABARITO - 23-04-2023 - PROVA A - ESCRITURÁRIO - AGENTE COMERCIAL.pdf",
			gabaritoNumero: 1,
		},
	],
	disciplinas: DISCIPLINAS_BB_AC,
	pageNoisePatterns: [
		/^\s*BANCO DO BRASIL\s*$/gim,
		/^\s*RASCUNHO\s*$/gim,
		/AGENTE COMERCIAL\s*-\s*PROVA A\d*GABARITO\s*\d+/gi,
		/AGENTE COMERCIAL\s*-\s*PROVA A\s*GABARITO\s*\d+/gi,
	],
};
