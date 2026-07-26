import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { questionNavCellClass } from "./question-styles";

describe("questionNavCellClass", () => {
	it("wrong differs from pending", () => {
		const pending = questionNavCellClass("pending", false);
		const wrong = questionNavCellClass("wrong", false);
		assert.notEqual(pending, wrong);
		assert.match(wrong, /danger/);
	});

	it("active correct keeps success and adds ring", () => {
		const cls = questionNavCellClass("correct", true);
		assert.match(cls, /success/);
		assert.match(cls, /ring/);
	});
});
