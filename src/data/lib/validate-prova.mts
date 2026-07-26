/**
 * Valida um JSON de prova contra o tipo Prova e o gabarito esperado.
 * Uso: npx tsx validate-prova.mts "../PROVA B - AGENTE COMERCIAL - GABARITO 1.json" B 1
 */
import fs from "node:fs";
import { resolve } from "node:path";
import type { Prova } from "@/lib/questions/types";
import {
	DISCIPLINAS_BB_AC,
	findGabaritoPdf,
	parseGabaritoPdf,
} from "./shared";

const [jsonPathArg, letterArg, gabNumArg] = process.argv.slice(2);
if (!jsonPathArg || !letterArg) {
	console.error(
		"Uso: npx tsx validate-prova.mts <json> <A|B|C> [gabaritoNumero=1]",
	);
	process.exit(1);
}

const jsonPath = resolve(jsonPathArg);
const letter = letterArg.toUpperCase();
const gabNum = Number.parseInt(gabNumArg ?? "1", 10);

const prova = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as Prova;
const expectedGabarito = await parseGabaritoPdf(
	findGabaritoPdf(letter),
	gabNum,
);

const errors: string[] = [];

if (prova.questoes.length !== 70) {
	errors.push(`count=${prova.questoes.length}`);
}

const nums = new Set<number>();
for (const q of prova.questoes) {
	if (nums.has(q.numero)) errors.push(`dup ${q.numero}`);
	nums.add(q.numero);

	if (q.provaId !== prova.id) errors.push(`Q${q.numero} provaId`);
	if (q.id !== `${prova.id}-q${String(q.numero).padStart(2, "0")}`) {
		errors.push(`Q${q.numero} id=${q.id}`);
	}
	if (q.alternativas.length !== 5) errors.push(`Q${q.numero} alts`);
	if (q.alternativas.map((a) => a.id).join("") !== "abcde") {
		errors.push(`Q${q.numero} alt ids`);
	}
	for (const a of q.alternativas) {
		if (!a.texto) errors.push(`Q${q.numero}${a.id} empty`);
		if (a.texto.length > 450) {
			errors.push(`Q${q.numero}${a.id} long=${a.texto.length}`);
		}
		if (
			/história do método|deep fake e saiba|Pix: é o fim|Jefferson says|Impacts of new age|How To Teach Your Kids|Available at:|Dado:/i.test(
				a.texto,
			)
		) {
			errors.push(`Q${q.numero}${a.id} leak`);
		}
	}
	if (/\$\$\s*IMAGE/i.test(q.enunciado)) {
		errors.push(`Q${q.numero} IMAGE leftover`);
	}
	const disc = DISCIPLINAS_BB_AC.find(
		(d) => q.numero >= d.de && q.numero <= d.ate,
	)?.nome;
	if (q.disciplina !== disc) {
		errors.push(`Q${q.numero} disciplina=${q.disciplina}`);
	}
	const expected = expectedGabarito[q.numero];
	if (q.gabaritoId !== expected) {
		errors.push(`Q${q.numero} gab=${q.gabaritoId} want=${expected}`);
	}
	if (q.numero <= 10 && q.enunciado.length < 800) {
		errors.push(`Q${q.numero} Portuguese support too short?`);
	}
	if (q.numero >= 11 && q.numero <= 15 && q.enunciado.length < 400) {
		errors.push(`Q${q.numero} English support too short?`);
	}
}

for (let n = 1; n <= 70; n++) {
	if (!nums.has(n)) errors.push(`missing ${n}`);
}

if (errors.length) {
	console.error("FAIL", jsonPath);
	console.error(errors.join("\n"));
	process.exit(1);
}

console.log("OK", jsonPath, `(${prova.questoes.length} questões, G${gabNum})`);
