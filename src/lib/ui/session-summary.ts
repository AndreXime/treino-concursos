import type { Question } from "@/lib/questions/types";
import {
	type QuestionNavStatus,
	resolveQuestionNavStatus,
} from "@/lib/ui/question-status";

export function shouldShowCompletion(input: {
	hasNext: boolean;
	justFinished: boolean;
	allAnswered: boolean;
}): boolean {
	if (input.hasNext) {
		return false;
	}
	return input.justFinished || input.allAnswered;
}

export function firstQuestionWithStatus(
	questions: Question[],
	status: QuestionNavStatus,
	answeredIds: ReadonlySet<string>,
	correctIds: ReadonlySet<string>,
): Question | null {
	return (
		questions.find(
			(question) =>
				resolveQuestionNavStatus(question.id, answeredIds, correctIds) ===
				status,
		) ?? null
	);
}

export function sessionCompletionStats(
	questions: Question[],
	answeredIds: ReadonlySet<string>,
	correctIds: ReadonlySet<string>,
): {
	correct: number;
	wrong: number;
	pending: number;
	taxa: number;
} {
	let correct = 0;
	let wrong = 0;
	let pending = 0;
	for (const question of questions) {
		const status = resolveQuestionNavStatus(
			question.id,
			answeredIds,
			correctIds,
		);
		if (status === "correct") {
			correct += 1;
		} else if (status === "wrong") {
			wrong += 1;
		} else {
			pending += 1;
		}
	}
	const answered = correct + wrong;
	const taxa = answered === 0 ? 0 : Math.round((correct / answered) * 100);
	return { correct, wrong, pending, taxa };
}
