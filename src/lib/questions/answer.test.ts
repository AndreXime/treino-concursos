import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAnswerCorrect, registerQuestionAttempt } from "./answer";
import type { Prova, Question } from "./types";

const prova = {
	id: "p",
	titulo: "T",
	orgao: "O",
	cargo: "C",
	area: "A",
	banca: "B",
	ano: 2022,
	edital: "E",
	questoes: [],
} satisfies Prova;

const anulada: Question = {
	id: "p-q01",
	provaId: "p",
	numero: 1,
	enunciado: "item",
	alternativas: [
		{ id: "c", texto: "Certo" },
		{ id: "e", texto: "Errado" },
	],
	gabaritoId: "x",
	disciplina: "Ética",
	tipo: "certo_errado",
};

describe("anulado", () => {
	it("registerQuestionAttempt returns null and does not count", () => {
		assert.equal(registerQuestionAttempt(prova, anulada, "c"), null);
	});

	it("isAnswerCorrect is false for anulado", () => {
		assert.equal(isAnswerCorrect(anulada, "x"), false);
		assert.equal(isAnswerCorrect(anulada, "c"), false);
	});
});
