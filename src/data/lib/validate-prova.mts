/**
 * Valida JSON de prova pelo slug do config.
 * Uso: npx tsx validate-prova.mts <slug>
 */
import fs from "node:fs";
import { join } from "node:path";
import type { Prova } from "@/lib/questions/types";
import { getConcurso, disciplinaDoNumero } from "./concursos";
import { loadConcursoGabarito } from "./gabarito";
import { DATA_ROOT } from "./shared";

const [slug] = process.argv.slice(2);
if (!slug) {
	console.error("Uso: npx tsx validate-prova.mts <slug>");
	process.exit(1);
}

const config = getConcurso(slug);
const jsonPath = join(DATA_ROOT, config.prova.jsonFileName);
const prova = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as Prova;
const expectedGabarito = await loadConcursoGabarito(config);

const errors: string[] = [];

if (prova.id !== config.prova.id) {
	errors.push(`prova.id=${prova.id}`);
}
if (prova.questoes.length !== config.expectedCount) {
	errors.push(`count=${prova.questoes.length} want=${config.expectedCount}`);
}

const nums = new Set<number>();
for (const q of prova.questoes) {
	if (nums.has(q.numero)) errors.push(`dup ${q.numero}`);
	nums.add(q.numero);

	if (q.provaId !== prova.id) errors.push(`Q${q.numero} provaId`);
	if (q.id !== `${prova.id}-q${String(q.numero).padStart(2, "0")}`) {
		errors.push(`Q${q.numero} id=${q.id}`);
	}
	if (q.tipo !== config.tipo) {
		errors.push(`Q${q.numero} tipo=${q.tipo}`);
	}

	if (config.tipo === "multipla") {
		if (q.alternativas.length !== 5) errors.push(`Q${q.numero} alts`);
		if (q.alternativas.map((a) => a.id).join("") !== "abcde") {
			errors.push(`Q${q.numero} alt ids`);
		}
	} else {
		if (q.alternativas.length !== 2) errors.push(`Q${q.numero} alts`);
		if (q.alternativas.map((a) => a.id).join("") !== "ce") {
			errors.push(`Q${q.numero} alt ids`);
		}
	}

	for (const a of q.alternativas) {
		if (!a.texto) errors.push(`Q${q.numero}${a.id} empty`);
		if (config.tipo === "multipla" && a.texto.length > 800) {
			errors.push(`Q${q.numero}${a.id} long=${a.texto.length}`);
		}
	}

	if (/\$\$\s*IMAGE/i.test(q.enunciado)) {
		errors.push(`Q${q.numero} IMAGE leftover`);
	}

	const disc = disciplinaDoNumero(config.disciplinas, q.numero);
	if (q.disciplina !== disc) {
		errors.push(`Q${q.numero} disciplina=${q.disciplina}`);
	}

	const expected = expectedGabarito[q.numero];
	if (q.gabaritoId !== expected) {
		errors.push(`Q${q.numero} gab=${q.gabaritoId} want=${expected}`);
	}

	if (!["a", "b", "c", "d", "e", "x"].includes(q.gabaritoId)) {
		errors.push(`Q${q.numero} gabaritoId inválido=${q.gabaritoId}`);
	}
}

for (let n = 1; n <= config.expectedCount; n++) {
	if (!nums.has(n)) errors.push(`missing ${n}`);
}

if (errors.length) {
	console.error("FAIL", jsonPath);
	console.error(errors.join("\n"));
	process.exit(1);
}

console.log(
	"OK",
	jsonPath,
	`(${prova.questoes.length} questões, ${config.tipo})`,
);
