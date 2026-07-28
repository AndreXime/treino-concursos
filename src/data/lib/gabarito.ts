import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";
import type { ConcursoConfig, ParserKind } from "./concursos";

const LIB_ROOT = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(LIB_ROOT, "..", "raw");

export function parseCesgranrioGabarito(
	text: string,
	opts: { blockMarker?: string; gabaritoNumero?: number } = {},
): Record<number, string> {
	const normalized = text.replace(/\r\n/g, "\n");
	let block: string;

	if (opts.blockMarker) {
		const start = normalized.indexOf(opts.blockMarker);
		if (start < 0) {
			throw new Error(`Marcador de gabarito não encontrado: ${opts.blockMarker}`);
		}
		const after = normalized.slice(start + opts.blockMarker.length);
		const nextGab = after.search(/\n[^\n]*GABARITO\s+\d+/i);
		block =
			nextGab >= 0
				? normalized.slice(start, start + opts.blockMarker.length + nextGab)
				: normalized.slice(start);
	} else {
		const num = opts.gabaritoNumero ?? 1;
		const marker = `GABARITO ${num}`;
		const start = normalized.indexOf(marker);
		if (start < 0) {
			throw new Error(`Bloco ${marker} não encontrado`);
		}
		const next = normalized.indexOf("GABARITO ", start + marker.length);
		block =
			next >= 0 ? normalized.slice(start, next) : normalized.slice(start);
	}

	const gabarito: Record<number, string> = {};
	for (const match of block.matchAll(/(?<!\d)(\d{1,3})\s*-\s*([A-E])\b/gi)) {
		gabarito[Number.parseInt(match[1], 10)] = match[2].toLowerCase();
	}
	return gabarito;
}

export function parseCebraspeGabarito(text: string): Record<number, string> {
	const normalized = text.replace(/\r\n/g, "\n");
	const gabarito: Record<number, string> = {};

	for (const match of normalized.matchAll(/^(\d{1,3})\s*\n\s*([CEX])\s*$/gim)) {
		gabarito[Number.parseInt(match[1], 10)] = match[2].toLowerCase();
	}
	if (Object.keys(gabarito).length > 0) {
		return gabarito;
	}

	const lines = normalized
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);

	for (let i = 0; i < lines.length - 1; i++) {
		const nums = lines[i]
			.split(/\t+|\s{2,}/)
			.map((s) => s.trim())
			.filter(Boolean);
		const answers = lines[i + 1]
			.split(/\t+|\s{2,}/)
			.map((s) => s.trim())
			.filter(Boolean);
		if (nums.length === 0 || nums.length !== answers.length) {
			continue;
		}
		if (!nums.every((n) => /^\d{1,3}$/.test(n))) {
			continue;
		}
		if (!answers.every((a) => /^[CEX]$/i.test(a))) {
			continue;
		}
		for (let j = 0; j < nums.length; j++) {
			const n = Number.parseInt(nums[j], 10);
			if (n === 0) {
				continue;
			}
			gabarito[n] = answers[j].toLowerCase();
		}
	}

	return gabarito;
}

export async function loadGabaritoFromPdf(
	pdfPath: string,
	parser: ParserKind,
	opts: { blockMarker?: string; gabaritoNumero?: number } = {},
): Promise<Record<number, string>> {
	const buf = fs.readFileSync(pdfPath);
	const pdf = new PDFParse({ data: buf });
	try {
		const result = await pdf.getText({ pageJoiner: "" });
		const text = result.text;
		if (parser === "cebraspe") {
			return parseCebraspeGabarito(text);
		}
		return parseCesgranrioGabarito(text, opts);
	} finally {
		await pdf.destroy();
	}
}

export async function loadConcursoGabarito(
	config: ConcursoConfig,
): Promise<Record<number, string>> {
	const merged: Record<number, string> = {};
	for (const source of config.gabaritos) {
		const path = join(RAW_DIR, source.fileName);
		const part = await loadGabaritoFromPdf(path, config.parser, {
			blockMarker: source.blockMarker,
			gabaritoNumero: source.gabaritoNumero,
		});
		Object.assign(merged, part);
	}
	return merged;
}
