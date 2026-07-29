import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sessionProgressLabel } from "./labels";

describe("sessionProgressLabel", () => {
	it("formats totals", () => {
		assert.equal(
			sessionProgressLabel({ total: 70, correct: 8, wrong: 4 }),
			"12/70 · 8 acertos · 4 erros",
		);
	});

	it("singular forms", () => {
		assert.equal(
			sessionProgressLabel({ total: 1, correct: 1, wrong: 0 }),
			"1/1 · 1 acerto · 0 erros",
		);
	});
});
