import type { QuestionTipo } from "@/lib/questions/types";

export type ParserKind = "cesgranrio" | "cebraspe";

export interface DisciplinaRange {
	nome: string;
	de: number;
	ate: number;
}

export interface ProvaPdfSource {
	fileName: string;
	artefactKey?: string;
}

export interface GabaritoSource {
	fileName: string;
	gabaritoNumero?: number;
	blockMarker?: string;
}

export interface ConcursoConfig {
	slug: string;
	parser: ParserKind;
	tipo: QuestionTipo;
	expectedCount: number;
	prova: {
		id: string;
		titulo: string;
		orgao: string;
		cargo: string;
		area: string;
		banca: string;
		ano: number;
		edital: string;
		jsonFileName: string;
	};
	provaPdfs: ProvaPdfSource[];
	gabaritos: GabaritoSource[];
	disciplinas: DisciplinaRange[];
	pageNoisePatterns?: RegExp[];
}

export function disciplinaDoNumero(
	disciplinas: DisciplinaRange[],
	n: number,
): string {
	return disciplinas.find((d) => n >= d.de && n <= d.ate)?.nome ?? "";
}
