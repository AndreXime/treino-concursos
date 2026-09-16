import type { ConcursoConfig } from "./types";

export const cnu2024b2: ConcursoConfig = {
	slug: "cnu-2024-b2",
	parser: "cesgranrio",
	tipo: "multipla",
	expectedCount: 50,
	prova: {
		id: "cnu-2024-b2-tarde-g1",
		titulo:
			"CNU 2024 – Bloco 2 Tecnologia, Dados e Informação (Tarde · Gabarito 1)",
		orgao: "Governo Federal",
		cargo: "Tecnologia, Dados e Informação – Bloco 2",
		area: "Tecnologia da Informação",
		banca: "CESGRANRIO",
		ano: 2024,
		edital: "Edital nº 02/2024 de 10 de janeiro de 2024",
		jsonFileName: "CNU - 2024 - Bloco 2 Tecnologia Dados e Informacao.json",
	},
	provaPdfs: [
		{
			fileName:
				"CNU - 2024 - Bloco 2 Tecnologia Dados e Informacao - Prova.pdf",
		},
	],
	gabaritos: [
		{
			fileName: "CNU - 2024 - Gabaritos Finais Tarde.pdf",
			gabaritoNumero: 1,
			blockMarker:
				"BLOCO 2 – TECNOLOGIA, DADOS E INFORMAÇÃO – TARDE – GABARITO 1",
		},
	],
	disciplinas: [
		{
			nome: "Gestão Governamental e Governança Pública",
			de: 1,
			ate: 10,
		},
		{ nome: "Políticas Públicas", de: 11, ate: 20 },
		{
			nome: "Gerência e Suporte da Tecnologia da Informação",
			de: 21,
			ate: 30,
		},
		{ nome: "Desenvolvimento de Software", de: 31, ate: 40 },
		{
			nome: "Apoio à Decisão, IA e Métodos Quantitativos",
			de: 41,
			ate: 50,
		},
	],
	pageNoisePatterns: [
		/^\s*RASCUNHO\s*$/gim,
		/^\s*EIXO\s+[1-5]\s*$/gim,
		// Cabeçalho Cesgranrio do CNU (página + "CONCURSO P Ú BLICO" com espaços OCR)
		/(?:^|\n)\d{1,2}\nCONCURSO P\s*[UÚ]\s*BLICO\nNACIONAL UNIFICADO\nPROVA 10[\s\S]*?BLOCO 2\s*-\s*TARDE\n?/gi,
		/\nCONCURSO P\s*[UÚ]\s*BLICO\nNACIONAL UNIFICADO\nPROVA 10[\s\S]*?BLOCO 2\s*-\s*TARDE\n?/gi,
	],
};
