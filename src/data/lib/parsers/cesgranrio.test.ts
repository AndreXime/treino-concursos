import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ConcursoConfig } from "../concursos";
import { parseCesgranrioRaw } from "./cesgranrio";

const config = {
	slug: "test",
	parser: "cesgranrio",
	tipo: "multipla",
	expectedCount: 5,
	prova: {
		id: "t",
		titulo: "T",
		orgao: "O",
		cargo: "C",
		banca: "B",
		ano: 2024,
		edital: "E",
		jsonFileName: "t.json",
	},
	provaPdfs: [],
	gabaritos: [],
	disciplinas: [{ nome: "Língua Portuguesa", de: 1, ate: 5 }],
} satisfies ConcursoConfig;

describe("parseCesgranrioRaw", () => {
	it("parses question with support text", () => {
		const raw = `
TEXTO DE APOIO AQUI COM CONTEUDO SUFICIENTEMENTE LONGO PARA SER CONSIDERADO BLOCO DE APOIO NAS PROVAS CESGRANRIO DE LINGUA PORTUGUESA E AFINS QUANDO O PARSE OCORRE.

1
Pergunta sobre o texto?
(A) um
(B) dois
(C) tres
(D) quatro
(E) cinco
`;
		const parsed = parseCesgranrioRaw(raw, config);
		const q = parsed.get(1);
		assert.ok(q);
		assert.match(q.enunciado, /TEXTO DE APOIO/);
		assert.match(q.enunciado, /Pergunta sobre o texto/);
		assert.equal(q.alternativas.length, 5);
		assert.equal(q.alternativas[0].id, "a");
	});
});
