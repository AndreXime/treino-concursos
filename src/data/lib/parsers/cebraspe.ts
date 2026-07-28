import type { QuestionOption } from "@/lib/questions/types";
import type { ConcursoConfig } from "../concursos";
import { formatEnunciado, type ParsedQuestion } from "../shared";

export const CERTO_ERRADO_ALTS: QuestionOption[] = [
	{ id: "c", texto: "Certo" },
	{ id: "e", texto: "Errado" },
];

function applyNoise(text: string, config: ConcursoConfig): string {
	let out = text.replace(/\r\n/g, "\n").replace(/--\s*\d+\s*of\s*\d+\s*--/g, "\n");
	for (const pattern of config.pageNoisePatterns ?? []) {
		out = out.replace(pattern, "\n");
	}
	return out.replace(/\n{3,}/g, "\n\n").trim();
}

function isStemIntro(line: string): boolean {
	return /^(Julgue|Com base|Acerca|Em relação|No que|A respeito|Considerando|Tendo|Na situação|Nessa situação)\b/i.test(
		line.trim(),
	);
}

/**
 * Parse Cebraspe C/E: itens "N texto" com texto-base do bloco anexado.
 */
export function parseCebraspeRaw(
	raw: string,
	config: ConcursoConfig,
): Map<number, ParsedQuestion> {
	const clean = applyNoise(raw, config);
	const itemRegex =
		/(?:^|\n)(\d{1,3})\s+(?=[A-ZÀ-Úa-zà-ú"“(•*\d])/g;
	const matches = Array.from(clean.matchAll(itemRegex));
	const byNumero = new Map<number, ParsedQuestion>();

	let currentStem = "";
	let cursor = 0;

	for (let i = 0; i < matches.length; i++) {
		const match = matches[i];
		const start = match.index;
		if (start === undefined) continue;

		const between = clean.slice(cursor, start).trim();
		if (between) {
			const lines = between.split("\n").map((l) => l.trim()).filter(Boolean);
			const stemLines: string[] = [];
			for (const line of lines) {
				if (isStemIntro(line) || stemLines.length > 0) {
					stemLines.push(line);
				}
			}
			if (stemLines.length > 0) {
				currentStem = formatEnunciado(stemLines.join("\n"));
			} else if (between.length > 120 && !/^\d{1,3}\s/.test(between)) {
				currentStem = formatEnunciado(between);
			}
		}

		const numero = Number.parseInt(match[1], 10);
		if (numero < 1 || numero > config.expectedCount) {
			cursor = start + match[0].length;
			continue;
		}

		const nextStart =
			i + 1 < matches.length ? matches[i + 1].index : clean.length;
		if (nextStart === undefined) continue;

		const block = clean.slice(start, nextStart).trim();
		const itemBody = block.replace(/^\d{1,3}\s+/, "").trim();
		const itemText = formatEnunciado(itemBody);
		if (!itemText) {
			cursor = nextStart;
			continue;
		}

		const enunciado = currentStem
			? `${currentStem}\n\n${numero} ${itemText}`
			: `${numero} ${itemText}`;

		const prev = byNumero.get(numero);
		if (!prev || enunciado.length >= prev.enunciado.length) {
			byNumero.set(numero, {
				enunciado,
				alternativas: CERTO_ERRADO_ALTS.map((a) => ({ ...a })),
			});
		}

		cursor = nextStart;
	}

	return byNumero;
}
