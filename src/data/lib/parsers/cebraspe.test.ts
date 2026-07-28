import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ConcursoConfig } from "../concursos";
import { parseCebraspeRaw } from "./cebraspe";

const config = {
	slug: "test",
	parser: "cebraspe",
	tipo: "certo_errado",
	expectedCount: 5,
	prova: {
		id: "t",
		titulo: "T",
		orgao: "O",
		cargo: "C",
		banca: "B",
		ano: 2022,
		edital: "E",
		jsonFileName: "t.json",
	},
	provaPdfs: [],
	gabaritos: [],
	disciplinas: [{ nome: "Ética", de: 1, ate: 5 }],
} satisfies ConcursoConfig;

describe("parseCebraspeRaw", () => {
	it("parses C/E items with stem", () => {
		const raw = `
Julgue os itens a seguir, relativos ao tema proposto nesta prova objetiva.
1 Afirmação verdadeira sobre o assunto tratado.
2 Afirmação falsa sobre o mesmo tema da prova.
`;
		const parsed = parseCebraspeRaw(raw, config);
		assert.equal(parsed.size, 2);
		const q1 = parsed.get(1);
		assert.ok(q1);
		assert.match(q1.enunciado, /Julgue os itens/);
		assert.match(q1.enunciado, /Afirmação verdadeira/);
		assert.equal(q1.alternativas.map((a) => a.id).join(""), "ce");
	});
});
