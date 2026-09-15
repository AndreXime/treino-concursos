import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getConcurso, listConcursos } from "./index";

describe("concursos registry", () => {
	it("resolves caixa slug", () => {
		const c = getConcurso("caixa-2024");
		assert.equal(c.parser, "cesgranrio");
		assert.equal(c.expectedCount, 60);
		assert.equal(c.tipo, "multipla");
	});

	it("resolves inss slug", () => {
		const c = getConcurso("inss-2022");
		assert.equal(c.parser, "cebraspe");
		assert.equal(c.expectedCount, 120);
		assert.equal(c.tipo, "certo_errado");
		assert.equal(c.provaPdfs.length, 2);
	});

	it("lists bb + caixa + inss", () => {
		assert.equal(listConcursos().length, 3);
	});
});
