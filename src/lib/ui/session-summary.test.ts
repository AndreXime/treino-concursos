import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Question } from "@/lib/questions/types";
import {
	firstQuestionWithStatus,
	shouldShowCompletion,
} from "./session-summary";

function stubQuestion(id: string): Question {
	return {
		id,
		provaId: "p",
		numero: 1,
		enunciado: "",
		alternativas: [],
		gabaritoId: "a",
		disciplina: "X",
		tipo: "multipla",
	};
}

describe("shouldShowCompletion", () => {
	it("hides when there is a next question", () => {
		assert.equal(
			shouldShowCompletion({
				hasNext: true,
				justFinished: true,
				allAnswered: true,
			}),
			false,
		);
	});

	it("shows when last and just finished", () => {
		assert.equal(
			shouldShowCompletion({
				hasNext: false,
				justFinished: true,
				allAnswered: false,
			}),
			true,
		);
	});

	it("shows when last and all answered", () => {
		assert.equal(
			shouldShowCompletion({
				hasNext: false,
				justFinished: false,
				allAnswered: true,
			}),
			true,
		);
	});
});

describe("firstQuestionWithStatus", () => {
	const questions = [stubQuestion("a"), stubQuestion("b"), stubQuestion("c")];

	it("finds first wrong", () => {
		const found = firstQuestionWithStatus(
			questions,
			"wrong",
			new Set(["a", "b"]),
			new Set(["a"]),
		);
		assert.equal(found?.id, "b");
	});

	it("finds first pending", () => {
		const found = firstQuestionWithStatus(
			questions,
			"pending",
			new Set(["a"]),
			new Set(["a"]),
		);
		assert.equal(found?.id, "b");
	});
});
