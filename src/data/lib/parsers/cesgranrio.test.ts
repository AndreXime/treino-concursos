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
		area: "A",
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

	it("does not treat capa/instruções as support text", () => {
		const raw = `
LEIA ATENTAMENTE AS INSTRUÇÕES ABAIXO.
01 - ATENÇÃO: o candidato deve escrever seu nome no Cartão-Resposta e conferir o Caderno de Questões com material suficiente para parecer um bloco de apoio longo nas provas.
02 - O tempo disponível para esta Prova objetiva é de três horas e meia.

1
Pergunta limpa?
(A) um
(B) dois
(C) tres
(D) quatro
(E) cinco
`;
		const parsed = parseCesgranrioRaw(raw, config);
		const q = parsed.get(1);
		assert.ok(q);
		assert.equal(q.enunciado, "Pergunta limpa?");
		assert.doesNotMatch(q.enunciado, /LEIA ATENTAMENTE|Cartão-Resposta/);
	});

	it("strips leading question number even when match includes newline", () => {
		const raw = `
1
Enunciado sem prefixo numérico?
(A) um
(B) dois
(C) tres
(D) quatro
(E) cinco
`;
		const parsed = parseCesgranrioRaw(raw, config);
		const q = parsed.get(1);
		assert.ok(q);
		assert.equal(q.enunciado, "Enunciado sem prefixo numérico?");
	});
});
