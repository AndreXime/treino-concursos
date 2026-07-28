import type { Question, QuestionTipo } from "./types";

export function resolveQuestionTipo(
	question: Pick<Question, "tipo"> | { tipo?: QuestionTipo },
): QuestionTipo {
	return question.tipo ?? "multipla";
}

export function isQuestionAnulada(
	question: Pick<Question, "gabaritoId">,
): boolean {
	return question.gabaritoId.toLowerCase() === "x";
}
