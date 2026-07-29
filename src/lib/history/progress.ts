import { listAttempts } from "@/lib/history/store";
import type { Question } from "@/lib/questions/types";

export function loadAnsweredIds(provaId: string): Set<string> {
	const answeredIds = new Set<string>();
	for (const attempt of listAttempts()) {
		if (attempt.provaId === provaId) {
			answeredIds.add(attempt.questionId);
		}
	}
	return answeredIds;
}

export function loadCorrectIds(provaId: string): Set<string> {
	const correctIds = new Set<string>();
	for (const attempt of listAttempts()) {
		if (attempt.provaId === provaId && attempt.correct) {
			correctIds.add(attempt.questionId);
		}
	}
	return correctIds;
}

export function resolveQuestionIdByNumero(
	questions: Question[],
	numero: number,
): string | null {
	return questions.find((question) => question.numero === numero)?.id ?? null;
}

export function resolveFirstPendingQuestionId(
	questions: Question[],
	provaId: string,
): string | null {
	const answeredIds = loadAnsweredIds(provaId);
	const pending = questions.find((question) => !answeredIds.has(question.id));
	return pending?.id ?? questions[0]?.id ?? null;
}

export function resolveInitialQuestionId(
	questions: Question[],
	provaId: string,
	initialNumero?: number,
): string | null {
	if (initialNumero !== undefined && Number.isFinite(initialNumero)) {
		return (
			resolveQuestionIdByNumero(questions, initialNumero) ??
			questions[0]?.id ??
			null
		);
	}
	return resolveFirstPendingQuestionId(questions, provaId);
}

export function findQuestionById(
	questions: Question[],
	questionId: string | null,
): Question | null {
	if (!questionId) {
		return null;
	}
	return questions.find((question) => question.id === questionId) ?? null;
}

export function findNextQuestion(
	questions: Question[],
	currentId: string,
): Question | null {
	const currentIndex = questions.findIndex(
		(question) => question.id === currentId,
	);
	if (currentIndex === -1) {
		return null;
	}
	return questions[currentIndex + 1] ?? null;
}

export function findPreviousQuestion(
	questions: Question[],
	currentId: string,
): Question | null {
	const currentIndex = questions.findIndex(
		(question) => question.id === currentId,
	);
	if (currentIndex <= 0) {
		return null;
	}
	return questions[currentIndex - 1] ?? null;
}

export function withAddedId(ids: Set<string>, id: string): Set<string> {
	const next = new Set(ids);
	next.add(id);
	return next;
}
