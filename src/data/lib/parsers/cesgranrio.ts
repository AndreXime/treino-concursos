import type { ConcursoConfig } from "../concursos";
import {
	formatEnunciado,
	type ParsedQuestion,
	parseAlternativas,
} from "../shared";

function applyNoise(text: string, config: ConcursoConfig): string {
	let out = text
		.replace(/\r\n/g, "\n")
		.replace(/--\s*\d+\s*of\s*\d+\s*--/g, "\n");
	for (const pattern of config.pageNoisePatterns ?? []) {
		out = out.replace(pattern, "\n");
	}
	return out.replace(/\n{3,}/g, "\n\n");
}

function isSectionHeader(line: string): boolean {
	const t = line.trim();
	if (!t || t.length > 90) return false;
	return /^(CONHECIMENTOS|L[IÍ]NGUA|MATEM[AÁ]TICA|ATUALIDADES|VENDAS|RASCUNHO|NO[CÇ][OÕ]ES|COMPORTAMENTOS|ATENDIMENTO|PROVA\b)/i.test(
		t,
	);
}

function refineSupport(between: string): string {
	let t = between.replace(/\r\n/g, "\n").trim();
	t = t.replace(
		/^[\s\S]*?\bLEIA ATENTAMENTE[\s\S]*?(?=\n[A-Za-zÀ-ú"“]|\n\d)/i,
		"",
	);
	const lines = t.split("\n");
	let start = 0;
	for (let i = 0; i < lines.length; i++) {
		if (isSectionHeader(lines[i])) {
			start = i + 1;
		}
	}
	const body = lines.slice(start);
	let bodyStart = 0;
	while (
		bodyStart < body.length &&
		(/^\d{1,3}$/.test(body[bodyStart].trim()) || !body[bodyStart].trim())
	) {
		bodyStart += 1;
	}
	return body.slice(bodyStart).join("\n").trim();
}

function looksLikeSupportBlock(text: string): boolean {
	const t = text.trim();
	if (t.length < 80 || t.length > 25000) return false;
	if (/LEIA ATENTAMENTE/i.test(t)) return false;
	if (/Cart[aã]o-Resposta|Caderno de Quest[oõ]es/i.test(t)) return false;
	if (/^\d{1,3}\n/.test(t)) return false;
	if (/^\(A\)/.test(t)) return false;
	return /[a-zà-ú]{4,}/i.test(t);
}

function alternativesFootprint(q: ParsedQuestion): number {
	return q.alternativas.reduce((sum, alt) => sum + alt.texto.length, 0);
}

function shouldReplace(prev: ParsedQuestion, next: ParsedQuestion): boolean {
	const prevFoot = alternativesFootprint(prev);
	const nextFoot = alternativesFootprint(next);
	if (nextFoot < prevFoot - 40) return true;
	if (prevFoot < nextFoot - 40) return false;
	return next.enunciado.length >= prev.enunciado.length;
}

function endOfAlternatives(altSection: string): number | null {
	const matches = Array.from(
		altSection.matchAll(
			/\(([A-E])\)\s*([\s\S]*?)(?=\([A-E]\)|\n\d{1,3}\n|\n(?:L[IÍ]NGUA|MATEM[AÁ]TICA|CONHECIMENTOS|RASCUNHO|NO[CÇ][OÕ]ES|COMPORTAMENTOS|ATENDIMENTO)\b|$)/gi,
		),
	);
	if (matches.length < 5) return null;
	const fifth = matches[4];
	if (fifth.index === undefined) return null;
	return fifth.index + fifth[0].length;
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
	const questionRegex = /(?:^|\n)(\d{1,3})\n(?=\([A-E]\)|[A-ZÀ-Úa-zà-ú"“*])/g;
	const matches = Array.from(clean.matchAll(questionRegex));
	const byNumero = new Map<number, ParsedQuestion>();

	let lastSupport = "";
	let cursor = 0;

	for (let i = 0; i < matches.length; i++) {
		const match = matches[i];
		const start = match.index;
		if (start === undefined) continue;

		if (start < cursor) {
			continue;
		}

		const between = clean.slice(cursor, start).trim();
		if (between.split("\n").some((line) => isSectionHeader(line))) {
			lastSupport = "";
		}
		const refined = refineSupport(between);
		if (looksLikeSupportBlock(refined)) {
			lastSupport = formatEnunciado(refined);
		}

		const numero = Number.parseInt(match[1], 10);
		if (numero < 1 || numero > config.expectedCount) {
			cursor = start + match[0].length;
			continue;
		}

		const nextStart =
			i + 1 < matches.length ? matches[i + 1].index : clean.length;
		if (nextStart === undefined) continue;

		const window = clean.slice(start, nextStart);
		const semNumero = window.replace(/^\n?\d{1,3}\n/, "");
		const inicioAlt = semNumero.search(/\(A\)/);
		if (inicioAlt < 0) {
			cursor = start + match[0].length;
			continue;
		}

		const altSection = semNumero.slice(inicioAlt);
		const altEnd = endOfAlternatives(altSection);
		const alternativas = parseAlternativas(altSection);
		let enunciado = formatEnunciado(semNumero.slice(0, inicioAlt));
		if (!enunciado || !alternativas || altEnd === null) {
			cursor = start + match[0].length;
			continue;
		}

		if (
			lastSupport &&
			!enunciado.startsWith(
				lastSupport.slice(0, Math.min(80, lastSupport.length)),
			)
		) {
			enunciado = `${lastSupport}\n\n${enunciado}`;
		}

		const candidate: ParsedQuestion = { enunciado, alternativas };
		const prev = byNumero.get(numero);
		if (!prev || shouldReplace(prev, candidate)) {
			byNumero.set(numero, candidate);
		}

		// Avança só até o fim das alternativas, para o texto seguinte
		// (apoio da próxima seção) virar `between` da próxima questão.
		const numberPrefixLen = window.length - semNumero.length;
		cursor = start + numberPrefixLen + inicioAlt + altEnd;
	}

	return byNumero;
}
