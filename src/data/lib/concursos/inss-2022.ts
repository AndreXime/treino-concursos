import type { ConcursoConfig } from "./types";

export const inss2022: ConcursoConfig = {
	slug: "inss-2022",
	parser: "cebraspe",
	tipo: "certo_errado",
	expectedCount: 120,
	prova: {
		id: "inss-2022-tss",
		titulo: "INSS – Técnico do Seguro Social (2022)",
		orgao: "Instituto Nacional do Seguro Social",
		cargo: "Técnico do Seguro Social",
		banca: "CEBRASPE",
		ano: 2022,
		edital: "Edital 2022",
		jsonFileName: "INSS - 2022 - Tecnico do Seguro Social.json",
	},
	provaPdfs: [
		{
			fileName:
				"INSS - 2022 - Tecnico do Seguro Social - Prova Conhecimentos Basicos.pdf",
			artefactKey: "basicos",
		},
		{
			fileName:
				"INSS - 2022 - Tecnico do Seguro Social - Prova Conhecimentos Especificos.pdf",
			artefactKey: "especificos",
		},
	],
	gabaritos: [
		{
			fileName:
				"INSS - 2022 - Tecnico do Seguro Social - Gabarito Conhecimentos Basicos.pdf",
		},
		{
			fileName:
				"INSS - 2022 - Tecnico do Seguro Social - Gabarito Conhecimentos Especificos.pdf",
		},
	],
	disciplinas: [
		{ nome: "Língua Portuguesa", de: 1, ate: 14 },
		{ nome: "Ética no Serviço Público", de: 15, ate: 21 },
		{ nome: "Direitos e Garantias Fundamentais", de: 22, ate: 26 },
		{ nome: "Administração Pública", de: 27, ate: 35 },
		{ nome: "Direito Administrativo", de: 36, ate: 40 },
		{ nome: "Noções de Informática", de: 41, ate: 50 },
		{ nome: "Seguridade Social", de: 51, ate: 86 },
		{ nome: "Plano de Benefícios da Previdência Social", de: 87, ate: 99 },
		{ nome: "Assistência Social", de: 100, ate: 105 },
		{ nome: "Saúde e Organização da Seguridade", de: 106, ate: 120 },
	],
	pageNoisePatterns: [
		/CEBRASPE\s*[–-]\s*INSS\s*[–-]\s*Edital:\s*2022/gi,
		/^\s*\d{3}[A-Z0-9_]+\s*$/gim,
		/Para melhorar a sua experi[eê]ncia na plataforma[\s\S]*?Declara[cç][aã]o de\s*Cookies\./gi,
	],
};
