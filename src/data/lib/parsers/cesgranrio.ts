import type { ConcursoConfig } from "../concursos";
import {
	formatEnunciado,
	parseAlternativas,
	type ParsedQuestion,
} from "../shared";

function applyNoise(text: string, config: ConcursoConfig): string {
	let out = text.replace(/\r\n/g, "\n").replace(/--\s*\d+\s*of\s*\d+\s*--/g, "\n");
	for (const pattern of config.pageNoisePatterns ?? []) {
		out = out.replace(pattern, "\n");
	}
	return out.replace(/\n{3,}/g, "\n\n");
}

function looksLikeSupportBlock(text: string): boolean {
	const t = text.trim();
	if (t.length < 80) return false;
	if (/^\d{1,3}\n/.test(t)) return false;
	if (/^\(A\)/.test(t)) return false;
	return true;
}

/**
 * Parse Cesgranrio raw: número isolado + enunciado + (A)..(E).
 * Anexa o último bloco de apoio longo visto antes do grupo de questões.
 */
export function parseCesgranrioRaw(
	raw: string,
	config: ConcursoConfig,
): Map<number, ParsedQuestion> {
	const clean = applyNoise(raw, config);
	const questionRegex =
		/(?:^|\n)(\d{1,3})\n(?=\([A-E]\)|[A-ZÀ-Úa-zà-ú"“*])/g;
	const matches = Array.from(clean.matchAll(questionRegex));
	const byNumero = new Map<number, ParsedQuestion>();

	let lastSupport = "";
	let cursor = 0;

	for (let i = 0; i < matches.length; i++) {
		const match = matches[i];
		const start = match.index;
		if (start === undefined) continue;

		const between = clean.slice(cursor, start).trim();
		if (looksLikeSupportBlock(between)) {
			lastSupport = formatEnunciado(between);
		}

		const numero = Number.parseInt(match[1], 10);
		if (numero < 1 || numero > config.expectedCount) {
			cursor = start + match[0].length;
			continue;
		}

		const nextStart =
			i + 1 < matches.length ? matches[i + 1].index : clean.length;
		if (nextStart === undefined) continue;

		let block = clean.slice(start, nextStart).trim();
		block = applyNoise(block, config);

		const semNumero = block.replace(/^\d{1,3}\n/, "");
		const inicioAlt = semNumero.search(/\(A\)/);
		if (inicioAlt < 0) {
			cursor = nextStart;
			continue;
		}

		let enunciado = formatEnunciado(semNumero.slice(0, inicioAlt));
		const alternativas = parseAlternativas(semNumero.slice(inicioAlt));
		if (!enunciado || !alternativas) {
			cursor = nextStart;
			continue;
		}

		if (
			lastSupport &&
			!enunciado.startsWith(lastSupport.slice(0, Math.min(80, lastSupport.length)))
		) {
			enunciado = `${lastSupport}\n\n${enunciado}`;
		}

		const prev = byNumero.get(numero);
		if (!prev || enunciado.length >= prev.enunciado.length) {
			byNumero.set(numero, { enunciado, alternativas });
		}

		cursor = nextStart;
	}

	return byNumero;
}
