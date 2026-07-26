import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveQuestionNavStatus } from "./question-status";

describe("resolveQuestionNavStatus", () => {
	it("pending when never answered", () => {
		assert.equal(
			resolveQuestionNavStatus("q1", new Set(), new Set()),
			"pending",
		);
	});

	it("wrong when answered but not correct", () => {
		assert.equal(
			resolveQuestionNavStatus("q1", new Set(["q1"]), new Set()),
			"wrong",
		);
	});

	it("correct when in correctIds", () => {
		assert.equal(
			resolveQuestionNavStatus("q1", new Set(["q1"]), new Set(["q1"])),
			"correct",
		);
	});
});
