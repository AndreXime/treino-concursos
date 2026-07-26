/**
 * Corrige gabarito oficial + limpa vazamentos comuns nos JSONs B/C.
 */
import fs from "node:fs";
import { resolve } from "node:path";
import type { Prova } from "@/lib/questions/types";
import { cleanAlternativeText, findGabaritoPdf, parseGabaritoPdf } from "./shared";

const [jsonPathArg, letterArg, gabNumArg] = process.argv.slice(2);
if (!jsonPathArg || !letterArg) {
	console.error("Uso: npx tsx fix-prova.mts <json> <B|C> [1]");
	process.exit(1);
}

const jsonPath = resolve(jsonPathArg);
const letter = letterArg.toUpperCase();
const gabNum = Number.parseInt(gabNumArg ?? "1", 10);

const prova = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as Prova;
const gabarito = await parseGabaritoPdf(findGabaritoPdf(letter), gabNum);

let fixedGab = 0;
let fixedAlt = 0;

for (const q of prova.questoes) {
	const want = gabarito[q.numero];
	if (want && q.gabaritoId !== want) {
		q.gabaritoId = want;
		fixedGab += 1;
	}
	for (const alt of q.alternativas) {
		const cleaned = cleanAlternativeText(alt.texto);
		if (cleaned !== alt.texto) {
			alt.texto = cleaned;
			fixedAlt += 1;
		}
	}
	q.enunciado = q.enunciado
		.replace(/\$\$\s*IMAGE\s+\d+\s*\$\$/g, "")
		.replace(/[ \t]{2,}/g, " ")
		.trim();
}

fs.writeFileSync(jsonPath, `${JSON.stringify(prova, null, 2)}\n`);
console.log(
	`Fixed ${jsonPath}: gabarito=${fixedGab}, alts=${fixedAlt}, keys=${Object.keys(gabarito).length}`,
);
