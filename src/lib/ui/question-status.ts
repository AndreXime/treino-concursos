export type QuestionNavStatus = "pending" | "wrong" | "correct";

export function resolveQuestionNavStatus(
	questionId: string,
	answeredIds: ReadonlySet<string>,
	correctIds: ReadonlySet<string>,
): QuestionNavStatus {
	if (correctIds.has(questionId)) {
		return "correct";
	}
	if (answeredIds.has(questionId)) {
		return "wrong";
	}
	return "pending";
}
