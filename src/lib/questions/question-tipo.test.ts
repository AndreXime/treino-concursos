import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	isQuestionAnulada,
	resolveQuestionTipo,
} from "./question-tipo";

describe("resolveQuestionTipo", () => {
	it("defaults missing tipo to multipla", () => {
		assert.equal(resolveQuestionTipo({}), "multipla");
	});

	it("returns certo_errado when set", () => {
		assert.equal(
			resolveQuestionTipo({ tipo: "certo_errado" }),
			"certo_errado",
		);
	});
});

describe("isQuestionAnulada", () => {
	it("detects gabarito x", () => {
		assert.equal(isQuestionAnulada({ gabaritoId: "x" }), true);
		assert.equal(isQuestionAnulada({ gabaritoId: "c" }), false);
	});
});
