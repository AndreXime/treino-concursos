/**
 * Corrige gabarito oficial + limpa vazamentos comuns.
 * Uso: npx tsx fix-prova.mts <slug>
 */
import fs from "node:fs";
import { join } from "node:path";
import type { Prova } from "@/lib/questions/types";
import { getConcurso } from "./concursos";
import { loadConcursoGabarito } from "./gabarito";
import { cleanAlternativeText, DATA_ROOT } from "./shared";

const [slug] = process.argv.slice(2);
if (!slug) {
	console.error("Uso: npx tsx fix-prova.mts <slug>");
	process.exit(1);
}

const config = getConcurso(slug);
const jsonPath = join(DATA_ROOT, config.prova.jsonFileName);
const prova = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as Prova;
const gabarito = await loadConcursoGabarito(config);

let fixedGab = 0;
let fixedAlt = 0;

for (const q of prova.questoes) {
	const want = gabarito[q.numero];
	if (want && q.gabaritoId !== want) {
		q.gabaritoId = want;
		fixedGab += 1;
	}
	if (config.tipo === "multipla") {
		for (const alt of q.alternativas) {
			const cleaned = cleanAlternativeText(alt.texto);
			if (cleaned !== alt.texto) {
				alt.texto = cleaned;
				fixedAlt += 1;
			}
		}
	}
	q.enunciado = q.enunciado
		.replace(/\$\$\s*IMAGE\s+\d+\s*\$\$/g, "")
		.replace(/[ \t]{2,}/g, " ")
		.trim();
	q.tipo = config.tipo;
}

fs.writeFileSync(jsonPath, `${JSON.stringify(prova, null, 2)}\n`);
console.log(
	`Fixed ${jsonPath}: gabarito=${fixedGab}, alts=${fixedAlt}, keys=${Object.keys(gabarito).length}`,
);
