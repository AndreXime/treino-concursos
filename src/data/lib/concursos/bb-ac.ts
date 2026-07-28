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

const metaBase = {
	orgao: "Banco do Brasil",
	cargo: "Escriturário – Agente Comercial",
	banca: "CESGRANRIO",
	ano: 2023,
	edital: "Seleção Externa 2022/001 · Edital nº 01 – 2022/001 BB",
} as const;

function bbConfig(letter: "A" | "B" | "C"): ConcursoConfig {
	const lower = letter.toLowerCase();
	return {
		slug: `bb-ac-${lower}`,
		parser: "cesgranrio",
		tipo: "multipla",
		expectedCount: 70,
		prova: {
			id: `bb-ac-2022-${lower}-g1`,
			titulo: `BB Escriturário – Agente Comercial (Prova ${letter} · Gabarito 1)`,
			...metaBase,
			jsonFileName: `PROVA ${letter} - AGENTE COMERCIAL - GABARITO 1.json`,
		},
		provaPdfs: [
			{ fileName: `PROVA ${letter} - AGENTE COMERCIAL - GABARITO 1.pdf` },
		],
		gabaritos: [
			{
				fileName: `GABARITO - 23-04-2023 - PROVA ${letter} - ESCRITURÁRIO - AGENTE COMERCIAL.pdf`,
				gabaritoNumero: 1,
			},
		],
		disciplinas: DISCIPLINAS_BB_AC,
		pageNoisePatterns: [
			/^\s*BANCO DO BRASIL\s*$/gim,
			/^\s*RASCUNHO\s*$/gim,
			new RegExp(
				`AGENTE COMERCIAL\\s*-\\s*PROVA ${letter}\\d*GABARITO\\s*\\d+`,
				"gi",
			),
			new RegExp(
				`AGENTE COMERCIAL\\s*-\\s*PROVA ${letter}\\s*GABARITO\\s*\\d+`,
				"gi",
			),
		],
	};
}

export const bbAcA = bbConfig("A");
export const bbAcB = bbConfig("B");
export const bbAcC = bbConfig("C");
