import fs from "node:fs";
import { join } from "node:path";
import type { Prova, Question } from "@/lib/questions/types";
import { getConcurso, disciplinaDoNumero } from "./concursos";
import { loadConcursoGabarito } from "./gabarito";
import { parseCebraspeRaw } from "./parsers/cebraspe";
import { parseCesgranrioRaw } from "./parsers/cesgranrio";
import { ARTEFACTS_DIR, DATA_ROOT, type ParsedQuestion } from "./shared";

function stripImages(text: string): string {
	return text
		.replace(/\$\$\s*IMAGE\s+\d+\s*\$\$/g, "")
		.replace(/[ \t]{2,}/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function readRawForConfig(slug: string, artefactKey?: string): string {
	const dirName = artefactKey ? `${slug}-${artefactKey}` : slug;
	const rawPath = join(ARTEFACTS_DIR, dirName, "raw.txt");
	if (!fs.existsSync(rawPath)) {
		throw new Error(
			`raw.txt não encontrado: ${rawPath}. Rode extract-pdf.mts ${slug}`,
		);
	}
	return fs.readFileSync(rawPath, "utf-8");
}

function mergeParsed(
	maps: Map<number, ParsedQuestion>[],
): Map<number, ParsedQuestion> {
	const out = new Map<number, ParsedQuestion>();
	for (const map of maps) {
		for (const [n, q] of map) {
			const prev = out.get(n);
			if (!prev || q.enunciado.length >= prev.enunciado.length) {
				out.set(n, q);
			}
		}
	}
	return out;
}

const [slug] = process.argv.slice(2);
if (!slug) {
	console.error("Uso: npx tsx build-prova.mts <slug>");
	process.exit(1);
}

const config = getConcurso(slug);
const parsedMaps: Map<number, ParsedQuestion>[] = [];

for (const source of config.provaPdfs) {
	const raw = readRawForConfig(config.slug, source.artefactKey);
	if (config.parser === "cebraspe") {
		parsedMaps.push(parseCebraspeRaw(raw, config));
	} else {
		parsedMaps.push(parseCesgranrioRaw(raw, config));
	}
}

const parsed = mergeParsed(parsedMaps);
const gabarito = await loadConcursoGabarito(config);

const missingQ: number[] = [];
const missingG: number[] = [];
for (let n = 1; n <= config.expectedCount; n++) {
	if (!parsed.has(n)) missingQ.push(n);
	if (!gabarito[n]) missingG.push(n);
}
if (missingQ.length || missingG.length) {
	console.error(
		`Faltam questões: [${missingQ.join(",")}] / gabarito: [${missingG.join(",")}]`,
	);
	process.exit(1);
}

const questoes: Question[] = [];
for (let n = 1; n <= config.expectedCount; n++) {
	const q = parsed.get(n);
	if (!q) continue;
	const pad = String(n).padStart(2, "0");
	questoes.push({
		id: `${config.prova.id}-q${pad}`,
		provaId: config.prova.id,
		numero: n,
		enunciado: stripImages(q.enunciado),
		alternativas: q.alternativas.map((a) => ({
			id: a.id,
			texto: a.texto,
		})),
		gabaritoId: gabarito[n],
		disciplina: disciplinaDoNumero(config.disciplinas, n),
		tipo: config.tipo,
	});
}

const prova: Prova = {
	id: config.prova.id,
	titulo: config.prova.titulo,
	orgao: config.prova.orgao,
	cargo: config.prova.cargo,
	banca: config.prova.banca,
	ano: config.prova.ano,
	edital: config.prova.edital,
	questoes,
};

const outPath = join(DATA_ROOT, config.prova.jsonFileName);
fs.writeFileSync(outPath, `${JSON.stringify(prova, null, 2)}\n`);
console.log(`OK ${outPath} (${questoes.length} questões)`);
