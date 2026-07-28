"use client";

import { useState } from "react";
import {
	isAnswerCorrect,
	registerQuestionAttempt,
} from "@/lib/questions/answer";
import { isQuestionAnulada } from "@/lib/questions/question-tipo";
import type { Prova, Question } from "@/lib/questions/types";

export function useQuestionResolver(
	prova: Prova,
	question: Question,
	onAnswered: (correct: boolean) => void,
) {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [revealed, setRevealed] = useState(false);
	const isAnulada = isQuestionAnulada(question);

	const isCorrect =
		selectedId !== null && isAnswerCorrect(question, selectedId);

	function conferir() {
		if (!selectedId || revealed) {
			return;
		}
		if (isAnulada) {
			setRevealed(true);
			return;
		}
		const correct = registerQuestionAttempt(prova, question, selectedId);
		if (correct === null) {
			setRevealed(true);
			return;
		}
		setRevealed(true);
		onAnswered(correct);
	}

	function resetar() {
		setSelectedId(null);
		setRevealed(false);
	}

	return {
		selectedId,
		setSelectedId,
		revealed,
		isCorrect,
		isAnulada,
		conferir,
		resetar,
	};
}
