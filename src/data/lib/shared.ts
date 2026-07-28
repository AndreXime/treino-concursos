/**
 * Utilitários compartilhados: parse de raw.txt → questões + gabarito PDF.
 */
import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";
import type { QuestionOption } from "@/lib/questions/types";
import {
	DISCIPLINAS_BB_AC,
	disciplinaDoNumero as disciplinaFromRanges,
} from "./concursos";

export { DISCIPLINAS_BB_AC };

export const ALT_IDS = ["a", "b", "c", "d", "e"] as const;

export type AltId = (typeof ALT_IDS)[number];

const LIB_ROOT = dirname(fileURLToPath(import.meta.url));
export const DATA_ROOT = join(LIB_ROOT, "..");
export const RAW_DIR = join(DATA_ROOT, "raw");
export const ARTEFACTS_DIR = join(LIB_ROOT, "artefacts");

export function disciplinaDoNumero(n: number): string {
	return disciplinaFromRanges(DISCIPLINAS_BB_AC, n);
}

export function joinBrokenHyphens(text: string): string {
	return text
		.replace(/(\p{L})-\s*-(\p{L})/gu, "$1-$2")
		.replace(/(\p{L})-\n(\p{L})/gu, "$1$2")
		.replace(/(\p{L})-\s+(\p{L})/gu, "$1$2");
}

export function fixPdfGlyphs(text: string): string {
	return text
		.replace(/(\d)o(?=\s+(?:mês|meses|ano|anos|dia|dias)\b)/gi, "$1º")
		.replace(/\b(Lei|Carta Circular)\s+no\s+(?=\d)/g, "$1 nº ")
		.replace(/\b(Resolução(?:\s+[\p{L}.]+)?)\s+no\s+(?=\d)/gu, "$1 nº ")
		.replace(/[""„«»]/g, '"')
		.replace(/['']/g, "'");
}

export function flattenInline(text: string): string {
	return fixPdfGlyphs(
		joinBrokenHyphens(text)
			.replace(/\r\n/g, "\n")
			.replace(/\t+/g, " ")
			.replace(/[ \t]+\n/g, "\n")
			.replace(/\n+/g, " ")
			.replace(/\s{2,}/g, " ")
			.trim(),
	);
}

function isStructuralLine(line: string): boolean {
	const t = line.trim();
	if (!t) return false;
	if (t.includes("\t") || t.includes("|")) return true;
	if (/^\d+[).]/.test(t)) return true;
	if (/→/.test(t)) return true;
	if (/^[.\u2026\s]+$/.test(t) && /[.\u2026]/.test(t)) return true;
	if (/\S+\s{2,}\S+\s{2,}\S+/.test(t)) return true;
	if (/^[\d.?]+(?:\s+[\d.?]+)+$/.test(t)) return true;
	return false;
}

export function formatEnunciado(text: string): string {
	const normalized = joinBrokenHyphens(
		text.replace(/\r\n/g, "\n").replace(/\t+/g, " "),
	);
	const lines = normalized
		.split("\n")
		.map((line) => line.replace(/[ \t]+$/g, ""));

	const result: string[] = [];
	let proseBuf: string[] = [];

	const flushProse = () => {
		if (proseBuf.length === 0) return;
		result.push(proseBuf.join(" ").replace(/\s{2,}/g, " ").trim());
		proseBuf = [];
	};

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		if (isStructuralLine(line)) {
			flushProse();
			result.push(line.replace(/^\s+/, ""));
			continue;
		}
		proseBuf.push(trimmed);
	}
	flushProse();
	return fixPdfGlyphs(result.join("\n").trim());
}

export function stripPageNoise(text: string, provaLetter = "[ABC]"): string {
	const letter = provaLetter.replace(/[[\]]/g, "");
	return text
		.replace(/--\s*\d+\s*of\s*\d+\s*--/g, "\n")
		.replace(
			new RegExp(
				`AGENTE COMERCIAL\\s*-\\s*PROVA ${letter}\\d*GABARITO\\s*\\d+`,
				"gi",
			),
			"\n",
		)
		.replace(
			new RegExp(
				`AGENTE COMERCIAL\\s*-\\s*PROVA ${letter}\\s*GABARITO\\s*\\d+`,
				"gi",
			),
			"\n",
		)
		.replace(/^\s*BANCO DO BRASIL\s*$/gim, "")
		.replace(/^\s*RASCUNHO\s*$/gim, "")
		.replace(
			/^\s*(?:CONHECIMENTOS (?:BÁSICOS|ESPECÍFICOS)|LÍNGUA PORTUGUESA|LÍNGUA INGLESA|MATEMÁTICA(?: FINANCEIRA)?|ATUALIDADES(?:\s+DO MERCADO FINANCEIRO)?|CONHECIMENTOS BANCÁRIOS|CONHECIMENTOS DE INFORMÁTICA|VENDAS E NEGOCIAÇÃO)\s*$/gim,
			"",
		)
		.replace(/\n{3,}/g, "\n\n");
}

const NOISE_AFTER_ALT =
	/\n(?:--\s*\d+\s*of\s*\d+\s*--|CONHECIMENTOS\b|L[IÍ]NGUA\b|MATEM[AÁ]TICA\b|ATUALIDADES\b|VENDAS\b|RASCUNHO\b|BANCO DO BRASIL\b|AGENTE COMERCIAL\s*-\s*PROVA|Dado:).*$/is;

const LEAKED_AFTER_ALT =
	/\s+(?:A história do método braile\b|Entenda o que é deep fake\b|Pix: é o fim\b|Fed[\u2019']s?\s+Jefferson\b|Impacts of new age\b|How To Teach Your Kids\b|Available at:\b|CONHECIMENTOS\b|L[IÍ]NGUA\b|MATEM[AÁ]TICA\b|ATUALIDADES\b|VENDAS\b|RASCUNHO\b|Dados?:).*$/is;

export function cleanAlternativeText(texto: string): string {
	return flattenInline(
		texto.replace(NOISE_AFTER_ALT, "").replace(LEAKED_AFTER_ALT, ""),
	);
}

export function parseAlternativas(bloco: string): QuestionOption[] | null {
	const matches = Array.from(
		bloco.matchAll(/\(([A-E])\)\s*([\s\S]*?)(?=\([A-E]\)|$)/g),
	);
	if (matches.length < 5) return null;

	const porLetra = new Map<string, string>();
	for (const match of matches) {
		const letra = match[1].toLowerCase();
		porLetra.set(letra, cleanAlternativeText(match[2].trim()));
	}

	const alternativas: QuestionOption[] = [];
	for (const id of ALT_IDS) {
		const texto = porLetra.get(id);
		if (!texto) return null;
		alternativas.push({ id, texto });
	}
	return alternativas;
}

export interface ParsedQuestion {
	enunciado: string;
	alternativas: QuestionOption[];
}

export function extractQuestionsFromRaw(
	raw: string,
	provaLetter: string,
): Map<number, ParsedQuestion> {
	const clean = stripPageNoise(raw.replace(/\r\n/g, "\n"), provaLetter);
	const questionRegex =
		/(?:^|\n)(\d{1,2})\n(?=\([A-E]\)|[A-ZÀ-Úa-zà-ú0-9"“])/g;
	const matches = Array.from(clean.matchAll(questionRegex));
	const byNumero = new Map<number, ParsedQuestion>();

	for (let i = 0; i < matches.length; i++) {
		const match = matches[i];
		const start = match.index;
		if (start === undefined) continue;

		const numero = Number.parseInt(match[1], 10);
		if (numero < 1 || numero > 70) continue;

		const nextStart =
			i + 1 < matches.length ? matches[i + 1].index : clean.length;
		if (nextStart === undefined) continue;

		let block = clean.slice(start, nextStart).trim();
		block = stripPageNoise(block, provaLetter);

		const semNumero = block.replace(/^\d{1,2}\n/, "");
		const inicioAlt = semNumero.search(/\(A\)/);
		if (inicioAlt < 0) continue;

		const enunciado = formatEnunciado(semNumero.slice(0, inicioAlt));
		const alternativas = parseAlternativas(semNumero.slice(inicioAlt));
		if (!enunciado || !alternativas) continue;

		const prev = byNumero.get(numero);
		if (!prev || enunciado.length >= prev.enunciado.length) {
			byNumero.set(numero, { enunciado, alternativas });
		}
	}

	return byNumero;
}

/** Extrai mapa questão→letra do bloco GABARITO N de um PDF de gabarito. */
export async function parseGabaritoPdf(
	pdfPath: string,
	gabaritoNumero: number,
): Promise<Record<number, string>> {
	const buf = fs.readFileSync(pdfPath);
	const parser = new PDFParse({ data: buf });
	try {
		const result = await parser.getText({ pageJoiner: "" });
		const text = result.text.replace(/\r\n/g, "\n");
		const marker = `GABARITO ${gabaritoNumero}`;
		const start = text.indexOf(marker);
		if (start < 0) {
			throw new Error(`Bloco ${marker} não encontrado em ${pdfPath}`);
		}
		const next = text.indexOf("GABARITO ", start + marker.length);
		const block = next >= 0 ? text.slice(start, next) : text.slice(start);

		const gabarito: Record<number, string> = {};
		for (const match of block.matchAll(
			/(?<!\d)(\d{1,2})\s*-\s*([A-E])\b/gi,
		)) {
			gabarito[Number.parseInt(match[1], 10)] = match[2].toLowerCase();
		}
		return gabarito;
	} finally {
		await parser.destroy();
	}
}

export function findGabaritoPdf(provaLetter: string): string {
	const files = fs.readdirSync(RAW_DIR);
	const match = files.find(
		(name) =>
			name.startsWith("GABARITO") &&
			name.includes(`PROVA ${provaLetter}`) &&
			name.endsWith(".pdf"),
	);
	if (!match) {
		throw new Error(`Gabarito da prova ${provaLetter} não encontrado`);
	}
	return join(RAW_DIR, match);
}

export function assertSeventy(
	parsed: Map<number, ParsedQuestion>,
	gabarito: Record<number, string>,
): void {
	const missingQ: number[] = [];
	const missingG: number[] = [];
	for (let n = 1; n <= 70; n++) {
		if (!parsed.has(n)) missingQ.push(n);
		if (!gabarito[n]) missingG.push(n);
	}
	if (missingQ.length || missingG.length) {
		throw new Error(
			`Faltam questões: [${missingQ}] / gabarito: [${missingG}]`,
		);
	}
}
