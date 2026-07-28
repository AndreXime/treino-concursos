import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Question } from "@/lib/questions/types";
import { findNextQuestion, findPreviousQuestion } from "./progress";

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

describe("findPreviousQuestion / findNextQuestion", () => {
	const questions = [stubQuestion("a"), stubQuestion("b"), stubQuestion("c")];

	it("returns previous or null", () => {
		assert.equal(findPreviousQuestion(questions, "b")?.id, "a");
		assert.equal(findPreviousQuestion(questions, "a"), null);
	});

	it("returns next or null", () => {
		assert.equal(findNextQuestion(questions, "b")?.id, "c");
		assert.equal(findNextQuestion(questions, "c"), null);
	});
});
