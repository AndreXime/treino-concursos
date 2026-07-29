import { bbAcA, bbAcB, bbAcC } from "./bb-ac";
import { caixa2024 } from "./caixa-2024";
import { cnu2024b8 } from "./cnu-2024-b8";
import { inss2022 } from "./inss-2022";
import type { ConcursoConfig } from "./types";

const REGISTRY: ConcursoConfig[] = [
	bbAcA,
	bbAcB,
	bbAcC,
	caixa2024,
	cnu2024b8,
	inss2022,
];

export function listConcursos(): ConcursoConfig[] {
	return [...REGISTRY];
}

export function getConcurso(slug: string): ConcursoConfig {
	const found = REGISTRY.find((c) => c.slug === slug);
	if (!found) {
		throw new Error(
			`Concurso desconhecido: ${slug}. Disponíveis: ${REGISTRY.map((c) => c.slug).join(", ")}`,
		);
	}
	return found;
}

export type { ConcursoConfig, DisciplinaRange, ParserKind } from "./types";
export { disciplinaDoNumero } from "./types";
export { DISCIPLINAS_BB_AC } from "./bb-ac";
