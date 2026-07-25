import fs from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Prova } from "@/lib/questions/types";
import { extractQuestionsFromPDF } from "../extractQuestions";
import {
	aplicarEnunciadoOverride,
	aplicarNotaEnunciado,
	disciplinaDoNumero,
	textoApoioDoNumero,
} from "../utils";
import {
	disciplinas,
	enunciadosOverride,
	gabarito,
	notasEnunciado,
	textosApoio,
} from "./staticData";

const resolvePath = (path: string) =>
	join(dirname(fileURLToPath(import.meta.url)), path);

async function main() {
	const inputPath = resolvePath("raw.pdf");
	const questions = await extractQuestionsFromPDF(inputPath);

	const prova: Prova = {
		id: "bb-ac-2022-a-g1",
		titulo: "BB Escriturário – Agente Comercial (Prova A · Gabarito 1)",
		orgao: "Banco do Brasil",
		cargo: "Escriturário – Agente Comercial",
		banca: "CESGRANRIO",
		ano: 2023,
		edital: "Seleção Externa 2022/001",
		questoes: questions.map((q) => {
			const apoio = textoApoioDoNumero(q.numero, textosApoio);
			const enunciadoComApoio = apoio
				? `${apoio}\n\n${q.enunciado}`
				: q.enunciado;
			const enunciado = aplicarNotaEnunciado(
				aplicarEnunciadoOverride(
					enunciadoComApoio,
					q.numero,
					enunciadosOverride,
				),
				q.numero,
				notasEnunciado,
			);
			return {
				...q,
				enunciado,
				disciplina: disciplinaDoNumero(q.numero, disciplinas),
				gabaritoId: gabarito[q.numero] ?? "",
			};
		}),
	};

	const outPath = resolvePath("processed.json");
	fs.writeFileSync(outPath, JSON.stringify(prova, null, 2), "utf-8");
}

await main();
