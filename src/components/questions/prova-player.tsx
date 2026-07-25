"use client";

import { QuestionResolver } from "@/components/questions/question-resolver";
import { useProvaPlayer } from "@/hooks/use-prova-player";
import type { Prova, Question } from "@/lib/questions/types";
import { answeredCountLabel } from "@/lib/ui/labels";
import { questionNavCellClass } from "@/lib/ui/question-styles";

interface ProvaPlayerProps {
	prova: Prova;
	questions: Question[];
	initialNumero?: number;
}

export function ProvaPlayer({
	prova,
	questions,
	initialNumero,
}: ProvaPlayerProps) {
	const {
		activeQuestion,
		nextQuestion,
		correctIds,
		answeredIds,
		setActiveId,
		markAnswered,
	} = useProvaPlayer(prova, questions, initialNumero);

	if (questions.length === 0) {
		return null;
	}

	if (!activeQuestion) {
		return (
			<p className="text-sm text-muted" aria-live="polite">
				Carregando progresso...
			</p>
		);
	}

	return (
		<div className="space-y-6">
			<nav aria-label="Navegação das questões">
				<p className="mb-2 text-sm text-muted">
					{answeredCountLabel(questions.length, answeredIds.size)}
				</p>
				<ul className="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1.5">
					{questions.map((question) => {
						const isActive = question.id === activeQuestion.id;
						const isCorrect = correctIds.has(question.id);
						return (
							<li key={question.id}>
								<button
									type="button"
									onClick={() => setActiveId(question.id)}
									aria-current={isActive ? "true" : undefined}
									className={`flex h-9 w-full items-center justify-center rounded-md border text-sm font-semibold ${questionNavCellClass(isActive, isCorrect)}`}
								>
									{question.numero}
								</button>
							</li>
						);
					})}
				</ul>
			</nav>

			<QuestionResolver
				key={activeQuestion.id}
				prova={prova}
				question={activeQuestion}
				onAnswered={(correct) => markAnswered(activeQuestion.id, correct)}
				onNext={nextQuestion ? () => setActiveId(nextQuestion.id) : null}
			/>
		</div>
	);
}
