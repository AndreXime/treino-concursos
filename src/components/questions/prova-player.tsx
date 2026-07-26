"use client";

import { QuestionResolver } from "@/components/questions/question-resolver";
import { useProvaPlayer } from "@/hooks/use-prova-player";
import type { Prova, Question } from "@/lib/questions/types";
import { sessionProgressLabel } from "@/lib/ui/labels";
import { questionNavCellClass } from "@/lib/ui/question-styles";
import { resolveQuestionNavStatus } from "@/lib/ui/question-status";

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

	const correctCount = [...correctIds].filter((id) =>
		questions.some((question) => question.id === id),
	).length;
	const answeredInList = [...answeredIds].filter((id) =>
		questions.some((question) => question.id === id),
	).length;
	const wrongCount = answeredInList - correctCount;

	return (
		<div className="space-y-6">
			<nav aria-label="Navegação das questões">
				<p className="mb-2 text-sm text-muted" aria-live="polite">
					{sessionProgressLabel({
						total: questions.length,
						correct: correctCount,
						wrong: wrongCount,
					})}
				</p>
				<ul className="mb-3 flex flex-wrap gap-3 text-xs text-muted">
					<li className="flex items-center gap-1.5">
						<span
							className="inline-block size-2.5 rounded-sm border border-border bg-surface"
							aria-hidden
						/>
						Pendente
					</li>
					<li className="flex items-center gap-1.5">
						<span
							className="inline-block size-2.5 rounded-sm bg-danger"
							aria-hidden
						/>
						Erro
					</li>
					<li className="flex items-center gap-1.5">
						<span
							className="inline-block size-2.5 rounded-sm bg-success"
							aria-hidden
						/>
						Acerto
					</li>
					<li className="flex items-center gap-1.5">
						<span
							className="inline-block size-2.5 rounded-sm bg-accent ring-2 ring-accent/40"
							aria-hidden
						/>
						Atual
					</li>
				</ul>
				<ul className="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1.5">
					{questions.map((question) => {
						const isActive = question.id === activeQuestion.id;
						const status = resolveQuestionNavStatus(
							question.id,
							answeredIds,
							correctIds,
						);
						return (
							<li key={question.id}>
								<button
									type="button"
									onClick={() => setActiveId(question.id)}
									aria-current={isActive ? "true" : undefined}
									className={`flex h-9 w-full items-center justify-center rounded-md border text-sm font-semibold ${questionNavCellClass(status, isActive)}`}
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
